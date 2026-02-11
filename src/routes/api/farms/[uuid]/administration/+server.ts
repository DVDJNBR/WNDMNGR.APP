import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { getFarmByUuid, upsertFarmAdministration } from '$lib/server/db/farms';

const patchSchema = z.object({
	siret_number: z.string().nullable().optional(),
	vat_number: z.string().nullable().optional(),
	account_number: z.string().nullable().optional(),
	legal_representative: z.string().nullable().optional(),
	head_office_address: z.string().nullable().optional(),
	windmanager_subsidiary: z.string().optional()
});

export const PATCH: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const parsed = patchSchema.safeParse(body);
	if (!parsed.success) throw error(400, parsed.error.message);

	const farm = await getFarmByUuid(params.uuid);
	if (!farm) throw error(404, 'Farm not found');

	await upsertFarmAdministration(farm.uuid, farm.code, parsed.data);
	return json({ success: true });
};
