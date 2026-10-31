<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../ui/Icon.svelte';
	import type { HeadingLevel, IconName } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/**
	 * Single disclosure (button + region). Accordion composes several of these.
	 * Animates height with a CSS grid-rows transition (disabled under reduced motion);
	 * collapsed content is `visibility: hidden`, so it is removed from tab order and
	 * the accessibility tree.
	 */
	interface Props {
		title: string;
		open?: boolean;
		disabled?: boolean;
		icon?: IconName;
		/** Wrap the trigger in a heading of this level (recommended inside accordions). */
		headingLevel?: HeadingLevel;
		variant?: 'default' | 'bordered' | 'ghost';
		/** Optional content to the right of the title (badge, count). */
		meta?: Snippet;
		onopenchange?: (open: boolean) => void;
		children: Snippet;
		class?: string;
	}

	let {
		title,
		open = $bindable(false),
		disabled = false,
		icon,
		headingLevel,
		variant = 'default',
		meta,
		onopenchange,
		children,
		class: className
	}: Props = $props();

	const uid = $props.id();
	const triggerId = `collapsible-trigger-${uid}`;
	const regionId = `collapsible-region-${uid}`;

	function toggle() {
		open = !open;
		onopenchange?.(open);
	}

	const variants = {
		default: '',
		bordered: 'rounded-card border border-border bg-surface px-4',
		ghost: ''
	};
</script>

{#snippet trigger()}
	<button
		type="button"
		id={triggerId}
		data-collapsible-trigger
		class="focus-ring flex w-full items-center gap-3 rounded-md py-4 text-left text-sm font-semibold text-foreground hover:text-primary-text disabled:cursor-not-allowed disabled:opacity-50"
		aria-expanded={open}
		aria-controls={regionId}
		{disabled}
		onclick={toggle}
	>
		{#if icon}<Icon name={icon} class="size-5 text-muted-foreground" />{/if}
		<span class="flex-1">{title}</span>
		{@render meta?.()}
		<Icon name="chevron-down" class={cn('size-5 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none', open && 'rotate-180')} />
	</button>
{/snippet}

<div class={cn(variants[variant], className)}>
	{#if headingLevel}
		<svelte:element this={`h${headingLevel}`} class="m-0">{@render trigger()}</svelte:element>
	{:else}
		{@render trigger()}
	{/if}
	<div
		id={regionId}
		role="region"
		aria-labelledby={triggerId}
		class={cn(
			'grid transition-[grid-template-rows,opacity,visibility] duration-200 ease-out motion-reduce:transition-none',
			open ? 'visible grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0'
		)}
	>
		<div class="overflow-hidden">
			<div class="pb-4 text-sm text-muted-foreground">{@render children()}</div>
		</div>
	</div>
</div>
