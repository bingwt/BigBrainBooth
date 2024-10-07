<script lang="ts">
	import { page } from "$app/stores";
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';
	import Interaction from '@event-calendar/interaction';
	import { onMount } from "svelte";
	
	$: login = $page.data?.user?.login;
	let calendar: any;
	let overlap: boolean = false;
	
	function listBookings(booking: any) {
		calendar.addEvent(booking);
		overlap = false;
	};

	async function addBooking(booking: any) {
		const new_booking = {
			"start": booking.start,
			"end": booking.end,
			"login": login,
			"title": booking.title,
			"allDay": false
		};

		await fetch('/api/v1/create/booking', {
			method: "POST",
			body: JSON.stringify({
				record: new_booking
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json())
		.then(() => {
			// calendar.addEvent(booking);
			overlap = false;
		});
	};

	async function updateBooking(booking: any) {
		let record: any;
		fetch('/api/v1/list/booking', {
			method: "POST",
			body: JSON.stringify({
				id: booking.id
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json())
		.then(data => {
			record = data;
			const updates = {
			"start": booking.start,
			"end": booking.end,
			"login": login,
			"title": booking.title,
			"allDay": false
		};

		if (record.login === login) {
			fetch('/api/v1/update/booking', {
				method: "POST",
				body: JSON.stringify({
					id: booking.id,
					record: updates
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})
		}
	})
}

	onMount(async () => {
		let records: any;
		fetch('/api/v1/list/booking')
		.then(response => response.json())
		.then(data => {
			records = data; 
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
		})
		.catch(error => {
			console.error('Error fetching data:', error);
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
						fetch('/api/v1/delete/booking', {
							method: "POST",
							body: JSON.stringify({
								id: event.event.id
							}),
							headers: {
								'Content-Type': 'application/json'
							}
						})
						.then(response => response.json())
						.then(() => {
							calendar.removeEventById(event.event.id);
							
						});
					}
				},
				select: async (info: any) => {
					const booking = {
						title: {html: `<p class="font-bold">${login}</p>`},
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
					if (!overlap && Object.keys($page.data).length != 0) {
						await addBooking(booking).then(() => {
							const events = calendar.getEvents();

							for (let i = 0; i < events.length; i++) {
								calendar.removeEventById(events[i].id);
							}
							fetch('/api/v1/list/booking')
							.then(response => response.json())
							.then(data => {
								records = data; 
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
									calendar.unselect();
								}
							})
							.catch(error => {
								console.error('Error fetching data:', error);
							});
						});
					}
					calendar.unselect();
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
				eventMouseEnter: (event: any) => {
					console.log(event.event);
				},
				events: []
			}
		}
	});
});
 </script>

<div id="ec" class="text-xs"></div>