<script lang="ts">
	import { page } from "$app/stores";
	import { dark_mode } from "$lib/stores";

	/** @type {import('./$types').ActionData} */
	export let form;

	$: login = $page?.data?.user?.login;

	let title: string = "";
	let description: string = "";
	let tags: string[] = [];
	let inputTag: string = "";
	let media: string[] = [];
	let mediaURL: string = "";
	let mediaName: string = "";
	let uploading: boolean = false;

	function addTag() {
		if (inputTag.trim() && !tags.includes(inputTag.trim())) {
			tags = [...tags, inputTag.trim()];
			inputTag = "";
		}
	}

	function removeTag(tag: string) {
		tags = tags.filter((t) => t !== tag);
	}

	async function uploadFile(e: Event) {
		uploading = true;
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) {
			const safeFileName = file.name
				.replace(/[^a-z0-9]/gi, "_")
				.toLowerCase();
			const getPresignedUrlResponse = await fetch("/api/v1/upload", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fileName: safeFileName,
					fileType: file.type,
				}),
			});
			if (!getPresignedUrlResponse.ok) {
				console.error("Failed to get presigned URL");
			}
			const { presignedUrl, objectKey } =
				await getPresignedUrlResponse.json();
			mediaURL = `${import.meta.env.VITE_R2_DOMAIN}/${objectKey}`;
			mediaName = safeFileName;
			media = [...media, mediaURL];

			const uploadFileResponse = await fetch(presignedUrl, {
					method: "PUT",
					body: file,
				});
				if (!uploadFileResponse.ok) {
				console.error("Failed to upload file");
			}
			uploading = false;
		}
	}
</script>

<svelte:head>
	<title>Create Post</title>
</svelte:head>

{#if form?.success}
	<div class="hero-content flex flex-col text-secondary">
		<h1 class="text-4xl font-bold text-center">Thank you for your post!</h1>
		<a
			href="/hall-of-fame/create"
			class="btn btn-secondary font-bold hover:btn-accent hover:text-primary"
			>Submit another post</a
		>
		<a
			href="/hall-of-fame"
			class="btn btn-secondary font-bold hover:btn-accent hover:text-primary"
			>Back</a
		>
		<a
			href="/"
			class="btn btn-secondary font-bold hover:btn-accent hover:text-primary"
			>Home</a
		>
	</div>
{:else}
	<form method="POST" action="?/submit" class="hero-content">
		<div
			class="form-control flex flex-col gap-4 justify-between p-0 text-3xl sm:text-4xl w-[90dvw] max-w-md text-secondary"
		>
			<h1 class="font-bold">Create a New Post</h1>
			<fieldset id="title" class="flex flex-col gap-0">
				<h2 class="font-bold text-lg">Title</h2>
				<input
					type="text"
					name="title"
					placeholder=""
					class="input input-bordered bg-primary"
					bind:value={title}
				/>
			</fieldset>
			<fieldset id="description" class="flex flex-col gap-0">
				<h2 class="font-bold text-lg">Description</h2>
				<textarea
					class="textarea textarea-bordered bg-primary"
					name="description"
					placeholder=""
					bind:value={description}
				></textarea>
			</fieldset>
			<fieldset id="tags" class="flex flex-col gap-0">
				<h2 class="font-bold text-lg">Tags</h2>
				<div
					class="flex flex-wrap gap-2 items-center border border-secondary rounded-lg p-2 bg-primary"
				>
					{#each tags as tag}
						<div
							class="badge badge-accent text-primary font-bold gap-0 flex items-center p-2 hover:badge-error hover:text-primary"
						>
							{tag}
							<button
								type="button"
								class="btn btn-ghost btn-xs"
								on:click={() => removeTag(tag)}>×</button
							>
						</div>
					{/each}
					<input
						type="text"
						class="input flex-grow focus:outline-none focus:border-none bg-primary"
						placeholder="Add tags..."
						bind:value={inputTag}
						on:keydown={(e) => {
							if (
								(e.key === "Enter" || e.key === " ") &&
								inputTag.trim()
							) {
								e.preventDefault();
								addTag();
							} else if (
								e.key === "Backspace" &&
								!inputTag.trim() &&
								tags.length > 0
							) {
								e.preventDefault();
								removeTag(tags[tags.length - 1]);
							}
						}}
					/>
				</div>
				<input type="hidden" name="tags" value={JSON.stringify(tags)} />
			</fieldset>
			<fieldset id="media" class="flex flex-col gap-0">
				<label for="file" class="join join-horizontal w-full">
					<btn
						class="btn btn-{$dark_mode
							? 'secondary'
							: 'primary border-secondary'} join-item
						hover:bg-accent hover:text-primary"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							fill="currentColor"
							viewBox="0 0 256 256"
						>
							<path
								d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-42.34-77.66a8,8,0,0,1-11.32,11.32L136,139.31V184a8,8,0,0,1-16,0V139.31l-10.34,10.35a8,8,0,0,1-11.32-11.32l24-24a8,8,0,0,1,11.32,0Z"
							></path>
						</svg>
					</btn>
					<input
						class="input input-bordered bg-primary hover:cursor-pointer join-item w-full"
						placeholder={mediaURL ? mediaName : "No File"}
						disabled
						value={mediaName}
					/>
				</label>
				<input
					type="file"
					id="file"
					accept="image/jpeg,image/png,image/jpg,video/mp4,video/webm"
					class="file-input bg-primary file-input-bordered hidden"
					on:change={uploadFile}
				/>
				<input type="hidden" name="media" value={JSON.stringify(media)} />
			</fieldset>
			<!-- <fieldset
				id="media"
				class="flex flex-col gap-0 opacity-50"
				disabled
			>
				<h2 class="font-bold text-lg">
					Media <span class="text-error">(disabled)</span>
				</h2>
				<label for="file" class="join join-horizontal w-full">
					<btn
						class="btn btn-{$dark_mode
							? 'secondary'
							: 'primary border-secondary'} join-item
						hover:bg-accent hover:text-primary"
						disabled
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							fill="currentColor"
							viewBox="0 0 256 256"
						>
							<path
								d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-42.34-77.66a8,8,0,0,1-11.32,11.32L136,139.31V184a8,8,0,0,1-16,0V139.31l-10.34,10.35a8,8,0,0,1-11.32-11.32l24-24a8,8,0,0,1,11.32,0Z"
							></path>
						</svg>
					</btn>
					<input
						class="input input-bordered bg-primary hover:cursor-default join-item w-full"
						placeholder={mediaURL ? mediaName : "No File"}
						disabled
					/>
				</label>
				<input
					type="file"
					id="file"
					accept="image/jpeg"
					class="file-input bg-primary file-input-bordered hidden"
				/>
			</fieldset> -->
			<button
				class="btn btn-secondary font-bold hover:btn-accent hover:text-primary"
				disabled={title && description && !uploading ? false : true}>Submit</button
			>
		</div>
	</form>
{/if}
