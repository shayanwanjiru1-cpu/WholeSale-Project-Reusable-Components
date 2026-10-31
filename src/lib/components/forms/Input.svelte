<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Field from './Field.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props extends Omit<HTMLInputAttributes, 'value' | 'size' | 'class'> {
		label: string;
		value?: string | number | null;
		hint?: string;
		error?: string;
		hideLabel?: boolean;
		size?: 'sm' | 'md';
		class?: string;
	}

	let { label, value = $bindable(''), hint, error, hideLabel = false, required = false, size = 'md', id, class: className, ...rest }: Props = $props();
</script>

<Field {label} {hint} {error} required={Boolean(required)} {hideLabel} id={id ?? undefined} class={className}>
	{#snippet children(control)}
		<input
			{...rest}
			{...control}
			bind:value
			class={cn(
				'focus-ring w-full rounded-control border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50',
				error ? 'border-danger' : 'border-border-strong',
				size === 'sm' ? 'h-9' : 'h-11'
			)}
		/>
	{/snippet}
</Field>
