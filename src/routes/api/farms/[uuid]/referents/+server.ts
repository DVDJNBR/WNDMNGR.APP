import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { getFarmByUuid } from '$lib/server/db/farms';
import { getPersonRoleByName, upsertPersonReferent, createPerson } from '$lib/server/db/referents';


const putSchema = z.object({
	role: z.string().min(1),
	personUuid: z.string().nullable(),
	newPerson: z.object({
		first_name: z.string().min(1),
		last_name: z.string().min(1)
	}).optional()
});

export const PUT: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const parsed = putSchema.safeParse(body);

	if (!parsed.success) {
		throw error(400, parsed.error.message);
	}

	const farm = await getFarmByUuid(params.uuid);
	if (!farm) throw error(404, 'Farm not found');

	const roleId = await getPersonRoleByName(parsed.data.role);
	if (roleId === null) throw error(400, `Unknown role: ${parsed.data.role}`);

	let personUuid = parsed.data.personUuid;

	// Create new person if requested
	if (parsed.data.newPerson) {
		personUuid = crypto.randomUUID();
		await createPerson({
			uuid: personUuid,
			first_name: parsed.data.newPerson.first_name,
			last_name: parsed.data.newPerson.last_name
		});
	}

	await upsertPersonReferent(farm.uuid, farm.code, roleId, personUuid);

	return json({ success: true });
};
