<script lang="ts">
	export let label: string;
	export let value: string | number;
	export let unit: string = '';
	export let icon: string = '';
</script>

<div class="info-card text-center">
	{#if icon}
		<div class="text-2xl mb-1">{icon}</div>
	{/if}
	<div class="text-2xl font-bold text-[var(--color-primary)]">
		{value}{#if unit}<span class="text-sm font-normal ml-1">{unit}</span>{/if}
	</div>
	<div class="info-label mt-1">{label}</div>
</div>
