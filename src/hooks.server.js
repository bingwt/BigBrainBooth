// @ts-nocheck
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
    const session_cookie = event.cookies.get('session');

    if (session_cookie) {
        try {
            const session = JSON.parse(session_cookie);
            event.locals.user = session.user;
        } catch (error) {
            console.error('Invalid session', error);
        }
    }

    const response = await resolve(event);
    return response;
}