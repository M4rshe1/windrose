"use server"

import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";
import {TourToUserRole, UserRole} from "@prisma/client";

export async function createCollaborationAction(tourId: string, userId: string, role: TourToUserRole) {
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
    return true;
}