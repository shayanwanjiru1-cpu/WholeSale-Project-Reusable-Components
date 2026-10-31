<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../ui/Icon.svelte';
	import { getListContext } from './List.svelte';
	import type { IconName } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/**
	 * Row in a List. Renders a link (`href`) or button (`onclick`) for interactive rows;
	 * otherwise static content. Use `leading` / `trailing` for avatars, badges, actions.
	 */
	interface Props {
		title?: string;
		description?: string;
		icon?: IconName;
		iconClass?: string;
		href?: string;
		onclick?: () => void;
		selected?: boolean;
		disabled?: boolean;
		leading?: Snippet;
		trailing?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let { title, description, icon, iconClass = 'text-muted-foreground', href, onclick, selected = false, disabled = false, leading, trailing, children, class: className }: Props = $props();

	const ctx = getListContext();
	const pad = $derived({ compact: 'py-1.5', default: 'py-2.5', spacious: 'py-4' }[ctx.density]);
	const interactive = $derived(Boolean(href || onclick));
	const inner = $derived(
		cn(
			'flex w-full items-center gap-3 text-left',
			pad,
			(ctx.divided || interactive) && 'px-3',
			interactive && 'focus-ring rounded-md transition-colors hover:bg-muted motion-reduce:transition-none',
			selected && 'bg-accent text-accent-foreground hover:bg-accent',
			disabled && 'pointer-events-none opacity-50'
		)
	);
</script>

{#snippet body()}
	{@render leading?.()}
	{#if icon}<Icon name={icon} class={cn('size-5', iconClass)} />{/if}
	<span class="min-w-0 flex-1">
		{#if title}<span class="block font-medium">{title}</span>{/if}
		{#if description}<span class="block text-muted-foreground">{description}</span>{/if}
		{@render children?.()}
	</span>
	{@render trailing?.()}
	{#if href}<Icon name="chevron-right" class="size-4 text-muted-foreground" />{/if}
{/snippet}

<li class={className}>
	{#if href}
		<a {href} class={inner} aria-current={selected ? 'page' : undefined} aria-disabled={disabled ? 'true' : undefined}>{@render body()}</a>
	{:else if onclick}
		<button type="button" class={inner} {onclick} {disabled} aria-pressed={selected}>{@render body()}</button>
	{:else}
		<div class={inner}>{@render body()}</div>
	{/if}
</li>
