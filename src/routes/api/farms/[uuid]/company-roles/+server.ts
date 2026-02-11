import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import {
	getFarmByUuid,
	getCompanyRoleByName,
	upsertFarmCompanyRole,
	deleteFarmCompanyRole,
	createCompany
} from '$lib/server/db/farms';

const putSchema = z.object({
	roleName: z.string().min(1),
	companyUuid: z.string().min(1),
	oldCompanyUuid: z.string().optional(),
	newCompany: z.object({
		name: z.string().min(1)
	}).optional()
});

const deleteSchema = z.object({
	companyRoleId: z.number(),
	companyUuid: z.string().min(1)
});

export const PUT: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const parsed = putSchema.safeParse(body);

	if (!parsed.success) {
		throw error(400, parsed.error.message);
	}

	const farm = await getFarmByUuid(params.uuid);
	if (!farm) throw error(404, 'Farm not found');

	const roleId = await getCompanyRoleByName(parsed.data.roleName);
	if (roleId === null) throw error(400, `Unknown role: ${parsed.data.roleName}`);

	let companyUuid = parsed.data.companyUuid;

	// Create new company if requested
	if (parsed.data.newCompany) {
		companyUuid = crypto.randomUUID();
		await createCompany({
			uuid: companyUuid,
			name: parsed.data.newCompany.name
		});
	}

	await upsertFarmCompanyRole(farm.uuid, farm.code, roleId, companyUuid, parsed.data.oldCompanyUuid);

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const parsed = deleteSchema.safeParse(body);

	if (!parsed.success) {
		throw error(400, parsed.error.message);
	}

	const farm = await getFarmByUuid(params.uuid);
	if (!farm) throw error(404, 'Farm not found');

	await deleteFarmCompanyRole(farm.uuid, parsed.data.companyRoleId, parsed.data.companyUuid);

	return json({ success: true });
};
