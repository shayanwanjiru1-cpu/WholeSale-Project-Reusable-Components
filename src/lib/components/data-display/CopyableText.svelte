<script lang="ts">
	import CopyButton from '../ui/CopyButton.svelte';
	import { cn } from '$lib/utils/cn';

	/** Short value (SKU, order ID, API key) with a copy button and announced feedback. */
	interface Props {
		value: string;
		/** Visible label before the value. */
		label?: string;
		mono?: boolean;
		truncate?: boolean;
		appearance?: 'plain' | 'field';
		class?: string;
	}

	let { value, label, mono = true, truncate = false, appearance = 'field', class: className }: Props = $props();
</script>

<span class={cn('inline-flex max-w-full items-center gap-1 text-sm', appearance === 'field' && 'rounded-control border border-border bg-muted py-0.5 pr-0.5 pl-3', className)}>
	{#if label}<span class="shrink-0 text-muted-foreground">{label}</span>{/if}
	<span class={cn('min-w-0 text-foreground', mono && 'font-mono', truncate && 'truncate')}>{value}</span>
	<CopyButton {value} label={label ? `Copy ${label}` : `Copy ${value}`} />
</span>
