<script lang="ts">
	import { page } from "$app/stores";
	import Schedule from "$lib/components/Schedule.svelte";
	
	$: login = $page?.data?.user?.login;
 </script>

<div class="hero-content">
	<div class="form-control flex flex-col gap-4 justify-between p-0 text-3xl sm:text-4xl w-[90dvw] max-w-md">
		<h1 class="font-bold">Feedback</h1>
		<div class="flex flex-col gap-0">
			<h2 class="font-bold text-lg">Title</h2>
			<input type="text" placeholder="" class="input input-bordered" />
		</div>
		<div class="flex flex-col gap-0">
			<h2 class="font-bold text-lg">Description</h2>
			<textarea class="textarea textarea-bordered" placeholder=""></textarea>
		</div>
		<div class="flex flex-col gap-0">
		<h2 class="font-bold text-lg">Priority</h2>
			<div class="form-control">
				<label class="label cursor-pointer">
				<span class="label-text">High</span>
				<input type="radio" name="radio-10" class="radio checked:bg-secondary" checked="checked" />
				</label>
			</div>
			<div class="form-control">
				<label class="label cursor-pointer">
				<span class="label-text">Medium</span>
				<input type="radio" name="radio-10" class="radio checked:bg-secondary" checked="checked" />
				</label>
			</div>
			<div class="form-control">
				<label class="label cursor-pointer">
				<span class="label-text">Low</span>
				<input type="radio" name="radio-10" class="radio checked:bg-secondary" checked="checked" />
				</label>
			</div>
		</div>
		<button class="btn btn-secondary font-bold hover:btn-accent hover:text-primary">Submit</button>
	</div>
</div>