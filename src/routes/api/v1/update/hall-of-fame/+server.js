// @ts-nocheck
import { error, json } from '@sveltejs/kit';
import { updateHallOfFamePost } from '$lib/pocketbase';
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

function decryptData(data) {
	const buff = Buffer.from(data, 'base64')
	const decipher = crypto.createDecipheriv(import.meta.env.VITE_ENCRYPTION_METHOD, secret_key, encryptionIV)
	return (
	  decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
	  decipher.final('utf8')
	)
}

export async function POST({ request, cookies }) {
	const origin = request.headers.get('Origin');
	const allowedOrigins = [import.meta.env.VITE_42API_URL];

	if (!origin || !allowedOrigins.includes(origin)) {
			throw error(403, 'Origin not allowed');
	}

	const { id, record } = await request.json();
	if (record) {
		updateHallOfFamePost(decryptData(id), record);
		let msRecord = {
			id: decryptData(id),
			title: record.title,
			description: record.description,
			author: record.author,
			author_meta: record.author_meta,
			tags: record.tags,
			comments: record.comments
		}
		let msResponse = await ms.index(import.meta.env.VITE_MEILISEARCH_INDEX).updateDocuments([msRecord]);
		return (json('success', { status: 201 }))
	}
	error(404, 'Not found');
}