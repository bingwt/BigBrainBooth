<script>
	export let login;

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
			heading: `Step 1`,
			content: "Go ahead and reserve your slot! Just like opening slots on the intra!"
		}
]
</script>

<dialog id="onboarding" class="modal">
	<div class="modal-box">
		<div class="carousel rounded-box pt-2 select-none">
			{#each onboarding as onboard, i}
			<div id="onboard-{i + 1}" class="carousel-item w-full flex flex-col select-none">
				<h3 class="text-lg font-bold">{onboard.heading}</h3>
				<p class="py-4">{onboard.content}</p>
			</div>
			{/each}
		</div>
		<div class="flex w-full justify-center gap-2 py-2">
			<a href="#onboard-1" class="btn btn-xs">1</a>
			<a href="#onboard-2" class="btn btn-xs">2</a>
			<a href="#onboard-3" class="btn btn-xs">3</a>
		</div>
		<div class="modal-action justify-between">
			<form method="dialog">
				<button class="btn hover:btn-error hover:text-primary">Skip</button>
			</form>
			<button class="btn hover:btn-accent hover:text-primary">Next</button>
		</div>
	</div>
</dialog>