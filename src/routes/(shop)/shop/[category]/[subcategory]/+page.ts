import { error } from '@sveltejs/kit';
import { getCategory, getSubcategory } from '$lib/data/categories';
import { productsInCategory } from '$lib/data/products';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const category = getCategory(params.category);
	const subcategory = category && getSubcategory(category.slug, params.subcategory);
	if (!category || !subcategory) error(404, 'Category not found');
	return { category, subcategory, products: productsInCategory(category.slug, subcategory.slug) };
};
