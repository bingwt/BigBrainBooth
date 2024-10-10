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