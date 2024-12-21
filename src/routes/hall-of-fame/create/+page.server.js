// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { createHallOfFamePost } from '$lib/pocketbase'

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
            author: {
                login: session.user.login,
                image: session.user.image,
            },
            tags: data.get('tags'),
            votes: {up: [], down: []},
            saves: [],
            published: true,
            comments: [],
            // type: data.get('type'),
        }

        createHallOfFamePost(record);
        // console.log(record);
		return { success: true };
	},
};