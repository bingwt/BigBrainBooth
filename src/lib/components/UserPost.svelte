<script>
    export let post;
    import { page } from "$app/stores";

    console.log(post);
    let login = $page.data?.user?.login;
    let votes = post.votes.up.length - post.votes.down.length;

    function isVideo(media) {
        const videoExtensions = ["mp4"];
        const extension = media.split(".").pop().toLowerCase();
        return videoExtensions.includes(extension);
    }

    let voted = (login) => {
        if (login === undefined) {
            return "";
        }
        if (post.votes.up.includes(login)) {
            return "up";
        } else if (post.votes.down.includes(login)) {
            return "down";
        }
        return "";
    };
</script>

<div class="flex flex-row gap-4 border border-secondary-50 hover:border-accent rounded-lg p-4 w-full">
    <!-- <div class="flex flex-col gap-0 items-center">
        <button class="btn btn-ghost text-accent">
            {#if voted(login) === "up"}
                <svg
                    class="hover:text-error"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    ><path
                        d="M215.39,163.06A8,8,0,0,1,208,168H48a8,8,0,0,1-5.66-13.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,215.39,163.06Z"
                    ></path></svg
                >
            {:else}
                <svg
                    class="text-secondary hover:text-accent"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    ><path
                        d="M215.39,163.06A8,8,0,0,1,208,168H48a8,8,0,0,1-5.66-13.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,215.39,163.06Z"
                    ></path></svg
                >
            {/if}
        </button>
        {#if votes}
            <p>{votes}</p>
        {:else}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#000000"
                viewBox="0 0 256 256"
                ><path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"
                ></path></svg
            >
        {/if}
        <button class="btn btn-ghost text-accent">
            {#if voted(login) === "down"}
                <svg
                    class="hover:text-error"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    ><path
                        d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z"
                    ></path></svg
                >
            {:else}
                <svg
                    class="text-secondary hover:text-accent"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    ><path
                        d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z"
                    ></path></svg
                >
            {/if}
        </button>
    </div> -->
    {#if post.media.length}
        <a href={`/hall-of-fame/${post.title}`}>
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
    <div class="flex flex-col gap-4">
        <a
            href={`/hall-of-fame/${post.title}`}
            class="btn btn-link text-secondary text-2xl font-bold hover:text-accent hover:underline no-underline justify-start"
            >{post.title}</a
        >
        <!-- <p class="text-lg">{post.description}</p> -->
        <div class="flex w-full h-4 items-center">
            <div
                class="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center"
            >
                {post.comments.length} comments
            </div>
            <div class="divider divider-horizontal divider-secondary"></div>
            <div
                class="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center"
            >
                share
            </div>
            <div class="divider divider-horizontal divider-secondary"></div>
            <div
                class="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center"
            >
                save
            </div>
        </div>
    </div>
</div>
