import type { ActiveFilter, FacetOption, Facets, FilterState, Product, SortKey, StockStatus } from '$lib/types';
import { STOCK_META, STOCK_ORDER } from './stock';
import { formatPrice } from './pricing';
import { searchProducts } from './search';

/** Faceted filtering + sorting. Pure functions over Product[]. */

export function emptyFilters(): FilterState {
	return {
		categories: [],
		subcategories: [],
		brands: [],
		units: [],
		packSizes: [],
		stock: [],
		price: {},
		maxMoq: undefined,
		saleOnly: false
	};
}

/** MOQ thresholds offered in the filter UI. */
export const MOQ_OPTIONS = [1, 2, 5, 10];

const inList = (list: string[], value: string | undefined) => list.length === 0 || (value !== undefined && list.includes(value));

/** Predicate for one product. `skip` ignores one facet (used to compute that facet's counts). */
function matches(p: Product, f: FilterState, skip?: keyof FilterState): boolean {
	if (skip !== 'categories' && !inList(f.categories, p.category)) return false;
	if (skip !== 'subcategories' && !inList(f.subcategories, p.subcategory)) return false;
	if (skip !== 'brands' && !inList(f.brands, p.brand)) return false;
	if (skip !== 'units' && !inList(f.units, p.unit)) return false;
	if (skip !== 'packSizes' && !inList(f.packSizes, p.packSize)) return false;
	if (skip !== 'stock' && !inList(f.stock, p.stockStatus)) return false;
	if (skip !== 'price') {
		if (f.price.min !== undefined && p.price < f.price.min) return false;
		if (f.price.max !== undefined && p.price > f.price.max) return false;
	}
	if (skip !== 'maxMoq' && f.maxMoq !== undefined && p.moq > f.maxMoq) return false;
	if (skip !== 'saleOnly' && f.saleOnly && !p.sale) return false;
	return true;
}

export function applyFilters(products: Product[], filters: FilterState): Product[] {
	return products.filter((p) => matches(p, filters));
}

function countBy(products: Product[], key: (p: Product) => string | undefined, label: (v: string) => string = (v) => v): FacetOption[] {
	const counts = new Map<string, number>();
	for (const p of products) {
		const v = key(p);
		if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
	}
	return [...counts.entries()].map(([value, count]) => ({ value, label: label(value), count }));
}

/**
 * Facet options with counts. Each facet's counts respect every *other* active filter,
 * so selecting a brand doesn't make the other brands' counts drop to zero.
 */
export function computeFacets(products: Product[], filters: FilterState, labels: { category: (slug: string) => string; subcategory: (slug: string) => string }): Facets {
	const without = (k: keyof FilterState) => products.filter((p) => matches(p, filters, k));
	const prices = products.map((p) => p.price);
	const byLabel = (a: FacetOption, b: FacetOption) => a.label.localeCompare(b.label);
	return {
		categories: countBy(without('categories'), (p) => p.category, labels.category),
		subcategories: countBy(without('subcategories'), (p) => p.subcategory, labels.subcategory).sort(byLabel),
		brands: countBy(without('brands'), (p) => p.brand).sort(byLabel),
		units: countBy(without('units'), (p) => p.unit).sort(byLabel),
		packSizes: countBy(without('packSizes'), (p) => p.packSize).sort((a, b) => b.count - a.count || byLabel(a, b)),
		stock: countBy(without('stock'), (p) => p.stockStatus, (v) => STOCK_META[v as StockStatus].label).sort(
			(a, b) => STOCK_ORDER.indexOf(a.value as StockStatus) - STOCK_ORDER.indexOf(b.value as StockStatus)
		),
		priceBounds: { min: Math.min(...prices, 0), max: Math.max(...prices, 0) }
	};
}

export function countActiveFilters(f: FilterState): number {
	return (
		f.categories.length +
		f.subcategories.length +
		f.brands.length +
		f.units.length +
		f.packSizes.length +
		f.stock.length +
		(f.price.min !== undefined || f.price.max !== undefined ? 1 : 0) +
		(f.maxMoq !== undefined ? 1 : 0) +
		(f.saleOnly ? 1 : 0)
	);
}

