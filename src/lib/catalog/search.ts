import type { Product } from '$lib/types';

/**
 * Client-side product search. Matches name, brand, category, subcategory, tags,
 * pack size and SKU (including partial SKUs like "1003" or "fg-10"), tolerates common
 * misspellings ("detergant", "flor", "battries") and expands a few buyer synonyms.
 *
 * Swap `searchProducts` for a call to a search API later; callers only rely on the
 * returned `{ product, score }[]` ordering.
 */

export interface SearchHit {
	product: Product;
	score: number;
}

/** Buyer language → catalog language. Applied to query tokens before matching. */
const SYNONYMS: Record<string, string[]> = {
	soda: ['cola', 'fizzy'],
	pop: ['cola', 'fizzy'],
	trash: ['garbage', 'bin'],
	rubbish: ['garbage', 'bin'],
	cookies: ['biscuits'],
	chips: ['crisps'],
	candy: ['sweets'],
	nappies: ['diapers'],
	tissue: ['tissue', 'toilet'],
	detergent: ['detergent', 'laundry'],
	washing: ['laundry', 'dishwashing'],
	cleaner: ['cleaner', 'disinfectant'],
	fertilizer: ['fertiliser'],
	aluminum: ['aluminium'],
	ketchup: ['tomato'],
	oil: ['oil'],
	pen: ['pens', 'ballpoint'],
	notebook: ['exercise', 'notebooks'],
	cable: ['extension', 'cable'],
	cord: ['extension', 'cord'],
	bulb: ['bulbs', 'led'],
	gloves: ['gloves']
};

/** Common misspellings of short words (too short for safe fuzzy matching). */
const MISSPELLINGS: Record<string, string> = {
	flor: 'flour',
	flower: 'flour',
	suger: 'sugar',
	shugar: 'sugar',
	rise: 'rice',
	ryce: 'rice',
	oyl: 'oil',
	tee: 'tea',
	chai: 'tea',
	soop: 'soap',
	sope: 'soap',
	salte: 'salt',
	pen: 'pens',
	tuna: 'tuna',
	tissu: 'tissue',
	glovs: 'gloves',
	batt: 'battery'
};

const STOP_WORDS = new Set(['the', 'a', 'an', 'of', 'for', 'and', 'with', 'in', 'x']);

export function normalize(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[×]/g, ' ')
		.replace(/[^a-z0-9.]+/g, ' ')
		.trim();
}

/** Naive singularisation so "bags" matches "bag" and "batteries" matches "battery". */
function stem(token: string): string {
	if (token.length > 4 && token.endsWith('ies')) return token.slice(0, -3) + 'y';
	if (token.length > 4 && /(ches|shes|xes|sses)$/.test(token)) return token.slice(0, -2);
	if (token.length > 3 && token.endsWith('s') && !token.endsWith('ss')) return token.slice(0, -1);
	return token;
}

export function tokenize(text: string): string[] {
	return normalize(text)
		.split(' ')
		.filter((t) => t && !STOP_WORDS.has(t))
		.map(stem);
}

const compact = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Optimal-string-alignment distance (Levenshtein + adjacent transpositions), capped. */
export function editDistance(a: string, b: string, max = 2): number {
	if (Math.abs(a.length - b.length) > max) return max + 1;
	const prev2 = new Array(b.length + 1).fill(0);
	let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		const cur = [i];
		let rowMin = i;
		for (let j = 1; j <= b.length; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
			if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
			cur[j] = v;
			rowMin = Math.min(rowMin, v);
		}
		if (rowMin > max) return max + 1;
		prev2.splice(0, prev2.length, ...prev);
		prev = cur;
	}
	return prev[b.length];
}

function allowedTypos(len: number): number {
	if (len <= 4) return 0; // short words: use MISSPELLINGS instead ("sona" must not match "soda")
	if (len <= 7) return 1;
	return 2;
}

/** How well one query token matches one indexed token (0 = no match). */
function tokenMatch(q: string, t: string, fuzzy = true): number {
	if (q === t) return 1;
	if (t.startsWith(q) && q.length >= 2) return 0.85;
	if (!fuzzy) return 0;
	if (q.length >= 5 && t.includes(q)) return 0.6;
	const typos = allowedTypos(q.length);
	if (typos && editDistance(q, t, typos) <= typos) return 0.55;
	// Typo inside a prefix: "detergen" → "detergent", "flou" → "flour"
	if (typos && t.length > q.length && editDistance(q, t.slice(0, q.length), 1) <= 1) return 0.45;
	return 0;
}

