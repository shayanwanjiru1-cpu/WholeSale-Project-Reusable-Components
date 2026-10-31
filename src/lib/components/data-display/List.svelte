<script lang="ts" module>
	import { getContext } from 'svelte';
	export type ListDensity = 'compact' | 'default' | 'spacious';
	const KEY = Symbol('list');
	export function getListContext() {
		return getContext<{ density: ListDensity; divided: boolean } | undefined>(KEY) ?? { density: 'default' as ListDensity, divided: false };
	}
	export { KEY as LIST_KEY };
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { cn } from '$lib/utils/cn';

	/**
	 * Ordered / unordered list. `marker="none"` + ListItem gives rich, icon or
	 * interactive lists; `divided` adds separators.
	 */
	interface Props {
		ordered?: boolean;
		marker?: 'default' | 'none';
		density?: ListDensity;
		divided?: boolean;
		bordered?: boolean;
		label?: string;
		class?: string;
		children: Snippet;
	}

	let { ordered = false, marker = 'none', density = 'default', divided = false, bordered = false, label, class: className, children }: Props = $props();

	setContext(KEY, { get density() { return density; }, get divided() { return divided; } });

	const markerClass = $derived(marker === 'default' ? (ordered ? 'list-decimal pl-5 marker:text-muted-foreground' : 'list-disc pl-5 marker:text-muted-foreground') : 'list-none');
	const gap = { compact: 'gap-1', default: 'gap-2', spacious: 'gap-4' };
</script>

<svelte:element
	this={ordered ? 'ol' : 'ul'}
	aria-label={label}
	class={cn(
		'flex flex-col text-sm text-foreground',
		markerClass,
		divided ? 'divide-y divide-border' : marker === 'default' ? gap[density] : '',
		bordered && 'overflow-hidden rounded-card border border-border bg-surface',
		className
	)}
>
	{@render children()}
</svelte:element>
