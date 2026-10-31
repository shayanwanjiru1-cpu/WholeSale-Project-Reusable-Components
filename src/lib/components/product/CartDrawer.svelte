<script lang="ts">
	import { goto } from '$app/navigation';
	import Sheet from '../layout/Sheet.svelte';
	import Button from '../ui/Button.svelte';
	import EmptyState from '../feedback/EmptyState.svelte';
	import CartLineItem from './CartLineItem.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { quote } from '$lib/stores/quote.svelte';
	import { formatPrice } from '$lib/catalog/pricing';

	/** Slide-in cart: lines, quantities, subtotal and a request-quote hand-off. Open via `cart.drawerOpen`. */
	function requestQuote(close: () => void) {
		for (const i of cart.items) quote.add(i.product, i.quantity);
		close();
		goto('/quote');
	}
</script>

<Sheet bind:open={cart.drawerOpen} side="right" size="md" title="Your cart" description={cart.count ? `${cart.count} products · ${cart.units} units` : undefined}>
	{#if cart.count === 0}
		<EmptyState icon="cart" title="Your cart is empty" description="Add products from the catalog to build a wholesale order.">
			{#snippet actions()}<Button href="/#catalog" onclick={() => (cart.drawerOpen = false)} iconLeft="search">Browse products</Button>{/snippet}
		</EmptyState>
	{:else}
		<ul class="-mt-2 divide-y divide-border">
			{#each cart.items as item (item.product.sku)}
				<CartLineItem {item} onquantity={(q) => cart.setQuantity(item.product.sku, q)} onremove={() => cart.remove(item.product.sku)} />
			{/each}
		</ul>
	{/if}
	{#snippet footer(close)}
		{#if cart.count}
			<div class="flex w-full flex-col gap-3">
				<dl class="flex flex-col gap-1 text-sm">
					<div class="flex justify-between"><dt class="text-muted-foreground">Subtotal (excl. VAT)</dt><dd class="text-lg font-bold text-primary-text tabular-nums">{formatPrice(cart.totals.subtotal)}</dd></div>
					{#if cart.totals.savings > 0}<div class="flex justify-between"><dt class="text-muted-foreground">Bulk savings</dt><dd class="font-medium text-success-strong tabular-nums">−{formatPrice(cart.totals.savings)}</dd></div>{/if}
					{#if cart.totals.belowMinimum}<p class="text-xs text-warning-strong">Add {formatPrice(cart.totals.amountToMinimum)} more to reach the minimum order value.</p>{/if}
				</dl>
				<Button iconLeft="file-text" fullWidth onclick={() => requestQuote(close)}>Request quote</Button>
				<Button href="/cart" variant="outline" fullWidth onclick={close}>View full cart</Button>
				<p class="text-center text-xs text-muted-foreground">Demo store — no payment is taken.</p>
			</div>
		{/if}
	{/snippet}
</Sheet>
