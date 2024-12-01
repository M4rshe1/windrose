"use server";

import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";
import {TourToUserRole} from "@prisma/client";
import minioClient from "@/lib/minioClient";

export async function deleteTourHeroAction(tourId: string) {
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

    const image = await db.tour.findUnique({
        where: {
            id: tourId
        },
        select: {
            heroImage: true
        }
    });

    if (!image?.heroImage) {
        return false;
    } else {
        await minioClient.removeObject(process.env.NEXT_PUBLIC_MINIO_BUCKET as string, image.heroImage.fileKey);
    }

    const result =  await db.tour.update({
        where: {
            id: tourId
        },
        data: {
            heroImage: undefined
        }
    });

    return result
}