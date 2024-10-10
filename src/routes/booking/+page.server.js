// @ts-nocheck
import { redirect, json } from '@sveltejs/kit';
import { getReservation, updateReservation } from '$lib/pocketbase';
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

    }
}

/** @type {import('./$types').Actions} */
export const actions = {
	submit: async ({ cookies, request }) => {
        const session_cookie = cookies.get('session');
        const session = JSON.parse(session_cookie);
		const data = await request.formData();
        let record = await getReservation(decryptData(data.get("id")));

        if (record.feedback === null)
            record.feedback = [];
        record.feedback = [
            {
                login: session.user.login,
                date: new Date().toISOString(),
                description: data.get("feedback"),
            },
            ...record.feedback
        ];
        updateReservation(decryptData(data.get("id")), record);
		return { success: true };
	},
};