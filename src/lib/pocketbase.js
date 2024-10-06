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