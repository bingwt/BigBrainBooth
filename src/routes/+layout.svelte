<script>
	import "../app.css";
	import { dark_mode } from "$lib/stores";
	import { page } from "$app/stores";
	import NavBar from "$lib/components/NavBar.svelte";
</script>
  
<main data-theme={$dark_mode ? "dark" : "light"}>
	{#if $page.data.session}
	<NavBar />
	{/if}
	<div class="hero bg-primary min-h-screen font-satoshi over">
		<div class="hero-content overflow-scroll">
			<div class=" max-w-full">
				<slot />
			</div>
		</div>
	</div>
</main>