interface IndexedField {
	tokens: string[];
	weight: number;
}

interface IndexEntry {
	product: Product;
	sku: string;
	fields: IndexedField[];
}

const indexCache = new WeakMap<Product[], { entries: IndexEntry[]; vocabulary: string[] }>();

function buildIndex(products: Product[]) {
	let cached = indexCache.get(products);
	if (cached) return cached;
	const vocab = new Set<string>();
	const entries = products.map((p) => {
		const fields: IndexedField[] = [
			{ tokens: tokenize(p.name), weight: 3 },
			{ tokens: tokenize(p.brand ?? ''), weight: 3 },
			{ tokens: tokenize(`${p.categoryName} ${p.subcategoryName ?? ''}`), weight: 1.5 },
			{ tokens: (p.tags ?? []).flatMap(tokenize), weight: 2 },
			{ tokens: tokenize(`${p.packSize ?? ''} ${p.unit}`), weight: 0.75 },
			{ tokens: tokenize(p.description ?? ''), weight: 0.4 }
		];
		for (const f of fields.slice(0, 4)) for (const t of f.tokens) if (t.length > 2 && !/^\d/.test(t)) vocab.add(t);
		return { product: p, sku: compact(p.sku), fields };
	});
	cached = { entries, vocabulary: [...vocab] };
	indexCache.set(products, cached);
	return cached;
}

function expand(token: string): string[] {
	const fixed = MISSPELLINGS[token];
	return [token, ...(fixed ? [stem(fixed)] : []), ...(SYNONYMS[token] ?? []).map(stem)];
}

/** Score a product for the query; 0 means it doesn't match. */
function scoreEntry(entry: IndexEntry, queryTokens: string[], skuQuery: string, requireAll: boolean): number {
	let score = 0;

	// SKU: exact or partial (digits / prefix / fragment)
	if (skuQuery.length >= 3) {
		if (entry.sku === skuQuery) score += 50;
		else if (entry.sku.endsWith(skuQuery) || entry.sku.includes(skuQuery)) score += 25;
	}

	let matchedTokens = 0;
	for (const q of queryTokens) {
		let best = 0;
		for (const variant of expand(q)) {
			for (const field of entry.fields) {
				for (const t of field.tokens) {
					// Synonyms / spelling fixes match exactly or by prefix only (no fuzz on top of fuzz).
					const m = tokenMatch(variant, t, variant === q) * field.weight * (variant === q ? 1 : 0.8);
					if (m > best) best = m;
				}
			}
		}
		if (best > 0) matchedTokens++;
		else if (requireAll && score < 25) return 0;
		score += best;
	}
	if (matchedTokens === 0 && score < 25) return 0;
	// Prefer products matching every term, and those whose name starts with the query.
	if (matchedTokens === queryTokens.length) score += 2;
	if (normalize(entry.product.name).startsWith(queryTokens.join(' '))) score += 1.5;
	return score;
}

export function searchProducts(products: Product[], query: string): SearchHit[] {
	const q = query.trim();
	if (!q) return products.map((product) => ({ product, score: 0 }));
	const { entries } = buildIndex(products);
	const tokens = tokenize(q);
	const skuQuery = compact(q);

	let hits = run(true);
	// Nothing matches every word → fall back to any-word matches, ranked.
	if (hits.length === 0 && tokens.length > 1) hits = run(false);
	return hits;

	function run(requireAll: boolean): SearchHit[] {
		const out: SearchHit[] = [];
		for (const e of entries) {
			const score = scoreEntry(e, tokens, skuQuery, requireAll);
			if (score > 0) out.push({ product: e.product, score });
		}
		return out.sort((a, b) => b.score - a.score);
	}
}

/** "Did you mean" terms for a query with no results. */
export function suggestTerms(products: Product[], query: string, limit = 4): string[] {
	const { vocabulary } = buildIndex(products);
	const out = new Map<string, number>();
	for (const q of tokenize(query)) {
		if (q.length < 3) continue;
		for (const v of vocabulary) {
			const d = editDistance(q, v, 3);
			if (d <= 3 && v !== q) out.set(v, Math.min(out.get(v) ?? 9, d));
		}
	}
	return [...out.entries()]
		.sort((a, b) => a[1] - b[1])
		.slice(0, limit)
		.map(([term]) => term);
}

/** Lightweight typeahead: top N hits for a search-as-you-type dropdown. */
export function quickSearch(products: Product[], query: string, limit = 6): Product[] {
	if (query.trim().length < 2) return [];
	return searchProducts(products, query)
		.slice(0, limit)
		.map((h) => h.product);
}
