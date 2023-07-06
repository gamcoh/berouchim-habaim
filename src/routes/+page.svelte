<script>
	import { Input, Spinner } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';
	import CustomCard from '$lib/CustomCard.svelte';
	import WelcomeMessage from '$lib/WelcomeMessage.svelte';
	import { onMount } from 'svelte';
	import { search_address } from '$lib/stores';
	import { db } from '$lib/firestore';
	import sha256 from 'crypto-js/sha256';

	let ratings = [];
	let address;
	let has_searched = false;
	let address_found = false;
	let searching = false;
	const loadAsync = (src) => {
		const script = document.createElement('script');
		script.src = src;
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);
	};

	const handlePlaceSelect = (autocomplete) => {
		searching = true;
		const addressObject = autocomplete.getPlace();
		address = addressObject.formatted_address;

		const data = {
			name: address,
			location: addressObject.geometry.location
		};

		search_address.set(data);

		fetch('/api/addresses', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((res) => {
				if (res.ok === false) {
					let err = new Error(res);
					err.status = res.status;
					throw err;
				}
			})
			.catch((err) => {
				address_found = false;
				has_searched = err.status === 404;
			});

		const hash = sha256(address).toString();
		db.collection('addresses')
			.doc(hash)
			.onSnapshot((doc) => {
				if (!doc.exists) {
					ratings = [];
					address_found = false;
					searching = false;
					return;
				}

				address_found = true;
				has_searched = true;
				searching = false;
				ratings = doc.data().ratings;
			});
	};

	onMount(() => {
		// Load the Google Maps Platform JS API script asynchronously.
		loadAsync(
			`//maps.googleapis.com/maps/api/js?key=AIzaSyB8mqM0E8jmjvMkQvsqK1BbDaP0heVNuNE&libraries=places&callback=onLoaded`
		);

		window.onLoaded = () => {
			const input = document.querySelector('.search-address-input');
			const autocomplete = new google.maps.places.Autocomplete(input);
			autocomplete.addListener('place_changed', () => handlePlaceSelect(autocomplete));
		};
	});
</script>

<div class="addresses w-full">
	<Input
		type="text"
		defaultClass="element w-full font-mono search-address-input"
		placeholder="Recherchez une adresse"
		value={address}
	>
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

	{#if has_searched}
		<CustomCard {ratings} />
	{:else if searching}
		<div class="mt-10 flex justify-center">
			<Spinner />
		</div>
	{:else}
		<WelcomeMessage />
	{/if}
</div>
