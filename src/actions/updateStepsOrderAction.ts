"use server";
import db from "@/lib/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import {TourToUserRole} from "@prisma/client";

export async function updateStepsOrderAction(tourId: string, order: string[]) {
    const session = await getServerSession(authOptions);
    const isAllowed = await db.tourToUser.findFirst({
        where: {
            tourId: tourId,
            userId: session?.user?.id
        }
    });

    if (isAllowed?.role !== TourToUserRole.OWNER && isAllowed?.role !== TourToUserRole.EDITOR && session?.user?.role !== 'ADMIN') return false;

    await db.tour.update({
        where: {
            id: tourId
        },
        data: {
            sectionOrder: order
        }
    });
    return true;
}