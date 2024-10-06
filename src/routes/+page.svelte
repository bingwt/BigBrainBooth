<script lang="ts">
	import { SignIn } from "@auth/sveltekit/components"
	import { page } from "$app/stores";
	/** @type {import('./$types').PageData} */
	export let data: any;
	let reserved: string;
	let start: any;
	let end: any;

	$: email = $page.data?.session?.user?.email;
	$: login = $page.data.session?.user?.email?.split('@')[0];
	reserved = data.reserved;
	if (reserved) {
		start = data.start;
		end = data.end;
	}

 </script>

{#if $page.data.session}
<div class="flex flex-col gap-4 justify-between p-0 w-full text-3xl sm:text-4xl">
<h1>Welcome, <span class="font-bold">{login}</span></h1>
{#if reserved === ""}
<h1>The <span class="font-bold">Big Brain Booth</span> is <span class="text-success font-bold">AVAILABLE</span></h1>
{:else}
<h1>The <span class="font-bold">Big Brain Booth</span> is <span class="text-error font-bold">RESERVED</span> by  <a href="https://profile.intra.42.fr/users/{reserved}" target="_blank" class="underline text-secondary font-bold">{reserved}</a></h1>
<h1>From <span class="text-accent font-bold">{start.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span> to <span class="text-accent font-bold">{end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span></h1>
{/if}
<a href="/booking" class="btn btn-secondary text-primary hover:btn-warning hover:text-primary font-satoshi font-bold p-4 h-8">Reserve</a>
</div>
{:else}
<div class="flex flex-col gap-4 justify-between p-0 w-full text-3xl sm:text-4xl">
	{#if reserved === ""}
	<h1>The <span class="font-bold">Big Brain Booth</span> is <span class="text-success font-bold">AVAILABLE</span></h1>
	{:else}
	<h1>The <span class="font-bold">Big Brain Booth</span> is <span class="text-error font-bold">RESERVED</span> by  <a href="https://profile.intra.42.fr/users/{reserved}" target="_blank" class="underline text-secondary font-bold">{reserved}</a></h1>
	<h1>From <span class="text-accent font-bold">{start.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span> to <span class="text-accent font-bold">{end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span></h1>
	{/if}
	<a href="/booking" class="btn btn-secondary text-primary hover:btn-accent hover:text-primary font-satoshi font-bold p-4 h-20">
		<p>View Schedule</p>
	</a>
	<!-- <button class="btn btn-secondary text-primary hover:btn-accent hover:text-primary font-satoshi font-bold p-4 h-20">
		<SignIn provider="42-school" signInPage="signin" className="w-full">
			<div slot="submitButton" class="flex flex-col place-items-center justify-center">
				<p>Sign in with</p>
			<svg class="w-8 h-8" role="graphics-symbol" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>42</title><path d="M19.581 16.851H24v-4.439ZM24 3.574h-4.419v4.42l-4.419 4.418v4.44h4.419v-4.44L24 7.993Zm-4.419 0h-4.419v4.42zm-6.324 8.838H4.419l8.838-8.838H8.838L0 12.412v3.595h8.838v4.419h4.419z"/></svg>
			</div>
		</SignIn>
	</button> -->
</div>
{/if}