import { error, json } from '@sveltejs/kit';
import { checkReservation } from '$lib/pocketbase';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const reservations = await checkReservation();

	if (reservations) {
		return reservations;
	}

	return { reserved: "" };
}