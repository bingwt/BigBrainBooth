import { error } from '@sveltejs/kit';
import { createReservation } from '$lib/pocketbase';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
	const { record } = await request.json();
	if (record) {
		createReservation(record);
		return (json('success', { status: 201 }))
	}
	error(404, 'Not found');
}