<script lang="ts">
	import { page } from "$app/stores";
	import Schedule from "$lib/components/Schedule.svelte";
	
	$: login = $page?.data?.user?.login;
 </script>

<svelte:head>
    <title>BBB - Booking</title> 
</svelte:head>

{#if login}
<div class="flex flex-col gap-4 p-4 w-full h-[90dvh]">
	<h1 class="text-4xl">Reservation for <span class="font-bold">{login}</span></h1>
	<div class="overflow-y-scroll p-4">
		<Schedule />
	</div>
</div>
{:else}
<div class="flex flex-col gap-4 p-0 w-full h-[90dvh]">
	<div class="overflow-y-scroll p-4 pt-6">
		<Schedule />
	</div>
</div>
{/if}