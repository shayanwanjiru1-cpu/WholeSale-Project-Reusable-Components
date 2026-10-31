<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../ui/Icon.svelte';
	import { getDescriptionContext } from './DescriptionList.svelte';
	import type { IconName } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/**
	 * One label/value pair. Inside DescriptionList it adopts the list's layout; on its
	 * own it renders its own <dl> so the markup stays valid.
	 */
	interface Props {
		label: string;
		value?: string | number;
		icon?: IconName;
		layout?: 'horizontal' | 'vertical' | 'inline';
		/** Rich value content (badges, links, copy buttons). */
		children?: Snippet;
		class?: string;
	}

	let { label, value, icon, layout, children, class: className }: Props = $props();

	const ctx = getDescriptionContext();
	const mode = $derived(layout ?? (ctx?.layout === 'grid' ? 'vertical' : ctx?.layout) ?? 'inline');
	const pad = $derived(ctx?.divided ? (ctx.compact ? 'py-2' : 'py-3') : '');

	const wrap = $derived(
		{
			horizontal: 'grid grid-cols-1 gap-1 sm:grid-cols-[minmax(8rem,1fr)_2fr] sm:gap-4',
			vertical: 'flex flex-col gap-1',
			inline: 'flex items-baseline gap-1.5'
		}[mode]
	);
</script>

{#snippet pair()}
	<div class={cn(wrap, pad, className)}>
		<dt class={cn('flex items-center gap-1.5 text-muted-foreground', mode === 'vertical' && 'text-xs font-medium tracking-wide uppercase')}>
			{#if icon}<Icon name={icon} class="size-4" />{/if}{label}{#if mode === 'inline'}<span aria-hidden="true">:</span>{/if}
		</dt>
		<dd class="min-w-0 font-medium break-words text-foreground">
			{#if children}{@render children()}{:else}{value}{/if}
		</dd>
	</div>
{/snippet}

{#if ctx}
	{@render pair()}
{:else}
	<dl>{@render pair()}</dl>
{/if}
