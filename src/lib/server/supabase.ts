import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
	if (!_supabase) {
		const url = env.SUPABASE_URL;
		const key = env.SUPABASE_ANON_KEY;

		if (!url || !key) {
			throw new Error('Missing Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)');
		}

		_supabase = createClient(url, key);
	}
	return _supabase;
}

// Backward-compatible export for existing imports
export const supabase = new Proxy({} as SupabaseClient, {
	get(_target, prop) {
		return (getSupabase() as any)[prop];
	}
});
