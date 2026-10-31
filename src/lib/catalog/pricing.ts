import type { PriceTier, Product } from '$lib/types';

/**
 * Wholesale pricing rules. Pure functions — no UI, no stores — so they can move to a
 * Pricing API (or be replaced by customer-specific price lists) without touching
 * components.
 */

export const DEFAULT_CURRENCY = 'KES';
export const LOCALE = 'en-KE';

/** Standard quantity breaks applied when a product doesn't define its own. */
export const STANDARD_BREAKS = [
	{ minQty: 10, discount: 0.04 },
	{ minQty: 50, discount: 0.08 }
];

/** Round to the nearest 5 (how list prices are typically quoted). */
const round5 = (n: number) => Math.round(n / 5) * 5;

export function standardTiers(price: number): PriceTier[] {
	return STANDARD_BREAKS.map((b) => ({ minQty: b.minQty, price: round5(price * (1 - b.discount)) }));
}

/** All price points including the base, sorted by quantity. */
export function priceLadder(product: Pick<Product, 'price' | 'tiers'>): PriceTier[] {
	return [{ minQty: 1, price: product.price }, ...(product.tiers ?? [])].sort((a, b) => a.minQty - b.minQty);
}

/** Unit price for an order quantity (the best tier the quantity qualifies for). */
export function unitPriceFor(product: Pick<Product, 'price' | 'tiers'>, quantity: number): number {
	let price = product.price;
	for (const tier of priceLadder(product)) if (quantity >= tier.minQty) price = tier.price;
	return price;
}

export function lineTotal(product: Pick<Product, 'price' | 'tiers'>, quantity: number): number {
	return unitPriceFor(product, quantity) * quantity;
}

export interface TierRow {
	/** "1–9 units", "50+ units" */
	range: string;
	minQty: number;
	maxQty?: number;
	price: number;
	/** Percentage saved versus the base price, 0 for the base row. */
	savingPct: number;
}

/** Table-ready tier rows: 1–9 · 10–49 · 50+. */
export function tierRows(product: Pick<Product, 'price' | 'tiers' | 'unit'>, unitLabel = 'units'): TierRow[] {
	const ladder = priceLadder(product);
	return ladder.map((tier, i) => {
		const next = ladder[i + 1];
		const maxQty = next ? next.minQty - 1 : undefined;
		const range = maxQty ? `${tier.minQty}–${maxQty} ${unitLabel}` : `${tier.minQty}+ ${unitLabel}`;
		return {
			range,
			minQty: tier.minQty,
			maxQty,
			price: tier.price,
			savingPct: Math.round((1 - tier.price / product.price) * 100)
		};
	});
}

/** The next quantity break above `quantity`, used for "Buy 6 more to save X" nudges. */
export function nextTier(product: Pick<Product, 'price' | 'tiers'>, quantity: number) {
	const tier = priceLadder(product).find((t) => t.minQty > quantity);
	if (!tier) return undefined;
	const current = unitPriceFor(product, quantity);
	return { ...tier, unitsNeeded: tier.minQty - quantity, savingPerUnit: current - tier.price };
}

export type QuantityIssue = { kind: 'below-moq'; moq: number } | { kind: 'invalid' };

/** Validate an order quantity against MOQ. Returns undefined when valid. */
export function validateQuantity(product: Pick<Product, 'moq'>, quantity: number): QuantityIssue | undefined {
	if (!Number.isFinite(quantity) || quantity < 1 || !Number.isInteger(quantity)) return { kind: 'invalid' };
	if (quantity < product.moq) return { kind: 'below-moq', moq: product.moq };
	return undefined;
}

export function quantityMessage(issue: QuantityIssue, unit: string): string {
	return issue.kind === 'below-moq'
		? `Minimum order is ${issue.moq} ${pluralUnit(unit, issue.moq)}.`
		: 'Enter a whole number of 1 or more.';
}

export function pluralUnit(unit: string, n: number): string {
	if (n === 1) return unit;
	if (/(s|x|ch|sh)$/.test(unit)) return `${unit}es`;
	return `${unit}s`;
}

export function formatPrice(amount: number, currency = DEFAULT_CURRENCY): string {
	return new Intl.NumberFormat(LOCALE, {
		style: 'currency',
		currency,
		maximumFractionDigits: 0
	}).format(amount);
}

/* ---------- Order-level rules (mock policy) ---------- */

export const ORDER_POLICY = {
	/** Minimum order value for wholesale accounts. */
	minimumOrderValue: 5000,
	/** Free delivery threshold within the delivery zone. */
	freeDeliveryThreshold: 50000,
	deliveryFee: 1500,
	vatRate: 0.16
};

export interface OrderTotals {
	subtotal: number;
	savings: number;
	delivery: number;
	vat: number;
	total: number;
	belowMinimum: boolean;
	amountToMinimum: number;
	amountToFreeDelivery: number;
}

/**
 * Prices are shown VAT-exclusive (common for B2B); VAT is added at the summary.
 * `lines` carry their resolved product so this stays a pure function.
 */
export function orderTotals(lines: { product: Pick<Product, 'price' | 'tiers'>; quantity: number }[]): OrderTotals {
	let subtotal = 0;
	let undiscounted = 0;
	for (const { product, quantity } of lines) {
		subtotal += lineTotal(product, quantity);
		undiscounted += product.price * quantity;
	}
	const { minimumOrderValue, freeDeliveryThreshold, deliveryFee, vatRate } = ORDER_POLICY;
	const delivery = subtotal === 0 || subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
	const vat = Math.round((subtotal + delivery) * vatRate);
	return {
		subtotal,
		savings: undiscounted - subtotal,
		delivery,
		vat,
		total: subtotal + delivery + vat,
		belowMinimum: subtotal > 0 && subtotal < minimumOrderValue,
		amountToMinimum: Math.max(0, minimumOrderValue - subtotal),
		amountToFreeDelivery: Math.max(0, freeDeliveryThreshold - subtotal)
	};
}
