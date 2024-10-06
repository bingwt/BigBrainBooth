<script>
	import "../app.css";
	import { dark_mode } from "$lib/stores";
	import { page } from "$app/stores";
	import NavBar from "$lib/components/NavBar.svelte";
</script>
  
<main data-theme={$dark_mode ? "dark" : "light"}>
	<NavBar />
	<div class="hero bg-primary min-h-screen font-satoshi over">
		<div class="hero-content overflow-scroll">
			<div class="w-[90dvw] mt-12">
				<slot />
			</div>
		</div>
	</div>
</main>