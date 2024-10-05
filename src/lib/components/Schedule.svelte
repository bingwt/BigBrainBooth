<script lang="ts">
	import { page } from "$app/stores";
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';
	import Interaction from '@event-calendar/interaction';
	import { onMount } from "svelte";
	import { pb } from "$lib/pocketbase";
	
	$: email = $page.data?.session?.user?.email;
	$: login = $page.data.session?.user?.email?.split('@')[0];
	let calendar: any;
	let overlap: boolean = false;
	
	function listBookings(booking: any) {
		calendar.addEvent(booking);
		overlap = false;
	};

	async function addBooking(booking: any) {
		const data = {
			"start": booking.start,
			"end": booking.end,
			"login": login,
			"title": booking.title,
			"allDay": false
		};

		await pb.collection('42_bbb').create(data);
		calendar.addEvent(booking);
		overlap = false;
	};

	async function updateBooking(booking: any) {
		const record = await pb.collection('42_bbb').getOne(booking.id);
		const data = {
			"start": booking.start,
			"end": booking.end,
			"login": login,
			"title": booking.title,
			"allDay": false
		};

		if (record.login === login)
			await pb.collection('42_bbb').update(booking.id, data);
	}

	onMount(async () => {
		const records = await pb.collection('42_bbb').getFullList({
    		sort: '-created',
		});
		calendar = new Calendar({
		target: document.getElementById('ec'),
		props: {
			plugins: [TimeGrid, Interaction],
			options: {
				view: 'timeGridWeek',
				nowIndicator: true,
				selectable: true,
				slotEventOverlap: true,
				eventBackgroundColor: "#D6EFEE",
				allDaySlot: false,
				eventClick: (event: any) => {
					if (event.event.title.html === `<p class="font-bold">${login}</p>`) {
						calendar.removeEventById(event.event.id);
						pb.collection('42_bbb').delete(event.event.id);
					}
				},
				select: (info: any) => {
					const booking = {
						title: {html: `<p class="font-bold">${email?.split('@')[0]}</p>`},
						start: info.start,
						end: info.end,
						style: "border: 2px solid #00C4C7; color: #00C4C7"
					}
					const booked = calendar.getEvents();
					for (let i: number = 0; i < booked.length; i++) {
						if (booking.start > booked[i].start && booking.start < booked[i].end)
							overlap = true;
						if (booking.end > booked[i].start && booking.end < booked[i].end)
							overlap = true;
						if (booked[i].start > booking.start && booked[i].start < booking.end)
							overlap = true;
							if (booked[i].end > booking.start && booked[i].end < booking.end)
							overlap = true;
					}
					if (!overlap) {
						addBooking(booking);
						window.location.reload();
					}
				},
				eventDrop: (event: any) => {
					const booked = calendar.getEvents();
					for (let i: number = 0; i < booked.length; i++) {
						if (event.event.start > booked[i].start && event.event.start < booked[i].end)
							overlap = true;
						if (event.event.end > booked[i].start && event.event.end < booked[i].end)
							overlap = true;
						if (booked[i].start > event.event.start && booked[i].start < event.event.end)
							overlap = true;
							if (booked[i].end > event.event.start && booked[i].end < event.event.end)
							overlap = true;
					}
					if (overlap || event.event.title.html != `<p class="font-bold">${login}</p>`) {
						event.revert();
						overlap = false;
					}
					updateBooking(event.event);
				},
				eventResize: (event: any) => {
					const booked = calendar.getEvents();
					for (let i: number = 0; i < booked.length; i++) {
						if (event.event.start > booked[i].start && event.event.start < booked[i].end)
							overlap = true;
						if (event.event.end > booked[i].start && event.event.end < booked[i].end)
							overlap = true;
						if (booked[i].start > event.event.start && booked[i].start < event.event.end)
							overlap = true;
							if (booked[i].end > event.event.start && booked[i].end < event.event.end)
							overlap = true;
					}
					if (overlap || event.event.title.html != `<p class="font-bold">${login}</p>`) {
						event.revert();
						overlap = false;
					}
					updateBooking(event.event);
				},
				unselect: () => {
					overlap = false;
				},
				events: []
			}
		}
	});
	for (let i: number = 0; i < records.length; i++) {
		const booking = {
			id: records[i].id,
			title: {html: `<p class="font-bold">${records[i].login}</p>`},
			start: new Date(records[i].start),
			end: new Date(records[i].end),
			allDay: records[i].allDay,
			style: "border: 2px solid #00C4C7; color: #00C4C7"
		}
		listBookings(booking);
	}
});
 </script>

<div id="ec" class="text-xs"></div>