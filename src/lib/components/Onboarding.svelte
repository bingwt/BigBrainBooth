<script>
	export let login;
	let current_board = 1;

	const onboarding = [
		{
			heading: `Hello ${login}!`,
			content: "Thank you for joining us at the Big Brain Booth. We're excited to help you manage your availability and support your fellow students!."
		},
		{
			heading: `What is BBB?`,
			content: "It's a dedicated space where students can offer help on specific projects. We've noticed that some might be struggling, so we are trying out BBB to further assist everyone with challenging projects."
		},
		{
			heading: `Opening Slots:`,
			content: "Go ahead and reserve your slot! Just like opening slots on the intra!"
		},
		{
			heading: `Describe what you'll be doing:`,
			content: "Give a breif description or don't, it's up to you!"
		},
		{
			heading: `Ready for the Big Brain Booth?`,
			content: "Go on and reserve your slot!"
		}
]

function nextOnboard() {
	if (current_board == onboarding.length) {
		current_board = 1;
	}
	current_board++;
	document.getElementById(`onboard-${current_board}`).scrollIntoView();
}

function prevOnboard() {
	if (current_board == 1) {
		current_board = onboarding.length;
	}
	current_board--;
	document.getElementById(`onboard-${current_board}`).scrollIntoView();
}
</script>

<dialog id="onboarding" class="modal">
	<div class="modal-box">
		<div class="carousel rounded-box pt-2 outline-none">
			{#each onboarding as onboard, i}
			<div id="onboard-{i + 1}" class="carousel-item w-full flex flex-col">
				<h3 class="text-lg font-bold">{onboard.heading}</h3>
				<p class="py-4">{onboard.content}</p>
			</div>
			{/each}
		</div>
		<div class="modal-action justify-between">
			{#if current_board == 1}
			<form method="POST" action="?/onboarded">
				<button class="btn hover:btn-error hover:text-primary">Skip</button>
			</form>
			{:else}
			<button class="btn hover:btn-accent hover:text-primary" on:click={prevOnboard}>Prev</button>
			{/if}
			{#if current_board == onboarding.length}
			<form method="POST" action="?/reserve">
				<button class="btn hover:btn-warning hover:text-primary">Reserve</button>
			</form>
			{:else}
			<button class="btn hover:btn-accent hover:text-primary" on:click={nextOnboard}>Next</button>
			{/if}
		</div>
	</div>
</dialog>