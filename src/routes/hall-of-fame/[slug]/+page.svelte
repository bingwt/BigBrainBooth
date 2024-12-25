<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import VoteButton from "$lib/components/VoteButton.svelte";

    let post;

    const login = $page.data?.user?.login;
    const name = $page.data?.user?.name;
    let saved = false;
    let copied = false;

    onMount(async () => {
        const response = await fetch(`/api/v1/list/hall-of-fame`, {
            method: "POST",
            body: JSON.stringify({ id: $page.params.slug }),
        });
        post = await response.json();
        saved = post.saves.includes(login) ? true : false;
    });

    function isVideo(media) {
        const videoExtensions = ["mp4"];
        const extension = media.split(".").pop().toLowerCase();
        return videoExtensions.includes(extension);
    }

    function formatDate(dateStr) {
        const now = new Date();
        const date = new Date(dateStr);
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        if (diffDays > 0) {
            if (diffDays === 1) {
                return "a day ago";
            }
            return `${diffDays} days ago`;
        } else if (diffHours > 0) {
            if (diffHours === 1) {
                return "an hour ago";
            }
            return `${diffHours} hours ago`;
        } else if (diffMinutes > 0) {
            if (diffMinutes === 1) {
                return "a minute ago";
            }
            return `${diffMinutes} minutes ago`;
        }
        return "just now";
    }

    let comment = "";

    async function submitComment() {
        const newComment = {
            login: login,
            name: name,
            description: comment,
            date: new Date().toISOString(),
        };

        const updatedComments = [...post.comments, newComment];

        const updatedRecord = {
            comments: updatedComments,
        };

        await fetch(`/api/v1/update/hall-of-fame`, {
            method: "POST",
            body: JSON.stringify({
                id: $page.params.slug,
                record: updatedRecord,
            }),
        });

        comment = "";

        const response = await fetch(`/api/v1/list/hall-of-fame`, {
            method: "POST",
            body: JSON.stringify({ id: $page.params.slug }),
        });
        post = await response.json();
    }

    function sortComments(comments) {
        return comments.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    async function submitSaved() {
        if (!login) {
            return;
        }
        let newSaved;
        if (saved) {
            newSaved = post.saves.filter((save) => save !== login);
        } else {
            newSaved = [...post.saves, login];
        }

        const updatedRecord = {
            saves: newSaved,
        };

        await fetch(`/api/v1/update/hall-of-fame`, {
            method: "POST",
            body: JSON.stringify({
                id: post.id,
                record: updatedRecord,
            }),
        });

        const response = await fetch(`/api/v1/list/hall-of-fame`, {
            method: "POST",
            body: JSON.stringify({ id: post.id }),
        });
        post = await response.json();
        saved = post.saves.includes(login) ? true : false;

        const profileResponse = await fetch(
            `/api/v1/list/profile?login=${login}`,
        );
        const profile = await profileResponse.json();
        if (saved) {
            await fetch(`/api/v1/update/profile`, {
                method: "POST",
                body: JSON.stringify({
                    id: profile[0].id,
                    record: { saved: [...profile[0].saved, post.id] },
                }),
            });
        } else {
            await fetch(`/api/v1/update/profile`, {
                method: "POST",
                body: JSON.stringify({
                    id: profile[0].id,
                    record: {
                        saved: profile[0].saved.filter(
                            (save) => save !== post.id,
                        ),
                    },
                }),
            });
        }
    }

    function copyToClipboard() {
        const url = `${window.location.origin}/hall-of-fame/${post.id}`;
        navigator.clipboard.writeText(url).then(() => {
            copied = true;
            setTimeout(() => {
                copied = false;
            }, 2000);
        });
    }

    let editMode = false;
    let postCopy;

    function toggleEditMode() {
        editMode = !editMode;
        if (editMode) {
            postCopy = JSON.parse(JSON.stringify(post));
        } else {
            cancelEdit();
        }
    }

    async function updatePost() {
        await fetch(`/api/v1/update/hall-of-fame`, {
            method: "POST",
            body: JSON.stringify({
                id: post.id,
                record: {
                    title: post.title,
                    description: post.description,
                },
            }),
        });
        editMode = false;
    }

    function cancelEdit() {
        post = JSON.parse(JSON.stringify(postCopy));
        editMode = false;
    }
</script>

<svelte:head>
    <title>Hall of fame</title>
</svelte:head>

{#if post}
    <div class="hero-content motion-preset-fade">
        <div class="flex flex-col align-middle gap-4 w-screen mt-8">
            <div
                class="flex flex-col gap-4 border p-4 rounded-xl mt-4 shadow-xl motion-scale-in-[0.5] motion-translate-x-in-[-25%] motion-translate-y-in-[25%] motion-opacity-in-[0%] motion-rotate-in-[-10deg] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate"
            >
                <div class="flex flex-row gap-2 justify-between">
                    {#if editMode}
                        <input
                            type="text"
                            bind:value={post.title}
                            class="input input-primary text-3xl font-bold border-secondary focus:border-accent"
                        />
                    {:else}
                        <h1 class="text-4xl font-bold">{post.title}</h1>
                    {/if}
                    <div class="flex flex-col gap-2 w-28 p-4">
                        <div
                            class="flex flex-col gap-2 absolute top-0 right-0 p-4"
                        >
                            <button
                                class="btn btn-primary"
                                on:click={() => goto("/hall-of-fame")}
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    viewBox="0 0 256 256"
                                    ><path
                                        d="M236,112a68.07,68.07,0,0,1-68,68H61l27.52,27.51a12,12,0,0,1-17,17l-48-48a12,12,0,0,1,0-17l48-48a12,12,0,1,1,17,17L61,156H168a44,44,0,0,0,0-88H80a12,12,0,0,1,0-24h88A68.07,68.07,0,0,1,236,112Z"
                                    ></path></svg
                                ></button
                            >
                            {#if post.author === login && !editMode}
                                <button
                                    class="btn btn-primary"
                                    on:click={toggleEditMode}
                                    ><svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 256 256"
                                        ><path
                                            d="M232.49,55.51l-32-32a12,12,0,0,0-17,0l-96,96A12,12,0,0,0,84,128v32a12,12,0,0,0,12,12h32a12,12,0,0,0,8.49-3.51l96-96A12,12,0,0,0,232.49,55.51ZM192,49l15,15L196,75,181,60Zm-69,99H108V133l56-56,15,15Zm105-7.43V208a20,20,0,0,1-20,20H48a20,20,0,0,1-20-20V48A20,20,0,0,1,48,28h67.43a12,12,0,0,1,0,24H52V204H204V140.57a12,12,0,0,1,24,0Z"
                                        ></path></svg
                                    ></button
                                >
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="flex flex-row gap-2">
                    {#if editMode}
                        {#each post.tags as tag}
                            <p
                                class="badge badge-neutral text-primary font-bold"
                            >
                                {tag}
                            </p>
                        {/each}
                    {:else}
                        {#each post.tags as tag}
                            <p
                                class="badge badge-accent text-primary font-bold"
                            >
                                {tag}
                            </p>
                        {/each}
                    {/if}
                </div>
                {#if !editMode}
                    <p>
                        submitted {formatDate(post.created)} by
                        <a
                            href={`https://profile.intra.42.fr/users/${post.author}`}
                            class="font-bold text-accent hover:text-accent2 hover:underline no-underline"
                            >{post.author}</a
                        >
                    </p>
                    <div class="flex w-full h-4 items-center">
                        <!-- <a
                    href={`/hall-of-fame/${post.id}`}
                    class="btn btn-link text-secondary font-bold hover:text-accent hover:underline no-underline p-0"
                >
                    {post.comments.length}
                    {post.comments.length === 1 ? "comment" : "comments"}
                </a> -->
                        <VoteButton {post} type="horizontal" />
                        <div
                            class="divider divider-horizontal divider-secondary"
                        ></div>
                        <button
                            class="btn btn-link text-secondary font-bold hover:text-accent hover:underline no-underline p-0"
                            on:click={copyToClipboard}
                        >
                            {#if copied}
                                <span class="motion-preset-confetti"
                                    >copied to clipboard!</span
                                >
                            {:else}
                                <span>share</span>
                            {/if}
                        </button>
                        <div
                            class="divider divider-horizontal divider-secondary"
                        ></div>
                        <button
                            class="btn btn-link text-secondary font-bold hover:text-error hover:underline no-underline p-0 hover:scale-[1.2] transition-all duration-300"
                            on:click={submitSaved}
                        >
                            {#if saved}
                                <svg
                                    class="text-error"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    viewBox="0 0 256 256"
                                    ><path
                                        d="M240,102c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,228.66,16,172,16,102A62.07,62.07,0,0,1,78,40c20.65,0,38.73,8.88,50,23.89C139.27,48.88,157.35,40,178,40A62.07,62.07,0,0,1,240,102Z"
                                    ></path></svg
                                >
                            {:else}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    viewBox="0 0 256 256"
                                    ><path
                                        d="M178,36c-20.09,0-37.92,7.93-50,21.56C115.92,43.93,98.09,36,78,36a66.08,66.08,0,0,0-66,66c0,72.34,105.81,130.14,110.31,132.57a12,12,0,0,0,11.38,0C138.19,232.14,244,174.34,244,102A66.08,66.08,0,0,0,178,36Zm-5.49,142.36A328.69,328.69,0,0,1,128,210.16a328.69,328.69,0,0,1-44.51-31.8C61.82,159.77,36,131.42,36,102A42,42,0,0,1,78,60c17.8,0,32.7,9.4,38.89,24.54a12,12,0,0,0,22.22,0C145.3,69.4,160.2,60,178,60a42,42,0,0,1,42,42C220,131.42,194.18,159.77,172.51,178.36Z"
                                    ></path></svg
                                >
                            {/if}
                        </button>
                    </div>
                {/if}
                {#if editMode}
                    <div class="flex flex-col gap-4 motion-preset-expand">
                        <div class="flex flex-col gap-4">
                            <textarea
                                bind:value={post.description}
                                class="textarea textarea-primary border-secondary focus:border-accent resize-none text-md"
                            ></textarea>
                        </div>
                        <div class="flex flex-col gap-2">
                            <button
                                class="btn btn-accent hover:btn-error-accent text-primary"
                                on:click={updatePost}
                            >
                                Save
                            </button>
                            <button
                                class="btn btn-error hover:btn-error-focus text-primary"
                                on:click={cancelEdit}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                {:else}
                    <div
                        class="flex flex-col gap-4 text-lg border p-4 rounded-xl motion-preset-fade"
                    >
                        {@html post.description}
                    </div>
                {/if}
                {#if post.media.length}
                    <div
                        class="carousel w-full rounded-xl gap-4 bg-black border-2 border-secondary min-h-[300px]"
                    >
                        {#each post.media as media}
                            <div
                                class="carousel-item w-full flex justify-center items-center"
                            >
                                {#if isVideo(media)}
                                    <video
                                        controls
                                        muted
                                        class="w-full h-auto max-h-96 object-contain"
                                        style="aspect-ratio: 16/9;"
                                    >
                                        <source
                                            src={`${media}`}
                                            type="video/mp4"
                                        />
                                        Your browser does not support the video tag.
                                    </video>
                                {:else}
                                    <img
                                        src={`${media}`}
                                        alt={post.title}
                                        class="w-full h-auto max-h-96 object-contain"
                                        style="aspect-ratio: 16/9;"
                                    />
                                {/if}
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
            <div
                class="overflow-y-scroll p-4 flex flex-col gap-8 text-left max-h-[75dvh] fade-top pt-14"
            >
                <div class="flex flex-col gap-2 border p-4 rounded-xl">
                    <p>
                        {post.comments.length}
                        {post.comments.length === 1 ? "comment" : "comments"}
                    </p>
                    {#if login}
                        <div class="flex flex-col gap-2 overflow-y-scroll">
                            {#each sortComments(post.comments) as comment}
                                <div
                                    class="flex flex-col gap-2 border p-4 rounded-xl hover:border-accent hover:shadow-md transition-all duration-300"
                                >
                                    <div class="flex flex-row gap-2">
                                        <a
                                            href={`https://profile.intra.42.fr/users/${comment.login}`}
                                            class="font-bold text-accent hover:text-accent2 hover:underline no-underline"
                                            >{comment.login}</a
                                        >
                                        <p>{formatDate(comment.date)}</p>
                                    </div>
                                    <p>{comment.description}</p>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <p class="font-normal">
                            <a
                                href="/signin"
                                class="hover:text-accent hover:underline no-underline font-bold text-accent"
                                >Login</a
                            > to view comments
                        </p>
                    {/if}
                </div>
                <!-- <p>{post.saves.length} saves</p> -->
            </div>
            {#if login}
                <div
                    class="flex flex-col gap-4 p-4 rounded-lg shadow-md border"
                >
                    <textarea
                        class="textarea textarea-bordered textarea-primary w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Comment..."
                        bind:value={comment}
                    ></textarea>
                    <button
                        class="btn btn-accent w-full font-bold text-primary hover:bg-accent-focus transition-all duration-200"
                        on:click={submitComment}
                    >
                        Submit
                    </button>
                </div>
                <!-- <div class="flex flex-col gap-2">
                    <textarea
                        class="textarea textarea-primary border-secondary focus:border-accent"
                        placeholder="Comment"
                        bind:value={comment}
                    ></textarea>
                    <button
                        class="btn btn-primary font-bold border-secondary hover:text-primary hover:btn-accent"
                        on:click={submitComment}>Submit</button
                    >
                </div> -->
            {/if}
        </div>
    </div>
{/if}
