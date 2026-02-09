// @ts-nocheck
import { supabase } from '$lib/server/supabase';
import type { PageServerLoad } from './$types';

export const load = async () => {
	try {
		const { data: farms, error } = await supabase
			.from('farms')
			.select('uuid, project')
			.limit(5);

		if (error) {
			return {
				success: false,
				error: error.message
			};
		}

		return {
			success: true,
			farms
		};
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : 'Unknown error'
		};
	}
};
;null as any as PageServerLoad;