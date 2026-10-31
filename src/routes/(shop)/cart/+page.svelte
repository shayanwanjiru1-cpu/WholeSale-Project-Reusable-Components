<script lang="ts">
	import { Alert, Button, CartLineItem, Container, EmptyState, OrderSummary, PageHeader, ProductGrid, Skeleton } from '$lib';
	import { cart } from '$lib/stores/cart.svelte';
	import { quote } from '$lib/stores/quote.svelte';
	import { featuredProducts } from '$lib/data/products';
	import { site } from '$lib/data/site';

	/** Large orders: move the cart's lines into a quote request. */
	function copyToQuote() {
		for (const i of cart.items) quote.add(i.product, i.quantity);
	}

	const canCheckout = $derived(cart.count > 0 && !cart.hasIssues && !cart.totals.belowMinimum);
</script>

<svelte:head>
	<title>Cart | {site.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Container size="wide" class="pb-16">
	<PageHeader title="Cart" breadcrumbs={[{ label: 'Home', href: '/', icon: 'home' }, { label: 'Cart' }]} description={cart.count ? `${cart.count} products · ${cart.units} units` : undefined} />

	{#if !cart.loaded}
		<div class="grid gap-8 lg:grid-cols-[1fr_24rem]" aria-busy="true" aria-label="Loading cart">
			<div class="flex flex-col gap-4"><Skeleton class="h-28 w-full" /><Skeleton class="h-28 w-full" /></div>
			<Skeleton class="h-72 w-full" />
		</div>
	{:else if cart.count === 0}
		<EmptyState icon="cart" title="Your cart is empty" description="Add products from the catalog, reorder from your history or upload a bulk order CSV." size="lg">
			{#snippet actions()}
				<Button href="/shop" iconLeft="search">Browse products</Button>
				<Button href="/account/orders#reorder" variant="outline" iconLeft="repeat">Quick reorder</Button>
				<Button href="/bulk-order" variant="outline" iconLeft="upload">Bulk upload</Button>
			{/snippet}
		</EmptyState>
		<section class="mt-16" aria-labelledby="suggested-title">
			<h2 id="suggested-title" class="text-h3 mb-6">Popular wholesale lines</h2>
			<ProductGrid products={featuredProducts.slice(0, 4)} columns={4} />
		</section>
	{:else}
		<div class="grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
			<section aria-labelledby="lines-title">
				<div class="flex items-center justify-between border-b border-border pb-3">
					<h2 id="lines-title" class="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Products</h2>
					<button type="button" class="focus-ring rounded text-sm text-muted-foreground hover:text-danger-strong" onclick={() => cart.clear()}>Clear cart</button>
				</div>
				{#if cart.hasIssues}
					<Alert tone="warning" role="alert" title="Some quantities are below the minimum order" class="mt-4">Adjust the highlighted lines to at least their MOQ before checkout.</Alert>
				{/if}
				<ul class="divide-y divide-border">
					{#each cart.items as item (item.product.sku)}
						<CartLineItem {item} onquantity={(q) => cart.setQuantity(item.product.sku, q)} onremove={() => cart.remove(item.product.sku)} />
					{/each}
				</ul>
				<div class="mt-4 flex flex-wrap gap-3 border-t border-border pt-4">
					<Button href="/shop" variant="ghost" iconLeft="arrow-left">Continue shopping</Button>
					<Button href="/bulk-order" variant="ghost" iconLeft="upload">Add from CSV</Button>
				</div>
			</section>

			<OrderSummary totals={cart.totals} itemCount={cart.count} class="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
				{#snippet actions()}
					<Button href={canCheckout ? '/checkout' : undefined} disabled={!canCheckout} size="lg" iconRight="arrow-right" fullWidth>Proceed to checkout</Button>
					<Button href="/quote" variant="outline" iconLeft="file-text" fullWidth onclick={copyToQuote}>Request a quote instead</Button>
				{/snippet}
			</OrderSummary>
		</div>
	{/if}
</Container>
