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
        req.cookies.get('next-auth.session-token') ||
        req.cookies.get('__Secure-next-auth.session-token');

    const formData = await req.formData();
    const tourId = formData.get('tourId');
    const sectionId = formData.get('sectionId');
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
    });


    if (!session || !session?.user) {
        return NextResponse.json({authenticated: false}, {status: 401});
    }


    const sections = await db.tourSection.findMany({
        where: {
            tourId: tourId as string
        }
    });

    const settings = await db.setting.findMany({
        where: {
            key: {
                in: ['MAX_SECTION_IMAGES_PREMIUM', 'MAX_SECTION_IMAGES_FREE']
            }
        }
    })

    const maxSections = session?.user.role === UserRole.USER
        ? settings?.find((s) => s.key === 'MAX_SECTION_IMAGES_FREE')?.value
        : session?.user.role === UserRole.PREMIUM
            ? settings?.find((s) => s.key === 'MAX_SECTION_IMAGES_PREMIUM')?.value
            : Infinity;

    if (sections.length >= (maxSections as number)) {
        return NextResponse.json({error: 'Max section images reached'}, {status: 400});
    }


    try {
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({error: 'No file uploaded'}, {status: 400});
        }

        const fileName = file.name;
        const ownerId = session.user.TourToUser.find(tu => tu.role === TourToUserRole.OWNER)?.userId;
        const fileObject = await uploadFileToMinio(file, `tours/${ownerId}/${tourId}/steps/${sectionId}/${Date.now()}.${fileName.split('.').pop()}`);

        await db.tourSectionToFile.create({
            data: {
                tourSectionId: sectionId as string,
                fileId: fileObject.file.id
            }
        });
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