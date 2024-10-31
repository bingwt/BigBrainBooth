// @ts-nocheck
import { redirect, error, json } from '@sveltejs/kit';
import { checkReservation, createReservation, checkBBB, checkUser } from '$lib/pocketbase';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const reservations = await checkReservation();
	const check_bbb = await checkBBB();
	const bbb = {
		occupied: false,
		login: ""
	};
    const session_cookie = cookies.get('session');
	if (check_bbb.length) {
		bbb.occupied = true;
		bbb.login = check_bbb[0].login;
	}
    try {
        const session = JSON.parse(session_cookie);
		const check_user = await checkUser(session.user.login);
		console.log(check_user)
		if (session && reservations.reserved === "") {
			if (bbb.occupied) {
				const start = new Date();
				const end = new Date();
				end.setMinutes(end.getMinutes() + 30);
				const record = {
					start: start.toISOString(),
					end: end.toISOString(),
					login: bbb.login,
					allDay: false,
				};
				createReservation(record);
			}
			return {
				user: session.user,
				reservations: { reserved: "" },
				bbb: bbb
			};
		}
        return {
            user: session.user,
			reservations,
			bbb: bbb
        };
    } catch (error) {

    }

	if (reservations) {
		return {
			reservations
		};
	}
	return { reservations: { reserved: "" } };

}