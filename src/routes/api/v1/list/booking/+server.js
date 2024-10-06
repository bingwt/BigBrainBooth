// @ts-nocheck
import { error } from '@sveltejs/kit';
import { listReservation, getReservation } from '$lib/pocketbase';
import { json } from '@sveltejs/kit';

export async function GET() {
	let records = await listReservation();

	if (records) {
		for (let i = 0; i < Object.keys(records).length; i++) {
			delete records[i]["collectionId"];
			delete records[i]["collectionName"];
			delete records[i]["created"];
			delete records[i]["title"];
			delete records[i]["updated"];
		}
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
		for (let i = 0; i < Object.keys(records).length; i++) {
			delete records[i]["collectionId"];
			delete records[i]["collectionName"];
			delete records[i]["created"];
			delete records[i]["title"];
			delete records[i]["updated"];
		}
		return json(record, { status: 201 });
	}
	error(404, 'Not found');
}