<script lang="ts">
	import { page } from "$app/stores";
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';
	import Interaction from '@event-calendar/interaction';
	import { onMount } from "svelte";
	
	$: email = $page.data?.session?.user?.email;
	$: login = $page.data.session?.user?.email?.split('@')[0]
	let calendar: any;
	
	onMount(() => {
		calendar = new Calendar({
		target: document.getElementById('ec'),
		props: {
			plugins: [TimeGrid, Interaction],
			options: {
				view: 'timeGridWeek',
				nowIndicator: true,
				selectable: true,
				slotEventOverlap: true,
				eventClick: (event: any) => {
					if (event.event.title === login)
					calendar.removeEventById(event.event.id);
				},
				select: (info: any) => {
					let overlap: boolean = false;
					const booking = {
						title: email?.split('@')[0],
						start: info.start,
						end: info.end
					}
					const booked = calendar.getEvents();
					for (let i: number = 0; i < booked.length; i++) {
						if (booking.start > booked[i].start && booking.start < booked[i].end)
							overlap = true;
						if (booking.end > booked[i].start && booking.end < booked[i].end)
							overlap = true;
					}
					console.log(overlap);
					if (!overlap)
						addBooking(booking);
				},
				events: []
			}
		}
	});
});

function addBooking(booking: any) {
		calendar.addEvent(booking);
		console.log(booking);
	};
 </script>

<div id="ec"></div>