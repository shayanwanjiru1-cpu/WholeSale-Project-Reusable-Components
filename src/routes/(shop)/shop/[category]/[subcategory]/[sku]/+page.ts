import { error, redirect } from '@sveltejs/kit';
import { getCategory } from '$lib/data/categories';
import { getProduct, relatedProducts } from '$lib/data/products';
import type { PageLoad } from './$types';

/** /shop/:category/:subcategory/:sku — redirects to the canonical URL if the path is stale. */
export const load: PageLoad = ({ params }) => {
	const product = getProduct(params.sku);
	if (!product) error(404, 'Product not found');
	if (product.category !== params.category || product.subcategory !== params.subcategory) redirect(301, product.href);
	return { product, category: getCategory(product.category)!, related: relatedProducts(product, 4) };
};
