'use server'

import db from "@/lib/db";
import {TourToUserRole} from "@prisma/client";
import {getMinioLinkFromKey} from "@/lib/utils";
import { auth } from "@/auth"


export interface Tour {
    owner: {
        image: string | null;
        tourId?: string | undefined;
        id?: string | undefined;
        name?: string | null | undefined;
        username?: string | null | undefined;
    };
    id: string;
    name: string;
    displayName: string;
    description: string | null;
}


export async function getUserToursAction(count?: number, owned?: boolean): Promise<Tour[]> {
    const session = await auth()
    const [tours] = await Promise.all([
        db.tour.findMany({
            where: {
                TourToUser: {
                    some: {
                        role: {
                            in: owned ? [TourToUserRole.OWNER] : [TourToUserRole.OWNER, TourToUserRole.EDITOR]
                        },
                        user: {
                            id: session?.user?.id
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                displayName: true,
                description: true,
            },
            take: count,
            orderBy: {
                createdAt: 'desc'
            }
        })
    ]);

    const images = await db.tourToUser.findMany({
        where: {
            tour: {
                id: {
                    in: tours.map(tour => tour.id)
                }
            },
            role: {
                in: [TourToUserRole.OWNER]
            }
        },
        select: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: {
                        select: {
                            fileKey: true
                        }
                    }
                }
            },
            tourId: true
        },
    })

    const owners = images.map(image => {
        return {
            ...image.user,
            tourId: image.tourId
        }
    })


    return tours.map(tour => {
        return {
            id: tour.id,
            name: tour.name,
            displayName: tour.displayName,
            description: tour.description,
            owner: owners.find(owner => owner.tourId === tour.id)
        }
    }).map(tour => {
        return {
            ...tour,
            owner: {
                ...tour.owner,
                image: tour.owner?.image ? getMinioLinkFromKey(tour.owner.image.fileKey) : null
            }
        }
    }) || [] as Tour[];
}