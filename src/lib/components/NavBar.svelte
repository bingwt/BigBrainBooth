<script>
    import { dark_mode } from "../stores";
	import { page } from "$app/stores";
	import { signOut } from '@auth/sveltekit/client';

	const handleSignOut = () => {
     signOut();
 }
</script>

<div class="navbar bg-primary fixed z-10">
	<div class="flex-1">
		<a class="btn btn-ghost text-xl" href="/">
			<svg class="w-12 h-12" role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>42</title><path d="M19.581 16.851H24v-4.439ZM24 3.574h-4.419v4.42l-4.419 4.418v4.44h4.419v-4.44L24 7.993Zm-4.419 0h-4.419v4.42zm-6.324 8.838H4.419l8.838-8.838H8.838L0 12.412v3.595h8.838v4.419h4.419z"/></svg>
		</a>
	</div>
	<div class="flex-none">
		<div class="dropdown dropdown-end">
			<div
			  tabindex="0"
			  class="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
			  <div class="card-body">
				<span class="text-lg font-bold">8 Items</span>
				<span class="text-info">Subtotal: $999</span>
				<div class="card-actions">
				  <button class="btn btn-primary btn-block">View cart</button>
				</div>
			  </div>
			</div>
		  </div>
		  {#if $page.data.session}
		  <div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
			  <div class="w-10 rounded-full">
				<img
					src={$page.data.session?.user?.image}
					alt={$page.data.session?.user?.image}
				/>
			  </div>
			</div>
			<ul
			  tabindex="0"
			  class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
			  <li><a class="hover:text-error" on:click={handleSignOut}>Sign Out</a></li>
			</ul>
		  </div>
		  {/if}
    </div>
</div>