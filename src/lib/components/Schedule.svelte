<script lang="ts">
	import { page } from "$app/stores";
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';
	import Interaction from '@event-calendar/interaction';
	import { onMount } from "svelte";
	
	$: login = $page.data?.user?.login;
	let calendar: any;
	let records: any;
	let overlap: boolean = false;
	let selected_event: any;
	let event_description: string;
	
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
			"allDay": false,
			"description": event_description
		};
		new_booking.title.description = event_description;
		event_description = "";

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
			"allDay": false,
			"description": booking.description
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

async function cancelBooking() {
	if (selected_event?.title?.login === login) {
		fetch('/api/v1/delete/booking', {
			method: "POST",
			body: JSON.stringify({
				id: selected_event?.id
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json())
		.then(() => {
			calendar.removeEventById(selected_event?.id);
		});
	}
}

async function createBooking(booking: any) {
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
						title: {
							html: `<p class="font-bold">${records[i].login}</p>`,
							login: records[i].login,
							description: records[i].description
						},
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
}

	onMount(async () => {
		fetch('/api/v1/list/booking')
		.then(response => response.json())
		.then(data => {
			records = data; 
			for (let i: number = 0; i < records.length; i++) {
				const booking = {
					id: records[i].id,
					title: {
						html: `<p class="font-bold">${records[i].login}</p>`,
						login: records[i].login,
						description: records[i].description
					},
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
				pointer: true,
				slotDuration: "00:15:00",
				nowIndicator: true,
				selectable: true,
				slotEventOverlap: true,
				eventBackgroundColor: "#D6EFEE",
				allDaySlot: false,
				eventClick: (event: any) => {
					selected_event = event.event;
					document.getElementById("view-booking").showModal();
				},
				// eventMouseEnter: (event: any) => {
				// 	selected_event = event.event;
				// 	console.log(selected_event);
				// },
				select: async (info: any) => {
					if (typeof login === 'undefined') {
						calendar.unselect();
						return ;
					}
					document.getElementById("create-booking").showModal();
					const booking = {
						title: {
							html: `<p class="font-bold">${login}</p>`,
							login: login,
							description: ""
						},
						start: info.start,
						end: info.end,
						style: "border: 2px solid #00C4C7; color: #00C4C7"
					}
					selected_event = booking;					
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
});
 </script>

<div id="ec" class="text-sm"></div>

<dialog id="view-booking" class="modal">
  <div class="modal-box rounded-md">    
	<div class="flex flex-col gap-4">
		<div>
			<h1 class="text-2xl font-bold">{selected_event?.title?.login}</h1>
    		<h2><span class="text-accent font-bold">{selected_event?.start.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span> to <span class="text-accent font-bold">{selected_event?.end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span></h2>
		</div>
		<div>
			<p>{selected_event?.title?.description}</p>
		</div>
	  </div> 
	{#if selected_event?.title?.login === login}
	<div class="modal-action">
		<form method="dialog">
			<button class="btn btn-secondary font-bold hover:btn-error hover:text-primary" on:click={cancelBooking}>Cancel</button>
		</form>
	</div>
	{/if}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="create-booking" class="modal">
	<div class="modal-box rounded-md">
	  <h1 class="text-2xl font-bold">Create Event</h1>
	  <div class="flex flex-col gap-4">
		<div>
			<!-- <h2 class="text-xl font-bold">{selected_event?.title?.login}</h2> -->
			<h3><span class="text-accent font-bold">{selected_event?.start.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span> to <span class="text-accent font-bold">{selected_event?.end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span></h3>
		</div>
		<div class="flex flex-col gap-2">
			<h2 class="font-bold text-lg">Description</h2>
			<textarea class="textarea textarea-bordered rounded-md w-full" name="description" placeholder="" bind:value={event_description}></textarea>
		</div>
	  </div> 
	  {#if selected_event?.title?.login === login}
	  <div class="modal-action">
		  <form method="dialog">
			  <button class="btn btn-secondary font-bold hover:btn-accent hover:text-primary" on:click={() => createBooking(selected_event)}>Create</button>
		  </form>
	  </div>
	  {/if}
	</div>
	<form method="dialog" class="modal-backdrop">
	  <button on:click={() => event_description = ""}>close</button>
	</form>
  </dialog>