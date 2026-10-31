<script lang="ts">
	import type { Snippet } from 'svelte';
	import Collapsible from './Collapsible.svelte';
	import type { HeadingLevel, IconName } from '$lib/types';
	import { moveFocus } from '$lib/utils/actions';
	import { cn } from '$lib/utils/cn';

	/**
	 * Group of Collapsibles. `type="single"` keeps at most one open; `multiple` allows any.
	 * Up/Down/Home/End move focus between headers (WAI-ARIA accordion pattern).
	 */
	interface Item {
		id: string;
		title: string;
		content?: string;
		icon?: IconName;
		disabled?: boolean;
	}
	interface Props {
		items: Item[];
		type?: 'single' | 'multiple';
		/** ids of open items. */
		value?: string[];
		variant?: 'default' | 'bordered' | 'separated';
		headingLevel?: HeadingLevel;
		/** Rich content per item (falls back to item.content). */
		content?: Snippet<[Item]>;
		class?: string;
	}

	let { items, type = 'single', value = $bindable([]), variant = 'default', headingLevel = 3, content, class: className }: Props = $props();

	let root: HTMLDivElement;

	function setOpen(id: string, open: boolean) {
		if (type === 'single') value = open ? [id] : [];
		else value = open ? [...value, id] : value.filter((v) => v !== id);
	}

	function onkeydown(e: KeyboardEvent) {
		const target = e.target as HTMLElement;
		if (!target.matches('[data-collapsible-trigger]') || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
		e.preventDefault();
		moveFocus(Array.from(root.querySelectorAll<HTMLElement>('[data-collapsible-trigger]:not([disabled])')), target, e.key);
	}

	const wrap = {
		default: 'divide-y divide-border border-y border-border',
		bordered: 'divide-y divide-border rounded-card border border-border bg-surface px-4',
		separated: 'flex flex-col gap-3'
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div bind:this={root} class={cn(wrap[variant], className)} {onkeydown}>
	{#each items as item (item.id)}
		<Collapsible
			title={item.title}
			icon={item.icon}
			disabled={item.disabled}
			{headingLevel}
			variant={variant === 'separated' ? 'bordered' : 'default'}
			bind:open={() => value.includes(item.id), (v) => setOpen(item.id, v)}
		>
			{#if content}{@render content(item)}{:else}{item.content}{/if}
		</Collapsible>
	{/each}
</div>
