<script lang="ts">
	import type { Snippet } from 'svelte';
	import Container, { type ContainerSize } from '../layout/Container.svelte';
	import NavigationMenu from './NavigationMenu.svelte';
	import MobileNavigation from './MobileNavigation.svelte';
	import MobileMenuButton from '../ui/MobileMenuButton.svelte';
	import type { NavItem } from '$lib/types';
	import type { TriggerMode } from '$lib/utils/disclosure.svelte';
	import { cn } from '$lib/utils/cn';

	/**
	 * Site header. Navigation is passed as data; desktop shows NavigationMenu,
	 * below `lg` it switches to a hamburger + MobileNavigation drawer.
	 *
	 * - `layout="inline"`: brand · nav · actions on one row
	 * - `layout="stacked"`: brand · search · actions, with the nav on a second row
	 *   (catalog-style header). The `search` snippet drops to its own full-width row
	 *   on small screens so search is always one tap away.
	 */
	interface Props {
		items: NavItem[];
		/** Drawer items (defaults to `items`). */
		mobileItems?: NavItem[];
		activeHref?: string;
		variant?: 'default' | 'transparent' | 'dark';
		layout?: 'inline' | 'stacked';
		sticky?: boolean;
		compact?: boolean;
		containerSize?: ContainerSize;
		dropdownTrigger?: TriggerMode;
		/** Logo / brand block. Also shown in the mobile drawer header. */
		brand: Snippet;
		/** Search field (stacked layout: centre of the main row). */
		search?: Snippet;
		/** Right-hand actions (account, cart, theme). */
		actions?: Snippet;
		/** Right side of the nav row in stacked layout (e.g. a phone number). */
		navExtra?: Snippet;
		/** Actions shown at the bottom of the mobile drawer. */
		mobileActions?: Snippet;
		mobileOpen?: boolean;
		label?: string;
		class?: string;
	}

	let {
		items,
		mobileItems,
		activeHref,
		variant = 'default',
		layout = 'inline',
		sticky = false,
		compact = false,
		containerSize = 'default',
		dropdownTrigger = 'click-or-hover',
		brand,
		search,
		actions,
		navExtra,
		mobileActions,
		mobileOpen = $bindable(false),
		label = 'Main',
		class: className
	}: Props = $props();

	const uid = $props.id();
	const drawerId = `mobile-nav-${uid}`;

	const variants = {
		default: 'border-b border-border bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75',
		transparent: 'bg-transparent',
		dark: 'theme-dark border-b border-border bg-background text-foreground'
	};
	const stacked = $derived(layout === 'stacked');
</script>

<header class={cn(sticky ? 'sticky top-0 z-40' : 'relative z-30', variants[variant], className)}>
	<Container size={containerSize} class={cn('relative flex items-center gap-3 sm:gap-6', compact ? 'h-14' : 'h-16')}>
		<MobileMenuButton bind:open={mobileOpen} controls={drawerId} class="-ml-2 lg:hidden" size={compact ? 'sm' : 'md'} label="Open menu" />
		<div class="shrink-0">{@render brand()}</div>
		{#if stacked}
			{#if search}<div class="hidden max-w-2xl flex-1 lg:block">{@render search()}</div>{/if}
		{:else}
			<NavigationMenu {items} {activeHref} {label} trigger={dropdownTrigger} class="hidden lg:block" />
		{/if}
		<div class="ml-auto flex items-center gap-1 sm:gap-2">
			{@render actions?.()}
		</div>
	</Container>
	{#if stacked}
		{#if search}
			<Container size={containerSize} class="pb-3 lg:hidden">{@render search()}</Container>
		{/if}
		<div class="hidden border-t border-border lg:block">
			<Container size={containerSize} class="relative flex h-11 items-center gap-4">
				<NavigationMenu {items} {activeHref} {label} trigger={dropdownTrigger} class="-ml-3" />
				{#if navExtra}<div class="ml-auto flex items-center gap-4 text-sm text-muted-foreground">{@render navExtra()}</div>{/if}
			</Container>
		</div>
	{/if}
</header>
<MobileNavigation id={drawerId} bind:open={mobileOpen} items={mobileItems ?? items} {activeHref} header={brand} footer={mobileActions} label="{label} navigation" />
