"use server"

import { auth } from "@/auth"

import db from "@/lib/db";
import {TourToUserRole, UserRole} from "@prisma/client";
import {revalidatePath} from "next/cache";

export async function deleteCollaborationAction(tourId: string, userId: string, reval: string) {
    const session = await auth()
    if (!session) return false;

    const isAllowed = await db.tourToUser.findFirst({
        where: {
            userId: session.user.id,
            role: TourToUserRole.OWNER,
        }
    })

    if (!isAllowed && session.user.role !== UserRole.ADMIN) return false;


    await db.tourToUser.deleteMany({
        where: {
            tourId: tourId,
            userId: userId,
            AND: {
                userId: {
                    not: session.user.id
                },
            },
            role: {
                not: TourToUserRole.OWNER
            }
        }
    });
    if (reval)
        revalidatePath(reval);
    return true;
}