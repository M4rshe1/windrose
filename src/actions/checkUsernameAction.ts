'use server';

import db from "@/lib/db";

const FORBIDDEN_USERNAMES = ['admin', 'moderator', 'root', 'superuser', "new", 'api', 'auth', 'notifications', 'pro', 'settings', 'search', 'tags', "_next"];


export async function checkUsernameAction(username: string) {
    if (FORBIDDEN_USERNAMES.includes(username)) {
        return false
    }

    const user = await db.user.findUnique({
        where: { username },
    });

    console.log(!user);

    return !user;
}