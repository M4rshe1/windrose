import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';

const ADMIN_ROUTES = [/^\/admin/];
const PRIVATE_ROUTES = [
    /^\/settings/,
    /^\/notifications/,
    /^\/new/,
    /^\/api\/private/,
    /^\/[^/]+\/[^/]+\/settings$/,
];
const LOGIN_FORBIDDEN_ROUTES = [/^\/auth/];
const ROOT = '/';

export async function middleware(request: NextRequest) {
    const apiUrl = new URL('/api/auth/validate-session', request.url);

    try {
        const sessionResponse = await fetch(apiUrl.toString(), {
            headers: {
                cookie: request.headers.get('cookie') || '',
            },
        });

        if (!sessionResponse.ok) {
            console.error(
                'Session validation failed:',
                sessionResponse.status,
                sessionResponse.statusText,
            );
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        const sessionData = await sessionResponse.json();
        const isAuthenticated = sessionData.authenticated;
        const isAuthorized = sessionData.user?.role === UserRole.ADMIN;
        const nextUrl = request.nextUrl.pathname;

        const isPrivateRoute = PRIVATE_ROUTES.some((route) => route.test(nextUrl));
        const isAdminRoute = ADMIN_ROUTES.some((route) => route.test(nextUrl));
        const isLoginForbiddenRoute = LOGIN_FORBIDDEN_ROUTES.some((route) =>
            route.test(nextUrl),
        );

        if (!isAuthenticated && (isPrivateRoute || nextUrl === ROOT)) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        if (isAuthenticated && isLoginForbiddenRoute) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (!isAuthorized && isAdminRoute) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        // Handle unexpected errors during session validation
        console.error('Middleware error:', error);
        return NextResponse.redirect(new URL('/auth/login', request.url)); // Or handle differently
    }
}

export const config = {
    matcher: [
        '/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
