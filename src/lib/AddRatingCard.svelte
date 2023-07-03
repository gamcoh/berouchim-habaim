<script lang="ts">
	import { Avatar, Button } from 'flowbite-svelte';
	import { show_modal, search_address, toasts } from '$lib/stores';

	let rating_clicked = null;

	const ratings = [
		{ name: 'A', value: 'A' },
		{ name: 'B', value: 'B' },
		{ name: 'C', value: 'C' }
	];
	const rating_colors = {
		A: 'green-500',
		B: 'yellow-500',
		C: 'red-500'
	};

	const disableModal = () => {
		show_modal.set(false);
	};

	const sendRating = () => {
		if (!rating_clicked) {
			// TODO: handle error
			throw new Error('No rating clicked');
		}

		fetch('/api/add_address', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ...$search_address, rating: rating_clicked })
		})
			.then((res) => {
				if (res.ok === false) {
					let err = new Error(res);
					err.status = res.status;
					throw err;
				}

				disableModal();
				toasts.update((t) => [
					...t,
					{
						message: 'Votre avis a bien été pris en compte !',
						color: 'green'
					}
				]);
			})
			.catch((err) => {
				// If the request is 404, then no address was found.
				if (err.status === 404) {
					has_searched = true;
					address_found = false;
				} else {
					show_error_toast = true;
					has_searched = false;
					address_found = false;
				}
			});
	};
</script>

<!-- veil -->
<div class="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center" />
<div class="card element p-7 mt-5 fixed z-50 w-96 left-0 right-0 m-auto">
	<h2 class="text-xl">{$search_address.name}</h2>

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
		<Button class="mt-5 self-end" outline on:click={disableModal} color="red">Annuler</Button>
		<Button class="mt-5 self-end" outline on:click={sendRating} color="light">Ajouter</Button>
	</div>
</div>
