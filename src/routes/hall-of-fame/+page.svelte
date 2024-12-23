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
            class="overflow-y-scroll p-4 flex flex-col gap-4 text-left h-[75dvh] w-screen fade-top pt-10 max-w-screen-lg"
        >
            {#each posts as post}
                <UserPost {post} />
            {/each}
        </div>
        <div class="toast">
            <a
                href="/hall-of-fame/create"
                class="btn btn-ghost btn-circle btn-lg text-secondary hover:text-accent hover:scale-[1.2] transition-all duration-300"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    ><path
                        d="M232.49,55.51l-32-32a12,12,0,0,0-17,0l-96,96A12,12,0,0,0,84,128v32a12,12,0,0,0,12,12h32a12,12,0,0,0,8.49-3.51l96-96A12,12,0,0,0,232.49,55.51ZM192,49l15,15L196,75,181,60Zm-69,99H108V133l56-56,15,15Zm105-7.43V208a20,20,0,0,1-20,20H48a20,20,0,0,1-20-20V48A20,20,0,0,1,48,28h67.43a12,12,0,0,1,0,24H52V204H204V140.57a12,12,0,0,1,24,0Z"
                    ></path></svg
                >
            </a>
        </div>
    </div>
</div>
