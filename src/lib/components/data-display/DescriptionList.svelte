<script lang="ts" module>
	import { getContext } from 'svelte';
	export type DescriptionLayout = 'horizontal' | 'vertical' | 'grid' | 'inline';
	const KEY = Symbol('dl');
	export function getDescriptionContext() {
		return getContext<{ layout: DescriptionLayout; compact: boolean; divided: boolean } | undefined>(KEY);
	}
	export { KEY as DL_KEY };
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import KeyValue from './KeyValue.svelte';
	import type { KeyValueItem } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/**
	 * Attribute/value data (<dl>), e.g. product specs. Pass `items` or compose KeyValue
	 * children.
	 * - horizontal: label left, value right; stacks on small screens
	 * - vertical: label above value
	 * - grid: responsive multi-column vertical pairs
	 * - inline: compact "Key: value" pairs that wrap
	 */
	interface Props {
		items?: KeyValueItem[];
		layout?: DescriptionLayout;
		compact?: boolean;
		divided?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { items, layout = 'horizontal', compact = false, divided = false, class: className, children }: Props = $props();

	setContext(KEY, { get layout() { return layout; }, get compact() { return compact; }, get divided() { return divided; } });

	const layouts: Record<DescriptionLayout, string> = {
		horizontal: 'flex flex-col',
		vertical: 'flex flex-col',
		grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
		inline: 'flex flex-wrap gap-x-6 gap-y-2'
	};
</script>

<dl
	class={cn(
		'text-sm',
		layouts[layout],
		layout !== 'inline' && (compact ? 'gap-2' : 'gap-4'),
		divided && layout !== 'inline' && 'gap-0 divide-y divide-border',
		className
	)}
>
	{#if items}
		{#each items as item (item.key)}<KeyValue label={item.key} value={item.value} icon={item.icon} />{/each}
	{/if}
	{@render children?.()}
</dl>
