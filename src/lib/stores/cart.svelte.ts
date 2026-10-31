import type { CartLine, Product } from '$lib/types';
import { getProduct } from '$lib/data/products';
import { lineTotal, orderTotals, unitPriceFor, validateQuantity, type QuantityIssue } from '$lib/catalog/pricing';
import { isOrderable } from '$lib/catalog/stock';
import { readJson, writeJson } from './persist';

const KEY = 'ws-cart';

export interface CartItem {
	product: Product;
	quantity: number;
	unitPrice: number;
	lineTotal: number;
	issue?: QuantityIssue;
}

/**
 * Cart state. Stores only SKU + quantity; prices are always re-derived from the
 * catalog (so a price/tier change can't leave stale totals). Replace `getProduct`
 * with a pricing API lookup for customer-specific prices.
 */
class CartStore {
	lines = $state<CartLine[]>([]);
	loaded = $state(false);
	/** Slide-in cart drawer (rendered once in the shop layout). */
	drawerOpen = $state(false);

	items: CartItem[] = $derived(
		this.lines.flatMap((line) => {
			const product = getProduct(line.sku);
			if (!product) return [];
			return [
				{
					product,
					quantity: line.quantity,
					unitPrice: unitPriceFor(product, line.quantity),
					lineTotal: lineTotal(product, line.quantity),
					issue: validateQuantity(product, line.quantity)
				}
			];
		})
	);

	/** Number of distinct products. */
	count = $derived(this.lines.length);
	units = $derived(this.lines.reduce((n, l) => n + l.quantity, 0));
	totals = $derived(orderTotals(this.items));
	hasIssues = $derived(this.items.some((i) => i.issue));

	load() {
		if (this.loaded) return;
		const saved = readJson<CartLine[]>(KEY, []);
		this.lines = Array.isArray(saved) ? saved.filter((l) => getProduct(l.sku) && l.quantity > 0) : [];
		this.loaded = true;
	}

	#save() {
		writeJson(KEY, this.lines);
	}

	quantityOf(sku: string): number {
		return this.lines.find((l) => l.sku === sku)?.quantity ?? 0;
	}

	/** Add units; the resulting line is raised to the product's MOQ. Returns the new quantity. */
	add(product: Product, quantity = product.moq): number {
		if (!isOrderable(product)) return 0;
		const existing = this.lines.find((l) => l.sku === product.sku);
		const next = Math.max(product.moq, (existing?.quantity ?? 0) + Math.max(1, Math.floor(quantity)));
		if (existing) existing.quantity = next;
		else this.lines.push({ sku: product.sku, quantity: next });
		this.#save();
		return next;
	}

	/** Set an exact quantity (may be below MOQ — surfaced as a validation issue). */
	setQuantity(sku: string, quantity: number) {
		const line = this.lines.find((l) => l.sku === sku);
		if (!line) return;
		if (!Number.isFinite(quantity) || quantity < 1) return this.remove(sku);
		line.quantity = Math.floor(quantity);
		this.#save();
	}

	remove(sku: string) {
		this.lines = this.lines.filter((l) => l.sku !== sku);
		this.#save();
	}

	clear() {
		this.lines = [];
		this.#save();
	}

	/** Add several lines at once (reorder, bulk upload). */
	addMany(lines: CartLine[]) {
		for (const l of lines) {
			const p = getProduct(l.sku);
			if (p) this.add(p, l.quantity);
		}
	}
}

export const cart = new CartStore();
