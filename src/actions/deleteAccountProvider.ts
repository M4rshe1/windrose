'use server'

import { auth } from "@/auth"

import db from "@/lib/db";

export async function deleteAccountProvider(provider: string) {
    const session = await auth()
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