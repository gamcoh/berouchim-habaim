import { adminDB } from '$lib/services/firebase.server';
import { error, json } from '@sveltejs/kit';
import { Timestamp, GeoPoint, FieldValue } from 'firebase-admin/firestore';
import { createHash } from 'crypto';
import type { RequestHandler } from './$types';
import validateAccessToken from "../Utils";

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const { name, location, rating, authAccessToken } = await request.json();
  try {
    await validateAccessToken(authAccessToken);
  } catch (error) {
    throw Error("Unauthorized");
  }

	const ip = getClientAddress();

	const hash = createHash('sha256').update(name).digest('hex');

	const batch = adminDB.batch();
	const this_addr = adminDB.doc(`addresses/${hash}`);

	batch.set(
		this_addr,
		{
			name,
			location: new GeoPoint(location.lat, location.lng),
			lastUpdatedAt: Timestamp.now(),
			ratings: FieldValue.arrayUnion({
				rating,
				ratedAt: Timestamp.now()
			})
		},
		{ merge: true }
	);

	// Adding the udpatedBy
	const updated_by_db = adminDB.doc(`updates_on_addresses/${hash}`);
	batch.set(
		updated_by_db,
		{
			name,
			updates: FieldValue.arrayUnion({
				ip,
				updatedAt: Timestamp.now()
			})
		},
		{ merge: true }
	);

	const res = await batch.commit();

	if (!res) {
		throw error(500, 'Error updating address');
	}

	return json({ success: true });
};
