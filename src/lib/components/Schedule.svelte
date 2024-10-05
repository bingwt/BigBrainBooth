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
			dateClick: (event: any) => {
			const booking = {
				title: email?.split('@')[0],
				start: event.date
			}
			// console.log(booking);
			addBooking(booking);
		},
		eventMouseEnter: (event: any) => {
			console.log(event);
		},
		eventClick: (event: any) => {
			if (event.event.title === login)
				calendar.removeEventById(event.event.id);
			console.log(event);
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