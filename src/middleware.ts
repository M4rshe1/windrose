import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    console.log('Request:', request.url)

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin',
        '/admin/:path*',
        '/settings',
        '/settings/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}

