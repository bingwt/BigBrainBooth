<script>
    export let post;
    export let type = "horizontal";
    import { page } from "$app/stores";

    let login = $page.data?.user?.login;

    let upVoted = post.votes.up.includes(login) ? true : false;
    let downVoted = post.votes.down.includes(login) ? true : false;

    async function submitVote() {
        const updatedVotes = {
            up: post.votes.up,
            down: post.votes.down,
        };

        const updatedRecord = {
            votes: updatedVotes,
        };

        await fetch(`/api/v1/update/hall-of-fame`, {
            method: "POST",
            body: JSON.stringify({ id: post.id, record: updatedRecord }),
        });

        const response = await fetch(`/api/v1/list/hall-of-fame`, {
            method: "POST",
            body: JSON.stringify({ id: post.id }),
        });
        post = await response.json();
        upVoted = post.votes.up.includes(login) ? true : false;
        downVoted = post.votes.down.includes(login) ? true : false;
        votes = post.votes.up.length - post.votes.down.length;
    }

    function upVote() {
        if (!login) {
            return;
        }
        if (upVoted) {
            post.votes.up.splice(post.votes.up.indexOf(login), 1);
        } else if (downVoted) {
            post.votes.down.splice(post.votes.down.indexOf(login), 1);
            post.votes.up.push(login);
        } else {
            post.votes.up.push(login);
        }
        upVoted = post.votes.up.includes(login) ? true : false;
        downVoted = post.votes.down.includes(login) ? true : false;
        submitVote();
    }

    function downVote() {
        if (!login) {
            return;
        }
        if (downVoted) {
            post.votes.down.splice(post.votes.down.indexOf(login), 1);
        } else if (upVoted) {
            post.votes.up.splice(post.votes.up.indexOf(login), 1);
            post.votes.down.push(login);
        } else {
            post.votes.down.push(login);
        }
        upVoted = post.votes.up.includes(login) ? true : false;
        downVoted = post.votes.down.includes(login) ? true : false;
        submitVote();
    }

    let votes = post.votes.up.length - post.votes.down.length;
</script>

{#if type === "horizontal"}
    <div class="flex flex-col gap-0 items-center">
        <button
            class="btn btn-ghost text-secondary hover:scale-[1.2] transition-all duration-300"
            on:click={upVote}
        >
            {#if upVoted}
                <svg
                    class="text-orange-500 hover:text-error"
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
                    class="hover:text-orange-500"
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
            <p class="text-lg font-bold">{votes}</p>
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
        <button
            class="btn btn-ghost text-secondary hover:scale-[1.2] transition-all duration-300"
            on:click={downVote}
        >
            {#if downVoted}
                <svg
                    class="text-orange-500 hover:text-error"
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
                    class="text-secondary hover:text-orange-500"
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
    </div>
{:else}
    <div class="flex flex-row gap-2 items-center scale-[0.8]">
        <button
            class="btn btn-ghost text-secondary hover:scale-[1.2] transition-all duration-300 p-0"
            on:click={upVote}
        >
            {#if upVoted}
                <svg
                    class="text-orange-500 hover:text-error"
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
                    class="hover:text-orange-500"
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
            <p class="text-lg font-bold">{votes}</p>
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
        <button
            class="btn btn-ghost text-secondary hover:scale-[1.2] transition-all duration-300 p-0"
            on:click={downVote}
        >
            {#if downVoted}
                <svg
                    class="text-orange-500 hover:text-error"
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
                    class="text-secondary hover:text-orange-500"
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
    </div>
{/if}
