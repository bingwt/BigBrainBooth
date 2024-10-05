<script lang="ts">
	import { SignIn } from "@auth/sveltekit/components"
	import { signOut } from '@auth/sveltekit/client';
	import { page } from "$app/stores"

	console.log($page)
	const handleSignOut = () => {
     signOut();
 }
 </script>
  
 <div>
   <img src="/img/logo.svg" alt="Company Logo" />
   <SignIn provider="42-school" signInPage="signin" />
 </div> 

 <nav>
	<img
	  src={$page.data.session?.user?.image}
	  alt={$page.data.session?.user?.image}
	/>
	<p>{$page.data.session?.user?.email?.split('@')[0]}</p>
  </nav>
  <button on:click={handleSignOut}>Sign out</button>