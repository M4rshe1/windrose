'use server'

import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";

export async function removeAccountProvider(provider: string) {
    const session: Session | null = await getServerSession(authOptions)
    if (!session) return false

    const account = await db.account.findFirst({
        where: {
            userId: session.user.id,
            provider: provider,
        }
    })
    if (!account) return false

    await db.account.delete({
        where: {
            id: account.id
        }
    })

    return true
}