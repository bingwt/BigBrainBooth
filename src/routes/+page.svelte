<script lang="ts">
	import { page } from "$app/stores";
	/** @type {import('./$types').PageData} */
	export let data: any;
	let reserved: string = "";
	let start: any;
	let end: any;

	$: login = $page.data?.user?.login;
	reserved = $page.data?.reservations?.reserved;
	if (reserved) {
		start = $page.data?.reservations?.start;
		end = $page.data?.reservations?.end;
	}

 </script>

{#if login}
<div class="flex flex-col gap-4 justify-between p-0 w-full text-3xl sm:text-4xl">
<h1>Welcome, <span class="font-bold">{login}</span></h1>
{#if reserved === ""}
<h1>The <span class="font-bold">Big Brain Booth</span> is <span class="text-success font-bold">AVAILABLE</span></h1>
{:else}
<h1>The <span class="font-bold">Big Brain Booth</span> is <span class="text-error font-bold">RESERVED</span> by  <a href="https://profile.intra.42.fr/users/{reserved}" target="_blank" class="underline text-secondary font-bold">{reserved}</a></h1>
<h1>From <span class="text-accent font-bold">{start.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span> to <span class="text-accent font-bold">{end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span></h1>
{/if}
<a href="/booking" class="btn btn-secondary text-primary hover:btn-warning hover:text-primary font-satoshi font-bold p-4 h-8">Reserve</a>
</div>
{:else}
<div class="flex flex-col gap-4 justify-between p-0 w-full text-3xl sm:text-4xl">
	{#if reserved === ""}
	<h1>The <span class="font-bold">Big Brain Booth</span> is <span class="text-success font-bold">AVAILABLE</span></h1>
	{:else}
	<h1>The <span class="font-bold">Big Brain Booth</span> is <span class="text-error font-bold">RESERVED</span> by  <a href="https://profile.intra.42.fr/users/{reserved}" target="_blank" class="underline text-secondary font-bold">{reserved}</a></h1>
	<h1>From <span class="text-accent font-bold">{start.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span> to <span class="text-accent font-bold">{end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span></h1>
	{/if}
	<a href="/booking" class="btn btn-secondary text-primary hover:btn-accent hover:text-primary font-satoshi font-bold p-4 h-20">
		<p>View Schedule</p>
	</a>
</div>
{/if}