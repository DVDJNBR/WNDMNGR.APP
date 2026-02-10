import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { getFarmByUuid, updateFarm } from '$lib/server/db/farms';

const patchSchema = z.object({
	spv: z.string().min(1).optional(),
	project: z.string().min(1).optional(),
	farm_type_id: z.coerce.number().int().positive().optional()
}).refine((data) => Object.keys(data).length > 0, { message: 'At least one field required' });

export const GET: RequestHandler = async ({ params }) => {
	const farm = await getFarmByUuid(params.uuid);
	if (!farm) throw error(404, 'Farm not found');
	return json(farm);
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const parsed = patchSchema.safeParse(body);

	if (!parsed.success) {
		throw error(400, parsed.error.message);
	}

	const farm = await getFarmByUuid(params.uuid);
	if (!farm) throw error(404, 'Farm not found');

	await updateFarm(params.uuid, parsed.data);
	return json({ success: true });
};
