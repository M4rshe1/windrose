"use server"

import { auth } from "@/auth"

import db from "@/lib/db";
import {TourToUserRole, UserRole} from "@prisma/client";
import {revalidatePath} from "next/cache";

export async function createCollaborationAction(tourId: string, userId: string, role: TourToUserRole, reval: string) {
    const session = await auth()
    if (!session) return false;
    if (Object.keys(TourToUserRole).indexOf(role) === -1) return false;

    const isAllowed = await db.tourToUser.findFirst({
        where: {
            userId: session.user.id,
            role: TourToUserRole.OWNER,
            tourId: tourId
        }
    })

    if (!isAllowed && session.user.role !== UserRole.ADMIN) return false;

    const tourToUser = await db.tourToUser.findFirst({
        where: {
            userId: userId,
            tourId: tourId
        }
    });

    if (tourToUser) return false;

    await db.tourToUser.create({
        data: {
            role: role,
            tourId: tourId,
            userId: userId
        },
    });
    if (reval)
        revalidatePath(reval);
    return true;
}