<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from './Card.svelte';
	import Heading from '../layout/Heading.svelte';
	import Icon from '../ui/Icon.svelte';
	import type { HeadingLevel, IconName } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/**
	 * Icon + title + description. Covers both "feature" and "service" cards:
	 * add `items` (what's included) and an `action` to present a service offering.
	 */
	interface Props {
		title: string;
		description?: string;
		icon?: IconName;
		items?: string[];
		href?: string;
		linkLabel?: string;
		layout?: 'stacked' | 'centered' | 'horizontal';
		variant?: 'default' | 'outlined' | 'elevated' | 'flat';
		headingLevel?: HeadingLevel;
		/** Custom footer actions (overrides href link). */
		action?: Snippet;
		class?: string;
	}

	let {
		title,
		description,
		icon,
		items,
		href,
		linkLabel = 'Learn more',
		layout = 'stacked',
		variant = 'default',
		headingLevel = 3,
		action,
		class: className
	}: Props = $props();
</script>

<Card {variant} interactive={Boolean(href)} class={className}>
	<div class={cn('flex h-full gap-4 p-6', layout === 'horizontal' ? 'flex-row items-start' : 'flex-col', layout === 'centered' && 'items-center text-center')}>
		{#if icon}
			<span class="grid size-12 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon name={icon} class="size-6" /></span>
		{/if}
		<div class={cn('flex flex-1 flex-col gap-2', layout === 'centered' && 'items-center')}>
			<Heading level={headingLevel} class="text-lg font-semibold text-foreground">{title}</Heading>
			{#if description}<p class="text-sm text-pretty text-muted-foreground">{description}</p>{/if}
			{#if items?.length}
				<ul class="mt-2 flex flex-col gap-2 text-left text-sm">
					{#each items as item (item)}
						<li class="flex gap-2"><Icon name="check" class="mt-0.5 size-4 text-success" />{item}</li>
					{/each}
				</ul>
			{/if}
			{#if action}
				<div class="mt-auto pt-4">{@render action()}</div>
			{:else if href}
				<!-- Stretched link: whole card is clickable, but the link text stays the accessible name. -->
				<a {href} class="focus-ring mt-auto inline-flex items-center gap-1 rounded pt-2 text-sm font-semibold text-primary-text after:absolute after:inset-0">
					{linkLabel}<span class="sr-only"> about {title}</span><Icon name="arrow-right" class="size-4" />
				</a>
			{/if}
		</div>
	</div>
</Card>
