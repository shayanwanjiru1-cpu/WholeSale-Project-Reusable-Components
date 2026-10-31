<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import Field from './Field.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props extends Omit<HTMLTextareaAttributes, 'value' | 'class'> {
		label: string;
		value?: string;
		hint?: string;
		error?: string;
		hideLabel?: boolean;
		class?: string;
	}

	let { label, value = $bindable(''), hint, error, hideLabel = false, required = false, rows = 4, id, class: className, ...rest }: Props = $props();
</script>

<Field {label} {hint} {error} required={Boolean(required)} {hideLabel} id={id ?? undefined} class={className}>
	{#snippet children(control)}
		<textarea
			{...rest}
			{...control}
			{rows}
			bind:value
			class={cn('focus-ring w-full rounded-control border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground', error ? 'border-danger' : 'border-border-strong')}
		></textarea>
	{/snippet}
</Field>
