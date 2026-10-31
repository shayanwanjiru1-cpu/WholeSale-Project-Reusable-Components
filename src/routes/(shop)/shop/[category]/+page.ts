import { error } from '@sveltejs/kit';
import { getCategory } from '$lib/data/categories';
import { productsInCategory } from '$lib/data/products';
import type { PageLoad } from './$types';

// Data-driven: every category in categories.ts gets a page; unknown slugs 404.
export const load: PageLoad = ({ params }) => {
	const category = getCategory(params.category);
	if (!category) error(404, 'Category not found');
	return { category, products: productsInCategory(category.slug) };
};
