import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { getFarmByUuid, upsertFarmOMContract } from '$lib/server/db/farms';

const patchSchema = z.object({
	service_contract_type: z.string().nullable().optional(),
	contract_end_date: z.string().nullable().optional()
});

export const PATCH: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const parsed = patchSchema.safeParse(body);
	if (!parsed.success) throw error(400, parsed.error.message);

	const farm = await getFarmByUuid(params.uuid);
	if (!farm) throw error(404, 'Farm not found');

	await upsertFarmOMContract(farm.uuid, farm.code, parsed.data);
	return json({ success: true });
};
