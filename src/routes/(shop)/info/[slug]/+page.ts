import { error } from '@sveltejs/kit';
import { pages } from '$lib/data/pages';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const page = pages[params.slug];
	if (!page) error(404, 'Page not found');
	return { page, slug: params.slug };
};
