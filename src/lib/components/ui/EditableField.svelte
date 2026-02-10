<script lang="ts">
	export let label: string;
	export let value: string;
	export let readonly = false;
	export let fieldName: string;
	export let farmUuid: string;
	/** Optional: 'text' | 'select' */
	export let inputType: 'text' | 'select' = 'text';
	/** Options for select mode */
	export let options: { value: string; label: string }[] = [];

	let editing = false;
	let editValue = value;
	let saving = false;

	function startEdit() {
		editValue = value;
		editing = true;
	}

	function cancel() {
		editing = false;
	}

	async function save() {
		if (editValue === value) {
			editing = false;
			return;
		}
		saving = true;
		try {
			const res = await fetch(`/api/farms/${farmUuid}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ [fieldName]: editValue })
			});
			if (res.ok) {
				value = editValue;
				editing = false;
			}
		} finally {
			saving = false;
		}
	}
</script>

<div class="info-card">
	<div class="info-label">{label}</div>

	{#if editing}
		<div class="flex items-center gap-2 mt-1">
			{#if inputType === 'select'}
				<select bind:value={editValue} class="flex-1 border rounded px-2 py-1 text-sm">
					{#each options as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			{:else}
				<input
					type="text"
					bind:value={editValue}
					class="flex-1 border rounded px-2 py-1 text-sm"
					on:keydown={(e) => e.key === 'Enter' && save()}
				/>
			{/if}
			<button class="btn-primary" on:click={save} disabled={saving}>
				{saving ? '...' : 'Save'}
			</button>
			<button class="btn-cancel" on:click={cancel}>Cancel</button>
		</div>
	{:else}
		<div class="flex items-center gap-2">
			<span class="info-value">{value || 'N/A'}</span>
			{#if !readonly}
				<button class="btn-edit" on:click={startEdit}>Edit</button>
			{/if}
		</div>
	{/if}
</div>
