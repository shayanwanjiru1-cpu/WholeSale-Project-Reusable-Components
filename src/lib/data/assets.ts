/**
 * Image asset resolution.
 *
 * Photography lives in `src/lib/assets/` so Vite fingerprints and optimises it, and so
 * the catalog only references images that actually exist (no 404s, no broken tiles):
 *
 *   src/lib/assets/products/<product-slug>.(webp|jpg|jpeg|png|avif)   one photo per product
 *   src/lib/assets/source/product-grid.(webp|jpg|png)                  the supplied 15-product grid
 *   src/lib/assets/source/category-collage.(webp|jpg|png)              the supplied category collage
 *
 * Resolution order for a product: individual photo → crop from the product grid → the
 * neutral ProductImage placeholder (category icon on a clean white tile).
 */
import type { SpriteRef } from '$lib/types';
import logoMarkUrl from '$lib/assets/brand/mark.webp';
import logoMarkInverseUrl from '$lib/assets/brand/mark-inverse.webp';
import logoFullUrl from '$lib/assets/brand/logo-full.webp';
import logoFullInverseUrl from '$lib/assets/brand/logo-full-inverse.webp';

/** Brand artwork, from the supplied logo (white removed; `inverse` = light ink for dark backgrounds). */
export const brandImages = {
	mark: logoMarkUrl,
	markInverse: logoMarkInverseUrl,
	full: logoFullUrl,
	fullInverse: logoFullInverseUrl
};

const productFiles = import.meta.glob('/src/lib/assets/products/*.{webp,jpg,jpeg,png,avif}', {
	eager: true,
	import: 'default'
}) as Record<string, string>;

const sourceFiles = import.meta.glob('/src/lib/assets/source/*.{webp,jpg,jpeg,png,avif}', {
	eager: true,
	import: 'default'
}) as Record<string, string>;

function stem(path: string): string {
	return path.slice(path.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
}

const categoryFiles = import.meta.glob('/src/lib/assets/categories/*.{webp,jpg,jpeg,png,avif}', {
	eager: true,
	import: 'default'
}) as Record<string, string>;

const productImages = new Map(Object.entries(productFiles).map(([path, url]) => [stem(path), url]));
const sourceImages = new Map(Object.entries(sourceFiles).map(([path, url]) => [stem(path), url]));
const categoryImages = new Map(Object.entries(categoryFiles).map(([path, url]) => [stem(path), url]));

/** Category scene cropped from the supplied collage: src/lib/assets/categories/<category-slug>.webp */
export function categoryImage(slug: string): string | undefined {
	return categoryImages.get(slug);
}

/**
 * Layout of the supplied individual-product grid (read left→right, top→bottom).
 * Adjust `cols`/`rows`/`order` if the supplied image is arranged differently.
 */
export const PRODUCT_GRID = {
	cols: 5,
	rows: 3,
	order: [
		'long-grain-rice-25kg',
		'cooking-oil-20l',
		'white-sugar-50kg',
		'black-tea-500g',
		'all-purpose-flour-12x2kg',
		'laundry-detergent-5kg',
		'dishwashing-liquid-5l',
		'multipurpose-bar-soap',
		'toilet-tissue-48',
		'fabric-softener-5l',
		'work-gloves-120',
		'garbage-bags-heavy',
		'aa-alkaline-batteries',
		'extension-cord-4way',
		'exercise-books-96pg'
	]
};

export function productImage(slug: string): string | undefined {
	return productImages.get(slug);
}

export function productSprite(slug: string): SpriteRef | undefined {
	const src = sourceImages.get('product-grid');
	const index = PRODUCT_GRID.order.indexOf(slug);
	if (!src || index < 0) return undefined;
	return { src, cols: PRODUCT_GRID.cols, rows: PRODUCT_GRID.rows, index };
}

/** The wide wholesale collage used in the hero, if supplied. */
export const heroCollage: string | undefined =
	sourceImages.get('category-collage') ?? sourceImages.get('hero-collage');
