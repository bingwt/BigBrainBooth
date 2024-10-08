// @ts-nocheck
import { redirect, json } from '@sveltejs/kit';
import { getReservation, updateReservation } from '$lib/pocketbase';

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
        let record = await getReservation(data.get("id"));

        if (record.feedback === null)
            record.feedback = [];
        record.feedback = [
            {
                login: session.user.login,
                created_at: new Date().toISOString(),
                description: data.get("feedback"),
            },
            ...record.feedback
        ];
        updateReservation(data.get("id"), record);
		return { success: true };
	},
};