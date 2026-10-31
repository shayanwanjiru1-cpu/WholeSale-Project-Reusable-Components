/**
 * Demo fixtures for the /components showcase ONLY.
 * These are generic sample values to exercise component states; they are not the
 * wholesale catalogue and should not be imported by production pages.
 */
import type {
	ActivityItem,
	BreadcrumbItem,
	DropdownItem,
	FooterColumn,
	MediaImage,
	NavItem,
	Product,
	SocialLink,
	StepItem,
	TabItem,
	TimelineItem
} from '$lib/types';
import { placeholderImage } from './placeholder';
import { getProduct } from './products';

export const demoNav: NavItem[] = [
	{ label: 'Home', href: '#' },
	{
		label: 'Catalogue',
		mega: {
			groups: [
				{
					heading: 'Browse',
					links: [
						{ label: 'All items', href: '#all', icon: 'grid', description: 'Everything in one place' },
						{ label: 'New arrivals', href: '#new', icon: 'tag', description: 'Added this month' },
						{ label: 'Bulk deals', href: '#deals', icon: 'dollar', description: 'Volume pricing' }
					]
				},
				{
					heading: 'Categories',
					links: [
						{ label: 'Category A', href: '#a', icon: 'package' },
						{ label: 'Category B', href: '#b', icon: 'layers' },
						{ label: 'Category C', href: '#c', icon: 'building' }
					]
				}
			],
			featured: { title: 'Featured collection', description: 'A highlighted promotional link with an image.', href: '#featured', image: placeholderImage('Featured', 260, 640, 360), cta: 'Explore' }
		}
	},
	{
		label: 'Services',
		children: [
			{ label: 'Delivery', href: '#delivery', icon: 'truck', description: 'Scheduled freight options' },
			{ label: 'Account support', href: '#support', icon: 'user', description: 'Dedicated contacts' },
			{ label: 'Documentation', href: '#docs', icon: 'file-text' }
		]
	},
	{ label: 'About', href: '#about' },
	{ label: 'Contact', href: '#contact' }
];

export const demoBreadcrumbs: BreadcrumbItem[] = [
	{ label: 'Home', href: '#', icon: 'home' },
	{ label: 'Level one', href: '#' },
	{ label: 'Level two', href: '#' },
	{ label: 'Level three', href: '#' },
	{ label: 'Current page' }
];

