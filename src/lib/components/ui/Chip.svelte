<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';
	import { cn } from '$lib/utils/cn';

	/**
	 * Chip / Tag. Static by default; becomes a toggle button with `selectable`,
	 * and shows a remove button when `onremove` is supplied.
	 */
	interface Props {
		icon?: IconName;
		size?: 'sm' | 'md';
		selectable?: boolean;
		selected?: boolean;
		disabled?: boolean;
		onremove?: () => void;
		/** Accessible label for the remove button. Defaults to "Remove". */
		removeLabel?: string;
		class?: string;
		children: Snippet;
	}

	let {
		icon,
		size = 'md',
		selectable = false,
		selected = $bindable(false),
		disabled = false,
		onremove,
		removeLabel = 'Remove',
		class: className,
		children
	}: Props = $props();

	const base = $derived(
		cn(
			'inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors motion-reduce:transition-none',
			size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3 text-sm',
			selected
				? 'border-primary bg-accent text-accent-foreground'
				: 'border-border-strong bg-surface text-foreground',
			disabled && 'opacity-50',
			className
		)
	);
</script>

{#if selectable}
	<button
		type="button"
		class={cn(base, 'focus-ring hover:bg-muted', selected && 'hover:bg-accent')}
		aria-pressed={selected}
		{disabled}
		onclick={() => (selected = !selected)}
	>
		{#if selected}<Icon name="check" class="size-3.5" />{:else if icon}<Icon name={icon} class="size-3.5" />{/if}
		{@render children()}
	</button>
{:else}
	<span class={cn(base, onremove && 'pr-1')}>
		{#if icon}<Icon name={icon} class="size-3.5" />{/if}
		<span>{@render children()}</span>
		{#if onremove}
			<button
				type="button"
				class="focus-ring -my-1 grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
				aria-label={removeLabel}
				{disabled}
				onclick={onremove}
			>
				<Icon name="x" class="size-3.5" />
			</button>
		{/if}
	</span>
{/if}
