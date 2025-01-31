import db from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";
import {uploadFileToMinio} from "@/lib/minio";
import {TourToUserRole, UserRole} from "@prisma/client";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    const sessionToken =
        req.cookies.get('authjs.session-token') ||
        req.cookies.get('authjs.csrf-token');

    const formData = await req.formData();
    const sectionId = formData.get('sectionId');
    const file = formData.get('file') as File | null;


    if (!sessionToken?.value) {
        return NextResponse.json({authenticated: false}, {status: 401});
    }

    if (!file) {
        return NextResponse.json({error: 'No file uploaded'}, {status: 400});
    }

    if (!sectionId) {
        return NextResponse.json({error: 'No tourId provided'}, {status: 400});
    }

    const [session, images, settings, tour] = await Promise.all([
        db.session.findUnique({
            where: {
                sessionToken: sessionToken.value,
                OR: [
                    {
                        user: {
                            TourToUser: {
                                some: {
                                    role: {
                                        in: [TourToUserRole.OWNER, TourToUserRole.EDITOR]
                                    },
                                    tour: {
                                        sections: {
                                            some: {
                                                id: sectionId as string
                                            }
                                        }
                                    }
                                },
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
                        TourToUser: true
                    }
                }
            },
        }), db.file.findMany({
            where: {
                TourSectionToFile: {
                    some: {
                        tourSectionId: sectionId as string
                    }
                }
            }
        }), db.setting.findMany({
            where: {
                key: {
                    in: ['MAX_SECTION_IMAGES_PREMIUM', 'MAX_SECTION_IMAGES_FREE']
                }
            }
        }),
        db.tour.findFirst({
            where: {
                sections: {
                    some: {
                        id: sectionId as string
                    }
                }
            }
        })
    ]);

    if (!session || !session?.user) {
        return NextResponse.json({authenticated: false}, {status: 401});
    }

    if (!tour) {
        return NextResponse.json({error: 'Tour not found'}, {status: 404});
    }

    const maxSections = session?.user.role === UserRole.USER
        ? settings?.find((s) => s.key === 'MAX_SECTION_IMAGES_FREE')?.value
        : session?.user.role === UserRole.PREMIUM
            ? settings?.find((s) => s.key === 'MAX_SECTION_IMAGES_PREMIUM')?.value
            : Infinity;

    if (images.length >= (maxSections as number)) {
        return NextResponse.json({error: 'Max section images reached'}, {status: 400});
    }


    try {
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({error: 'No file uploaded'}, {status: 400});
        }

        const fileName = file.name;
        const ownerId = session.user.TourToUser.find(tu => tu.role === TourToUserRole.OWNER)?.userId;
        const fileObject = await uploadFileToMinio(file, `tours/${ownerId}/${tour.id}/steps/${sectionId}/${Date.now()}.${fileName.split('.').pop()}`);

        await db.tourSectionToFile.create({
            data: {
                tourSectionId: sectionId as string,
                fileId: fileObject.file.id
            }
        });
        return NextResponse.json({
            message: 'File uploaded successfully',
            status: 200,
            fileName,
            fileObject
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: 'File upload failed'}, {status: 500});
    }
}