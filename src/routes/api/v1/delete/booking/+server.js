import { error } from '@sveltejs/kit';
import { deleteReservation } from '$lib/pocketbase';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
	const { id } = await request.json();
	if (id) {
		deleteReservation(id);
		return (json('success', { status: 201 }))
	}
	error(404, 'Not found');
}