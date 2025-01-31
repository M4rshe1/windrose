import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
    // Extract the session token from cookies
    const sessionToken =
        request.cookies.get('authjs.session-token') ||
        request.cookies.get('authjs.csrf-token');

    if (!sessionToken?.value) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Query the session from the database using the token
    const session = await db.session.findUnique({
        where: { sessionToken: sessionToken.value },
        include: { user: true },
    });

    if (!session || !session.user) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Return the session data with the user's role and authentication status
    return NextResponse.json({
        authenticated: true,
        user: {
            id: session.user.id,
            role: session.user.role,
        },
    });
}
