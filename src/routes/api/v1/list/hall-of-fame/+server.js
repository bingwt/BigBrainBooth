// @ts-nocheck
import { error, json } from '@sveltejs/kit';
import { getHallOfFame, getHallOfFamePost, searchHallOfFame } from '$lib/pocketbase';
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

export async function GET({ url, locals }) {
	const query = new URLSearchParams(url.search);
	const start = new Date(query.get('start')).toISOString();
	const end = new Date(query.get('end')).toISOString();
	const search = query.get('search');
	const id = query.get('id');
	let records = [];

	let searchFilter = ["*"];
	if (!locals.user) {
		searchFilter = ["author", "author_meta", "title", "media", "tags"];
	}
	if (search) {
		const results = await ms.index(import.meta.env.VITE_MEILISEARCH_INDEX).search(search, {
			attributesToSearchOn: searchFilter
		});
		records = results.hits;
		// if (records.length === 0) {
		// 	records = await searchHallOfFame(search);
		// }
	} else if (id) {
		records = await getHallOfFamePost(decryptData(id));
	} else {
		records = await getHallOfFame(start, end);
	}

	if (records) {
		for (let i = 0; i < records.length; i++) {
			records[i].id = encryptData(records[i].id);
		}
		return json(records, { status: 201 });
	}
	error(404, 'Not found');
}

export async function POST({ request, cookies }) {
	const origin = request.headers.get('Origin');
	const allowedOrigins = [import.meta.env.VITE_42API_URL];

	if (!origin || !allowedOrigins.includes(origin)) {
		throw error(403, 'Origin not allowed');
	}

	const { id } = await request.json();
	const record = await getHallOfFamePost(decryptData(id));

	if (record) {
		record.id = encryptData(record.id);
		return json(record, { status: 201 });
	}
	error(404, 'Not found');
}