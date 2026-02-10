<script lang="ts">
	export let title: string = '';
</script>

<div class="info-card">
	{#if title}
		<div class="section-title text-sm">{title}</div>
	{/if}
	<slot />
</div>
