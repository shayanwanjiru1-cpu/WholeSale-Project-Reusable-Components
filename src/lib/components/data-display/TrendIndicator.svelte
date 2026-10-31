<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import type { Trend } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/** Up/down change indicator with icon + text, so it doesn't rely on colour. */
	let { trend, class: className }: { trend: Trend; class?: string } = $props();

	const good = $derived(trend.positive ?? trend.direction === 'up');
	const color = $derived(trend.direction === 'flat' ? 'text-muted-foreground' : good ? 'text-success' : 'text-danger');
	const icon = $derived(trend.direction === 'up' ? 'trending-up' : trend.direction === 'down' ? 'trending-down' : 'minus');
	const word = $derived(trend.direction === 'up' ? 'Increased' : trend.direction === 'down' ? 'Decreased' : 'Unchanged');
</script>

<span class={cn('inline-flex items-center gap-1 text-sm font-medium', color, className)}>
	<Icon name={icon} class="size-4" />
	<span><span class="sr-only">{word} by </span>{trend.value}</span>
	{#if trend.label}<span class="font-normal text-muted-foreground">{trend.label}</span>{/if}
</span>
