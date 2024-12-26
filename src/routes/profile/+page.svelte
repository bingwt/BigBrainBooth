<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    let upVotedPosts = [];
    let downVotedPosts = [];
    let savedPosts = [];

    const login = $page.data?.user?.login;
    const image = $page.data?.user?.image;
    const email = $page.data?.user?.email;

    onMount(async () => {
        const response = await fetch("/api/v1/list/profile?login=" + login);
        const profile = await response.json();
        for (let i = 0; i < profile[0].votes.up.length; i++) {
            const postId = profile[0].votes.up[i];
            const postResponse = await fetch(
                "/api/v1/list/hall-of-fame?id=" + postId,
            );
            const post = await postResponse.json();
            upVotedPosts.push(post);
        }
        for (let i = 0; i < profile[0].votes.down.length; i++) {
            const postId = profile[0].votes.down[i];
            const postResponse = await fetch(
                "/api/v1/list/hall-of-fame?id=" + postId,
            );
            const post = await postResponse.json();
            downVotedPosts.push(post);
        }
        for (let i = 0; i < profile[0].saved.length; i++) {
            const postId = profile[0].saved[i];
            const postResponse = await fetch(
                "/api/v1/list/hall-of-fame?id=" + postId,
            );
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

<div class="hero-content text-secondary">
    <div class="flex flex-col align-middle gap-4">
        <h1 class="text-4xl font-bold p-4 mt-12">Profile</h1>
        <div
            class="overflow-y-scroll p-4 flex flex-col gap-4 text-left h-[75dvh] w-screen max-w-screen-lg"
        >
            <div
                class="flex flex-col gap-4 items-center border p-4 rounded-xl hover:shadow-md hover:scale-[1.01] transition-all duration-300 motion-scale-in-[0.5] motion-translate-x-in-[-25%] motion-translate-y-in-[25%] motion-opacity-in-[0%] motion-rotate-in-[-10deg] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate motion-delay-1000}ms]"
            >
                <div class="avatar">
                    <div
                        class="ring-accent ring-offset-base-100 w-36 rounded-full ring ring-offset-2"
                    >
                        <img src={image} alt={image} />
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <a
                        href={`https://intra.42.fr/users/${login}`}
                        class="text-2xl font-bold hover:text-accent hover:underline"
                    >
                        {login}
                    </a>
                    <p class="text-sm text-gray-500">
                        {email}
                    </p>
                </div>
            </div>
            <div
                class="flex flex-row gap-4 items-center justify-center border p-4 rounded-xl hover:shadow-md hover:scale-[1.01] transition-all duration-300 motion-scale-in-[0.5] motion-translate-x-in-[-25%] motion-translate-y-in-[25%] motion-opacity-in-[0%] motion-rotate-in-[-10deg] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate motion-delay-1000}ms]"
            >
                <div class="font-bold flex flex-row gap-2">
                    <div>
                        {upVotedPosts.length}
                    </div>
                    <div class="text-accent">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                            ><path
                                d="M215.39,163.06A8,8,0,0,1,208,168H48a8,8,0,0,1-5.66-13.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,215.39,163.06Z"
                            ></path></svg
                        >
                    </div>
                </div>
                <div class="font-bold flex flex-row gap-2">
                    <div>
                        {downVotedPosts.length}
                    </div>
                    <div class="text-accent">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                            ><path
                                d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z"
                            ></path></svg
                        >
                    </div>
                </div>
                <div class="font-bold flex flex-row gap-2">
                    <div>
                        {savedPosts.length}
                    </div>
                    <div class="text-error">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                            ><path
                                d="M240,102c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,228.66,16,172,16,102A62.07,62.07,0,0,1,78,40c20.65,0,38.73,8.88,50,23.89C139.27,48.88,157.35,40,178,40A62.07,62.07,0,0,1,240,102Z"
                            ></path></svg
                        >
                    </div>
                </div>
            </div>
            <!-- <div
                class="flex flex-col gap-4 items-center border p-4 rounded-xl hover:shadow-md hover:scale-[1.01] transition-all duration-300 hover:cursor-pointer motion-scale-in-[0.5] motion-translate-x-in-[-25%] motion-translate-y-in-[25%] motion-opacity-in-[0%] motion-rotate-in-[-10deg] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate motion-delay-1000}ms]"
            >
                <div class="font-bold">
                    Up: {upVotedPosts.length}
                    {upVotedPosts.length == 1 ? "post" : "posts"}
                </div>
                <div class="font-bold">
                    Down: {downVotedPosts.length}
                    {downVotedPosts.length == 1 ? "post" : "posts"}
                </div>
            </div> -->
        </div>
    </div>
</div>
