<svelte:head>
  <title>Bercouchim Habaim</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
</svelte:head>

<script>
	import { Input, Spinner } from 'flowbite-svelte';
  import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import CustomCard from '$lib/CustomCard.svelte';
	import WelcomeMessage from '$lib/WelcomeMessage.svelte';
	import { search_address, toasts } from '$lib/stores';
	import { db } from '$lib/firestore';
	import sha256 from 'crypto-js/sha256';
  import JConnectLogo from "../images/logo-jconnect.png";
  import BerouchimLogo from "../images/berouchim-logo.png";

  import { createAuth0Client } from "@auth0/auth0-spa-js";

  let auth0;
  let isAuthenticated = false;
  let buttonText = "Se connecter avec JConnect";
  let buttonIsActive = true;
  let hasFound = false;
  let authAT;

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

  const login = async () => {
    await auth0.loginWithPopup();
    const user = await auth0.getUser();
    buttonText = "Connecté en tant que " + user.name;
    buttonIsActive = false;
    isAuthenticated = true;
  };

	const handlePlaceSelect = async (autocomplete) => {
		searching = true;
		const addressObject = autocomplete.getPlace();
		address = addressObject.formatted_address;

		const data = {
			name: address,
			location: addressObject.geometry.location,
      authAccessToken: await auth0.getTokenSilently(),
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
        
        hasFound = true;
			})
			.catch((err) => {
				address_found = false;
				has_searched = err.status === 404;
				toasts.update((t) => [
					...t,
					{
						message: 'Une erreur est survenue lors de la recherche de l\'adresse. Veuillez réessayer plus tard.',
						color: 'red'
					}
				]);
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

	onMount(async () => {
    auth0 = await createAuth0Client({
      domain: "jconnect.eu.auth0.com",
      clientId: "nxMunD2S0w3B1Eqf3kCTb9f4kIDvNbw8",
      redirect_uri: "http://127.0.0.1:5173/",
      cacheLocation: 'localstorage',
      authorizationParams: {
        audience: "https://api.auth0.jconnect.cloud",
        scope: "openid profile read:profile_picture",
        ui_locales: "fr",
      },
    });

    isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
      authAT = await auth0.getTokenSilently();
      const user = await auth0.getUser();
      buttonText = "Connecté en tant que " + user.name;
      buttonIsActive = false;
    }

		// Load the Google Maps Platform JS API script asynchronously.
		loadAsync(
			`//maps.googleapis.com/maps/api/js?key=AIzaSyCccjLlNycBKO0fTfUJglwol18iECMXcpM&libraries=places&callback=onLoaded`
		);

		window.onLoaded = () => {
			const input = document.querySelector('.search-address-input');
			const autocomplete = new google.maps.places.Autocomplete(input);
			autocomplete.addListener('place_changed', () => handlePlaceSelect(autocomplete));
		};
	});
</script>

<div class="addresses w-full">
  <div class="mb-5 text-center" on:click={() => {
    // refresh the page
    window.location.reload();
  }}>
    <img src={BerouchimLogo} class="w-20 h-20 mx-auto" alt="Berouchim Logo" />
  </div>

  {#if isAuthenticated}
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
  {/if}

  {#if !hasFound}
  <div class="card element p-7 mt-5 w-[700px] -ml-[200px] max-md:w-full max-md:ml-0">
    <p class="text-sm">Connectez-vous avant de pouvoir utiliser cette application</p>

    <p class="text-xs mt-3 leading-5 font-mono">
      Cette application met à disposition des informations sensibles sur les immeubles. Pour garantir la confidentialité des données, nous vous demandons de vous connecter avant de pouvoir utiliser cette application.<br/>
      Utilisez l'application JConnect<sup>©</sup> pour assurer la sécurité de vos données.
    </p>

    <div class="mt-3 text-right">
      <button on:click={login} type="button" class="text-white bg-[#003049] hover:bg-[#003049]/90 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs p-2 text-center inline-flex items-center me-2 mb-2" class:bg-[#778da9]={!buttonIsActive} class:hover:bg-[#778da9]={!buttonIsActive} disabled={!buttonIsActive}>
        <img src={JConnectLogo} class="w-5 h-5 mr-2" alt="JConnect Logo" />
        {buttonText}
      </button>
      <p class="text-xs">Pas encore de compte ? <a href="https://jconnect.cloud/auth/register" class="text-[#90e0ef] underline">Créez-en un</a><br/>
        C'est rapide et totalement gratuit !
      </p>
    </div>
  </div>
  {/if}

	{#if has_searched}
		<CustomCard {ratings} access_token={authAT} />
	{:else if searching}
		<div class="mt-10 flex justify-center">
			<Spinner />
		</div>
	{:else}
		<WelcomeMessage />
	{/if}
</div>
