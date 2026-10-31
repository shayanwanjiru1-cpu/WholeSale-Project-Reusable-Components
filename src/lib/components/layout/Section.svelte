<script lang="ts">
	import type { Snippet } from 'svelte';
	import Container, { type ContainerSize } from './Container.svelte';
	import Heading from './Heading.svelte';
	import type { HeadingLevel } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	type Spacing = 'none' | 'sm' | 'md' | 'lg' | 'xl';
	type Background = 'default' | 'muted' | 'surface' | 'dark' | 'accent';
	// spacing follows the 8px scale: sm 32 · md 48/64 · lg 64/80 · xl 80/96

	interface Props {
		spacing?: Spacing;
		background?: Background;
		/** Wrap content in a Container. Set false for full-bleed content. */
		contained?: boolean;
		containerSize?: ContainerSize;
		align?: 'left' | 'center';
		eyebrow?: string;
		title?: string;
		description?: string;
		headingLevel?: HeadingLevel;
		/** Actions shown beside (left-aligned) or below (centered) the heading. */
		actions?: Snippet;
		id?: string;
		divided?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		spacing = 'lg',
		background = 'default',
		contained = true,
		containerSize = 'default',
		align = 'left',
		eyebrow,
		title,
		description,
		headingLevel = 2,
		actions,
		id,
		divided = false,
		class: className,
		children
	}: Props = $props();

	const uid = $props.id();
	const headingId = `section-heading-${uid}`;

	const spacings: Record<Spacing, string> = {
		none: '',
		sm: 'py-8',
		md: 'py-12 sm:py-16',
		lg: 'py-16 sm:py-20',
		xl: 'py-20 sm:py-24'
	};
	// `theme-dark` re-maps tokens so every nested component adapts automatically.
	const backgrounds: Record<Background, string> = {
		default: 'bg-background text-foreground',
		muted: 'bg-muted text-foreground',
		surface: 'bg-surface text-foreground',
		dark: 'theme-dark bg-background',
		accent: 'bg-accent text-foreground'
	};
	const hasHeader = $derived(Boolean(title || eyebrow || description || actions));
</script>

{#snippet header()}
	<div
		class={cn(
			'mb-8 flex flex-col gap-4 sm:mb-10',
			align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'
		)}
	>
		<div class={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
			{#if eyebrow}<p class="mb-2 text-sm font-semibold tracking-wide text-primary-text uppercase">{eyebrow}</p>{/if}
			{#if title}
				<Heading level={headingLevel} id={headingId} class="text-h2 text-balance">{title}</Heading>
			{/if}
			{#if description}<p class="mt-2 text-base text-pretty text-muted-foreground">{description}</p>{/if}
		</div>
		{#if actions}<div class="flex shrink-0 flex-wrap gap-3">{@render actions()}</div>{/if}
	</div>
{/snippet}

<section
	{id}
	aria-labelledby={title ? headingId : undefined}
	class={cn(spacings[spacing], backgrounds[background], divided && 'border-t border-border', className)}
>
	{#if contained}
		<Container size={containerSize}>
			{#if hasHeader}{@render header()}{/if}
			{@render children?.()}
		</Container>
	{:else}
		{#if hasHeader}<Container size={containerSize}>{@render header()}</Container>{/if}
		{@render children?.()}
	{/if}
</section>
