<script lang="ts">
	import Button from '../ui/Button.svelte';
	import Icon from '../ui/Icon.svelte';
	import QuantityInput from '../forms/QuantityInput.svelte';
	import type { Product } from '$lib/types';
	import { cart } from '$lib/stores/cart.svelte';
	import { quote } from '$lib/stores/quote.svelte';
	import { toasts } from '$lib/stores/toast.svelte';
	import { formatPrice, lineTotal, nextTier, pluralUnit, quantityMessage, unitPriceFor, validateQuantity } from '$lib/catalog/pricing';
	import { isOrderable } from '$lib/catalog/stock';
	import { cn } from '$lib/utils/cn';

	/**
	 * Purchase controls for one product. Connects the pricing rules (MOQ, tiers) to the
	 * cart and quote stores.
	 *  - `compact`: one "Add to cart" button that adds the MOQ (product cards)
	 *  - `full`: quantity stepper, live tier price + line total, next-break nudge
	 * Out-of-stock and quote-only products fall back to "Request quote".
	 */
	interface Props {
		product: Product;
		variant?: 'compact' | 'full';
		/** Show the secondary "Request quote" action alongside Add to cart. */
		showQuote?: boolean;
		size?: 'sm' | 'md' | 'lg';
		stacked?: boolean;
		/** Selected quantity (full variant). Bind to sync e.g. a TierPriceTable. */
		quantity?: number;
		class?: string;
	}

	let { product, variant = 'compact', showQuote = false, size = 'md', stacked = false, quantity = $bindable(0), class: className }: Props = $props();

	// Start at the MOQ whenever the product changes.
	let lastSku = '';
	$effect.pre(() => {
		if (product.sku !== lastSku) {
			lastSku = product.sku;
			quantity = product.moq;
		}
	});
	let touched = $state(false);

	const orderable = $derived(isOrderable(product));
	const issue = $derived(validateQuantity(product, quantity));
	const error = $derived(touched && issue ? quantityMessage(issue, product.unit) : undefined);
	const unitPrice = $derived(unitPriceFor(product, quantity));
	const total = $derived(lineTotal(product, quantity));
	const nudge = $derived(nextTier(product, quantity));
	const inCart = $derived(cart.quantityOf(product.sku));
	const inQuote = $derived(quote.has(product.sku));

	function addToCart(qty: number) {
		touched = true;
		if (validateQuantity(product, qty)) return;
		const now = cart.add(product, qty);
		toasts.show({
			title: 'Added to cart',
			description: `${qty} ${pluralUnit(product.unit, qty)} of ${product.name}. ${now} in cart.`,
			action: { label: 'View cart', href: '/cart' }
		});
	}

	function requestQuote() {
		quote.add(product, Math.max(quantity, product.moq));
		toasts.show({ title: 'Added to quote request', description: product.name, tone: 'info', action: { label: 'View quote', href: '/quote' } });
	}
</script>

{#if variant === 'compact'}
	<div class={cn('flex gap-2', stacked ? 'flex-col' : 'flex-wrap', className)}>
		{#if orderable}
			<Button {size} iconLeft="cart" class="flex-1" onclick={() => addToCart(Math.max(product.moq, 1))}>
				{inCart ? 'Add more' : 'Add to cart'}<span class="sr-only">: {product.name}, minimum {product.moq} {pluralUnit(product.unit, product.moq)}</span>
			</Button>
			{#if showQuote}
				<Button {size} variant="outline" iconLeft="file-text" class={stacked ? '' : 'flex-1'} onclick={requestQuote}>
					{inQuote ? 'In quote' : 'Quote'}<span class="sr-only">: request a quote for {product.name}</span>
				</Button>
			{/if}
		{:else}
			<Button {size} variant="secondary" iconLeft="file-text" class="flex-1" onclick={requestQuote}>
				{inQuote ? 'Added to quote' : 'Request quote'}<span class="sr-only">: {product.name}</span>
			</Button>
		{/if}
	</div>
{:else}
	<div class={cn('flex flex-col gap-4', className)}>
		{#if orderable}
			<div class="flex flex-wrap items-start gap-x-6 gap-y-3">
				<div class="flex flex-col gap-1.5">
					<span class="text-sm font-medium text-foreground" aria-hidden="true">Quantity ({pluralUnit(product.unit, 2)})</span>
					<QuantityInput
						bind:value={quantity}
						label="Quantity for {product.name}"
						unit={pluralUnit(product.unit, quantity)}
						{error}
						onchange={() => (touched = true)}
					/>
				</div>
				<div class="flex flex-col gap-0.5" aria-live="polite">
					<span class="text-sm text-muted-foreground">
						{formatPrice(unitPrice)} × {quantity}
					</span>
					<span class="text-2xl font-bold tracking-tight text-foreground tabular-nums">{formatPrice(total)}</span>
					<span class="text-xs text-muted-foreground">Excl. VAT</span>
				</div>
			</div>
			{#if nudge && !issue}
				<p class="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
					<Icon name="tag" class="size-4" />
					Add {nudge.unitsNeeded} more to pay {formatPrice(nudge.price)} per {product.unit} (save {formatPrice(nudge.savingPerUnit)} each).
				</p>
			{/if}
			<div class="flex flex-col gap-2 sm:flex-row">
				<Button size="lg" iconLeft="cart" class="sm:flex-1" onclick={() => addToCart(quantity)}>Add to cart</Button>
				<Button size="lg" variant="secondary" iconLeft="file-text" class="sm:flex-1" onclick={requestQuote}>{inQuote ? 'Update quote' : 'Request quote'}</Button>
			</div>
			{#if inCart}
				<p class="flex items-center gap-1.5 text-sm text-muted-foreground"><Icon name="check-circle" class="size-4 text-success" />{inCart} {pluralUnit(product.unit, inCart)} already in your <a href="/cart" class="font-medium text-primary-text underline-offset-2 hover:underline">cart</a>.</p>
			{/if}
		{:else}
			<p class="text-sm text-muted-foreground">
				{product.quoteOnly ? 'This product is supplied to verified trade accounts on request.' : 'Currently unavailable to order online — request a quote and we’ll confirm availability and lead time.'}
			</p>
			<Button size="lg" iconLeft="file-text" onclick={requestQuote}>{inQuote ? 'Added to quote' : 'Request quote'}</Button>
		{/if}
	</div>
{/if}
