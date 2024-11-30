"use server";

import db from "@/lib/db";
import {getMinioLinkFromKey} from "@/lib/utils";

export async function getUsersAction(search: string, count: number = 10, exclude?: string[], skip?: number) {
    const users = await db.user.findMany({
        take: count,
        skip: skip,
        where: {
            NOT: {
                username: {
                    in: exclude
                }
            },
            OR: [
                {
                    name: {
                        contains: search
                    }
                },
                {
                    username: {
                        contains: search
                    }
                }
            ]
        },
        include: {
            image: true
        }
    });

    return users?.map((user) => {
        return {
            id: user.id,
            name: user.name,
            username: user.username,
            avatar: user.image?.fileKey ? getMinioLinkFromKey(user.image?.fileKey) : null
        }
    });

}