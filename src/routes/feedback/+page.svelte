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

{#if form?.success}
<div class="hero-content flex flex-col">
	<h1 class="text-4xl font-bold text-center">Thank you for your feedback!</h1>
	<a href="/feedback" class="btn btn-secondary font-bold hover:btn-accent hover:text-primary">Submit another feedback</a>
</div>
{:else}
<form method="POST" action="?/submit" class="hero-content">
	<div class="form-control flex flex-col gap-4 justify-between p-0 text-3xl sm:text-4xl w-[90dvw] max-w-md">
		<h1 class="font-bold">{type === "feedback" ? "Feedback" : ""}{type === "feature" ? "Feature Request" : ""}{type === "bug" ? "Bug Report" : ""}</h1>
		<fieldset id="title" class="flex flex-col gap-0">
			<h2 class="font-bold text-lg">Title</h2>
			<input type="text" name="title" placeholder="" class="input input-bordered" bind:value={title} />
		</fieldset>
		<fieldset id="description" class="flex flex-col gap-0">
			<h2 class="font-bold text-lg">Description</h2>
			<textarea class="textarea textarea-bordered" name="description" placeholder="" bind:value={description}></textarea>
		</fieldset>
		<fieldset id="priority" class="flex flex-col gap-0">
			<h2 class="font-bold text-lg">Priority</h2>
			<div class="form-control">
				<label class="label cursor-pointer">
				<span class="label-text">Low</span>
				<input type="radio" name="priority" class="radio checked:bg-secondary" on:change={priorityChange} value="low" checked={priority === "low"} />
				</label>
			</div>
			<div class="form-control">
				<label class="label cursor-pointer">
				<span class="label-text">Medium</span>
				<input type="radio" name="priority" class="radio checked:bg-secondary" on:change={priorityChange} value="medium" checked={priority === "medium"} />
				</label>
			</div>
			<div class="form-control">
				<label class="label cursor-pointer">
				<span class="label-text">High</span>
				<input type="radio" name="priority" class="radio checked:bg-secondary" on:change={priorityChange} value="high" checked={priority === "high"} />
				</label>
			</div>
		</fieldset>
		<fieldset id="type" class="flex flex-col gap-0">
			<h2 class="font-bold text-lg">Type</h2>
			<div class="form-control">
				<label class="label cursor-pointer">
				<span class="label-text">Feedback</span>
				<input type="radio" name="type" class="radio checked:bg-secondary" on:change={typeChange} value="feedback" checked={type === "feedback"} />
				</label>
			</div>
			<div class="form-control">
				<label class="label cursor-pointer">
				<span class="label-text">Feature Request</span>
				<input type="radio" name="type" class="radio checked:bg-secondary" on:change={typeChange} value="feature" checked={type === "feature"} />
				</label>
			</div>
			<div class="form-control">
				<label class="label cursor-pointer">
				<span class="label-text">Bug Report</span>
				<input type="radio" name="type" class="radio checked:bg-secondary" on:change={typeChange} value="bug" checked={type === "bug"} />
				</label>
			</div>
		</fieldset>
		<button class="btn btn-secondary font-bold hover:btn-accent hover:text-primary" disabled={title && description ? false : true}>Submit</button>
	</div>
</form>
{/if}