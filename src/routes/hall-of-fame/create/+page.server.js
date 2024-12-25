// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { createHallOfFamePost } from '$lib/pocketbase'
import crypto from 'crypto';
import { ms } from '$lib/meilisearch';

const secret_key = crypto
    .createHash('sha512')
    .update(import.meta.env.VITE_SECRET_KEY)
    .digest('hex')
    .substring(0, 32)

const encryptionIV = crypto
    .createHash('sha512')
    .update(import.meta.env.VITE_SECRET_IV)
    .digest('hex')
    .substring(0, 16)

function encryptData(data) {
    const cipher = crypto.createCipheriv(import.meta.env.VITE_ENCRYPTION_METHOD, secret_key, encryptionIV)
    return Buffer.from(
        cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64')
}

function decryptData(data) {
    const buff = Buffer.from(data, 'base64')
    const decipher = crypto.createDecipheriv(import.meta.env.VITE_ENCRYPTION_METHOD, secret_key, encryptionIV)
    return (
        decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
        decipher.final('utf8')
    )
}

export function load({ cookies }) {
    const session_cookie = cookies.get('session');

    try {
        const session = JSON.parse(session_cookie);
        return {
            user: session.user
        };
    } catch (error) {
        redirect(301, "/signin")
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    submit: async ({ cookies, request }) => {
        const session_cookie = cookies.get('session');
        const session = JSON.parse(session_cookie);

        const data = await request.formData();
        const record = {
            title: data.get('title'),
            description: data.get('description'),
            author: session.user.login,
            author_meta: {
                name: session.user.name,
                image: session.user.image,
            },
            media: [],
            tags: data.get('tags'),
            votes: { up: [], down: [] },
            saves: [],
            published: true,
            comments: [],
        }

        const pbResponse = await createHallOfFamePost(record);
        const msRecord = {
            id: pbResponse.id,
            title: record.title,
            description: record.description,
            author: record.author,
            author_meta: record.author_meta,
            // media: record.media,
            tags: record.tags,
            comments: record.comments
        }
        let msResponse = await ms.index(import.meta.env.VITE_MEILISEARCH_INDEX).addDocuments([msRecord]);
        return { success: true };
    },
};