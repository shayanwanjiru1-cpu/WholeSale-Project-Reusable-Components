import type { FooterColumn, LinkItem } from '$lib/types';
import type { IconName } from '$lib/components/ui/icons';
import { ORDER_POLICY, formatPrice } from '$lib/catalog/pricing';

/** Business details. Contact details, policies and prices are demo values. */
export const site = {
	name: 'Shayanne Wanjiru Wholesalers',
	shortName: 'Shayanne Wanjiru',
	tagline: 'Wholesalers',
	url: 'https://shayannewanjiru.example',
	description:
		'Bulk food, beverages, cleaning, personal care, packaging, stationery, hardware and trade chemicals for businesses. Tiered wholesale pricing, low MOQs and business delivery.',
	email: 'orders@shayannewanjiru.example',
	phone: '+254 700 000 000',
	address: 'Warehouse 4, Industrial Area, Nairobi (demo address)',
	hours: 'Mon–Sat, 7:00–18:00',
	demoNotice: 'Demo store — prices, stock and policies are illustrative, not real market prices. Product brands belong to their owners.'
};

/** Short, factual wholesale terms (fictional policy, used in several sections). */
export const wholesaleTerms: { icon: IconName; title: string; value: string; description: string }[] = [
	{ icon: 'wallet', title: 'Minimum order', value: formatPrice(ORDER_POLICY.minimumOrderValue), description: 'Per order, across any mix of products.' },
	{ icon: 'percent', title: 'Wholesale pricing', value: 'Tiered', description: 'Unit prices drop at 10+ and 50+ units.' },
	{ icon: 'truck', title: 'Delivery', value: 'Business delivery', description: `Free over ${formatPrice(ORDER_POLICY.freeDeliveryThreshold)} in the delivery zone.` },
	{ icon: 'calendar', title: 'Payment terms', value: 'Net-30 / Net-60', description: 'For approved business accounts.' },
	{ icon: 'headphones', title: 'Order support', value: 'Account team', description: 'Help with quotes, bulk orders and reorders.' }
];

export const footerColumns: FooterColumn[] = [
	{
		title: 'Shop',
		links: [
			{ label: 'All products', href: '/shop' },
			{ label: 'Categories', href: '/#categories' },
			{ label: 'Deals', href: '/deals' },
			{ label: 'Bulk order upload', href: '/bulk-order' }
		]
	},
	{
		title: 'Customer',
		links: [
			{ label: 'Account', href: '/account' },
			{ label: 'Order history', href: '/account/orders' },
			{ label: 'Quick reorder', href: '/account/orders#reorder' },
			{ label: 'Quote requests', href: '/quote' }
		]
	},
	{
		title: 'Support',
		links: [
			{ label: 'Help centre', href: '/info/help' },
			{ label: 'Shipping & delivery', href: '/info/shipping' },
			{ label: 'Returns', href: '/info/returns' },
			{ label: 'Payment terms', href: '/info/payment-terms' }
		]
	},
	{
		title: 'Company',
		links: [
			{ label: 'About us', href: '/info/about' },
			{ label: 'Wholesale information', href: '/info/wholesale' },
			{ label: 'Contact', href: '/info/contact' },
			{ label: 'Component library', href: '/components' }
		]
	}
];

export const legalLinks: LinkItem[] = [
	{ label: 'Privacy', href: '/info/privacy' },
	{ label: 'Terms', href: '/info/terms' },
	{ label: 'Cookies', href: '/info/cookies' }
];
