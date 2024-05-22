import { adminDB } from '$lib/services/firebase.server';
import { error, json } from '@sveltejs/kit';
import { Timestamp, GeoPoint } from 'firebase-admin/firestore';
import type { RequestHandler } from './$types';
import validateAccessToken from "../Utils";

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const { name, location, authAccessToken } = await request.json();
  try {
    await validateAccessToken(authAccessToken);
  } catch (error) {
    throw Error("Unauthorized");
  }

	const ip = getClientAddress();

	// First we need to asynchronously add the search to the database
	adminDB.collection('searched_addresses').add({
		name,
		location: new GeoPoint(location.lat, location.lng),
		searchedBy: ip,
		searchedAt: Timestamp.now()
	});

	// Then we need to get the results from the database for this search
	const addresses = await adminDB.collection('addresses').where('name', '==', name).get();

	// If there are no results, we need to return an error
	if (addresses.empty) {
		throw error(404, 'No addresses found');
	}

	return json(addresses.docs.map((doc) => doc.data()));
};
