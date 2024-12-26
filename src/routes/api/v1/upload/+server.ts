// @ts-nocheck
import { error, json } from '@sveltejs/kit';
import { S3 } from '$lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const slugifyString = (str: string) => {
    return str.trim().toLowerCase().replace(/\s+/g, '-').replace(/\./g, '-').replace(/-+/g, '-').replace(/[^a-z0-9-]/g, '-');
}

export async function POST({ request, locals }) {
    if (!locals.user) {
        throw error(401, 'Unauthorized - Please log in to access this endpoint');
    }
    const { fileName, fileType, } = await request.json() as { fileName: string | undefined, fileType: string | undefined };

    const uniqueFileName = uuidv4();
    const extension = fileType.split('/')[1];
    // const slugifiedFileName = `${slugifyString(Date.now().toString())}-${slugifyString(fileName)}`;
    const objectKey = uniqueFileName;
    const presignedUrl = await getSignedUrl(S3, new PutObjectCommand({
        Bucket: import.meta.env.VITE_R2_BUCKET,
        Key: objectKey,
        ContentType: fileType,
        ACL: 'public-read'
    }), {
        expiresIn: 60 * 5
    });

    return json({ presignedUrl, objectKey }, { status: 201 });
}