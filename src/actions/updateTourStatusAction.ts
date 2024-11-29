"use server";

import db from "@/lib/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import {TourStatus, TourToUserRole} from "@prisma/client";

export async function updateTourStatusAction(tourId: string, status: string) {
    const session = await getServerSession(authOptions)
    const allowed = db.tourToUser.findFirst({
        where: {
            userId: session?.user?.id,
            tourId: tourId,
            role: {
                in: [TourToUserRole.OWNER, TourToUserRole.EDITOR]
            }
        }
    });

    if (!allowed) {
        return false;
    }

    if (Object.keys(TourStatus).indexOf(status) === -1) {
        return false;
    }

    const result =  await db.tour.update({
        where: {
            id: tourId
        },
        data: {
            status: status as TourStatus
        }
    });

    return result
}