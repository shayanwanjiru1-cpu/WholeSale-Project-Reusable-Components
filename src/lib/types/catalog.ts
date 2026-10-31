/**
 * Wholesale domain model. These are the shapes a future Products / Categories /
 * Pricing / Inventory API should return; the UI only depends on these types.
 */
import type { IconName } from '$lib/components/ui/icons';

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'backorder';

/** Quantity break: `price` applies when ordering at least `minQty` units. */
export interface PriceTier {
	minQty: number;
	price: number;
}

/** Shown on regulated / hazardous goods (chemicals, solvents, strong cleaners). */
export interface HazardInfo {
	signal: 'Warning' | 'Danger';
	statements: string[];
	/** Short handling note shown on cards. */
	note: string;
}

/** A single cell of a contact-sheet image, rendered with CSS background positioning. */
export interface SpriteRef {
	src: string;
	cols: number;
	rows: number;
	index: number;
}

export interface Product {
	id: string;
	sku: string;
	/** URL-safe name, also used to resolve image assets. */
	slug: string;
	name: string;
	/** Category slug. */
	category: string;
	/** Denormalised for display (an API would include it in the response). */
	categoryName: string;
	subcategory?: string;
	subcategoryName?: string;
	brand?: string;
	/** Resolved image URL. Undefined renders the neutral product placeholder. */
	image?: string;
	/** Crop from a contact-sheet photo, used when no individual image exists. */
	sprite?: SpriteRef;
	/** Descriptive alt text, e.g. "25 kg bag of long-grain rice". */
	imageAlt: string;
	description?: string;
	/** Selling unit: "bag", "carton", "case", "bale"... */
	unit: string;
	/** Contents of one unit: "25 kg", "12 × 1 L". */
	packSize?: string;
	/** Retail units inside one selling unit (case pack). */
	casePack?: number;
	/** Base (1-unit) price per selling unit. */
	price: number;
	/** Previous price, shown struck-through when on sale. */
	compareAtPrice?: number;
	currency: string;
	/** Quantity breaks below the base price. */
	tiers?: PriceTier[];
	/** Minimum order quantity in selling units. */
	moq: number;
	stockStatus: StockStatus;
	stockQty?: number;
	/** Days to ship for backorder / low stock replenishment. */
	leadTimeDays?: number;
	featured?: boolean;
	sale?: boolean;
	/** Higher = more popular (mock order volume). */
	popularity: number;
	/** ISO date the product was listed. */
	addedAt: string;
	tags?: string[];
	hazard?: HazardInfo;
	/** Price withheld; buyers must request a quote. */
	quoteOnly?: boolean;
	/** Canonical product URL: /shop/category/subcategory/sku */
	href: string;
}

export interface Subcategory {
	slug: string;
	name: string;
}

export interface Category {
	slug: string;
	name: string;
	/** Short label for tight spaces (rail tooltips, chips). */
	shortName: string;
	description: string;
	icon: IconName;
	/** Slug of a product whose image represents the category. */
	coverProduct?: string;
	/** Category photo (collage crop). Preferred over the cover product's packshot. */
	image?: string;
	subcategories: Subcategory[];
	/** Requires responsible-handling messaging (chemicals). */
	regulated?: boolean;
}

/* ---------- Search / filter / sort ---------- */

export type SortKey =
	| 'relevance'
	| 'price-asc'
	| 'price-desc'
	| 'name-asc'
	| 'name-desc'
	| 'newest'
	| 'popular'
	| 'featured';

export interface PriceRange {
	min?: number;
	max?: number;
}

export interface FilterState {
	categories: string[];
	subcategories: string[];
	brands: string[];
	units: string[];
	packSizes: string[];
	stock: StockStatus[];
	price: PriceRange;
	/** Only products whose MOQ is at most this. */
	maxMoq?: number;
	saleOnly: boolean;
}

export interface FacetOption {
	value: string;
	label: string;
	count: number;
}

export interface Facets {
	categories: FacetOption[];
	subcategories: FacetOption[];
	brands: FacetOption[];
	units: FacetOption[];
	packSizes: FacetOption[];
	stock: FacetOption[];
	priceBounds: { min: number; max: number };
}

/** One removable chip describing an active filter. */
export interface ActiveFilter {
	key: keyof FilterState;
	value?: string;
	label: string;
}

/* ---------- Cart / quote / orders ---------- */

export interface CartLine {
	sku: string;
	quantity: number;
}

export type PaymentTerms = 'prepaid' | 'net-30' | 'net-60';

export type OrderStatus = 'pending-approval' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderLine {
	sku: string;
	name: string;
	quantity: number;
	unitPrice: number;
}

export interface Order {
	id: string;
	poNumber?: string;
	placedAt: string;
	placedBy: string;
	status: OrderStatus;
	terms: PaymentTerms;
	lines: OrderLine[];
	total: number;
	currency: string;
}

export interface QuoteLine {
	sku: string;
	quantity: number;
	note?: string;
}
