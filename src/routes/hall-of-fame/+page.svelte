<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import UserPost from "$lib/components/UserPost.svelte";

    let posts = [];

    let search = "";

    let inputFocused = false;

    onMount(async () => {
        const savedSearch = localStorage.getItem("hallOfFameSearch");
        if (savedSearch) {
            search = savedSearch;
            await searchPosts();
        } else {
            const response = await fetch("/api/v1/list/hall-of-fame");
            posts = await response.json();
        }
    });

    async function searchPosts() {
        localStorage.setItem("hallOfFameSearch", search);

        const response = await fetch(
            `/api/v1/list/hall-of-fame?search=${search}`,
        );
        posts = await response.json();
    }
</script>

<svelte:head>
    <title>Hall of Fame</title>
</svelte:head>

<div class="hero-content">
    <div class="flex flex-col align-middle gap-4 text-secondary">
        <h1 class="text-4xl font-bold p-4 mt-12">Hall of Fame</h1>
        <div class="p-4 pb-0">
            <label
                class="flex items-center gap-2 rounded-xl border-2 p-2 motion-preset-fade"
                class:border-accent={inputFocused}
                class:border-secondary={!inputFocused}
            >
                <input
                    type="text"
                    class="grow focus:outline-none pl-2 pr-2"
                    placeholder="Search"
                    bind:value={search}
                    on:input={searchPosts}
                    on:focus={() => (inputFocused = true)}
                    on:blur={() => (inputFocused = false)}
                />
                {#if search}
                    <button
                        class="btn btn-ghost btn-xs motion-preset-fade"
                        on:click={() => {
                            search = "";
                            searchPosts();
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                            ><path
                                d="M168.49,104.49,145,128l23.52,23.51a12,12,0,0,1-17,17L128,145l-23.51,23.52a12,12,0,0,1-17-17L111,128,87.51,104.49a12,12,0,0,1,17-17L128,111l23.51-23.52a12,12,0,0,1,17,17ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z"
                            ></path></svg
                        >
                    </button>
                {:else}
                    <button class="btn btn-ghost btn-xs motion-preset-fade">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                            ><path
                                d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z"
                            ></path></svg
                        >
                    </button>
                {/if}
            </label>
        </div>
        <div class="flex flex-row gap-2 justify-between pl-6 pr-6">
            <p class="font-bold">
                {posts.length}
                {posts.length == 1 ? "post" : "posts"}
            </p>
        </div>
        <div
            class="overflow-y-scroll p-4 flex flex-col gap-4 text-left h-[65dvh] w-screen fade-top pt-10 max-w-screen-lg"
        >
            {#each posts as post, i}
                <div
                    class="motion-scale-in-[0.5] motion-translate-x-in-[-25%] motion-translate-y-in-[25%] motion-opacity-in-[0%] motion-rotate-in-[-10deg] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate motion-delay-[{i *
                        1000}ms]"
                >
                    <UserPost {post} />
                </div>
            {/each}
        </div>
        <div class="toast">
            <button
                on:click={() => goto("/hall-of-fame/create")}
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
            </button>
        </div>
    </div>
</div>
