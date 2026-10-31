<script lang="ts">
	import type { Snippet } from 'svelte';
	import StateMessage from './StateMessage.svelte';
	import Button from '../ui/Button.svelte';
	import type { HeadingLevel } from '$lib/types';

	/**
	 * A search or filter returned nothing — distinct from EmptyState (nothing exists).
	 * Explains why and offers ways out.
	 */
	interface Props {
		query?: string;
		/** Number of active filters, used in the explanation. */
		activeFilters?: number;
		suggestions?: string[];
		onclear?: () => void;
		onsuggestion?: (suggestion: string) => void;
		title?: string;
		size?: 'sm' | 'md' | 'lg';
		headingLevel?: HeadingLevel;
		illustration?: Snippet;
		class?: string;
	}

	let {
		query,
		activeFilters = 0,
		suggestions = [],
		onclear,
		onsuggestion,
		title,
		size = 'md',
		headingLevel = 3,
		illustration,
		class: className
	}: Props = $props();

	const heading = $derived(title ?? (query ? `No results for “${query}”` : 'No matching results'));
	const explanation = $derived(
		[
			query && 'Check the spelling or try a broader term.',
			activeFilters > 0 && `${activeFilters} filter${activeFilters === 1 ? ' is' : 's are'} narrowing the results.`
		]
			.filter(Boolean)
			.join(' ') || 'Try adjusting your search or filters.'
	);
</script>

<StateMessage title={heading} description={explanation} icon="search" {size} {headingLevel} role="status" media={illustration} class={className}>
	{#if suggestions.length}
		<div class="flex flex-col items-center gap-2">
			<p class="text-sm text-muted-foreground">Try searching for:</p>
			<ul class="flex flex-wrap justify-center gap-2">
				{#each suggestions as s (s)}
					<li>
						<button type="button" class="focus-ring rounded-full border border-border-strong px-3 py-1 text-sm hover:bg-muted" onclick={() => onsuggestion?.(s)}>{s}</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
	{#snippet actions()}
		{#if onclear}<Button variant="outline" iconLeft="x" onclick={onclear}>{activeFilters > 0 ? 'Clear filters' : 'Clear search'}</Button>{/if}
	{/snippet}
</StateMessage>
