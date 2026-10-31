import type { Product, QuoteLine } from '$lib/types';
import { getProduct } from '$lib/data/products';
import { readJson, writeJson } from './persist';

const KEY = 'ws-quote';

/** Products collected for a quote request (large, custom or quote-only items). */
class QuoteStore {
	lines = $state<QuoteLine[]>([]);
	loaded = $state(false);

	items = $derived(
		this.lines.flatMap((l) => {
			const product = getProduct(l.sku);
			return product ? [{ ...l, product }] : [];
		})
	);
	count = $derived(this.lines.length);

	load() {
		if (this.loaded) return;
		const saved = readJson<QuoteLine[]>(KEY, []);
		this.lines = Array.isArray(saved) ? saved.filter((l) => getProduct(l.sku)) : [];
		this.loaded = true;
	}

	#save() {
		writeJson(KEY, this.lines);
	}

	has(sku: string) {
		return this.lines.some((l) => l.sku === sku);
	}

	add(product: Product, quantity = Math.max(product.moq, 10)) {
		const existing = this.lines.find((l) => l.sku === product.sku);
		if (existing) existing.quantity = Math.max(existing.quantity, quantity);
		else this.lines.push({ sku: product.sku, quantity });
		this.#save();
	}

	update(sku: string, patch: Partial<Omit<QuoteLine, 'sku'>>) {
		const line = this.lines.find((l) => l.sku === sku);
		if (!line) return;
		Object.assign(line, patch);
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
}

export const quote = new QuoteStore();
