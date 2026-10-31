<script lang="ts">
	import NavTree from './NavTree.svelte';
	import Icon from '../ui/Icon.svelte';
	import type { NavItem } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/**
	 * Vertical, nested navigation list with disclosure groups. Shared by
	 * MobileNavigation, Sidebar and NavigationMenu (vertical orientation).
	 */
	interface Props {
		items: NavItem[];
		activeHref?: string;
		/** Icon-rail mode: labels are visually hidden (still read by screen readers). */
		collapsed?: boolean;
		depth?: number;
		onnavigate?: () => void;
		/** Called when a group is activated while collapsed (e.g. Sidebar expands itself). */
		onexpandrequest?: () => void;
		class?: string;
	}

	let { items, activeHref, collapsed = false, depth = 0, onnavigate, onexpandrequest, class: className }: Props = $props();

	const uid = $props.id();

	function childrenOf(item: NavItem): NavItem[] | undefined {
		if (item.children) return item.children;
		if (item.mega) return item.mega.groups.map((g) => ({ label: g.heading, children: g.links }));
		return undefined;
	}

	function containsActive(item: NavItem): boolean {
		if (!activeHref) return false;
		if (item.href === activeHref) return true;
		return (childrenOf(item) ?? []).some(containsActive);
	}

	// Groups containing the active page start open.
	let openGroups = $state<Record<string, boolean>>({});
	const isOpen = (item: NavItem) => openGroups[item.label] ?? containsActive(item);

	function toggle(item: NavItem) {
		if (collapsed) {
			openGroups[item.label] = true;
			onexpandrequest?.();
			return;
		}
		openGroups[item.label] = !isOpen(item);
	}

	const row = (active: boolean) =>
		cn(
			'focus-ring flex w-full items-center gap-3 rounded-md text-sm font-medium transition-colors motion-reduce:transition-none',
			depth === 0 ? 'min-h-10 px-3 py-2' : 'min-h-9 px-3 py-1.5',
			collapsed && 'justify-center px-0',
			// Active: tinted background + red bar + bold weight (not colour alone), plus aria-current.
			active
				? 'relative bg-accent font-semibold text-accent-foreground before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-brand'
				: 'text-muted-foreground hover:bg-muted hover:text-foreground'
		);
</script>

<ul class={cn('flex flex-col gap-0.5', depth > 0 && 'mt-0.5 ml-4 border-l border-border pl-2', className)}>
	{#each items as item, i (item.label + i)}
		{@const kids = childrenOf(item)}
		{@const active = item.href === activeHref}
		<li>
			{#if kids}
				{@const open = isOpen(item) && !collapsed}
				<button
					type="button"
					class={row(collapsed && containsActive(item))}
					aria-expanded={open}
					aria-controls="navtree-{uid}-{i}"
					title={collapsed ? item.label : undefined}
					disabled={item.disabled}
					onclick={() => toggle(item)}
				>
					{#if item.icon}<Icon name={item.icon} class="size-5" />{/if}
					<span class={cn('flex-1 truncate text-left', collapsed && 'sr-only')}>{item.label}</span>
					{#if !collapsed}
						<Icon name="chevron-down" class={cn('size-4 transition-transform motion-reduce:transition-none', open && 'rotate-180')} />
					{/if}
				</button>
				<div id="navtree-{uid}-{i}" hidden={!open}>
					{#if open}
						<NavTree items={kids} {activeHref} depth={depth + 1} {onnavigate} />
					{/if}
				</div>
			{:else}
				<a
					href={item.href}
					class={cn(row(active), item.disabled && 'pointer-events-none opacity-50')}
					aria-current={active ? 'page' : undefined}
					aria-disabled={item.disabled ? 'true' : undefined}
					title={collapsed ? item.label : undefined}
					target={item.external ? '_blank' : undefined}
					rel={item.external ? 'noopener noreferrer' : undefined}
					onclick={onnavigate}
				>
					{#if item.icon}<Icon name={item.icon} class="size-5" />{/if}
					<span class={cn('flex-1 truncate', collapsed && 'sr-only')}>{item.label}</span>
					{#if item.badge !== undefined && !collapsed}
						<span class="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">{item.badge}</span>
					{/if}
				</a>
			{/if}
		</li>
	{/each}
</ul>
