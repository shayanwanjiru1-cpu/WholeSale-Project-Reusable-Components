import type { NavItem } from '$lib/types';
import { categories, categoryHref } from './categories';

/** Navigation is generated from the category data — no hardcoded category menus. */

const categoryLink = (slug: string) => {
	const c = categories.find((x) => x.slug === slug)!;
	return { label: c.name, href: categoryHref(c.slug), icon: c.icon, description: c.subcategories.slice(0, 3).map((s) => s.name).join(' · ') };
};

/** Desktop header navigation. */
export const headerNav: NavItem[] = [
	{
		label: 'Categories',
		icon: 'grid',
		mega: {
			groups: [
				{ heading: 'Food & drink', links: ['food-grocery', 'beverages'].map(categoryLink) },
				{ heading: 'Home & personal', links: ['cleaning-household', 'personal-care', 'gardening-outdoor'].map(categoryLink) },
				{ heading: 'Business supplies', links: ['packaging-food-service', 'stationery-office', 'hardware-supplies', 'chemicals'].map(categoryLink) }
			],
			featured: {
				title: 'Bulk deals this month',
				description: 'Reduced case prices on staples, cleaning and packaging.',
				href: '/deals',
				cta: 'Shop deals'
			}
		}
	},
	{ label: 'Products', href: '/#catalog' },
	{ label: 'Deals', href: '/deals' },
	{ label: 'Bulk order', href: '/bulk-order' },
	{ label: 'Request a quote', href: '/quote' },
	{
		label: 'Company',
		children: [
			{ label: 'About us', href: '/info/about', icon: 'building', description: 'Who we supply and how we work' },
			{ label: 'Wholesale information', href: '/info/wholesale', icon: 'info', description: 'MOQs, pricing tiers and accounts' },
			{ label: 'Payment terms', href: '/info/payment-terms', icon: 'calendar', description: 'Prepaid, Net-30 and Net-60' },
			{ label: 'Contact', href: '/info/contact', icon: 'phone', description: 'Sales and order support' }
		]
	}
];

/** Category tree for the sidebar rail and the mobile drawer. */
export const categoryNav: NavItem[] = categories.map((c) => ({
	label: c.name,
	icon: c.icon,
	children: [
		{ label: `All ${c.name}`, href: categoryHref(c.slug) },
		...c.subcategories.map((s) => ({ label: s.name, href: categoryHref(c.slug, s.slug) }))
	]
}));

/** Sidebar / drawer: shop shortcuts, categories, then account tools. */
export const sidebarNav: NavItem[] = [
	{ label: 'Home', href: '/', icon: 'home' },
	{ label: 'All products', href: '/shop', icon: 'layers' },
	{ label: 'Deals', href: '/deals', icon: 'percent' },
	...categoryNav,
	{ label: 'Request a quote', href: '/quote', icon: 'file-text' },
	{ label: 'Bulk order upload', href: '/bulk-order', icon: 'upload' },
	{ label: 'Order history', href: '/account/orders', icon: 'repeat' },
	{ label: 'Account', href: '/account', icon: 'user' }
];

/** Mobile drawer: everything in one tree. */
export const mobileNav: NavItem[] = [
	...sidebarNav.slice(0, 3),
	{ label: 'Shop by category', icon: 'grid', children: categoryNav },
	...sidebarNav.slice(3 + categoryNav.length),
	{
		label: 'Company',
		icon: 'building',
		children: [
			{ label: 'About us', href: '/info/about' },
			{ label: 'Wholesale information', href: '/info/wholesale' },
			{ label: 'Payment terms', href: '/info/payment-terms' },
			{ label: 'Contact', href: '/info/contact' }
		]
	}
];
