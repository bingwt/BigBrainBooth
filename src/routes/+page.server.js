// @ts-nocheck
import { redirect, error, json } from '@sveltejs/kit';
import { checkReservation } from '$lib/pocketbase';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const reservations = await checkReservation();
    const session_cookie = cookies.get('session');

    try {
        const session = JSON.parse(session_cookie);
		if (session && reservations.reserved === "") {
			return {
				user: session.user,
				reservations: { reserved: "" }
			};
		}
        return {
            user: session.user,
			reservations
        };
    } catch (error) {

    }

	if (reservations) {
		return {
			reservations
		};
	}
	return { reservations: { reserved: "" } };

}