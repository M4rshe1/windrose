'use server'

import {authOptions} from "@/lib/authOptions";
import {getServerSession} from "next-auth";
import {TourToUserRole, UserRole} from "@prisma/client";
import db from "@/lib/db";

export async function updateTourOwner(tourId: string, username: string) {
    const session = await getServerSession(authOptions);
    if (!session) return false;
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
            role: TourToUserRole.OWNER
        },
        data: {
            role: TourToUserRole.EDITOR
        }
    })

    await db.tourToUser.updateMany({
        where: {
            tourId: tourId,
            user: {
                username: username
            }
        },
        data: {
            role: TourToUserRole.OWNER
        }
    })

    return true;
}