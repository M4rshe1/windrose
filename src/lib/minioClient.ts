import { Client } from 'minio';

if (!process.env.MINIO_ENDPOINT) {
    throw new Error('MINIO_ENDPOINT is required');
}

if (!process.env.MINIO_PORT) {
    throw new Error('MINIO_PORT is required');
}

if (!process.env.MINIO_USE_SSL) {
    throw new Error('MINIO_USE_SSL is required');
}

if (!process.env.MINIO_ACCESS_KEY) {
    throw new Error('MINIO_ACCESS_KEY is required');
}

if (!process.env.MINIO_SECRET_KEY) {
    throw new Error('MINIO_SECRET_KEY is required');
}

const bucketName = process.env.MINIO_BUCKET;
if (!bucketName) {
    throw new Error('MINIO_BUCKET is required');
}

const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT, 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});

// check if the bucket exists, if not create it
minioClient.bucketExists(bucketName).then(r => {
    if (!r) {
        minioClient.makeBucket(bucketName).then(() => {
            console.log(`Bucket ${bucketName} created successfully`);
        });
    }
});

export default minioClient;