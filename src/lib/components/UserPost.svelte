<script>
    export let post;
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import VoteButton from "./VoteButton.svelte";

    let login = $page.data?.user?.login;
    let saved = post.saves.includes(login) ? true : false;
    let buttonText = "share";

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

    async function submitSaved() {
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
    }

    function copyToClipboard() {
        const url = `${window.location.origin}/hall-of-fame/${post.id}`;
        navigator.clipboard.writeText(url).then(() => {
            buttonText = "copied to clipboard!";
            setTimeout(() => {
                buttonText = "share";
            }, 2000);
        });
    }
</script>

{#if post}
    <div
        class="flex flex-row gap-4 border border-secondary-50 hover:border-accent rounded-lg p-4 w-full items-center hover:shadow-md hover:scale-[1.01] transition-all duration-300 hover:cursor-pointer"
        on:click={() => goto(`/hall-of-fame/${post.id}`)}
    >
        <VoteButton {post} />
        {#if post.media.length}
            <a href={`/hall-of-fame/${post.id}`} on:click|stopPropagation>
                {#if isVideo(post.media[0])}
                    <video muted class="w-24 rounded-md">
                        <source src={`${post.media[0]}`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                {:else}
                    <img
                        src={`${post.media[0]}`}
                        alt={post.title}
                        class="w-24 rounded-md"
                    />
                {/if}
            </a>
        {/if}
        <div class="flex flex-col gap-4" on:click|stopPropagation>
            <a
                href={`/hall-of-fame/${post.id}`}
                class="text-secondary text-2xl font-bold hover:text-accent hover:underline no-underline"
                >{post.title}</a
            >
            <p>
                submitted {formatDate(post.created)} by
                <a
                    href={`https://profile.intra.42.fr/users/${post.author.login}`}
                    class="font-bold text-accent hover:text-accent2 hover:underline no-underline"
                    >{post.author.login}</a
                >
            </p>
            <!-- <p class="text-lg">{post.description}</p> -->
            <div class="flex w-full h-4 items-center">
                <a
                    href={`/hall-of-fame/${post.id}#comments`}
                    class="btn btn-link text-secondary font-bold hover:text-accent hover:underline no-underline p-0"
                >
                    {post.comments.length}
                    {post.comments.length === 1 ? "comment" : "comments"}
                </a>
                <div class="divider divider-horizontal divider-secondary"></div>
                <button
                    class="btn btn-link text-secondary font-bold hover:text-accent hover:underline no-underline p-0"
                    on:click={copyToClipboard}
                >
                    {buttonText}
                </button>
                <div class="divider divider-horizontal divider-secondary"></div>
                <button
                    class="btn btn-link text-secondary font-bold hover:text-error hover:underline no-underline p-0 hover:scale-[1.2] transition-all duration-300 hover:motion-preset-pulse"
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
        </div>
    </div>
{/if}
