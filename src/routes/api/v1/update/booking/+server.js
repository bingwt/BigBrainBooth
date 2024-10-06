import { error } from '@sveltejs/kit';
import { updateReservation } from '$lib/pocketbase';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
	const { id, record } = await request.json();
	if (record) {
		updateReservation(id, record);
		return (json('success', { status: 201 }))
	}
	error(404, 'Not found');
}