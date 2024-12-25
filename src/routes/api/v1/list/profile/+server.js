// @ts-nocheck
import { error, json } from '@sveltejs/kit';
import { getProfile } from '$lib/pocketbase';
import crypto from 'crypto';

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
	if (!locals.user) {
		throw error(401, 'Unauthorized - Please log in to access this endpoint');
	}

	const query = new URLSearchParams(url.search);
	const search = query.get('login');
	let records = [];

	records = await getProfile(search);

	if (records) {
		for (let i = 0; i < records.length; i++) {
			records[i].id = encryptData(records[i].id);
		}
		return json(records, { status: 201 });
	}
	throw error(404, 'Not found');
}