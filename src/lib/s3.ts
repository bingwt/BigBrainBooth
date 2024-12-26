import { S3Client } from "@aws-sdk/client-s3";

const S3 = new S3Client({
    region: "auto",
    endpoint: import.meta.env.VITE_R2_ENDPOINT,
    credentials: {
        accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY,
        secretAccessKey: import.meta.env.VITE_R2_SECRET_KEY,
    },
});

export { S3 };