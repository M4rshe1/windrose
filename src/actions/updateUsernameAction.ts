"use server"

import {checkUsernameAction} from "@/actions/checkUsernameAction";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";

export async function updateUsernameAction(username: string) {
    const isValid = await checkUsernameAction(username);
    const session: Session | null = await getServerSession(authOptions)
    if (!session) {
        return false;
    }

    if (!isValid || username.length === 0) {
        return false;
    }

    const result = await db.user.update({
        where: {
            id: session.user.id
        },
        data: {
            username
        }
    });

    return !!result;
}
