import type { BreadcrumbItem, Category, Product } from '$lib/types';
import { site } from '$lib/data/site';
import { STOCK_META } from './stock';

/** Meta title / description templates and JSON-LD builders. */

export function categoryTitle(name: string): string {
	return `Wholesale ${name} | ${site.name}`;
}

export function productTitle(product: Pick<Product, 'name' | 'brand'>): string {
	return `${product.brand ? `${product.brand} ` : ''}${product.name} Wholesale | ${site.name}`;
}

export function categoryDescription(category: Pick<Category, 'name' | 'description'>, count: number): string {
	return `Buy ${category.name.toLowerCase()} wholesale: ${count} products with tiered bulk pricing, clear MOQs and business delivery. ${category.description}`.slice(0, 300);
}

export function productDescription(p: Product): string {
	const pack = p.packSize ? ` (${p.packSize} per ${p.unit})` : '';
	return `${p.brand ? `${p.brand} ` : ''}${p.name}${pack} at wholesale prices. Minimum order ${p.moq} ${p.unit}${p.moq === 1 ? '' : 's'}. SKU ${p.sku}. ${STOCK_META[p.stockStatus].label}.`;
}

const abs = (path: string) => new URL(path, site.url).toString();

export function organizationJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: site.name,
		url: site.url,
		email: site.email,
		telephone: site.phone,
		description: site.description
	};
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.label,
			...(item.href ? { item: abs(item.href) } : {})
		}))
	};
}

const availability: Record<Product['stockStatus'], string> = {
	'in-stock': 'https://schema.org/InStock',
	'low-stock': 'https://schema.org/LimitedAvailability',
	backorder: 'https://schema.org/BackOrder',
	'out-of-stock': 'https://schema.org/OutOfStock'
};

export function productJsonLd(p: Product) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: p.name,
		sku: p.sku,
		description: p.description ?? productDescription(p),
		category: p.categoryName,
		...(p.brand ? { brand: { '@type': 'Brand', name: p.brand } } : {}),
		...(p.image ? { image: abs(p.image) } : {}),
		...(p.quoteOnly
			? {}
			: {
					offers: {
						'@type': 'Offer',
						url: abs(p.href),
						priceCurrency: p.currency,
						price: p.price,
						availability: availability[p.stockStatus],
						eligibleQuantity: { '@type': 'QuantitativeValue', minValue: p.moq, unitText: p.unit }
					}
				})
	};
}

/** Serialise JSON-LD safely for {@html} inside a <script> tag. */
export function jsonLdScript(data: unknown): string {
	return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}
