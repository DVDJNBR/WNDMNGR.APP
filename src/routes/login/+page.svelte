<script lang="ts">
	import { createBrowserClient } from '@supabase/ssr';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let data;

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	// Check for error from URL params (e.g. domain restriction)
	$: {
		const errorParam = $page.url.searchParams.get('error');
		if (errorParam === 'domain') {
			error = "Accès restreint aux comptes @wpd.fr.";
		}
	}

	async function handleLogin() {
		if (!email || !password) {
			error = "Veuillez remplir tous les champs.";
			return;
		}

		loading = true;
		error = '';

		const supabase = createBrowserClient(data.supabaseUrl, data.supabaseAnonKey);

		const { error: authError } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (authError) {
			if (authError.message.includes('Invalid login credentials')) {
				error = "Email ou mot de passe incorrect.";
			} else if (authError.message.includes('Email not confirmed')) {
				error = "Veuillez confirmer votre email avant de vous connecter.";
			} else {
				error = authError.message;
			}
			loading = false;
		} else {
			// Session is set in cookies, redirect to dashboard
			goto('/dashboard');
		}
	}
</script>

<svelte:head>
	<title>Connexion — WNDMNGR</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
	<div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
		<div class="mb-6 text-center">
			<h1 class="text-2xl font-bold text-gray-800">WNDMNGR</h1>
			<p class="text-sm text-gray-500 mt-1">Wind Farm Management Dashboard</p>
		</div>

		{#if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
				<p class="text-red-700 text-sm">{error}</p>
			</div>
		{/if}

		<form on:submit|preventDefault={handleLogin} class="space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="prenom.nom@wpd.fr"
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565c0] focus:border-transparent outline-none"
					disabled={loading}
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					placeholder="••••••••"
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565c0] focus:border-transparent outline-none"
					disabled={loading}
				/>
			</div>

			<button
				type="submit"
				class="w-full bg-[#1565c0] hover:bg-[#0d47a1] text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
				disabled={loading}
			>
				{loading ? 'Connexion...' : 'Se connecter'}
			</button>
		</form>
	</div>
</div>
