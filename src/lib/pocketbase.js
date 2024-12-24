// @ts-nocheck
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

export async function listReservation(start, end) {
	const records = await pb.collection('42_bbb').getFullList({
		sort: '-created',
		filter: `start >= "${start}" && end <= "${end}"`,
		fields: 'id,login,start,end,allDay,description'
	});
	return (records);
}

// @ts-ignore
export async function getReservation(id) {
	const record = await pb.collection('42_bbb').getOne(id, {
		fields: 'id,login,start,end,allDay,description,feedback'
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

export async function listHallOfFame(start, end) {
	const records = await pb.collection('42_hall_of_fame').getFullList({
		sort: '-created',
		filter: `start >= "${start}" && end <= "${end}"`,
		fields: 'id,author,title,description'
	});
	return (records);
}

export async function getHallOfFame() {
	let records = await pb.collection('42_hall_of_fame').getFullList({
		sort: '-created',
		fields: 'id,author,title,description,tags,media,votes,saves,published,comments,created'
	});
	// for (let i = 0; i < records.length; i++) {
	// 	for (let j = 0; j < records[i].media.length; j++) {
	// 		records[i].media[j] = `${import.meta.env.VITE_PB_URL}/api/files/42_hall_of_fame/${records[i].id}/${records[i].media[j]}`
	// 	}
	// }
	return (records);
}

export async function searchHallOfFame(search) {
	const records = await pb.collection('42_hall_of_fame').getFullList({
		filter: `author ~ "${search}" || author_meta.name ~ "${search}" || tags ~ "${search}" || title ~ "${search}" || description ~ "${search}" || comments ~ "${search}"`,
		sort: '-created',
		fields: 'id,author,title,description,tags,media,votes,saves,published,comments,created'
	});
	return (records);
}

export async function createHallOfFamePost(record) {
	await pb.collection('42_hall_of_fame').create(record);
}

export async function getHallOfFamePost(id) {
	const record = await pb.collection('42_hall_of_fame').getOne(id, {
		fields: 'id,author,title,description,tags,media,votes,saves,published,comments,created'
	});
	// for (let i = 0; i < record.media.length; i++) {
	// 	record.media[i] = `${import.meta.env.VITE_PB_URL}/api/files/42_hall_of_fame/${record.id}/${record.media[i]}`
	// }
	return (record);
}

export async function updateHallOfFamePost(id, record) {
	await pb.collection('42_hall_of_fame').update(id, record);
}

export async function deleteHallOfFamePost(id) {
	await pb.collection('42_hall_of_fame').delete(id);
}

export async function createProfile(record) {
	await pb.collection('42_bbb_profiles').create(record);
}

export async function getProfile(login) {
	const records = await pb.collection('42_bbb_profiles').getFullList({
		filter: `login ~ "${login}"`,
		sort: '-created',
		fields: 'id,login,votes,saved,comments,created'
	});
	return (records);
}

export async function updateProfile(id, record) {
	await pb.collection('42_bbb_profiles').update(id, record);
}