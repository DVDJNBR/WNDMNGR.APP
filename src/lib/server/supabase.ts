import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

let _supabase: SupabaseClient | null = null;
let _configuredUrl: string | undefined;
let _configuredKey: string | undefined;

/**
 * Called from hooks.server.ts to inject runtime env vars
 * (needed because $env/dynamic/private doesn't work on Cloudflare Pages runtime)
 */
export function configureSupabase(url: string, key: string) {
	_configuredUrl = url;
	_configuredKey = key;
}

export function getSupabase(): SupabaseClient {
	if (!_supabase) {
		const url = _configuredUrl || env.SUPABASE_URL;
		// Prefer service role key for data queries (bypasses RLS), fallback to anon key
		const key = _configuredKey || env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

		if (!url || !key) {
			throw new Error('Missing Supabase environment variables');
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
