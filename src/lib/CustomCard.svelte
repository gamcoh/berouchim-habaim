<script lang="ts">
	import { Listgroup, Avatar, Button, Tooltip } from 'flowbite-svelte';
	import AddRatingCard from '$lib/AddRatingCard.svelte';
	import { show_modal, search_address } from '$lib/stores';
	import { fade } from 'svelte/transition';

	export let ratings: object[];
	const rating_colors = {
		A: 'bg-green-500',
		B: 'bg-yellow-500',
		C: 'bg-red-500'
	};

	const format_pct = (pct) => {
		return pct.toFixed(0);
	};

	// Deduplicate ratings
	$: deduplicated_ratings = ratings.filter((rating, index, self) => {
		return index === self.findIndex((r) => r.rating === rating.rating);
	});

	$: ratings_pcts = ratings.map((rate) => {
		const nbr_rating_similar = ratings.filter((r) => r.rating === rate.rating).length;
		return {
			rating: rate.rating,
			pct: (nbr_rating_similar / ratings.length) * 100
		};
	});
</script>

{#if $show_modal}
	<div transition:fade>
		<AddRatingCard />
	</div>
{/if}

<div class="card element p-7 mt-5">
	<h2 class="text-xl">{$search_address.name}</h2>

	{#if ratings.length == 0}
		<p class="text-xs mt-3 leading-5 font-mono">
			Aucun avis n'a été partagé pour ce lieu. Nous vous serions reconnaissants de partager votre
			opinion, aidant ainsi d'autres membres de la communauté juive dans leurs recherches.
		</p>
	{:else}
		<p class="text-xs mt-3 leading-5 font-mono">
			Voici les avis des internautes sur ce lieu. Notez que la mention 'A' signifie que le bâtiment
			est complètement Kasher, aucun obstacle sur votre chemin. 'B' signifie que le bâtiment est
			gérable, quoique difficile. 'C' indique un bâtiment impraticable (porte robotisée, etc.).
		</p>
		<p class="text-xs mt-3 leading-5 font-mono">
			Nous vous serions reconnaissants de partager votre opinion sur ce lieu, aidant ainsi d'autres
			membres de la communauté juive dans leurs recherches.
		</p>

		<Tooltip
			triggeredBy="[id^='tooltip-']"
			arrow={false}
			class="bg-gray-800 dark:bg-white text-white dark:text-gray-800"
		>
			Date de dernière mise à jour.
		</Tooltip>
		<Listgroup items={deduplicated_ratings} let:item class="mt-3 bg-transparent">
			<div class="flex items-center space-x-4">
				<Avatar class="flex-shrink-0 {rating_colors[item.rating]} text-white">{item.rating}</Avatar>
				<div class="flex-1 min-w-0">
					<p class="text-xxs text-white truncate">
						{item.ratedAt.toDate().toLocaleDateString()}
						<span class="text-xxs" id="tooltip-{item.rating}">
							<svg
								class="w-[12px] inline h-[12px] text-gray-800 dark:text-white"
								ariaHidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
								/>
							</svg>
						</span>
					</p>
				</div>
				<div class="inline-flex items-center text-base font-semibold text-white">
					{format_pct(ratings_pcts.find((r) => r.rating === item.rating).pct)}%
				</div>
			</div>
		</Listgroup>
	{/if}

	<div class="flex flex-col">
		<Button
			class="mt-5 self-end"
			outline
			on:click={() => {
				show_modal.set(true);
			}}
			color="white">Ajouter un avis</Button
		>
	</div>
</div>
