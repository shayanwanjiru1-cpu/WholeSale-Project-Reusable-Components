<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import ProductImage from '../media/ProductImage.svelte';
	import QuantityInput from '../forms/QuantityInput.svelte';
	import type { CartItem } from '$lib/stores/cart.svelte';
	import { formatPrice, pluralUnit, quantityMessage } from '$lib/catalog/pricing';
	import { getCategory } from '$lib/data/categories';
	import { cn } from '$lib/utils/cn';

	/** One cart row: product, quantity (with MOQ validation), unit price, line total, remove. */
	interface Props {
		item: CartItem;
		onquantity: (quantity: number) => void;
		onremove: () => void;
		compact?: boolean;
		class?: string;
	}

	let { item, onquantity, onremove, compact = false, class: className }: Props = $props();
	const p = $derived(item.product);
	const discounted = $derived(item.unitPrice < p.price);
	const qty = $derived(item.quantity);
</script>

<li class={cn('grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-3 py-5 sm:grid-cols-[6rem_1fr_auto]', className)}>
	<a href={p.href} class="focus-ring row-span-2 self-start rounded-md sm:row-span-1" tabindex="-1" aria-hidden="true">
		<ProductImage src={p.image} sprite={p.sprite} alt="" icon={getCategory(p.category)?.icon} aspect="square" class="rounded-md border border-border" />
	</a>
	<div class="min-w-0">
		<p class="text-xs text-muted-foreground">{p.brand ?? p.categoryName} · <span class="font-mono">{p.sku}</span></p>
		<h3 class="mt-0.5 text-sm font-semibold text-foreground sm:text-base"><a href={p.href} class="focus-ring rounded-sm hover:text-primary-text">{p.name}</a></h3>
		<p class="mt-0.5 text-sm text-muted-foreground">{p.packSize} per {p.unit}</p>
		<p class="mt-1 text-sm">
			<span class="font-semibold text-foreground tabular-nums">{formatPrice(item.unitPrice)}</span>
			<span class="text-muted-foreground">/ {p.unit}</span>
			{#if discounted}<span class="ml-1 rounded bg-success-soft px-1.5 py-0.5 text-xs font-medium text-success-strong">Bulk price</span>{/if}
		</p>
		{#if !compact}
			<div class="mt-3 flex flex-wrap items-start gap-3">
				<QuantityInput
					value={qty}
					size="sm"
					label="Quantity for {p.name}"
					unit={pluralUnit(p.unit, qty)}
					error={item.issue ? quantityMessage(item.issue, p.unit) : undefined}
					onchange={onquantity}
				/>
				<button type="button" class="focus-ring inline-flex h-8 items-center gap-1.5 rounded px-2 text-sm text-muted-foreground hover:bg-muted hover:text-danger-strong" onclick={onremove}>
					<Icon name="trash" class="size-4" />Remove<span class="sr-only"> {p.name}</span>
				</button>
			</div>
			<p class="mt-1.5 text-xs text-muted-foreground">MOQ {p.moq} {pluralUnit(p.unit, p.moq)}{#if p.casePack} · case pack {p.casePack}{/if}</p>
		{/if}
	</div>
	<p class="col-start-2 text-left text-base font-bold text-foreground tabular-nums sm:col-start-3 sm:text-right">
		<span class="sr-only">Line total: </span>{formatPrice(item.lineTotal)}
		{#if compact}<span class="block text-xs font-normal text-muted-foreground">Qty {qty}</span>{/if}
	</p>
</li>
