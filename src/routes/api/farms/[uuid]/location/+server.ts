import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { getFarmByUuid, upsertFarmLocation } from '$lib/server/db/farms';

const patchSchema = z.object({
	country: z.string().optional(),
	region: z.string().optional(),
	department: z.string().optional(),
	municipality: z.string().optional(),
	map_reference: z.string().optional(),
	arras_round_trip_distance_km: z.coerce.number().optional(),
	vertou_round_trip_duration_h: z.coerce.number().optional(),
	arras_toll_eur: z.coerce.number().optional(),
	nantes_toll_eur: z.coerce.number().optional()
});

export const PATCH: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const parsed = patchSchema.safeParse(body);

	if (!parsed.success) {
		throw error(400, parsed.error.message);
	}

	const farm = await getFarmByUuid(params.uuid);
	if (!farm) throw error(404, 'Farm not found');

	await upsertFarmLocation(farm.uuid, farm.code, parsed.data);

	return json({ success: true });
};
