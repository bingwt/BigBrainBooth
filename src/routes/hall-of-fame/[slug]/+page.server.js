// @ts-nocheck
import { redirect, json } from '@sveltejs/kit';
import { getHallOfFamePost } from '$lib/pocketbase';
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
        // redirect(301, "/signin")
    }
}