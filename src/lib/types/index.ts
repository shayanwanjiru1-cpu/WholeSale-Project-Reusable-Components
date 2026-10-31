import type { Snippet } from 'svelte';
import type { IconName } from '$lib/components/ui/icons';
import type { Tone } from '$lib/utils/tones';

export type { IconName, Tone };
export type * from './catalog';
export type Size = 'sm' | 'md' | 'lg';
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/* ---------- Navigation ---------- */

export interface LinkItem {
	label: string;
	href: string;
	icon?: IconName;
	description?: string;
	external?: boolean;
}

export interface MegaMenuGroup {
	heading: string;
	links: LinkItem[];
}

export interface MegaMenuFeatured {
	title: string;
	description?: string;
	href: string;
	image?: string;
	imageAlt?: string;
	cta?: string;
}

export interface MegaMenuContent {
	groups: MegaMenuGroup[];
	featured?: MegaMenuFeatured;
}

export interface NavItem {
	label: string;
	href?: string;
	icon?: IconName;
	description?: string;
	badge?: string | number;
	external?: boolean;
	disabled?: boolean;
	/** Nested links: rendered as a dropdown (desktop) or expandable group (mobile/sidebar). */
	children?: NavItem[];
	/** Rendered as a mega menu panel instead of a simple dropdown. */
	mega?: MegaMenuContent;
}

export interface BreadcrumbItem {
	label: string;
	href?: string;
	icon?: IconName;
}

export interface FooterColumn {
	title: string;
	links: LinkItem[];
}

export interface SocialLink {
	label: string;
	href: string;
	icon: IconName;
}

export type DropdownItem =
	| {
			type?: 'item';
			label: string;
			icon?: IconName;
			href?: string;
			disabled?: boolean;
			destructive?: boolean;
			shortcut?: string;
			onSelect?: () => void;
	  }
	| { type: 'divider' }
	| { type: 'label'; label: string };

export interface TabItem {
	id: string;
	label: string;
	icon?: IconName;
	badge?: string | number;
	disabled?: boolean;
}

/* ---------- Data display ---------- */

export interface Trend {
	value: string;
	direction: 'up' | 'down' | 'flat';
	/** Whether this direction is good. Defaults to up = positive. */
	positive?: boolean;
	label?: string;
}

export interface KeyValueItem {
	key: string;
	value: string | number;
	icon?: IconName;
}


export interface TableColumn<T> {
	key: string;
	header: string;
	accessor?: (row: T) => unknown;
	/** Plain-text formatting; use `cell` for rich content. */
	format?: (value: unknown, row: T) => string;
	cell?: Snippet<[T]>;
	sortable?: boolean;
	align?: 'left' | 'center' | 'right';
	/** Hide this column below a breakpoint (selective column hiding). */
	hideBelow?: 'sm' | 'md' | 'lg';
	/** Treat as the row's title in stacked (card) mobile layout. */
	primary?: boolean;
	class?: string;
}

export interface SortState {
	key: string;
	direction: 'asc' | 'desc';
}

export interface TimelineItem {
	id: string;
	title: string;
	date?: string;
	dateTime?: string;
	description?: string;
	icon?: IconName;
	tone?: Tone;
}

export interface ActivityItem {
	id: string;
	actor: { name: string; avatar?: string };
	action: string;
	target?: string;
	href?: string;
	timestamp: string;
	dateTime?: string;
	description?: string;
	tone?: Tone;
}

export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error';
export interface StepItem {
	label: string;
	description?: string;
	status?: StepStatus;
}

export interface MediaImage {
	src: string;
	alt: string;
	thumbnail?: string;
	caption?: string;
}

export interface PricingFeature {
	label: string;
	included?: boolean;
}

export interface Action {
	label: string;
	href?: string;
	onclick?: () => void;
	icon?: IconName;
}
