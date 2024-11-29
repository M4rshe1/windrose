import db from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";
import {uploadFileToMinio} from "@/lib/minio";
import minioClient from "@/lib/minioClient";
import {TourToUserRole, UserRole} from "@prisma/client";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    const sessionToken =
        req.cookies.get('next-auth.session-token') ||
        req.cookies.get('__Secure-next-auth.session-token');

    const formData = await req.formData();
    const tourId = formData.get('tourId');
    const file = formData.get('file') as File | null;


    if (!sessionToken?.value) {
        return NextResponse.json({authenticated: false}, {status: 401});
    }

    if (!file) {
        return NextResponse.json({error: 'No file uploaded'}, {status: 400});
    }

    if (!tourId) {
        return NextResponse.json({error: 'No tourId provided'}, {status: 400});
    }

    const session = await db.session.findUnique({
        where: {
            sessionToken: sessionToken.value,
            OR: [
                {
                    user: {
                        TourToUser: {
                            some: {
                                tourId: tourId as string,
                                role: {
                                    in: [TourToUserRole.OWNER, TourToUserRole.EDITOR]
                                },
                            }
                        }
                    }
                },
                {
                    user: {
                        role: UserRole.ADMIN
                    }
                }
            ]
        },
        include: {
            user: {
                include: {
                    TourToUser: {
                        where: {
                            tourId: tourId as string
                        },
                        include: {
                            tour: {
                                include: {
                                    heroImage: true
                                }
                            }
                        }
                    }
                }
            }
        },
    });

    if (!session || !session?.user) {
        return NextResponse.json({authenticated: false}, {status: 401});
    }

    try {
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({error: 'No file uploaded'}, {status: 400});
        }

        const fileName = file.name;

        if (session.user.TourToUser[0].tour.heroImage) {
            await db.file.delete({
                where: {id: session.user.TourToUser[0].tour.heroImage.id}
            })
        }

        if (session.user.TourToUser[0].tour.heroImage?.fileKey) {
            await minioClient.removeObject(process.env.MINIO_BUCKET as string, session.user.TourToUser[0].tour.heroImage.fileKey);
        }

        const ownerId = session.user.TourToUser.find(tu => tu.role === TourToUserRole.OWNER)?.userId;

        const fileObject = await uploadFileToMinio(file, `tours/${ownerId}/${tourId}/hero/${Date.now()}.${fileName.split('.').pop()}`);

        await db.tour.update({
            where: {id: tourId as string},
            data: {
                heroImage: {
                    connect: {
                        id: fileObject.file.id
                    }
                }
            }
        })
        return NextResponse.json({
            message: 'File uploaded successfully',
            fileName,
            fileObject
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: 'File upload failed'}, {status: 500});
    }
}