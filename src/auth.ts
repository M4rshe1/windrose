import {PrismaAdapter} from "@next-auth/prisma-adapter";
import db from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import {stringToDashCase} from "@/lib/utils";
import NextAuth from "next-auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    session: {
        strategy: 'database',
        maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async session({session, user}) {
            session.user.id = user.id;
            try {
                const dbUser = await db.user.findUnique({
                    where: {id: user.id},
                    select: {
                        role: true, username: true,
                        image: {
                            select: {
                                fileKey: true,
                            }
                        },
                        metric: true,
                    },
                });
                const protocol = process.env.NEXT_PUBLIC_MINIO_USE_SSL == 'true' ? "https://" : "http://"
                const s3Endpoint = `${protocol}${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}:${process.env.NEXT_PUBLIC_MINIO_PORT}/${process.env.NEXT_PUBLIC_MINIO_BUCKET}/`;
                if (dbUser) {
                    session.user.role = dbUser.role;
                    session.user.username = dbUser.username;
                    session.user.image = dbUser.image ? `${s3Endpoint}${dbUser.image.fileKey}` : null;
                    session.user.metric = dbUser.metric;
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
                session.user.role = "USER";
            }
            return session;
        },
        async redirect({url, baseUrl}) {
            try {
                if (url.startsWith('/')) return `${baseUrl}${url}`;
                if (new URL(url).origin === baseUrl) return url;
            } catch (error) {
                console.error('Error in redirect callback:', error);
            }
            return baseUrl;
        },
        async signIn({user, account}) {
            if (!account || !user) {
                return false;
            }
            try {
                const existingUser = await db.user.findUnique({
                    where: {email: user.email as string},
                });

                if (existingUser) {
                    // Check if the provider matches
                    const isLinkedAccount = await db.account.findFirst({
                        where: {
                            userId: existingUser.id,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                        },
                    });

                    if (!isLinkedAccount) {
                        // Link new provider to the existing user
                        await db.account.create({
                            data: {
                                userId: existingUser.id,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                type: account.type,
                                access_token: account.access_token,
                                expires_at: account.expires_at,
                                refresh_token: account.refresh_token,
                                token_type: account.token_type,
                            },
                        });
                    }
                } else {
                    const checkUsername = await db.user.findUnique(
                        {
                            where: {username: stringToDashCase(user.name as string)},
                        }
                    )

                    await db.user.create({
                        data: {
                            name: user.name,
                            email: user.email as string,
                            username: checkUsername ? `${stringToDashCase(user.name as string)}-${new Date().getTime()}` : stringToDashCase(user.name as string),
                            accounts: {
                                create: {
                                    provider: account.provider,
                                    providerAccountId: account.providerAccountId,
                                    type: account.type,
                                    access_token: account.access_token,
                                    expires_at: account.expires_at,
                                    refresh_token: account.refresh_token,
                                    token_type: account.token_type,
                                },
                            },
                        },
                    });
                }

                return true;
            } catch (error) {
                console.error('Error during sign-in callback:', error);
                return false;
            }
        },
    },
});


declare module 'next-auth' {
    interface User {
        role?: string | null;
    }

    interface Session {
        user: {
            username: string | null;
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string | null;
            metric?: boolean | null;
        }
    }
}