export const demoFooterColumns: FooterColumn[] = [
	{ title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Press', href: '#' }] },
	{ title: 'Support', links: [{ label: 'Help centre', href: '#' }, { label: 'Shipping', href: '#' }, { label: 'Returns', href: '#' }] },
	{ title: 'Resources', links: [{ label: 'Docs', href: '#' }, { label: 'Status', href: 'https://example.com', external: true }] }
];

export const demoSocial: SocialLink[] = [
	{ label: 'Website', href: 'https://example.com', icon: 'globe' },
	{ label: 'Email us', href: 'mailto:hello@example.com', icon: 'mail' },
	{ label: 'Share link', href: 'https://example.com/share', icon: 'link' }
];

export const demoDropdownItems: DropdownItem[] = [
	{ type: 'label', label: 'Actions' },
	{ label: 'View details', icon: 'eye', shortcut: '⌘V' },
	{ label: 'Edit', icon: 'pencil' },
	{ label: 'Duplicate', icon: 'copy' },
	{ label: 'Archived (disabled)', icon: 'inbox', disabled: true },
	{ type: 'divider' },
	{ label: 'Delete', icon: 'trash', destructive: true }
];

export const demoTabs: TabItem[] = [
	{ id: 'overview', label: 'Overview', icon: 'info' },
	{ id: 'specs', label: 'Specifications', icon: 'sliders' },
	{ id: 'reviews', label: 'Reviews', badge: 12 },
	{ id: 'shipping', label: 'Shipping', icon: 'truck' },
	{ id: 'disabled', label: 'Disabled', disabled: true }
];

/** Real catalog entries chosen to cover every card state. */
export const demoProducts: Product[] = [
	'WS-FG-1003', // sale
	'WS-FG-1005', // low stock
	'WS-BV-2008', // backorder
	'WS-CH-3013', // out of stock
	'WS-CM-9006', // quote only + hazard
	'WS-CM-9001' // hazard
].map((sku) => getProduct(sku)!);

export const demoTableRows = Array.from({ length: 23 }, (_, i) => ({
	id: `R-${String(i + 1).padStart(3, '0')}`,
	name: `Row item ${i + 1}`,
	category: ['Alpha', 'Beta', 'Gamma'][i % 3],
	quantity: (i * 37) % 500,
	price: Math.round(((i * 13.7) % 90) * 100) / 100 + 5,
	status: (['In stock', 'Low stock', 'Out of stock'] as const)[i % 5 === 0 ? 2 : i % 3 === 0 ? 1 : 0]
}));
export type DemoRow = (typeof demoTableRows)[number];

export const demoTimeline: TimelineItem[] = [
	{ id: 't1', title: 'Order placed', date: 'Oct 2, 09:14', description: 'Confirmation sent to the buyer.', tone: 'success', icon: 'cart' },
	{ id: 't2', title: 'Payment verified', date: 'Oct 2, 10:02', tone: 'success' },
	{ id: 't3', title: 'Dispatched from warehouse', date: 'Oct 3, 16:40', description: 'Tracking number issued.', tone: 'info', icon: 'truck' },
	{ id: 't4', title: 'Delivery delayed', date: 'Oct 5, 08:00', description: 'Weather disruption on route.', tone: 'warning' }
];

export const demoActivity: ActivityItem[] = [
	{ id: 'a1', actor: { name: 'Alex Morgan' }, action: 'updated', target: 'Price list', href: '#', timestamp: '5 minutes ago', tone: 'info' },
	{ id: 'a2', actor: { name: 'Sam Lee' }, action: 'commented on', target: 'Quote #1042', href: '#', timestamp: '1 hour ago', description: 'Can we confirm the delivery window before Friday?' },
	{ id: 'a3', actor: { name: 'Jordan Taylor' }, action: 'approved', target: 'Order #881', timestamp: 'Yesterday', tone: 'success' }
];

export const demoSteps: StepItem[] = [
	{ label: 'Cart', description: 'Review items' },
	{ label: 'Details', description: 'Delivery info' },
	{ label: 'Payment', description: 'Terms or card' },
	{ label: 'Confirm' }
];

export const demoImages: MediaImage[] = [
	{ src: placeholderImage('Image 1', 200), alt: 'Placeholder image one', caption: 'First image caption' },
	{ src: placeholderImage('Image 2', 140), alt: 'Placeholder image two' },
	{ src: placeholderImage('Image 3', 30), alt: 'Placeholder image three', caption: 'Third image caption' },
	{ src: placeholderImage('Image 4', 300), alt: 'Placeholder image four' }
];

export const demoPeople = [
	{ name: 'Alex Morgan', src: placeholderImage('', 210, 96, 96) },
	{ name: 'Sam Lee' },
	{ name: 'Jordan Taylor' },
	{ name: 'Riley Chen' },
	{ name: 'Casey Brooks' },
	{ name: 'Drew Patel' }
];

export const showcaseNav: NavItem[] = [
	{
		label: 'Layout & Navigation',
		icon: 'layers',
		children: [
			{ label: 'Button', href: '#button' },
			{ label: 'Navbar', href: '#navbar' },
			{ label: 'Logo', href: '#logo' },
			{ label: 'Navigation menu', href: '#navigation-menu' },
			{ label: 'Mega menu', href: '#mega-menu' },
			{ label: 'Mobile navigation', href: '#mobile-navigation' },
			{ label: 'Sheet', href: '#sheet' },
			{ label: 'Sidebar', href: '#sidebar' },
			{ label: 'Dropdown', href: '#dropdown' },
			{ label: 'Tabs', href: '#tabs' },
			{ label: 'Breadcrumbs', href: '#breadcrumbs' },
			{ label: 'Page header', href: '#page-header' },
			{ label: 'Section', href: '#section' },
			{ label: 'Containers', href: '#containers' },
			{ label: 'Skip link', href: '#skip-link' },
			{ label: 'Footer', href: '#footer' }
		]
	},
	{
		label: 'Data Display',
		icon: 'grid',
		children: [
			{ label: 'Cards', href: '#cards' },
			{ label: 'Product card', href: '#product-card' },
			{ label: 'Data table', href: '#data-table' },
			{ label: 'Lists', href: '#lists' },
			{ label: 'Description lists', href: '#description-lists' },
			{ label: 'Accordion', href: '#accordion' },
			{ label: 'Timeline & activity', href: '#timeline' },
			{ label: 'Progress & stepper', href: '#progress' },
			{ label: 'Badges & avatars', href: '#badges' },
			{ label: 'Tooltip & popover', href: '#overlays' },
			{ label: 'States', href: '#states' },
			{ label: 'Media', href: '#media' },
			{ label: 'Code & copy', href: '#code' }
		]
	},
	{ label: 'Back to top', href: '#top', icon: 'arrow-up' }
];
