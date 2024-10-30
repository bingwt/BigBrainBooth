<script lang="ts">
	import { page } from "$app/stores";
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';
	import Interaction from '@event-calendar/interaction';
	import { onMount } from "svelte";
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	/** @type {import('./$types').ActionData} */
	let form;
	
	$: login = $page.data?.user?.login;
	let calendar: any;
	let records: any;
	let overlap: boolean = false;
	let selected_event: any;
	let event_description: string;
	let event_feedback: string;
	let notify_create: boolean = false;
	let notify_destroy: boolean = false;
	let notify_too_long: boolean = false;
	$: coalitions = JSON.parse($page.data?.coalitions);
	let intra = {
		event: true,
		coalition: "",
		ft_start: false,
		title: "",
		description: "",
		rules: "",
		support: ""
	};

	function coalitionChange(event: any) {
		intra.coalition = event.currentTarget.value;
	}
	
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
			notify_create = true;
			setTimeout(() => {
				notify_create = false;
			}, 4000);
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
			"description": event_description ? event_description : booking.description
		};
		event_description = "";
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

async function removeBooking() {
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
			notify_destroy = true;
			setTimeout(() => {
				notify_destroy = false;
			}, 4000);
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
			refreshBooking();
		});
	}
}

function refreshBooking() {
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
					description: records[i].description,
					feedback: records[i].feedback
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
}

	function checkOverlap(event: any) {
		const booked = calendar.getEvents();
		for (let i: number = 0; i < booked.length; i++) {
			if (event.start > booked[i].start && event.start < booked[i].end)
				overlap = true;
			if (event.end > booked[i].start && event.end < booked[i].end)
				overlap = true;
			if (booked[i].start > event.start && booked[i].start < event.end)
				overlap = true;
				if (booked[i].end > event.start && booked[i].end < event.end)
				overlap = true;
		}
	}

	onMount(async () => {
		calendar = new Calendar({
		target: document.getElementById('ec'),
		props: {
			plugins: [TimeGrid, Interaction],
			options: {
				view: 'timeGridWeek',
				scrollTime: new Date().toTimeString(),
				pointer: true,
				slotDuration: "00:15:00",
				nowIndicator: true,
				selectable: true,
				slotEventOverlap: true,
				eventBackgroundColor: "#D6EFEE",
				allDaySlot: false,
				eventClick: (event: any) => {
					if (!login) {
						selected_event = event.event;
						document.getElementById("view-booking").showModal();
						return ;
					}
					fetch('/api/v1/list/booking', {
					method: "POST",
					body: JSON.stringify({
						id: event.event.id
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				})
				.then(response => response.json())
				.then(data => {
					selected_event = event.event;
					selected_event.title.feedback = data.feedback;
					document.getElementById("view-booking").showModal();
				})
				},
				// eventMouseEnter: (event: any) => {
				// 	selected_event = event.event;
				// 	console.log(selected_event);
				// },
				select: async (event: any) => {
					if (typeof login === 'undefined') {
						calendar.unselect();
						return ;
					}
					if (event.end - event.start > 14400000) {
						calendar.unselect();
						notify_too_long = true;
						setTimeout(() => {
						notify_too_long = false;
					}, 4000);
						return ;
					}
					checkOverlap(event);
					if (overlap) {
						overlap = false;
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
						start: event.start,
						end: event.end,
						style: "border: 2px solid #00C4C7; color: #00C4C7"
					}
					selected_event = booking;					
				},
				eventDrop: (event: any) => {
					checkOverlap(event.event);
					if (overlap || event.event.title.html != `<p class="font-bold">${login}</p>`) {
						event.revert();
						overlap = false;
						return ;
					}
					updateBooking(event.event);
				},
				eventResize: (event: any) => {
					checkOverlap(event.event);
					if (overlap || event.event.title.html != `<p class="font-bold">${login}</p>`) {
						event.revert();
						overlap = false;
						return ;
					}
					if (event.event.end - event.event.start > 14400000) {
						event.revert();
						notify_too_long = true;
						setTimeout(() => {
							notify_too_long = false;
						}, 4000);
						return ;
					}
					updateBooking(event.event);
				},
				unselect: () => {
					overlap = false;
				},
				datesSet: (event: any) => {
					if (calendar) {
						const events = calendar.getEvents();
						for (let i = 0; i < events.length; i++) {
							calendar.removeEventById(events[i].id);
						}
					};
					fetch(`/api/v1/list/booking?start=${event.start}&end=${event.end}`)
					.then(response => response.json())
					.then(data => {
						records = data;
						for (let i: number = 0; i < records.length; i++) {
							const booking = {
								id: records[i].id,
								title: {
									html: `<p class="font-bold">${records[i].login}</p>`,
									login: records[i].login,
									description: records[i].description,
									feedback: records[i].feedback
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
				},
				events: []
			}
		}
	});
	document.onkeydown = function(event) {
		if (event.key === "Escape")
			calendar.unselect();
	};
});
 </script>

<div class="toast toast-top toast-end mt-14 text-sm fixed z-20">
	{#if notify_create}
	<div in:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'x' }} out:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'x' }}
	class="alert rounded-md text-success bg-primary">
	  <span>Slot has been created</span>
	</div>
	{/if}
	{#if notify_destroy}
	<div in:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'x' }} out:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'x' }}
	class="alert rounded-md text-error bg-primary">
	  <span>Slot has been destroyed</span>
	</div>
	{/if}
	{#if notify_too_long}
	<div in:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'x' }} out:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'x' }}
	class="alert rounded-md text-warning bg-primary">
	  <span>Slot is too long</span>
	</div>
	{/if}
