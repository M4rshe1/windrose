import { NextApiRequest } from 'next';
import db from '@/lib/db';
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from '@/lib/authOptions';

export default async function GET(req: NextApiRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse(JSON.stringify({ authenticated: false },), {
            status: 401,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    const user = await db.user.findUnique({
        where: {
            id: req.query.id as string
        }
    });

    return NextResponse.json({ user });
}