"use server"
import db from "@/lib/db";
import { auth } from "@/auth"

import {TourToUserRole, TourVisibility, UserRole} from "@prisma/client";

export async function updateTourVisabilityAction(tourId: string, visibility: string) {
    const session = await auth()
    const allowed = db.tourToUser.findFirst({
        where: {
            userId: session?.user?.id,
            tourId: tourId,
            role: {
                in: [TourToUserRole.OWNER]
            }
        }
    });

    if (Object.keys(TourVisibility).indexOf(visibility) === -1) {
        return false;
    }

    if (!allowed && session?.user?.role !== UserRole.ADMIN) {
        return false;
    }


    await db.tour.update({
        where: {
            id: tourId
        },
        data: {
            visibility: visibility as TourVisibility
        }
    })
}