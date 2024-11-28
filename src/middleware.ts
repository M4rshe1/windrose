import {NextRequest, NextResponse} from 'next/server';
import {UserRole} from "@prisma/client";

const ADMIN_ROUTES = ['/admin'];
const PRIVATE_ROUTES = ['/settings', '/notifications', '/new', '/api/private'];
// const PUBLIC_ROUTES = ['/explore', '/auth', '/api', "/tags", "/pro"];
// const AUTHORIZATION_TOUR_ROUTES = ['/[username]/[tour]/settings', "/[username]/[tour]/steps"];
// const AUTHORIZATION_USER_ROUTES = ['/[username]'];
const LOGIN_FORBIDDEN_ROUTES = ['/auth'];
const ROOT = '/';

export async function middleware(request: NextRequest) {
    const apiUrl = new URL('/api/auth/validate-session', request.url);
    const sessionResponse = await fetch(apiUrl.toString(), {
        headers: {
            cookie: request.headers.get('cookie') || '',
        },
    });

    const sessionData = await sessionResponse.json();
    const isAuthenticated = sessionData.authenticated;
    const isAuthorized = sessionData.user?.role === UserRole.ADMIN;
    const nextUrl = request.nextUrl.pathname;

    const isPrivateRoute = PRIVATE_ROUTES.some((route) => nextUrl.startsWith(route));
    const isAdminRoute = ADMIN_ROUTES.some((route) => nextUrl.startsWith(route));
    const isLoginForbiddenRoute = LOGIN_FORBIDDEN_ROUTES.some((route) => nextUrl.startsWith(route));
    // const isPublicRoute = PUBLIC_ROUTES.some((route) => nextUrl.startsWith(route));
    // const slashCount = nextUrl.split('/').length - 1;

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
}

export const config = {
    matcher: [
        '/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
