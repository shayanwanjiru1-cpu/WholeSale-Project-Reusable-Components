<script lang="ts">
	import type { Product } from '$lib/types';
	import { formatPrice, pluralUnit, tierRows } from '$lib/catalog/pricing';
	import { cn } from '$lib/utils/cn';

	/** Quantity-break pricing table. Highlights the tier that applies to `quantity`. */
	interface Props {
		product: Pick<Product, 'price' | 'tiers' | 'unit' | 'currency' | 'name'>;
		quantity?: number;
		class?: string;
	}

	let { product, quantity, class: className }: Props = $props();
	const rows = $derived(tierRows(product, pluralUnit(product.unit, 2)));
	const activeIndex = $derived(quantity === undefined ? -1 : rows.findLastIndex((r) => quantity >= r.minQty));
</script>

<div class={cn('overflow-hidden rounded-card border border-border', className)}>
	<table class="w-full text-sm">
		<caption class="sr-only">Wholesale price per {product.unit} by order quantity for {product.name}</caption>
		<thead class="bg-muted text-left text-xs tracking-wide text-muted-foreground uppercase">
			<tr>
				<th scope="col" class="px-4 py-2.5 font-semibold">Quantity</th>
				<th scope="col" class="px-4 py-2.5 text-right font-semibold">Price / {product.unit}</th>
				<th scope="col" class="px-4 py-2.5 text-right font-semibold">Saving</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-border bg-surface">
			{#each rows as row, i (row.minQty)}
				{@const active = i === activeIndex}
				<tr class={cn(active && 'bg-accent')} aria-current={active ? 'true' : undefined}>
					<th scope="row" class={cn('px-4 py-2.5 text-left font-medium', active ? 'text-accent-foreground' : 'text-foreground')}>
						{row.range}{#if active}<span class="sr-only"> (your quantity)</span>{/if}
					</th>
					<td class={cn('px-4 py-2.5 text-right font-semibold tabular-nums', active ? 'text-accent-foreground' : 'text-foreground')}>{formatPrice(row.price, product.currency)}</td>
					<td class="px-4 py-2.5 text-right text-muted-foreground tabular-nums">{row.savingPct > 0 ? `−${row.savingPct}%` : '—'}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
