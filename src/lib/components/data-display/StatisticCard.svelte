<script lang="ts">
	import Card from './Card.svelte';
	import TrendIndicator from './TrendIndicator.svelte';
	import Icon from '../ui/Icon.svelte';
	import type { IconName, Trend } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { toneSoft, type Tone } from '$lib/utils/tones';

	/** A single headline number with label, optional icon and trend. */
	interface Props {
		label: string;
		value: string | number;
		icon?: IconName;
		tone?: Tone;
		trend?: Trend;
		description?: string;
		variant?: 'default' | 'outlined' | 'elevated' | 'flat';
		class?: string;
	}

	let { label, value, icon, tone = 'primary', trend, description, variant = 'default', class: className }: Props = $props();
</script>

<Card {variant} class={cn('p-5', className)}>
	<div class="flex items-start justify-between gap-4">
		<dl class="min-w-0">
			<dt class="truncate text-sm font-medium text-muted-foreground">{label}</dt>
			<dd class="mt-1 text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">{value}</dd>
		</dl>
		{#if icon}
			<span class={cn('grid size-10 shrink-0 place-items-center rounded-lg', toneSoft[tone])}><Icon name={icon} class="size-5" /></span>
		{/if}
	</div>
	{#if trend || description}
		<div class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
			{#if trend}<TrendIndicator {trend} />{/if}
			{#if description}<span class="text-sm text-muted-foreground">{description}</span>{/if}
		</div>
	{/if}
</Card>
