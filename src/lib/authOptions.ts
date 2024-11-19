import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import db from "@/lib/db";


export const authOptions: NextAuthOptions = {
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
        })
    ],
    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id;
            const dbUser = await db.user.findUnique({
                where: { id: user.id },
                select: { role: true }
            });

            if (dbUser) {
                session.user.role = dbUser.role;
            }

            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        }
    },
    events: {
        async signIn(message) {
            console.log('Sign in event', message);
        }
    }
};


declare module 'next-auth' {
    interface User {
        role?: string | null;
    }

    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string | null;
        }
    }
}