<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    let post;

    let login = $page.data?.user?.login;

    onMount(async () => {
        const response = await fetch(`/api/v1/list/hall-of-fame`, {
            method: "POST",
            body: JSON.stringify({ id: $page.params.slug }),
        });
        post = await response.json();
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
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));
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
</script>

<svelte:head>
    <title>Hall of fame</title>
</svelte:head>

{#if post}
    <div class="hero-content">
        <div class="flex flex-col align-middle gap-4 w-full">
            <h1 class="text-4xl font-bold">{post.title}</h1>
            <div class="flex flex-row gap-2">
                {#each post.tags as tag}
                    <p class="badge badge-accent text-primary font-bold">
                        {tag}
                    </p>
                {/each}
            </div>
            <p>
                submitted {formatDate(post.created)} by
                <a
                    href={`https://profile.intra.42.fr/users/${post.author.login}`}
                    class="font-bold text-accent hover:text-accent2 hover:underline no-underline"
                    >{post.author.login}</a
                >
            </p>
            <div
                class="overflow-y-scroll p-4 flex flex-col gap-8 text-left h-[75dvh] fade-top pt-14"
            >
                <div class="flex flex-col gap-4 text-lg border p-4 rounded-xl">
                    {@html post.description}
                </div>
                {#if post.media.length}
                    <div
                        class="carousel w-full rounded-xl gap-4 bg-black border-2 border-secondary min-h-[300px]"
                    >
                        {#each post.media as media}
                            <div
                                class="carousel-item w-full flex justify-center items-center h-full"
                            >
                                {#if isVideo(media)}
                                    <video
                                        controls
                                        muted
                                        class="w-full max-h-full max-w-full object-contain"
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
                                        class="w-full max-h-full max-w-full object-contain"
                                    />
                                {/if}
                            </div>
                        {/each}
                    </div>
                {/if}
                <p>
                    {post.comments.length}
                    {post.comments.length === 1 ? "comment" : "comments"}
                </p>
                {#if login}
                    <div
                        class="flex flex-col gap-2 h-[75dvh] overflow-y-scroll fade-top pt-4"
                    >
                        {#each post.comments as comment}
                            <div
                                class="flex flex-col gap-2 border p-4 rounded-xl"
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
                <!-- <p>{post.saves.length} saves</p> -->
            </div>
        </div>
    </div>
{/if}
