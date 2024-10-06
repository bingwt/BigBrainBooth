import PocketBase from 'pocketbase';

export const pb = new PocketBase(import.meta.env.VITE_PB_URL);

export async function checkReservation() {
	let reservation;
	const records = await pb.collection('42_bbb').getFullList({
		sort: '-created',
	});
	let now = new Date().toISOString();

	for (let i = 0; i < records.length; i++) {
		if (now >= new Date(records[i].start).toISOString() && now <= new Date(records[i].end).toISOString()) {
			reservation = {
				reserved: records[i].login,
				start: new Date(records[i].start),
				end: new Date(records[i].end),
			}
			return (reservation)
		}
	}
}

export async function listReservation() {
	const records = await pb.collection('42_bbb').getFullList({
		sort: '-created',
	});
	return (records);
}

// @ts-ignore
export async function getReservation(id) {
	const record = await pb.collection('42_bbb').getOne(id);
	return (record);
}

// @ts-ignore
export async function updateReservation(id, record) {
	await pb.collection('42_bbb').update(id, record);
}

// @ts-ignore
export async function createReservation(record) {
	await pb.collection('42_bbb').create(record);
}

// @ts-ignore
export async function deleteReservation(id) {
	await pb.collection('42_bbb').delete(id);
}