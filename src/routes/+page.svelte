<script>
	import { Input } from 'flowbite-svelte';
	import CustomCard from '$lib/CustomCard.svelte';

	const ratings = [
		{ id: 1, name: 'A', value: 'A', updated_at: '2023-04-01', pct: '90%' },
		{ id: 2, name: 'B', value: 'B', updated_at: '2023-04-01', pct: '5%' },
		{ id: 3, name: 'C', value: 'C', updated_at: '2023-04-01', pct: '5%' }
	];

	const address = '1 rue de la paix, Paris';
</script>

<div class="addresses w-full">
	<Input type="text" defaultClass="element w-full font-mono" placeholder="Recherchez une adresse">
		<svg
			slot="right"
			aria-hidden="true"
			class="w-5 h-5 text-white dark:text-white mr-2"
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				id="icon"
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M14.76 13.27L20.49 19L19 20.49L13.27 14.76C12.2 15.53 10.91 16 9.5 16C5.91 16 3 13.09 3 9.5C3 5.91 5.91 3 9.5 3C13.09 3 16 5.91 16 9.5C16 10.91 15.53 12.2 14.76 13.27ZM9.5 5C7.01 5 5 7.01 5 9.5C5 11.99 7.01 14 9.5 14C11.99 14 14 11.99 14 9.5C14 7.01 11.99 5 9.5 5Z"
			/></svg
		>
	</Input>

	<CustomCard {ratings} {address} />
</div>
