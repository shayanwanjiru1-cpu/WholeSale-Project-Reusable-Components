import type { Product } from '$lib/types';
import { getProduct } from '$lib/data/products';
import { isOrderable } from './stock';

/** CSV / pasted bulk-order parsing. Accepts "SKU,quantity" lines (comma, tab or semicolon). */

export type BulkRowStatus = 'ok' | 'raised-to-moq' | 'unknown-sku' | 'unavailable' | 'invalid-quantity';

export interface BulkRow {
	line: number;
	raw: string;
	sku: string;
	requested: number;
	quantity: number;
	product?: Product;
	status: BulkRowStatus;
	message: string;
}

export const BULK_TEMPLATE = 'sku,quantity\nWS-FG-1001,10\nWS-FG-1003,4\nWS-CH-3001,6\nWS-HW-7001,2\n';

export function parseBulkOrder(text: string): BulkRow[] {
	const rows: BulkRow[] = [];
	text.split(/\r?\n/).forEach((raw, i) => {
		const line = raw.trim();
		if (!line || line.startsWith('#')) return;
		const [skuRaw = '', qtyRaw = ''] = line.split(/[,;\t]/).map((c) => c.trim().replace(/^"|"$/g, ''));
		if (i === 0 && /sku/i.test(skuRaw) && !/\d/.test(qtyRaw)) return; // header row
		const sku = skuRaw.toUpperCase();
		const requested = Number(qtyRaw);
		const product = getProduct(sku);
		const base = { line: i + 1, raw, sku, requested, quantity: 0, product };
		if (!product) return rows.push({ ...base, status: 'unknown-sku', message: 'SKU not found' });
		if (!Number.isInteger(requested) || requested < 1) return rows.push({ ...base, status: 'invalid-quantity', message: 'Quantity must be a whole number' });
		if (!isOrderable(product)) return rows.push({ ...base, status: 'unavailable', message: product.quoteOnly ? 'Quote only' : 'Out of stock' });
		if (requested < product.moq) return rows.push({ ...base, quantity: product.moq, status: 'raised-to-moq', message: `Raised to MOQ ${product.moq}` });
		rows.push({ ...base, quantity: requested, status: 'ok', message: 'Ready' });
	});
	return rows;
}
