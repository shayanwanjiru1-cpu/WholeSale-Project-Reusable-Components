<script lang="ts">
	import type { Snippet } from 'svelte';
	import NavTree from './NavTree.svelte';
	import Sheet from '../layout/Sheet.svelte';
	import type { NavItem } from '$lib/types';

	/**
	 * Off-canvas navigation drawer: a Sheet containing a NavTree.
	 * Pair with <MobileMenuButton bind:open controls={id} />.
	 */
	interface Props {
		open?: boolean;
		items: NavItem[];
		activeHref?: string;
		id?: string;
		label?: string;
		side?: 'left' | 'right';
		/** Drawer header content (usually a Logo). */
		header?: Snippet;
		/** Drawer footer (account actions, CTA). */
		footer?: Snippet;
		class?: string;
	}

	let {
		open = $bindable(false),
		items,
		activeHref,
		id,
		label = 'Main navigation',
		side = 'left',
		header,
		footer,
		class: className
	}: Props = $props();
</script>

<Sheet
	bind:open
	{id}
	{side}
	size="sm"
	{label}
	{header}
	footer={footer ? footerSnippet : undefined}
	bodyClass="p-3"
	class={className}
>
	<nav aria-label={label}>
		<NavTree {items} {activeHref} onnavigate={() => (open = false)} />
	</nav>
</Sheet>

{#snippet footerSnippet()}{@render footer?.()}{/snippet}
