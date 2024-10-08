// @ts-nocheck
import { error } from '@sveltejs/kit';
import { checkBBB } from '$lib/pocketbase';
import { json } from '@sveltejs/kit';

export async function GET() {
	let record = await checkBBB();

	if (record) {
		return json(record, { status: 201 });
	}
	error(404, 'Not found');
}