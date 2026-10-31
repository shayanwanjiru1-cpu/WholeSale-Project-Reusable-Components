<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import type { Product } from '$lib/types';
	import { formatPrice } from '$lib/catalog/pricing';
	import { cn } from '$lib/utils/cn';

	/**
	 * Wholesale price block: unit price in the accent colour, previous price struck
	 * through when on sale, and the "from" (best tier) price when quantity breaks exist.
	 * `hidden` supports customer-specific pricing behind sign-in.
	 */
	interface Props {
		product: Pick<Product, 'price' | 'compareAtPrice' | 'currency' | 'unit' | 'tiers' | 'quoteOnly'>;
		/** Override the shown price (e.g. the tier price for the selected quantity). */
		amount?: number;
		size?: 'sm' | 'md' | 'lg';
		showTierHint?: boolean;
		showVatNote?: boolean;
		/** Hide prices until the buyer signs in. */
		hidden?: boolean;
		class?: string;
	}

	let { product, amount, size = 'md', showTierHint = true, showVatNote = false, hidden = false, class: className }: Props = $props();

	const price = $derived(amount ?? product.price);
	const best = $derived(product.tiers?.length ? Math.min(...product.tiers.map((t) => t.price)) : undefined);
	const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };
</script>

<div class={cn('flex flex-col gap-0.5', className)}>
	{#if hidden}
		<p class="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
			<Icon name="lock" class="size-4 text-muted-foreground" />Sign in to see trade prices
		</p>
	{:else if product.quoteOnly}
		<p class="inline-flex items-center gap-1.5 font-semibold text-foreground {size === 'lg' ? 'text-xl' : 'text-base'}">
			<Icon name="file-text" class="size-4 text-primary-text" />Price on request
		</p>
		<p class="text-xs text-muted-foreground">Trade accounts only — request a quote</p>
	{:else}
		<p class="flex flex-wrap items-baseline gap-x-1.5">
			<span class="sr-only">Price:</span>
			<span class={cn('font-bold tracking-tight text-primary-text tabular-nums', sizes[size])}>{formatPrice(price, product.currency)}</span>
			<span class="text-sm text-muted-foreground">/ {product.unit}</span>
			{#if product.compareAtPrice && product.compareAtPrice > price}
				<span class="text-sm text-muted-foreground line-through tabular-nums"><span class="sr-only">Was </span>{formatPrice(product.compareAtPrice, product.currency)}</span>
			{/if}
		</p>
		{#if showTierHint && best !== undefined && best < price}
			<p class="text-xs text-muted-foreground">From <span class="font-semibold text-foreground tabular-nums">{formatPrice(best, product.currency)}</span> in bulk</p>
		{/if}
		{#if showVatNote}<p class="text-xs text-muted-foreground">Excl. VAT · demo price</p>{/if}
	{/if}
</div>
