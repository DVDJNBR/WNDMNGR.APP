<script lang="ts">
	import type { FarmPerformance } from '$lib/types/farm';

	export let actual: FarmPerformance[];
	export let target: FarmPerformance[];

	// Merge years for display
	$: years = [...new Set([...actual.map((d) => d.year), ...target.map((d) => d.year)])].sort();
	$: maxAmount = Math.max(
		...actual.map((d) => d.amount),
		...target.map((d) => d.amount),
		1
	);

	function getAmount(data: FarmPerformance[], year: number): number {
		return data.find((d) => d.year === year)?.amount ?? 0;
	}

	function barHeight(amount: number): number {
		return (amount / maxAmount) * 100;
	}
</script>

{#if years.length === 0}
	<div class="info-card text-center text-gray-400 py-8">
		<p class="text-lg">No performance data available</p>
		<p class="text-sm mt-1">Data will appear once Rotorsoft API is configured</p>
	</div>
{:else}
	<div class="info-card">
		<div class="section-title text-sm">Actual vs Target Performance</div>

		<div class="flex items-end gap-1 h-48 mt-4 px-2">
			{#each years as year}
				{@const actualAmt = getAmount(actual, year)}
				{@const targetAmt = getAmount(target, year)}
				<div class="flex-1 flex flex-col items-center gap-1">
					<div class="flex items-end gap-0.5 w-full h-40">
						<div
							class="flex-1 bg-[var(--color-primary)] rounded-t opacity-80 transition-all"
							style="height: {barHeight(actualAmt)}%"
							title="Actual: {actualAmt.toLocaleString()}"
						></div>
						<div
							class="flex-1 bg-[var(--color-primary-light)] rounded-t opacity-40 transition-all"
							style="height: {barHeight(targetAmt)}%"
							title="Target: {targetAmt.toLocaleString()}"
						></div>
					</div>
					<span class="text-xs text-gray-500">{year}</span>
				</div>
			{/each}
		</div>

		<div class="flex justify-center gap-6 mt-3 text-xs">
			<div class="flex items-center gap-1">
				<span class="inline-block w-3 h-3 rounded bg-[var(--color-primary)] opacity-80"></span>
				Actual
			</div>
			<div class="flex items-center gap-1">
				<span class="inline-block w-3 h-3 rounded bg-[var(--color-primary-light)] opacity-40"></span>
				Target
			</div>
		</div>
	</div>
{/if}
