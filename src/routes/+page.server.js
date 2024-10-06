import { error } from '@sveltejs/kit';
import { checkReservation } from '$lib/pocketbase';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const post = await checkReservation();

	if (post) {
		return post;
	}

	error(404, 'Not found');
}