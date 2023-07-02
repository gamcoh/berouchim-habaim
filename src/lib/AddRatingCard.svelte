<script lang="ts">
	import { Avatar, Button } from 'flowbite-svelte';

	export let address: string;

	let rating_clicked = null;

	const ratings = [
		{ name: 'A', value: 'A' },
		{ name: 'B', value: 'B' },
		{ name: 'C', value: 'C' }
	];
	const rating_colors = {
		A: 'bg-green-500',
		B: 'bg-yellow-500',
		C: 'bg-red-500'
	};
</script>

<div class="card element p-7 mt-5">
	<h2 class="text-xl">{address}</h2>

	<ul class="text-xs mt-3 leading-5 font-mono">
		<li>
			<b>A</b> : signifie que le bâtiment est complètement Kasher, aucun obstacle sur votre chemin.
		</li>
		<li><b>B</b> : signifie que le bâtiment est gérable, quoique difficile.</li>
		<li>
			<b>C</b> : signifie que le bâtiment est non Kasher, vous ne pourrez pas y accéder (porte robotisé,
			etc...).
		</li>
	</ul>

	<div class="flex flex-row mt-10 justify-center">
		{#each ratings as rating}
			<div class="flex flex-col mr-5" on:click={() => (rating_clicked = rating.name)}>
				<Avatar
					class="w-10 h-10 mb-2 cursor-pointer text-white
          {rating_clicked == rating.name
						? 'bg-' +
						  rating_colors[rating.name] +
						  ' ' +
						  'shadow-outline shadow-' +
						  rating_colors[rating.name] +
						  '/50'
						: 'avatar-rating'}">{rating.name}</Avatar
				>
			</div>
		{/each}
	</div>

	<div class="flex flex-row justify-between">
		<Button class="mt-5 self-end" outline color="red">Annuler</Button>
		<Button class="mt-5 self-end" outline color="light">Ajouter</Button>
	</div>
</div>
