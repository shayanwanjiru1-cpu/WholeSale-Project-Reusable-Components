<script lang="ts">
	import type { Snippet } from 'svelte';
	import SearchInput from '../../ui/SearchInput.svelte';
	import Chip from '../../ui/Chip.svelte';
	import Button from '../../ui/Button.svelte';
	import { cn } from '$lib/utils/cn';

	/**
	 * Toolbar above a table. Combines three roles so they never fight for space:
	 *  - search (bind `search` to enable)
	 *  - filters: `filters` snippet for controls + `activeFilters` shown as removable chips
	 *  - bulk actions: when `selectedCount > 0` the bar switches to bulk mode
	 */
	interface Props {
		search?: string;
		searchLabel?: string;
		searchPlaceholder?: string;
		filters?: Snippet;
		activeFilters?: { id: string; label: string }[];
		onremovefilter?: (id: string) => void;
		onclearfilters?: () => void;
		actions?: Snippet;
		selectedCount?: number;
		bulkActions?: Snippet;
		onclearselection?: () => void;
		class?: string;
	}

	let {
		search = $bindable(),
		searchLabel = 'Search table',
		searchPlaceholder = 'Search…',
		filters,
		activeFilters = [],
		onremovefilter,
		onclearfilters,
		actions,
		selectedCount = 0,
		bulkActions,
		onclearselection,
		class: className
	}: Props = $props();

	const bulk = $derived(selectedCount > 0 && Boolean(bulkActions));
</script>

<div class={cn('flex flex-col gap-3', className)}>
	{#if bulk}
		<div class="flex min-h-10 flex-wrap items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground" role="region" aria-label="Bulk actions">
			<p class="text-sm font-semibold" aria-live="polite">{selectedCount} selected</p>
			<div class="flex flex-wrap items-center gap-2">{@render bulkActions?.()}</div>
			{#if onclearselection}<Button variant="ghost" size="sm" class="ml-auto" onclick={onclearselection}>Clear selection</Button>{/if}
		</div>
	{:else}
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
			{#if search !== undefined}
				<SearchInput bind:value={search} label={searchLabel} placeholder={searchPlaceholder} class="sm:max-w-xs sm:flex-1" />
			{/if}
			{#if filters}<div class="flex flex-wrap items-center gap-2">{@render filters()}</div>{/if}
			{#if actions}<div class="flex flex-wrap items-center gap-2 sm:ml-auto">{@render actions()}</div>{/if}
		</div>
	{/if}
	{#if activeFilters.length}
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-xs font-medium text-muted-foreground">Filters:</span>
			{#each activeFilters as f (f.id)}
				<Chip size="sm" onremove={onremovefilter ? () => onremovefilter(f.id) : undefined} removeLabel="Remove filter {f.label}">{f.label}</Chip>
			{/each}
			{#if onclearfilters}<Button variant="link" size="sm" onclick={onclearfilters}>Clear all</Button>{/if}
		</div>
	{/if}
</div>
