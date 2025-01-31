"use server"

import { auth } from "@/auth"

import db from "@/lib/db";
import {TourToUserRole, UserRole} from "@prisma/client";
import minioClient from "@/lib/minioClient";

export async function deleteTourAction(tourId: string) {
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

    if (!allowed && session?.user?.role !== UserRole.ADMIN) {
        return false;
    }

    const images = await db.file.findMany({
        where: {
            OR: [
                {
                    tour: {
                        some: {
                            id: tourId
                        }
                    }
                },
                {
                    TourSectionToFile: {
                        some: {
                            tourSection: {
                                tourId: tourId
                            }
                        }
                    }
                }
            ]
        }
    })


    for (const image of images) {
        await minioClient.removeObject(process.env.NEXT_PUBLIC_MINIO_BUCKET as string, image.fileKey);
    }


    const result = await db.tour.delete({
        where: {
            id: tourId
        }
    });
}