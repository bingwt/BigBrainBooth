import PocketBase from 'pocketbase';

export const pb = new PocketBase(import.meta.env.VITE_PB_URL);
pb.autoCancellation(false);

export async function checkReservation() {
	let reservation;
	const records = await pb.collection('42_bbb').getFullList({
		sort: '-created',
	});
	let now = new Date().toISOString();

	for (let i = 0; i < records.length; i++) {
		console.log(records[i])
		if (now >= new Date(records[i].start).toISOString() && now <= new Date(records[i].end).toISOString()) {
			reservation = {
				reserved: records[i].login,
				start: new Date(records[i].start),
				end: new Date(records[i].end),
			}
			return (reservation)
		}
	}
	return { reserved: ""}
}

export async function listReservation() {
	const records = await pb.collection('42_bbb').getFullList({
		sort: '-created',
		fields: 'id,login,start,end,allDay,description'
	});
	return (records);
}

// @ts-ignore
export async function getReservation(id) {
	const record = await pb.collection('42_bbb').getOne(id, {
		fields: 'id,login,start,end,allDay,description'
	});
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

export async function checkBBB() {
	const records = await pb.collection('42_core').getFullList({
		filter: `location = "${import.meta.env.VITE_BBB_LOCATION}"`,
		fields: 'login'
	});
	return (records);
}


// @ts-ignore
export async function createFeedback(record) {
	await pb.collection('42_bbb_feedback').create(record);
}