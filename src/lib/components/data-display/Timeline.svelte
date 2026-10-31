<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../ui/Icon.svelte';
	import type { TimelineItem } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { toneIcon, toneSoft } from '$lib/utils/tones';

	/** Vertical chronological list of events (order history, shipment tracking). */
	interface Props {
		items: TimelineItem[];
		label?: string;
		/** Extra content per event. */
		extra?: Snippet<[TimelineItem]>;
		class?: string;
	}

	let { items, label, extra, class: className }: Props = $props();
</script>

<ol class={cn('relative flex flex-col', className)} aria-label={label}>
	{#each items as item, i (item.id)}
		{@const tone = item.tone ?? 'neutral'}
		<li class="relative flex gap-4 pb-8 last:pb-0">
			{#if i < items.length - 1}
				<span class="absolute top-10 bottom-0 left-[1.1875rem] w-px bg-border" aria-hidden="true"></span>
			{/if}
			<span class={cn('relative z-10 grid size-10 shrink-0 place-items-center rounded-full ring-4 ring-background', toneSoft[tone])}>
				<Icon name={item.icon ?? toneIcon[tone]} class="size-5" />
			</span>
			<div class="min-w-0 flex-1 pt-2">
				<div class="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
					<p class="text-sm font-semibold text-foreground">{item.title}</p>
					{#if item.date}<time datetime={item.dateTime} class="shrink-0 text-xs text-muted-foreground">{item.date}</time>{/if}
				</div>
				{#if item.description}<p class="mt-1 text-sm text-muted-foreground">{item.description}</p>{/if}
				{@render extra?.(item)}
			</div>
		</li>
	{/each}
</ol>
