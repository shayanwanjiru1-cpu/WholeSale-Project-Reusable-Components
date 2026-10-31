<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from '../data-display/Card.svelte';
	import Heading from '../layout/Heading.svelte';
	import Badge from '../ui/Badge.svelte';
	import ProductImage from '../media/ProductImage.svelte';
	import PriceDisplay from './PriceDisplay.svelte';
	import StockStatus from './StockStatus.svelte';
	import HazardNotice from './HazardNotice.svelte';
	import AddToCart from './AddToCart.svelte';
	import type { HeadingLevel, Product } from '$lib/types';
	import { getCategory } from '$lib/data/categories';
	import { pluralUnit } from '$lib/catalog/pricing';
	import { cn } from '$lib/utils/cn';

	/**
	 * Wholesale product card. One component, four layouts:
	 *  - default     grid card (image → brand/category → name → pack → price → MOQ/stock → actions)
	 *  - compact     dense grids and carousels
	 *  - horizontal  list rows (search results, reorder lists)
	 *  - featured    larger card with description and quote action
	 * The product name is a stretched link, so the whole card opens the product while
	 * the action buttons stay independently focusable.
	 */
	interface Props {
		product: Product;
		variant?: 'default' | 'compact' | 'horizontal' | 'featured';
		headingLevel?: HeadingLevel;
		/** Show purchase actions (Add to cart / Request quote). */
		showActions?: boolean;
		/** Replace the default actions. */
		actions?: Snippet<[Product]>;
		/** Hide prices (customer-specific pricing behind sign-in). */
		hidePrices?: boolean;
		/** Eager-load the image (first row / above the fold). */
		priority?: boolean;
		class?: string;
	}

	let {
		product: p,
		variant = 'default',
		headingLevel = 3,
		showActions = true,
		actions,
		hidePrices = false,
		priority = false,
		class: className
	}: Props = $props();

	const uid = $props.id();
	const compact = $derived(variant === 'compact');
	const horizontal = $derived(variant === 'horizontal');
	const featured = $derived(variant === 'featured');
	const icon = $derived(getCategory(p.category)?.icon ?? 'package');
	const savePct = $derived(p.compareAtPrice ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0);
</script>

<Card
	as="article"
	variant="default"
	interactive
	class={cn('group', horizontal && 'sm:flex-row', featured && 'border-t-4 border-t-brand', className)}
	aria-labelledby="pc-{uid}"
>
	<!-- Media -->
	<div class={cn('relative shrink-0 border-b border-[var(--card-border)]', horizontal && 'sm:w-44 sm:border-r sm:border-b-0 lg:w-52')}>
		<ProductImage
			src={p.image}
			sprite={p.sprite}
			alt={p.imageAlt}
			{icon}
			label={p.packSize}
			aspect={horizontal ? 'square' : compact ? 'square' : '4/3'}
			loading={priority ? 'eager' : 'lazy'}
			hoverZoom
			class={horizontal ? 'sm:h-full' : ''}
		/>
		<div class="pointer-events-none absolute top-2 left-2 flex flex-col items-start gap-1">
			{#if p.sale}
				<Badge variant="sale" appearance="solid" size={compact ? 'sm' : 'md'} pill={false} icon="tag">Sale{#if savePct > 0}&nbsp;−{savePct}%{/if}</Badge>
			{/if}
			{#if p.quoteOnly}
				<Badge variant="neutral" appearance="solid" size="sm" pill={false} icon="lock">Trade only</Badge>
			{/if}
		</div>
	</div>

	<!-- Content -->
	<div class={cn('flex min-w-0 flex-1 flex-col', compact ? 'gap-2 p-3' : 'gap-2.5 p-4', featured && 'sm:p-5')}>
		<p class="flex min-w-0 flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
			{#if p.brand}<span class="font-semibold text-foreground">{p.brand}</span><span aria-hidden="true">·</span>{/if}
			<span class="truncate">{p.subcategoryName ?? p.categoryName}</span>
		</p>

		<Heading level={headingLevel} id="pc-{uid}" class={cn('leading-snug font-semibold text-foreground', compact ? 'line-clamp-2 text-sm' : featured ? 'text-lg' : 'line-clamp-2 text-base')}>
			<a href={p.href} class="focus-ring rounded-sm after:absolute after:inset-0 after:content-[''] hover:text-primary-text">{p.name}</a>
		</Heading>

		{#if !compact}
			<p class="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
				{#if p.packSize}<span><span class="sr-only">Pack size: </span>{p.packSize} / {p.unit}</span>{/if}
				<span class="font-mono text-xs leading-5">SKU {p.sku}</span>
			</p>
		{/if}

		{#if p.description && (featured || horizontal)}
			<p class="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
		{/if}

		{#if p.hazard && !compact}<HazardNotice hazard={p.hazard} />{/if}

		<div class={cn('mt-auto flex flex-col gap-2', compact ? 'pt-0.5' : 'pt-1')}>
			<PriceDisplay product={p} size={compact ? 'sm' : featured ? 'lg' : 'md'} hidden={hidePrices} showTierHint={!compact} />
			<div class="flex flex-wrap items-center gap-x-3 gap-y-1.5">
				<span class="inline-flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
					MOQ {p.moq} {pluralUnit(p.unit, p.moq)}
				</span>
				<StockStatus product={p} showDetail={!compact} />
			</div>
		</div>

		{#if actions}
			<div class="relative z-10 pt-1">{@render actions(p)}</div>
		{:else if showActions}
			<AddToCart product={p} size={compact ? 'sm' : 'md'} showQuote={featured || horizontal} stacked={compact} class="relative z-10 pt-1" />
		{/if}
	</div>
</Card>
