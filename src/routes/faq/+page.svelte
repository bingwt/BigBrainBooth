<script lang="ts">
	import { page } from "$app/stores";

	/** @type {import('./$types').ActionData} */
	export let form;
	
	$: login = $page?.data?.user?.login;

	let title: string = "";
	let description: string = ""
	let priority = "low";
	let type = "feedback"

	function priorityChange(event: any) {
		priority = event.currentTarget.value;
	}

	function typeChange(event: any) {
		type = event.currentTarget.value;
	}
 </script>

<svelte:head>
    <title>BBB - Feedback</title> 
</svelte:head>


<h1 class="text-4xl font-bold">FAQ</h1>
<div class="overflow-y-scroll p-4 flex flex-col gap-8">
	<div>
		<h2 class="text-2xl font-bold">What's BBB for? 🤔</h2>
		<li class="text-justify">It's a dedicated space for students who would like to step-up and offer help on a specific project e.g. so_long or pipex etc. We've noticed that there are some who might be struggling with their projects but are unsure if the peers on site are available for help, so we are trying BBB out to further help you all along with your challenging projects.</li>
	</div>
	<div>
		<h2 class="text-2xl font-bold">How can I be a part of BBB? :homer_thinking:</h2>
		<li class="text-justify">Simply fill out the roster that will be stuck on the wall beside the workstation. This roster will be student managed so only fill out the times and projects you are open to helping. Please allow for different peers to try out BBB and not book the space out for more than 4hrs at a time (this timing can be negotiated in future if we see fit as this is still after all, a trial Bocal project).</li>
	</div>
	<div>
		<h2 class="text-2xl font-bold">Will there be a reward for students that help out at BBB? :awkward_monkey:</h2>
		<li class="text-justify">Yes! The awesome feeling and knowledge of helping a fellow peer in need is the best reward money can't buy :fry_money:</li>
	</div>
	<div>
		<h2 class="text-2xl font-bold">Can we suggest improvements on BBB? :face_in_clouds:</h2>
		<li class="text-justify">Definitely! Drop us some <a href="/feedback" class="font-bold underline">feedback</a>!</li>
	</div>
	<!-- <h1 class="text-2xl font-bold text-center">Happy BBB-ing everyone! Hope to see the space being utilized by everyone :success:</h1> -->
</div>