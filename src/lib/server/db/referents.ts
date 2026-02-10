import { supabase } from '$lib/server/supabase';
import type { FarmReferentDisplay, Person } from '$lib/types/farm';

/** Get all referents for a farm (persons + companies with roles) */
export async function getReferentsByFarm(farmUuid: string): Promise<FarmReferentDisplay[]> {
	const { data, error } = await supabase
		.from('farm_referents')
		.select(`
			person_uuid,
			company_uuid,
			person_role_id,
			company_role_id,
			persons(first_name, last_name),
			companies(name),
			person_roles(role_name),
			company_roles(role_name)
		`)
		.eq('farm_uuid', farmUuid);

	if (error) return [];

	return (data ?? []).map((r: any) => {
		const name = r.persons
			? `${r.persons.first_name} ${r.persons.last_name}`
			: r.companies?.name ?? 'N/A';

		const role = r.person_roles?.role_name ?? r.company_roles?.role_name ?? 'N/A';

		return { referent_name: name, role };
	});
}

/** Get all persons (for dropdown) */
export async function getAllPersons(): Promise<Person[]> {
	const { data, error } = await supabase
		.from('persons')
		.select('*')
		.order('last_name');

	if (error) return [];
	return data ?? [];
}

/** Create a new person */
export async function createPerson(person: { uuid: string; first_name: string; last_name: string }) {
	const { error } = await supabase
		.from('persons')
		.insert(person);

	if (error) throw error;
}

/** Upsert a farm referent for a person role */
export async function upsertPersonReferent(
	farmUuid: string,
	farmCode: string,
	personRoleId: number,
	personUuid: string | null
) {
	// Check existing
	const { data: existing } = await supabase
		.from('farm_referents')
		.select('uuid')
		.eq('farm_uuid', farmUuid)
		.eq('person_role_id', personRoleId)
		.is('company_role_id', null)
		.maybeSingle();

	if (personUuid === null) {
		// Remove referent
		if (existing) {
			const { error } = await supabase
				.from('farm_referents')
				.delete()
				.eq('uuid', existing.uuid);
			if (error) throw error;
		}
		return;
	}

	if (existing) {
		const { error } = await supabase
			.from('farm_referents')
			.update({ person_uuid: personUuid })
			.eq('uuid', existing.uuid);
		if (error) throw error;
	} else {
		const { error } = await supabase
			.from('farm_referents')
			.insert({
				farm_uuid: farmUuid,
				farm_code: farmCode,
				person_role_id: personRoleId,
				person_uuid: personUuid
			});
		if (error) throw error;
	}
}

/** Get person role ID by name */
export async function getPersonRoleByName(roleName: string): Promise<number | null> {
	const { data, error } = await supabase
		.from('person_roles')
		.select('id')
		.eq('role_name', roleName)
		.single();

	if (error) return null;
	return data.id;
}
