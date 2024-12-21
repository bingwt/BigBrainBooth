<script>
    import { onMount } from 'svelte';
    import UserPost from '$lib/components/UserPost.svelte';
    import { page } from '$app/stores';

    console.log($page.params.slug);


    let posts = [];

    // onMount(async () => {
    //     const response = await fetch(`/api/v1/list/hall-of-fame/${post_id}`);
    //     posts = await response.json();
    // });
</script>

<svelte:head>
    <title>Hall of fame</title> 
</svelte:head>


<!-- <div class="hero-content">
	<div class="flex flex-col align-middle gap-4">
		<h1 class="text-4xl font-bold">Hall of Fame</h1>
		<div class="overflow-y-scroll p-4 flex flex-col gap-8 text-left h-[75dvh]">
            {#each posts as post}
                <UserPost post={post} />
            {/each}
		</div>
	</div>
</div> -->