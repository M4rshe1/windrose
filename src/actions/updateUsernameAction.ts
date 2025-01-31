"use server"

import {checkUsernameAction} from "@/actions/checkUsernameAction";
import { auth } from "@/auth"

import db from "@/lib/db";

export async function updateUsernameAction(username: string) {
    const isValid = await checkUsernameAction(username);
    const session = await auth()
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
