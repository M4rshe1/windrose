import minioClient from "@/lib/minioClient";
import path from "path";
import fs from "fs/promises";
import db from "@/lib/db";

export const uploadFileToMinio = async (file: File, fileName: string) => {
    const bucketName = process.env.NEXT_PUBLIC_MINIO_BUCKET;
    const cdnHost = process.env.NEXT_PUBLIC_MINIO_ENDPOINT;
    const port = process.env.NEXT_PUBLIC_MINIO_PORT;

    if (!bucketName) {
        throw new Error("NEXT_PUBLIC_MINIO_BUCKET is required");
    }

    if (!cdnHost) {
        throw new Error("NEXT_PUBLIC_MINIO_ENDPOINT is required");
    }

    if (!port) {
        throw new Error("NEXT_PUBLIC_MINIO_PORT is required");
    }


    const tempFilePath = await saveFileToTemp(file);
    await minioClient.fPutObject(bucketName, fileName, tempFilePath);

    const dbFile = await db.file.create({
        data: {
            fileName: fileName.split('/').at(-1) ?? fileName,
            fileKey: fileName,
            size: file.size as number ?? 0,
            status: 'UPLOADED',
            contentType: file.type || 'application/octet-stream',
            bucket: bucketName,
        }
    });


    await fs.unlink(tempFilePath);

    return {
        cdn: `http://${cdnHost}:${port}/${bucketName}/${fileName}`, file: {
            ...dbFile,
            size: dbFile.size.toString()
        }
    };
};

export const saveFileToTemp = async (file: File) => {
    const tempDir = path.join(process.cwd(), 'tmp');
    await fs.mkdir(tempDir, {recursive: true});
    const tempFilePath = path.join(tempDir, file.name);
    const buffer = await file.arrayBuffer();
    await fs.writeFile(tempFilePath, Buffer.from(buffer));
    return tempFilePath;
}