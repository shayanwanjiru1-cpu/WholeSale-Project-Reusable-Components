<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import Field from './Field.svelte';
	import Icon from '../ui/Icon.svelte';
	import { cn } from '$lib/utils/cn';

	interface Option {
		value: string;
		label: string;
		disabled?: boolean;
	}
	interface Props extends Omit<HTMLSelectAttributes, 'value' | 'size' | 'class'> {
		label: string;
		options: Option[];
		value?: string;
		placeholder?: string;
		hint?: string;
		error?: string;
		hideLabel?: boolean;
		size?: 'sm' | 'md';
		class?: string;
	}

	let { label, options, value = $bindable(''), placeholder, hint, error, hideLabel = false, required = false, size = 'md', id, class: className, ...rest }: Props = $props();
</script>

<Field {label} {hint} {error} required={Boolean(required)} {hideLabel} id={id ?? undefined} class={className}>
	{#snippet children(control)}
		<div class="relative">
			<select
				{...rest}
				{...control}
				bind:value
				class={cn(
					'focus-ring w-full appearance-none rounded-control border bg-surface pr-9 pl-3 text-sm text-foreground',
					error ? 'border-danger' : 'border-border-strong',
					size === 'sm' ? 'h-9' : 'h-11'
				)}
			>
				{#if placeholder}<option value="" disabled>{placeholder}</option>{/if}
				{#each options as o (o.value)}<option value={o.value} disabled={o.disabled}>{o.label}</option>{/each}
			</select>
			<Icon name="chevron-down" class="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
		</div>
	{/snippet}
</Field>
