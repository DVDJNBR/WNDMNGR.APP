import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { getFarmByUuid, upsertFarmTCMAContract } from '$lib/server/db/farms';

const patchSchema = z.object({
	contract_type: z.string().nullable().optional(),
	tcma_status: z.string().nullable().optional(),
	effective_date: z.string().nullable().optional(),
	end_date: z.string().nullable().optional(),
	signature_date: z.string().nullable().optional(),
	beginning_of_remuneration: z.string().nullable().optional(),
	compensation_rate: z.coerce.number().nullable().optional()
});

export const PATCH: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const parsed = patchSchema.safeParse(body);
	if (!parsed.success) throw error(400, parsed.error.message);

	const farm = await getFarmByUuid(params.uuid);
	if (!farm) throw error(404, 'Farm not found');

	await upsertFarmTCMAContract(farm.uuid, farm.code, parsed.data);
	return json({ success: true });
};
