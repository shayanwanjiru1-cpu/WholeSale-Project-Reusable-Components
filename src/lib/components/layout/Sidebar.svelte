<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onDestroy } from 'svelte';
	import NavTree from '../navigation/NavTree.svelte';
	import MobileNavigation from '../navigation/MobileNavigation.svelte';
	import MobileMenuButton from '../ui/MobileMenuButton.svelte';
	import type { NavItem } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/**
	 * Application sidebar with one implementation for every behaviour:
	 *  - expanded / collapsed (icon rail) via `collapsed`
	 *  - hover-to-expand: the rail slides open over content without shifting layout
	 *  - click-to-expand/collapse via the built-in hamburger toggle
	 *  - keyboard: focusing into the rail expands it so labels are visible; Escape collapses
	 *  - below `lg` it becomes an off-canvas drawer controlled by `mobileOpen`
	 *    (open it with any <MobileMenuButton bind:open={mobileOpen} />), unless
	 *    `mobileDrawer={false}` because another drawer (e.g. the Navbar's) covers mobile
	 *  - `variant="dark"`: near-black rail for the wholesale shell
	 */
	interface Props {
		items: NavItem[];
		activeHref?: string;
		collapsed?: boolean;
		expandOnHover?: boolean;
		/** Show the hamburger toggle that pins the sidebar open/closed. */
		expandOnClick?: boolean;
		mobileOpen?: boolean;
		label?: string;
		/** Header content; receives whether the sidebar is visually collapsed. */
		header?: Snippet<[boolean]>;
		footer?: Snippet<[boolean]>;
		/** Height/positioning classes for the desktop rail. */
		class?: string;
		id?: string;
		/** id for the mobile drawer (reference it from your MobileMenuButton's `controls`). */
		drawerId?: string;
		mobileDrawer?: boolean;
		variant?: 'default' | 'dark';
	}

	let {
		items,
		activeHref,
		collapsed = $bindable(false),
		expandOnHover = true,
		expandOnClick = true,
		mobileOpen = $bindable(false),
		label = 'Sidebar',
		header,
		footer,
		class: className = 'sticky top-0 h-dvh',
		id,
		drawerId,
		mobileDrawer = true,
		variant = 'default'
	}: Props = $props();

	let peek = $state(false); // temporarily expanded by hover/focus while collapsed
	let timer: ReturnType<typeof setTimeout>;
	let panel: HTMLDivElement;
	onDestroy(() => clearTimeout(timer));

	const narrow = $derived(collapsed && !peek);

	function onpointerenter(e: PointerEvent) {
		if (!collapsed || !expandOnHover || e.pointerType !== 'mouse') return;
		clearTimeout(timer);
		timer = setTimeout(() => (peek = true), 120);
	}
	function onpointerleave(e: PointerEvent) {
		if (e.pointerType !== 'mouse') return;
		clearTimeout(timer);
		if (!panel.contains(document.activeElement)) peek = false;
		else timer = setTimeout(() => (peek = false), 300);
	}
	function onfocusin() {
		if (collapsed && expandOnHover) peek = true;
	}
	function onfocusout(e: FocusEvent) {
		if (!panel.contains(e.relatedTarget as Node)) peek = false;
	}
	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && peek) {
			peek = false;
			(document.activeElement as HTMLElement)?.blur();
		}
	}
	function toggle() {
		collapsed = !collapsed;
		peek = false;
	}
</script>

<!-- Desktop: the outer element reserves layout width; the inner panel animates and can overlay content. -->
<aside
	{id}
	aria-label={label}
	class={cn('relative hidden shrink-0 transition-[width] duration-200 ease-out motion-reduce:transition-none lg:block', collapsed ? 'w-16' : 'w-64', className)}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={panel}
		class={cn(
			'absolute inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r border-border',
			variant === 'dark' ? 'theme-dark bg-background' : 'bg-surface',
			'transition-[width,box-shadow] duration-200 ease-out motion-reduce:transition-none',
			narrow ? 'w-16' : 'w-64',
			collapsed && peek && 'shadow-overlay'
		)}
		{onpointerenter}
		{onpointerleave}
		{onfocusin}
		{onfocusout}
		{onkeydown}
	>
		<div class={cn('flex h-16 shrink-0 items-center gap-2 border-b border-border', narrow ? 'justify-center px-2' : 'justify-between px-3')}>
			{#if !narrow}<div class="min-w-0 overflow-hidden whitespace-nowrap">{@render header?.(narrow)}</div>{/if}
			{#if expandOnClick}
				<MobileMenuButton
					open={!collapsed}
					size="sm"
					label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
					onclick={toggle}
				/>
			{/if}
		</div>
		<nav aria-label={label} class={cn('flex-1 overflow-x-hidden overflow-y-auto py-3 whitespace-nowrap', narrow ? 'px-2' : 'px-3')}>
			<NavTree {items} {activeHref} collapsed={narrow} onexpandrequest={() => (expandOnClick ? (collapsed = false) : (peek = true))} />
		</nav>
		{#if footer}
			<div class={cn('shrink-0 border-t border-border', narrow ? 'p-2' : 'p-3')}>{@render footer(narrow)}</div>
		{/if}
	</div>
</aside>

<!-- Mobile: tap-driven drawer, never hover-dependent. -->
{#if mobileDrawer}
	<div class="lg:hidden">
		<MobileNavigation id={drawerId} bind:open={mobileOpen} {items} {activeHref} {label} header={header ? headerMobile : undefined} footer={footer ? footerMobile : undefined} />
	</div>
{/if}

{#snippet headerMobile()}{@render header?.(false)}{/snippet}
{#snippet footerMobile()}{@render footer?.(false)}{/snippet}
