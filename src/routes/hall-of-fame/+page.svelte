<script>
    import { onMount } from "svelte";
    import UserPost from "$lib/components/UserPost.svelte";

    let posts = [];

    onMount(async () => {
        const response = await fetch("/api/v1/list/hall-of-fame");
        posts = await response.json();
    });
</script>

<svelte:head>
    <title>Hall of fame</title>
</svelte:head>

<div class="hero-content">
    <div class="flex flex-col align-middle gap-4">
        <h1 class="text-4xl font-bold p-4">Hall of Fame</h1>
        <div
            class="overflow-y-scroll p-4 flex flex-col gap-4 text-left h-[75dvh] w-screen"
        >
            {#each posts as post}
                <UserPost {post} />
            {/each}
            <div class="toast">
                <a
                href="/hall-of-fame/create"
                class="btn btn-ghost btn-circle btn-lg text-accent hover:scale-[1.2] transition-all duration-300">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        ><path
                            d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm52-84a12,12,0,0,1-12,12H140v28a12,12,0,0,1-24,0V140H88a12,12,0,0,1,0-24h28V88a12,12,0,0,1,24,0v28h28A12,12,0,0,1,180,128Z"
                        ></path></svg
                    >
                </a>
            </div>
        </div>
    </div>
</div>
