import { error } from '@sveltejs/kit';
import { createHallOfFamePost } from '$lib/pocketbase';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
	const origin = request.headers.get('Origin');
	const allowedOrigins = [import.meta.env.VITE_42API_URL];

	if (!origin || !allowedOrigins.includes(origin)) {
			throw error(403, 'Origin not allowed');
	}
    const { record } = await request.json();
    if (record) {
        createHallOfFamePost(record);
        return (json('success', { status: 201 }))
    }
    error(404, 'Not found');
}