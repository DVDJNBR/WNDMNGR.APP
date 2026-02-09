<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="p-8">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">WNDMNGR Platform Health Check</h1>
		{#if data.user}
			<div class="text-right">
				<p class="text-sm text-gray-600">Connected as:</p>
				<p class="font-semibold">{data.user.name} ({data.user.email})</p>
			</div>
		{/if}
	</div>

	{#if data.success}
		<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
			<p class="font-bold">Database Connection Successful!</p>
			<p>Successfully fetched {data.farms?.length || 0} farms from Supabase.</p>
		</div>

		{#if data.farms && data.farms.length > 0}
			<div class="bg-white shadow rounded-lg p-6">
				<h2 class="text-xl font-semibold mb-4">Sample Farms:</h2>
				<ul class="list-disc pl-5">
					{#each data.farms as farm}
						<li>{farm.project} ({farm.uuid})</li>
					{/each}
				</ul>
			</div>
		{/if}
	{:else}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
			<p class="font-bold">Database Connection Failed</p>
			<p>{data.error}</p>
			<p class="mt-2 text-sm">Note: Ensure <code>SUPABASE_SERVICE_ROLE_KEY</code> is set in your environment variables.</p>
		</div>
	{/if}
</main>
