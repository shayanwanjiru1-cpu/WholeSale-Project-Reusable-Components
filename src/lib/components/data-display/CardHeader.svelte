<script lang="ts">
	import type { Snippet } from 'svelte';
	import Heading from '../layout/Heading.svelte';
	import Icon from '../ui/Icon.svelte';
	import { cardPadding, getCardSize } from './card-context';
	import type { HeadingLevel, IconName } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	interface Props {
		title?: string;
		description?: string;
		icon?: IconName;
		headingLevel?: HeadingLevel;
		headingId?: string;
		divided?: boolean;
		/** Top-right actions (icon button, dropdown, badge). */
		actions?: Snippet;
		/** Fully custom header content (replaces title/description). */
		children?: Snippet;
		class?: string;
	}

	let { title, description, icon, headingLevel = 3, headingId, divided = false, actions, children, class: className }: Props = $props();
	const size = getCardSize();
</script>

<div class={cn(cardPadding[size], divided ? 'border-b border-border' : 'pb-0!', 'flex items-start gap-3', className)}>
	{#if icon}
		<span class="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"><Icon name={icon} class="size-5" /></span>
	{/if}
	<div class="min-w-0 flex-1">
		{#if children}
			{@render children()}
		{:else}
			{#if title}<Heading level={headingLevel} id={headingId} class="text-base font-semibold text-foreground">{title}</Heading>{/if}
			{#if description}<p class="mt-1 text-sm text-muted-foreground">{description}</p>{/if}
		{/if}
	</div>
	{#if actions}<div class="-mt-1 -mr-1 flex shrink-0 items-center gap-1">{@render actions()}</div>{/if}
</div>
