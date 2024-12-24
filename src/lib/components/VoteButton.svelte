<script>
    export let post;
    export let type = "vertical";
    import { page } from "$app/stores";

    let login = $page.data?.user?.login;

    $: upVoted = post.votes.up.includes(login) ? true : false;
    $: downVoted = post.votes.down.includes(login) ? true : false;
    $: votes = post.votes.up.length - post.votes.down.length;

    let newRecord = {
        votes: {
            up: [],
            down: [],
        },
    };

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
    }

    async function upVote() {
        if (!login) {
            return;
        }

        const response = await fetch(`/api/v1/list/profile?login=${login}`);
        const profile = await response.json();
        let profileVotes = profile[0].votes;
        if (upVoted) {
            post.votes.up.splice(post.votes.up.indexOf(login), 1);
            profileVotes.up.splice(profileVotes.up.indexOf(post.id), 1);
        } else if (downVoted) {
            post.votes.down.splice(post.votes.down.indexOf(login), 1);
            profileVotes.down.splice(profileVotes.down.indexOf(post.id), 1);
            post.votes.up.push(login);
            profileVotes.up.push(post.id);
        } else {
            post.votes.up.push(login);
            profileVotes.up.push(post.id);
        }
        upVoted = post.votes.up.includes(login) ? true : false;
        downVoted = post.votes.down.includes(login) ? true : false;
        const record = {
            votes: profileVotes,
        };
        await fetch(`/api/v1/update/profile`, {
            method: "POST",
            body: JSON.stringify({ id: profile[0].id, record: record }),
        });
        submitVote();
    }

    async function downVote() {
        if (!login) {
            return;
        }

        const response = await fetch(`/api/v1/list/profile?login=${login}`);
        const profile = await response.json();
        let profileVotes = profile[0].votes;
        if (downVoted) {
            post.votes.down.splice(post.votes.down.indexOf(login), 1);
            profileVotes.down.splice(profileVotes.down.indexOf(post.id), 1);
        } else if (upVoted) {
            post.votes.up.splice(post.votes.up.indexOf(login), 1);
            profileVotes.up.splice(profileVotes.up.indexOf(post.id), 1);
            post.votes.down.push(login);
            profileVotes.down.push(post.id);
        } else {
            post.votes.down.push(login);
            profileVotes.down.push(post.id);
        }
        upVoted = post.votes.up.includes(login) ? true : false;
        downVoted = post.votes.down.includes(login) ? true : false;
        const record = {
            votes: profileVotes,
        };
        await fetch(`/api/v1/update/profile`, {
            method: "POST",
            body: JSON.stringify({ id: profile[0].id, record: record }),
        });
        submitVote();
    }
</script>

{#if type === "vertical"}
    <div class="flex flex-col gap-0 items-center" on:click|stopPropagation>
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
    <div
        class="flex flex-row gap-2 items-center scale-[0.8]"
        on:click|stopPropagation
    >
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
