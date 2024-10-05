<script lang="ts">
	import { page } from "$app/stores";
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';
	import Interaction from '@event-calendar/interaction';
	import { onMount } from "svelte";
	
	$: email = $page.data?.session?.user?.email;
	$: login = $page.data.session?.user?.email?.split('@')[0]
	let calendar: any;
	let overlap: boolean = false;
	
	function addBooking(booking: any) {
		calendar.addEvent(booking);
		overlap = false;
	};

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
				eventBackgroundColor: "#D6EFEE",
				eventClick: (event: any) => {
					if (event.event.title.html === `<p class="font-bold">${login}</p>`)
					calendar.removeEventById(event.event.id);
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
					if (!overlap)
						addBooking(booking);
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
					if (overlap)
					{
						event.revert();
						overlap = false;
					}
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
					if (overlap)
					{
						event.revert();
						overlap = false;
					}
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

<div id="ec" class="text-xs"></div>