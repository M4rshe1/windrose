import {NextRequest, NextResponse} from "next/server";
import db from "@/lib/db";
import {TourToUserRole} from "@prisma/client";
import {getMinioLinkFromKey} from "@/lib/utils";

export async function GET(req: NextRequest) {
    const sessionToken =
        req.cookies.get('next-auth.session-token') ||
        req.cookies.get('__Secure-next-auth.session-token');

    if (!sessionToken?.value) {
        return NextResponse.json({authenticated: false}, {status: 401});
    }

    const [session, tours] = await Promise.all([
        db.session.findUnique({
            where: {
                sessionToken: sessionToken.value,
            },
            include: {
                user: true,
            },
        }),
        db.tour.findMany({
            where: {
                TourToUser: {
                    some: {
                        role: {
                            in: [TourToUserRole.OWNER, TourToUserRole.EDITOR]
                        },
                        user: {
                            sessions: {
                                some: {
                                    sessionToken: sessionToken.value
                                }
                            }
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                displayName: true,
                description: true,
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
        }
    })

    const owners = images.map(image => {
        return {
            ...image.user,
            tourId: image.tourId
        }
    })


    const toursOwners = tours.map(tour => {
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
    })

    if (!session || !session.user) {
        return NextResponse.json({status: 401});
    }

    return NextResponse.json({
        tours: toursOwners
    });
}