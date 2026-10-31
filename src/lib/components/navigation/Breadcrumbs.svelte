<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import type { BreadcrumbItem } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	interface Props {
		items: BreadcrumbItem[];
		separator?: 'chevron' | 'slash';
		/** Collapse middle levels behind an expandable "…" when the trail is longer than this. */
		maxVisible?: number;
		label?: string;
		class?: string;
	}

	let { items, separator = 'chevron', maxVisible = 4, label = 'Breadcrumb', class: className }: Props = $props();

	let expanded = $state(false);
	const collapsible = $derived(!expanded && items.length > maxVisible);
	// Keep first item + last (maxVisible - 1) items when collapsed.
	const hiddenRange = $derived(collapsible ? [1, items.length - (maxVisible - 1)] : [0, 0]);
</script>

<nav aria-label={label} class={className}>
	<ol class="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
		{#each items as item, i (i)}
			{@const isLast = i === items.length - 1}
			{@const isHidden = i >= hiddenRange[0] && i < hiddenRange[1]}
			{#if i === hiddenRange[0] && collapsible}
				<li class="flex items-center gap-1.5">
					<button
						type="button"
						class="focus-ring rounded px-1 hover:bg-muted hover:text-foreground"
						aria-label="Show {hiddenRange[1] - hiddenRange[0]} more breadcrumb levels"
						onclick={() => (expanded = true)}
					>…</button>
					{@render sep()}
				</li>
			{/if}
			{#if !isHidden}
				<!-- On small screens only the last two levels are shown to avoid wrapping. -->
				<li class={cn('items-center gap-1.5', i < items.length - 2 ? 'hidden sm:flex' : 'flex', 'min-w-0')}>
					{#if isLast || !item.href}
						<span class={cn('inline-flex min-w-0 items-center gap-1.5', isLast && 'font-medium text-foreground')} aria-current={isLast ? 'page' : undefined}>
							{#if item.icon}<Icon name={item.icon} class="size-4" />{/if}
							<span class="truncate">{item.label}</span>
						</span>
					{:else}
						<a href={item.href} class="focus-ring inline-flex items-center gap-1.5 rounded hover:text-foreground hover:underline">
							{#if item.icon}<Icon name={item.icon} class="size-4" />{/if}
							<span class="max-w-40 truncate">{item.label}</span>
						</a>
					{/if}
					{#if !isLast}{@render sep()}{/if}
				</li>
			{/if}
		{/each}
	</ol>
</nav>

{#snippet sep()}
	{#if separator === 'chevron'}
		<Icon name="chevron-right" class="size-4 opacity-60" />
	{:else}
		<span class="opacity-60" aria-hidden="true">/</span>
	{/if}
{/snippet}
