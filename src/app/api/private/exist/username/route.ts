import { NextRequest, NextResponse } from 'next/server';
import  db  from '@/lib/db';

async function handler(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
        where: { username },
    });

    if (user) {
        return NextResponse.json({ exists: true });
    } else {
        return NextResponse.json({ exists: false });
    }
}

export { handler as GET, handler as POST };