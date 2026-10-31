import type { Product, StockStatus, Tone } from '$lib/types';

/** Display metadata for inventory states (label + tone; StatusBadge adds the icon). */
export const STOCK_META: Record<StockStatus, { label: string; tone: Tone; orderable: boolean }> = {
	'in-stock': { label: 'In stock', tone: 'success', orderable: true },
	'low-stock': { label: 'Low stock', tone: 'warning', orderable: true },
	backorder: { label: 'Backorder', tone: 'info', orderable: true },
	'out-of-stock': { label: 'Out of stock', tone: 'neutral', orderable: false }
};

export const STOCK_ORDER: StockStatus[] = ['in-stock', 'low-stock', 'backorder', 'out-of-stock'];

/** Can this product go in the cart? (Quote-only and out-of-stock items can't.) */
export function isOrderable(product: Pick<Product, 'stockStatus' | 'quoteOnly'>): boolean {
	return !product.quoteOnly && STOCK_META[product.stockStatus].orderable;
}

/** Secondary availability line: "Ships in 14 days", "Only 12 left". */
export function availabilityDetail(product: Pick<Product, 'stockStatus' | 'stockQty' | 'leadTimeDays' | 'unit'>): string | undefined {
	switch (product.stockStatus) {
		case 'low-stock':
			return product.stockQty !== undefined ? `Only ${product.stockQty} left` : 'Limited quantity';
		case 'backorder':
			return product.leadTimeDays ? `Ships in ~${product.leadTimeDays} days` : 'Ships when restocked';
		case 'out-of-stock':
			return product.leadTimeDays ? `Restock expected in ~${product.leadTimeDays} days` : 'Request a quote for availability';
		default:
			return product.leadTimeDays ? `Dispatch in ${product.leadTimeDays} day${product.leadTimeDays === 1 ? '' : 's'}` : 'Ready to dispatch';
	}
}
