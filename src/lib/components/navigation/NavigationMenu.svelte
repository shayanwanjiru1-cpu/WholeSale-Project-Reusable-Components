<script lang="ts">
	import NavigationMenuItem from './NavigationMenuItem.svelte';
	import NavTree from './NavTree.svelte';
	import type { NavItem } from '$lib/types';
	import type { TriggerMode } from '$lib/utils/disclosure.svelte';
	import { cn } from '$lib/utils/cn';

	/**
	 * Data-driven site navigation.
	 * - horizontal: links + disclosure dropdowns / mega menus (desktop header)
	 * - vertical: nested expandable list (drawers, sidebars, footers)
	 * Uses the disclosure pattern (not role="menu"), as recommended for site navigation.
	 */
	interface Props {
		items: NavItem[];
		activeHref?: string;
		orientation?: 'horizontal' | 'vertical';
		/** How dropdowns open in horizontal mode. */
		trigger?: TriggerMode;
		label?: string;
		onnavigate?: () => void;
		class?: string;
	}

	let {
		items,
		activeHref,
		orientation = 'horizontal',
		trigger = 'click-or-hover',
		label = 'Main',
		onnavigate,
		class: className
	}: Props = $props();

	// Only one dropdown open at a time.
	let openIndex = $state<number | null>(null);
</script>

<nav aria-label={label} class={className}>
	{#if orientation === 'horizontal'}
		<ul class="flex items-center gap-1">
			{#each items as item, i (i)}
				<NavigationMenuItem
					{item}
					{activeHref}
					{trigger}
					bind:open={() => openIndex === i, (v) => (openIndex = v ? i : openIndex === i ? null : openIndex)}
				/>
			{/each}
		</ul>
	{:else}
		<NavTree {items} {activeHref} {onnavigate} />
	{/if}
</nav>
