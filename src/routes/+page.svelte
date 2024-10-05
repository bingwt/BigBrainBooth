<script lang="ts">
	import { SignIn } from "@auth/sveltekit/components"
	import { page } from "$app/stores";
	import Schedule from "$lib/components/Schedule.svelte";
	
	$: email = $page.data?.session?.user?.email;
	$: login = $page.data.session?.user?.email?.split('@')[0]
 </script>

{#if $page.data.session}
<div class="flex flex-col gap-4 p-0 w-full">
<h1 class="text-4xl">Welcome, <span class="font-bold">{login}</span></h1>
<Schedule />
</div>
{:else}
<div class="flex flex-col gap-4">
	<h1 class="text-4xl">Big Brain Booth</h1>
	<button class="btn btn-secondary text-primary hover:btn-accent hover:text-primary font-satoshi font-bold p-4 h-20">
		<SignIn provider="42-school" signInPage="signin" className="w-full">
			<div slot="submitButton" class="flex flex-col place-items-center justify-center">
				<p>Sign in with</p>
			<svg class="w-8 h-8" role="graphics-symbol" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>42</title><path d="M19.581 16.851H24v-4.439ZM24 3.574h-4.419v4.42l-4.419 4.418v4.44h4.419v-4.44L24 7.993Zm-4.419 0h-4.419v4.42zm-6.324 8.838H4.419l8.838-8.838H8.838L0 12.412v3.595h8.838v4.419h4.419z"/></svg>
			</div>
		</SignIn>
	</button>
</div>
{/if}