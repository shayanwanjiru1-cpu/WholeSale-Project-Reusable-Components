<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Icon from './Icon.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props extends Omit<HTMLInputAttributes, 'value' | 'size' | 'class'> {
		value?: string;
		/** Visible or screen-reader label. */
		label?: string;
		hideLabel?: boolean;
		size?: 'sm' | 'md';
		class?: string;
	}

	let {
		value = $bindable(''),
		label = 'Search',
		hideLabel = true,
		size = 'md',
		placeholder = 'Search…',
		class: className,
		id: providedId,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const id = $derived(providedId ?? `search-${uid}`);
</script>

<div class={cn('flex flex-col gap-1.5', className)}>
	<label for={id} class={hideLabel ? 'sr-only' : 'text-sm font-medium'}>{label}</label>
	<div class="relative">
		<Icon name="search" class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
		<input
			{id}
			type="search"
			bind:value
			{placeholder}
			{...rest}
			class={cn(
				'focus-ring w-full rounded-control border border-border-strong bg-surface pr-9 pl-9 text-sm text-foreground placeholder:text-muted-foreground',
				'[&::-webkit-search-cancel-button]:hidden',
				size === 'sm' ? 'h-9' : 'h-10'
			)}
		/>
		{#if value}
			<button
				type="button"
				class="focus-ring absolute top-1/2 right-1.5 grid size-7 -translate-y-1/2 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
				aria-label="Clear search"
				onclick={() => (value = '')}
			>
				<Icon name="x" class="size-4" />
			</button>
		{/if}
	</div>
</div>
