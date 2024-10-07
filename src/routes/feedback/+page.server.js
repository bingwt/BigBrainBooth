// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { createFeedback } from '$lib/pocketbase'

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
            login: session.user.login,
            title: data.get('title'),
            description: data.get('description'),
            priority: data.get('priority'),
            type: data.get('type'),
        }

        createFeedback(record);
		return { success: true };
	},
};