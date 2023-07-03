import { adminDB } from '$lib/services/firebase.server';
import { error, json } from '@sveltejs/kit';
import { Timestamp, GeoPoint, FieldValue } from 'firebase-admin/firestore';
import { createHash } from 'crypto';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const { name, location, rating } = await request.json();
	const ip = getClientAddress();

	const hash = createHash('sha256').update(name).digest('hex');

	const doc = adminDB.collection('addresses').doc(hash);
	const res = doc.set(
		{
			name,
			location: new GeoPoint(location.lat, location.lng),
			lastUpdatedAt: Timestamp.now(),
			ratings: FieldValue.arrayUnion({
				rating,
				ratedBy: ip,
				ratedAt: Timestamp.now()
			})
		},
		{ merge: true }
	);

	if (!res) {
		throw error(500, 'Error updating address');
	}

	return json({ success: true });
};
