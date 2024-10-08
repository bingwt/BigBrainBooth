// @ts-nocheck
import { error } from '@sveltejs/kit';
import { listReservation, getReservation } from '$lib/pocketbase';
import { json } from '@sveltejs/kit';

export async function GET() {
	let records = await listReservation();

	if (records) {
		return json(records, { status: 201 });
	}
	error(404, 'Not found');
}

export async function POST({ request, cookies }) {
	const origin = request.headers.get('Origin');
	const allowedOrigins = [import.meta.env.VITE_42API_URL];

	if (!origin || !allowedOrigins.includes(origin)) {
			throw error(403, 'Origin not allowed');
	}

	const { id } = await request.json();
	const record = await getReservation(id);

	if (record) {
		return json(record, { status: 201 });
	}
	error(404, 'Not found');
}