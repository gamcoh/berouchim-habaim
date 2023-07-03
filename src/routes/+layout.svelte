<script>
	import '../app.css';
	import { toasts } from '$lib/stores';
	import { fade } from 'svelte/transition';
	import { Toast } from 'flowbite-svelte';

	// Remove toasts after 5 seconds
	$: if ($toasts.length > 0) {
		setTimeout(() => {
			toasts.update((t) => t.slice(1));
		}, 5000);
	}
</script>

<div class="container">
	<slot />
</div>

<div class="fixed bottom-0 left-0 right-0 m-auto w-80 pb-8" data-theme="dark">
	{#each $toasts as t}
		<Toast
			simple
			transition={fade}
			color={t.color}
			contentClass="bg-dark flex space-x-4 mb-8 divide-x divide-gray-200 dark:divide-gray-700"
		>
			<svg
				aria-hidden="true"
				class="w-5 h-5"
				slot="icon"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				{#if t.color == 'green'}
					<path
						fill-rule="evenodd"
						d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/>
				{:else}
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				{/if}
			</svg>
			{t.message}
		</Toast>
	{/each}
</div>
