<script>
    export let post;
    import { page } from "$app/stores";

    let login = $page.data?.user?.login;
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

    let votes = post.votes.up.length - post.votes.down.length;
</script>

<div class="flex flex-col gap-0 items-center">
    <button class="btn btn-ghost text-secondary">
        {#if voted(login) === "up"}
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
    <button class="btn btn-ghost text-secondary">
        {#if voted(login) === "down"}
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