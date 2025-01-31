"use server";

import db from "@/lib/db";
import { auth } from "@/auth"

import {TourSectionStatus, TourStatus, TourToUserRole} from "@prisma/client";

export async function updateTourStatusAction(tourId: string, status: string) {
    const session = await auth()
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

    const result = await db.tour.update({
        where: {
            id: tourId
        },
        data: {
            status: status as TourStatus
        }
    });

    if (status === TourStatus.FINISHED) {
        await db.tourSection.updateMany({
            where: {
                tourId: tourId,
                status: TourSectionStatus.PLANNED
            },
            data: {
                status: TourSectionStatus.VISITED
            }
        });
    }

    if (status === TourStatus.PLANNING) {
        await db.tourSection.updateMany({
            where: {
                tourId: tourId,
            },
            data: {
                status: TourSectionStatus.PLANNED
            }
        });
    }

    if (status === TourStatus.ON_TOUR) {
        const lowestDatetime = await db.tourSection.findFirst({
            where: {
                tourId: tourId,
                status: TourSectionStatus.PLANNED
            },
            orderBy: {
                datetime: 'asc'
            }
        })
        if (lowestDatetime) {
            await db.tourSection.update({
                where: {
                    id: lowestDatetime.id
                },
                data: {
                    status: TourSectionStatus.VISITED
                }
            });
        }
    }

    return result
}