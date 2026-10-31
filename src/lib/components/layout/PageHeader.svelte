<script lang="ts">
	import type { Snippet } from 'svelte';
	import Breadcrumbs from '../navigation/Breadcrumbs.svelte';
	import Heading from './Heading.svelte';
	import Icon from '../ui/Icon.svelte';
	import type { BreadcrumbItem, HeadingLevel, IconName } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	interface Props {
		title: string;
		eyebrow?: string;
		description?: string;
		breadcrumbs?: BreadcrumbItem[];
		icon?: IconName;
		size?: 'compact' | 'default' | 'large';
		align?: 'left' | 'center';
		headingLevel?: HeadingLevel;
		divided?: boolean;
		/** Page-level actions (buttons, dropdowns). */
		actions?: Snippet;
		/** Extra row under the description (badges, metadata). */
		meta?: Snippet;
		class?: string;
	}

	let {
		title,
		eyebrow,
		description,
		breadcrumbs,
		icon,
		size = 'default',
		align = 'left',
		headingLevel = 1,
		divided = false,
		actions,
		meta,
		class: className
	}: Props = $props();

	const titleSizes = {
		compact: 'text-h3',
		default: 'text-h2',
		large: 'text-h1'
	};
	const spacing = { compact: 'py-4', default: 'py-6 sm:py-8', large: 'py-10 sm:py-16' };
	const centered = $derived(align === 'center');
</script>

<header class={cn(spacing[size], divided && 'border-b border-border', className)}>
	{#if breadcrumbs?.length}
		<Breadcrumbs items={breadcrumbs} class={cn('mb-4', centered && 'flex justify-center')} />
	{/if}
	<div class={cn('flex flex-col gap-4', centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between')}>
		<div class={cn('flex min-w-0 gap-4', centered ? 'flex-col items-center' : 'items-start')}>
			{#if icon}
				<span class={cn('grid shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground', size === 'large' ? 'size-14' : 'size-11')}>
					<Icon name={icon} class={size === 'large' ? 'size-7' : 'size-5'} />
				</span>
			{/if}
			<div class={cn('min-w-0', centered && 'max-w-2xl')}>
				{#if eyebrow}<p class="mb-1 text-sm font-semibold tracking-wide text-primary-text uppercase">{eyebrow}</p>{/if}
				<Heading level={headingLevel} class={cn('font-bold text-balance text-foreground', titleSizes[size])}>{title}</Heading>
				{#if description}
					<p class={cn('mt-2 max-w-2xl text-pretty text-muted-foreground', size === 'large' ? 'text-lg' : 'text-base')}>{description}</p>
				{/if}
				{#if meta}<div class={cn('mt-3 flex flex-wrap items-center gap-2', centered && 'justify-center')}>{@render meta()}</div>{/if}
			</div>
		</div>
		{#if actions}
			<div class={cn('flex shrink-0 flex-wrap gap-2', centered && 'justify-center')}>{@render actions()}</div>
		{/if}
	</div>
</header>
