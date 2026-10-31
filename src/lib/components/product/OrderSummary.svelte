<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../ui/Icon.svelte';
	import ProgressBar from '../feedback/ProgressBar.svelte';
	import type { OrderTotals } from '$lib/catalog/pricing';
	import { ORDER_POLICY, formatPrice } from '$lib/catalog/pricing';
	import { cn } from '$lib/utils/cn';

	/** Order totals panel used by Cart and Checkout. */
	interface Props {
		totals: OrderTotals;
		itemCount: number;
		title?: string;
		/** Line items or extra info above the totals. */
		children?: Snippet;
		/** CTA area under the totals. */
		actions?: Snippet;
		class?: string;
	}

	let { totals, itemCount, title = 'Order summary', children, actions, class: className }: Props = $props();
	const row = 'flex items-baseline justify-between gap-4';
</script>

<section aria-labelledby="summary-title" class={cn('rounded-card border border-border bg-surface p-5 shadow-card sm:p-6', className)}>
	<h2 id="summary-title" class="text-lg font-semibold">{title}</h2>
	{@render children?.()}
	<dl class="mt-4 flex flex-col gap-2.5 text-sm">
		<div class={row}><dt class="text-muted-foreground">Subtotal ({itemCount} {itemCount === 1 ? 'product' : 'products'})</dt><dd class="font-medium tabular-nums">{formatPrice(totals.subtotal)}</dd></div>
		{#if totals.savings > 0}
			<div class={row}><dt class="text-muted-foreground">Bulk savings</dt><dd class="font-medium text-success-strong tabular-nums">−{formatPrice(totals.savings)}</dd></div>
		{/if}
		<div class={row}><dt class="text-muted-foreground">Delivery</dt><dd class="font-medium tabular-nums">{totals.delivery === 0 && totals.subtotal > 0 ? 'Free' : formatPrice(totals.delivery)}</dd></div>
		<div class={row}><dt class="text-muted-foreground">VAT ({Math.round(ORDER_POLICY.vatRate * 100)}%)</dt><dd class="font-medium tabular-nums">{formatPrice(totals.vat)}</dd></div>
		<div class={cn(row, 'mt-1 border-t border-border pt-3')}><dt class="text-base font-semibold">Total</dt><dd class="text-xl font-bold text-foreground tabular-nums">{formatPrice(totals.total)}</dd></div>
	</dl>

	{#if totals.belowMinimum}
		<p class="mt-4 flex gap-2 rounded-md border border-warning/40 bg-warning-soft p-3 text-sm text-warning-strong" role="status">
			<Icon name="alert-triangle" class="mt-0.5 size-4 shrink-0" />
			<span>Add {formatPrice(totals.amountToMinimum)} more to reach the {formatPrice(ORDER_POLICY.minimumOrderValue)} minimum order.</span>
		</p>
	{:else if totals.subtotal > 0 && totals.amountToFreeDelivery > 0}
		<div class="mt-4 flex flex-col gap-2">
			<p class="text-xs text-muted-foreground"><Icon name="truck" class="mr-1 inline size-3.5" />{formatPrice(totals.amountToFreeDelivery)} away from free delivery</p>
			<ProgressBar value={totals.subtotal} max={ORDER_POLICY.freeDeliveryThreshold} label="Progress to free delivery" size="sm" />
		</div>
	{/if}

	{#if actions}<div class="mt-5 flex flex-col gap-2">{@render actions()}</div>{/if}
	<p class="mt-4 text-xs text-muted-foreground">Demo prices, excluding VAT on product lines. Not real market prices.</p>
</section>
