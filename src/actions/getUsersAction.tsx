"use server";

import db from "@/lib/db";

export async function getUsersAction(count: number, skip: number, exclude: string[]) {
    return db.user.findMany({
        take: count,
        skip: skip,
        where: {
            NOT: {
                username: {
                    in: exclude
                }
            }
        }
    });
}