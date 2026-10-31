<script lang="ts">
	import StatusBadge from '../ui/StatusBadge.svelte';
	import type { Product } from '$lib/types';
	import { STOCK_META, availabilityDetail } from '$lib/catalog/stock';
	import { cn } from '$lib/utils/cn';

	/** Inventory state: badge (icon + text, never colour alone) plus lead-time detail. */
	interface Props {
		product: Pick<Product, 'stockStatus' | 'stockQty' | 'leadTimeDays' | 'unit'>;
		showDetail?: boolean;
		size?: 'sm' | 'md';
		layout?: 'inline' | 'stacked';
		class?: string;
	}

	let { product, showDetail = true, size = 'sm', layout = 'inline', class: className }: Props = $props();
	const meta = $derived(STOCK_META[product.stockStatus]);
	const detail = $derived(showDetail ? availabilityDetail(product) : undefined);
</script>

<div class={cn('flex gap-x-2 gap-y-1', layout === 'inline' ? 'flex-wrap items-center' : 'flex-col items-start', className)}>
	<StatusBadge status={meta.tone} label={meta.label} {size} />
	{#if detail}<span class="text-xs text-muted-foreground">{detail}</span>{/if}
</div>
