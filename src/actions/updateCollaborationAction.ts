"use server"

import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";
import {TourToUserRole, UserRole} from "@prisma/client";
import {revalidatePath} from "next/cache";

export async function updateCollaborationAction(tourId: string, useId: string, role: TourToUserRole,mentioned: boolean, reval: string) {
    const session = await getServerSession(authOptions);
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

    await db.tourToUser.updateMany({
        where: {
            tourId: tourId,
            userId: useId
        },
        data: {
            role: role,
            mentioned: mentioned
        },
    });
    if (reval)
        revalidatePath(reval);
    return true;
}