</div>

<div id="ec" class="text-sm"></div>

<dialog id="view-booking" class="modal">
  <div class="modal-box rounded-md">    
	<div class="flex flex-col gap-4">
		<div>
			<a href="https://profile.intra.42.fr/users/{selected_event?.title?.login}" class="text-2xl font-bold text-accent">{selected_event?.title?.login}</a>
    		<h2><span class="font-bold">{selected_event?.start.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span> to <span class="font-bold">{selected_event?.end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span></h2>
		</div>
		{#if selected_event?.title?.description}
		<div>
			<h2 class="font-bold text-lg">Description</h2>
			<p>{selected_event?.title?.description}</p>
		</div>
		{/if}
		{#if selected_event?.title?.feedback}
		<div>
			<h2 class="font-bold text-lg">Feedback</h2>
			{#if login}
			<div class="flex flex-col gap-0 p-4 h-48 overflow-y-scroll">
				{#each selected_event?.title?.feedback as entry, i}
				<div class="flex flex-col gap-2">
					<div>
						<h3><a href="https://profile.intra.42.fr/users/{entry.login}" class="font-bold text-accent">{entry.login}'s</a> feedback from <span class="font-bold">{new Date(entry.date).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</span></h3>
					</div>
					<div>
						{entry.description}
					</div>
				</div>
				{#if i !== selected_event?.title?.feedback?.length - 1}
				<div class="divider divider-neutral"></div>
				{/if}
				{/each}
			</div>
			{:else}
			<p class="p-4"><a href="/signin" class="font-bold underline">Sign in</a> to view feedback.</p>
			{/if}
		</div>
		{/if}
	  </div>
	{#if selected_event?.title?.login === login}
	<div class="modal-action">
	<button class="btn btn-secondary font-bold hover:btn-warning hover:text-primary" on:click={() => {
		event_description = selected_event.title.description;
		document.getElementById("edit-booking").showModal();
		}}>Edit</button>
		<form method="dialog">
			<button class="btn btn-secondary font-bold hover:btn-error hover:text-primary" on:click={removeBooking}>Remove</button>
		</form>
	</div>
	{:else if typeof(login) !== "undefined"}
	<div class="modal-action">
		<form method="">
			<button class="btn btn-secondary font-bold hover:btn-warning hover:text-primary" on:click={() => document.getElementById("feedback-booking").showModal()}>Give Feedback</button>
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
			<div class="form-control">
				<label class="label cursor-pointer">
				  <span class="label-text font-bold">Intra Event</span>
				  <input type="checkbox" checked={intra.event} class="checkbox" />
				  {#if intra.event}
				  <span class="label-text font-bold">Start at 42 minutes</span>
				  <input type="checkbox" checked={intra.ft_start} class="checkbox" />
				  {/if}
				  <!-- <input type="radio" name="type" class="radio checked:bg-secondary" on:change={typeChange} value="feedback" checked={type === "feedback"} /> -->
				</label>
			  </div>
			{#if intra.event}
			<fieldset id="coalition" class="flex flex-col gap-0">
				<h2 class="font-bold text-lg">Coalition</h2>
				{#each coalitions as coalition}
				<div class="form-control">
					<label class="label cursor-pointer">
					<span class="label-text">{coalition}</span>
					<input type="radio" name="coalition" class="radio checked:bg-secondary" on:change={coalitionChange} value={coalition} checked={intra.coalition === coalition} />
					</label>
				</div>
				{/each}
			</fieldset>
			<h2 class="font-bold text-lg">Activity Title/Theme</h2>
			<input type="text" placeholder="" class="input input-bordered w-full font-bold rounded-md" bind:value={intra.title} />
			<h2 class="font-bold text-lg">Activity Description</h2>
			<textarea class="textarea textarea-bordered rounded-md w-full" name="description" placeholder="" bind:value={intra.description}></textarea>
			<h2 class="font-bold text-lg">Activity Rundown and Rules</h2>
			<textarea class="textarea textarea-bordered rounded-md w-full" name="description" placeholder="" bind:value={intra.rules}></textarea>
			<h2 class="font-bold text-lg">Activity Support/Equipment Required</h2>
			<textarea class="textarea textarea-bordered rounded-md w-full" name="description" placeholder="6 x Badminton Court Booking for Badminton Tournament" bind:value={intra.support}></textarea>
			{:else}
			<h2 class="font-bold text-lg">Description</h2>
			<textarea class="textarea textarea-bordered rounded-md w-full" name="description" placeholder="" bind:value={event_description}></textarea>
			{/if}
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

  <dialog id="feedback-booking" class="modal">
	<div class="modal-box rounded-md">
	  <h1 class="text-2xl font-bold">Feedback {selected_event?.title?.login}'s Event</h1>
	  <div class="flex flex-col gap-4">
		<div>
			<!-- <h2 class="text-xl font-bold">{selected_event?.title?.login}</h2> -->
			<h3><span class="text-accent font-bold">{selected_event?.start.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span> to <span class="text-accent font-bold">{selected_event?.end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span></h3>
		</div>
		<div class="flex flex-col gap-2">
			<form method="POST" action="?/submit">
				<div class="form-control flex flex-col gap-4 text-3xl sm:text-4xl w-full">
					{#if form?.success}
					<h1 class="text-4xl font-bold text-center">Thank you for your feedback!</h1>
					{:else}
					<fieldset id="id" class="flex flex-col gap-0">
						<textarea name="id" hidden contenteditable=false value={selected_event?.id}></textarea>
					</fieldset>
					<fieldset id="feedback" class="flex flex-col gap-0">
						<textarea class="textarea textarea-bordered" name="feedback" placeholder="" bind:value={event_feedback}></textarea>
					</fieldset>
					{/if}
				</div>
				<div class="modal-action">
					  <button class="btn btn-secondary font-bold hover:btn-accent hover:text-primary" disabled={event_feedback ? false : true} on:click={refreshBooking}>Submit</button>
				</div>
			</form>
		</div>
	  </div>
	</div>
	<form method="dialog" class="modal-backdrop">
	  <button on:click={() => event_feedback = ""}>close</button>
	</form>
  </dialog>

  <dialog id="edit-booking" class="modal">
	<div class="modal-box rounded-md">
	  <h1 class="text-2xl font-bold">Edit Event</h1>
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
			  <button class="btn btn-secondary font-bold hover:btn-accent hover:text-primary" on:click={() => updateBooking(selected_event)}>Update</button>
		  </form>
	  </div>
	  {/if}
	</div>
	<form method="dialog" class="modal-backdrop">
	  <button>close</button>
	</form>
  </dialog>

<style>

:global(.ec) {
	--ec-now-indicator-color: theme('colors.error');
	--ec-today-bg-color: rgba(230, 178, 145, 0);
}

:global(.ec-title) {
	@apply text-lg font-bold text-accent;
}

:global(.ec-button.ec-today) {
	@apply bg-accent text-primary border-none hover:bg-accent hover:text-primary
}

:global(.ec-button:disabled),
:global(.ec-button[disabled]) {
	@apply opacity-50 cursor-not-allowed;
}

:global(.ec-button.ec-prev) {
	@apply bg-[#EBEBEB] text-secondary border-none mr-1
}

:global(.ec-button.ec-next) {
	@apply bg-[#EBEBEB] text-secondary border-none ml-1 rounded-md
}

:global(.ec-days) {
	@apply text-xs font-bold text-accent;
}

:global(.ec-sidebar) {
	@apply text-xs font-bold text-accent;
}

:global(.ec-body) {
	@apply h-[70dvh] p-0 overflow-y-scroll
}
</style>