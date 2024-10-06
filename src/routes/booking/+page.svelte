<script lang="ts">
	import { page } from "$app/stores";
	import Schedule from "$lib/components/Schedule.svelte";
	
	$: email = $page.data?.session?.user?.email;
	$: login = $page.data.session?.user?.email?.split('@')[0];
 </script>

{#if $page.data.session}
<div class="flex flex-col gap-4 p-0 w-full h-[90dvh]">
	<h1 class="text-4xl">Resevation for <span class="font-bold">{login}</span></h1>
	<div class="overflow-y-scroll p-4">
		<Schedule />
	</div>
</div>
{:else}
<div class="flex flex-col gap-4 p-0 w-full h-[90dvh]">
	<div class="overflow-y-scroll p-4">
		<Schedule />
	</div>
</div>
{/if}