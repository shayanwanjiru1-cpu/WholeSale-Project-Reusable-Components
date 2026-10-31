<script lang="ts">
	import Button from '../ui/Button.svelte';
	import ProductImage from '../media/ProductImage.svelte';
	import QuantityInput from '../forms/QuantityInput.svelte';
	import Checkbox from '../forms/Checkbox.svelte';
	import type { Product } from '$lib/types';
	import { cart } from '$lib/stores/cart.svelte';
	import { toasts } from '$lib/stores/toast.svelte';
	import { formatPrice, lineTotal, pluralUnit } from '$lib/catalog/pricing';
	import { isOrderable } from '$lib/catalog/stock';
	import { getCategory } from '$lib/data/categories';

	/**
	 * Quick Reorder: pick previously ordered products, adjust quantities, add them all
	 * to the cart in one action. Takes any list of { product, quantity } (order history,
	 * saved lists, a "regulars" API).
	 */
	interface Props {
		items: { product: Product; lastQuantity: number; times?: number }[];
		title?: string;
		headingLevel?: 2 | 3;
	}

	let { items, title = 'Quick reorder', headingLevel = 2 }: Props = $props();

	const initRows = (list: Props['items']) =>
		list.map((i) => ({ sku: i.product.sku, quantity: Math.max(i.lastQuantity, i.product.moq), selected: isOrderable(i.product) }));
	// Editable copy of the items (initialised for SSR, re-initialised if the list changes).
	// svelte-ignore state_referenced_locally
	let rows = $state(initRows(items));
	let source = items;
	$effect.pre(() => {
		if (items !== source) {
			source = items;
			rows = initRows(items);
		}
	});

	const selected = $derived(rows.filter((r) => r.selected));
	const total = $derived(
		selected.reduce((n, r) => {
			const item = items.find((i) => i.product.sku === r.sku);
			return item ? n + lineTotal(item.product, r.quantity) : n;
		}, 0)
	);

	function addSelected() {
		cart.addMany(selected.map((r) => ({ sku: r.sku, quantity: r.quantity })));
		toasts.show({ title: `Added ${selected.length} products to cart`, description: `Reorder total ${formatPrice(total)} excl. VAT`, action: { label: 'View cart', href: '/cart' } });
	}
</script>

<section aria-labelledby="reorder-title" id="reorder" class="rounded-card border border-border bg-surface shadow-card">
	<div class="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4 sm:p-5">
		<div>
			<svelte:element this={`h${headingLevel}`} id="reorder-title" class="text-lg font-semibold">{title}</svelte:element>
			<p class="text-sm text-muted-foreground">Your regular products, at last ordered quantities.</p>
		</div>
		<Button iconLeft="repeat" disabled={selected.length === 0} onclick={addSelected}>
			Add {selected.length} to cart · {formatPrice(total)}
		</Button>
	</div>
	<ul class="divide-y divide-border">
		{#each items as item, i (item.product.sku)}
			{@const p = item.product}
			{@const orderable = isOrderable(p)}
			<li class="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap sm:px-5">
				<Checkbox label="Select {p.name}" class="[&>span]:sr-only" disabled={!orderable} bind:checked={rows[i].selected} />
				<ProductImage src={p.image} sprite={p.sprite} alt="" icon={getCategory(p.category)?.icon} aspect="square" class="size-14 shrink-0 rounded-md border border-border" />
				<div class="min-w-0 flex-1">
					<a href={p.href} class="focus-ring block truncate rounded-sm text-sm font-semibold hover:text-primary-text">{p.name}</a>
					<p class="text-xs text-muted-foreground">{p.packSize} · <span class="font-mono">{p.sku}</span>{#if item.times} · ordered {item.times}×{/if}</p>
					{#if !orderable}<p class="text-xs font-medium text-warning-strong">Currently unavailable</p>{/if}
				</div>
				<QuantityInput bind:value={rows[i].quantity} size="sm" label="Reorder quantity for {p.name}" unit={pluralUnit(p.unit, rows[i].quantity)} disabled={!orderable} error={rows[i].quantity < p.moq ? `MOQ ${p.moq}` : undefined} />
				<p class="w-24 text-right text-sm font-semibold tabular-nums">{formatPrice(lineTotal(p, rows[i].quantity))}</p>
			</li>
		{/each}
	</ul>
</section>