/** Chips describing each active filter, for "remove one" UI. */
export function activeFilterChips(f: FilterState, labels: { category: (s: string) => string; subcategory: (s: string) => string }): ActiveFilter[] {
	const chips: ActiveFilter[] = [];
	for (const v of f.categories) chips.push({ key: 'categories', value: v, label: labels.category(v) });
	for (const v of f.subcategories) chips.push({ key: 'subcategories', value: v, label: labels.subcategory(v) });
	for (const v of f.brands) chips.push({ key: 'brands', value: v, label: v });
	for (const v of f.units) chips.push({ key: 'units', value: v, label: `Unit: ${v}` });
	for (const v of f.packSizes) chips.push({ key: 'packSizes', value: v, label: `Pack: ${v}` });
	for (const v of f.stock) chips.push({ key: 'stock', value: v, label: STOCK_META[v].label });
	if (f.price.min !== undefined || f.price.max !== undefined) {
		const min = f.price.min !== undefined ? formatPrice(f.price.min) : 'Any';
		const max = f.price.max !== undefined ? formatPrice(f.price.max) : 'Any';
		chips.push({ key: 'price', label: `Price: ${min} – ${max}` });
	}
	if (f.maxMoq !== undefined) chips.push({ key: 'maxMoq', label: `MOQ ≤ ${f.maxMoq}` });
	if (f.saleOnly) chips.push({ key: 'saleOnly', label: 'On sale' });
	return chips;
}

/** Return a copy of `f` with one chip removed. */
export function removeFilter(f: FilterState, chip: ActiveFilter): FilterState {
	const next: FilterState = { ...f, price: { ...f.price } };
	switch (chip.key) {
		case 'price':
			next.price = {};
			break;
		case 'maxMoq':
			next.maxMoq = undefined;
			break;
		case 'saleOnly':
			next.saleOnly = false;
			break;
		default: {
			const key = chip.key as 'categories' | 'subcategories' | 'brands' | 'units' | 'packSizes' | 'stock';
			(next[key] as string[]) = (f[key] as string[]).filter((v) => v !== chip.value);
		}
	}
	return next;
}

/* ---------- Sorting ---------- */

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
	{ value: 'relevance', label: 'Relevance' },
	{ value: 'featured', label: 'Featured' },
	{ value: 'popular', label: 'Most popular' },
	{ value: 'newest', label: 'Newest' },
	{ value: 'price-asc', label: 'Price: low to high' },
	{ value: 'price-desc', label: 'Price: high to low' },
	{ value: 'name-asc', label: 'Name: A to Z' },
	{ value: 'name-desc', label: 'Name: Z to A' }
];

export function isSortKey(v: string | null): v is SortKey {
	return SORT_OPTIONS.some((o) => o.value === v);
}

const byName = (a: Product, b: Product) => a.name.localeCompare(b.name);

export function sortProducts(products: Product[], sort: SortKey): Product[] {
	const list = [...products];
	switch (sort) {
		case 'price-asc':
			return list.sort((a, b) => a.price - b.price || byName(a, b));
		case 'price-desc':
			return list.sort((a, b) => b.price - a.price || byName(a, b));
		case 'name-asc':
			return list.sort(byName);
		case 'name-desc':
			return list.sort((a, b) => byName(b, a));
		case 'newest':
			return list.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
		case 'popular':
			return list.sort((a, b) => b.popularity - a.popularity);
		case 'featured':
			return list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.popularity - a.popularity);
		default:
			return list; // relevance: keep incoming (search-ranked) order
	}
}

/**
 * The full catalog query: search → filter → sort. One function so listing pages,
 * the quick search and a future API adapter share the same semantics.
 */
export function queryCatalog(products: Product[], opts: { query?: string; filters: FilterState; sort: SortKey }): Product[] {
	const searched = opts.query?.trim() ? searchProducts(products, opts.query).map((h) => h.product) : products;
	const filtered = applyFilters(searched, opts.filters);
	// Without a query, "relevance" means featured-then-popular.
	const sort = opts.sort === 'relevance' && !opts.query?.trim() ? 'featured' : opts.sort;
	return sortProducts(filtered, sort);
}
