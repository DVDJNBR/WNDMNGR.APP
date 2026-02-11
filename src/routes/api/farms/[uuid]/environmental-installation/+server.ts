import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { getFarmByUuid, upsertFarmEnvironmentalInstallation } from '$lib/server/db/farms';

const patchSchema = z.object({
	aip_number: z.string().nullable().optional(),
	prefecture_name: z.string().nullable().optional(),
	prefecture_address: z.string().nullable().optional(),
	duty_dreal_contact: z.string().nullable().optional()
});

export const PATCH: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const parsed = patchSchema.safeParse(body);
	if (!parsed.success) throw error(400, parsed.error.message);

	const farm = await getFarmByUuid(params.uuid);
	if (!farm) throw error(404, 'Farm not found');

	await upsertFarmEnvironmentalInstallation(farm.uuid, farm.code, parsed.data);
	return json({ success: true });
};
