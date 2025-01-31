import db from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";
import {uploadFileToMinio} from "@/lib/minio";
import minioClient from "@/lib/minioClient";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    const sessionToken =
        req.cookies.get('authjs.session-token') ||
        req.cookies.get('authjs.csrf-token');

    if (!sessionToken?.value) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = await db.session.findUnique({
        where: { sessionToken: sessionToken.value },
        include: { user: true },
    });

    if (!session || !session.user) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const userId = session.user.id;
        const fileName = file.name;


        const existingAvatar = await db.user.findFirst({
            where: { id: userId },
            include: { image: true }
        })

        if (existingAvatar?.image) {
            await db.file.delete({
                where: { id: existingAvatar.image.id }
            })
        }

        // delete existing avatar file from minio
        if (existingAvatar?.image?.fileKey) {
            await minioClient.removeObject(process.env.NEXT_PUBLIC_MINIO_BUCKET as string, existingAvatar.image.fileKey);
        }

        const fileObject = await uploadFileToMinio(file, `avatar/${userId}-${Date.now()}.${fileName.split('.').pop()}`);

        await db.user.update({
            where: { id: userId },
            data: {
                image: {
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
        return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
    }
}