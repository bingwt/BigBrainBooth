<script lang="ts">
	import { page } from "$app/stores";
	import Schedule from "$lib/components/Schedule.svelte";
	
	$: login = $page?.data?.user?.login;
 </script>

<svelte:head>
    <title>BBB - Booking</title> 
</svelte:head>

<div class="hero-content">
	<div class="flex flex-col align-middle gap-4 w-full">
		{#if login}
		<h1 class="text-4xl text-secondary">Reservation for <span class="font-bold">{login}</span></h1>
		{/if}
		<div class="pt-4 h-[75dvh]">
			<Schedule />
		</div>
	</div>
</div>