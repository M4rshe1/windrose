"use server"

import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";
import {TourToUserRole, UserRole} from "@prisma/client";

export async function deleteCollaborationAction(tourId: string, userId: string) {
    const session = await getServerSession(authOptions);
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
                }
            },
            role: {
                not: TourToUserRole.OWNER
            }
        }
    });
    return true;
}