<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    let upVotedPosts = [];
    let downVotedPosts = [];
    let savedPosts = [];

    const login = $page.data?.user?.login;

    onMount(async () => {
        const response = await fetch("/api/v1/list/profile?login=" + login);
        const profile = await response.json();
        for (let i = 0; i < profile[0].votes.up.length; i++) {
            const postId = profile[0].votes.up[i];
            const postResponse = await fetch("/api/v1/list/hall-of-fame?id=" + postId);
            const post = await postResponse.json();
            upVotedPosts.push(post);
        }
        for (let i = 0; i < profile[0].votes.down.length; i++) {
            const postId = profile[0].votes.down[i];
            const postResponse = await fetch("/api/v1/list/hall-of-fame?id=" + postId);
            const post = await postResponse.json();
            downVotedPosts.push(post);
        }
        for (let i = 0; i < profile[0].saved.length; i++) {
            const postId = profile[0].saved[i];
            const postResponse = await fetch("/api/v1/list/hall-of-fame?id=" + postId);
            const post = await postResponse.json();
            savedPosts.push(post);
        }
        upVotedPosts = upVotedPosts;
        downVotedPosts = downVotedPosts;
        savedPosts = savedPosts;
    });
</script>

<svelte:head>
    <title>BBB - Profile</title>
</svelte:head>

<div class="hero-content">
    <div class="flex flex-col align-middle gap-4">
        <h1 class="text-4xl font-bold p-4 mt-12">Welcome, {login}</h1>
        <div
            class="overflow-y-scroll p-4 flex flex-col gap-4 text-left h-[75dvh] w-screen fade-top pt-10 max-w-screen-lg"
        >
            <div class="font-bold">
                Up: {upVotedPosts.length} {upVotedPosts.length == 1 ? "post" : "posts"}
            </div>
            <div class="font-bold">
                Down: {downVotedPosts.length} {downVotedPosts.length == 1 ? "post" : "posts"}
            </div>
        </div>
    </div>
</div>
