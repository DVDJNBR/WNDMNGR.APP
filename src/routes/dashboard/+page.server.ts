import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllFarms, getFarmFullData, getFarmTypes } from '$lib/server/db/farms';
import { getAllPersons } from '$lib/server/db/referents';

export const load: PageServerLoad = async ({ url }) => {
	const farms = await getAllFarms();

	if (farms.length === 0) {
		return { farms: [], farmData: null, farmTypes: [], persons: [], selectedUuid: '' };
	}

	// Selected farm from URL param or default to first
	const selectedUuid = url.searchParams.get('farm') ?? farms[0].uuid;

	const farmData = await getFarmFullData(selectedUuid);
	if (!farmData) {
		throw error(404, 'Farm not found');
	}

	const [farmTypes, persons] = await Promise.all([
		getFarmTypes(),
		getAllPersons()
	]);

	return {
		farms,
		farmData,
		farmTypes,
		persons,
		selectedUuid
	};
};
