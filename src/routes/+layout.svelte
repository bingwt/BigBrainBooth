<script>
	import "../app.css";
	import { dark_mode } from "$lib/stores";
	import NavBar from "$lib/components/NavBar.svelte";
</script>
  
<main data-theme={$dark_mode ? "dark" : "light"}>
	<NavBar />
	<div class="hero bg-primary min-h-screen font-satoshi">
		<div class="hero-content">
			<div class="w-[90dvw]">
				<slot />
			</div>
		</div>
	</div>
</main>