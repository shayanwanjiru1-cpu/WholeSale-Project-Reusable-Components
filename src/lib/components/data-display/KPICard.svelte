<script lang="ts">
	import Card from './Card.svelte';
	import TrendIndicator from './TrendIndicator.svelte';
	import ProgressBar from '../feedback/ProgressBar.svelte';
	import StatusBadge from '../ui/StatusBadge.svelte';
	import type { Trend } from '$lib/types';
	import type { Tone } from '$lib/utils/tones';

	/** A metric measured against a target: value, target, progress and status. */
	interface Props {
		label: string;
		value: string | number;
		target?: string | number;
		/** 0–100 progress toward target. */
		progress?: number;
		status?: { label: string; tone: Tone };
		trend?: Trend;
		footnote?: string;
		class?: string;
	}

	let { label, value, target, progress, status, trend, footnote, class: className }: Props = $props();
	const progressTone = $derived<Tone>(status?.tone ?? 'primary');
</script>

<Card class={className}>
	<div class="flex flex-col gap-4 p-5">
		<div class="flex items-start justify-between gap-3">
			<p class="text-sm font-medium text-muted-foreground">{label}</p>
			{#if status}<StatusBadge status={status.tone} label={status.label} size="sm" />{/if}
		</div>
		<div class="flex flex-wrap items-baseline gap-x-2">
			<span class="text-3xl font-bold tracking-tight tabular-nums">{value}</span>
			{#if target !== undefined}<span class="text-sm text-muted-foreground">of {target} target</span>{/if}
		</div>
		{#if progress !== undefined}
			<ProgressBar value={progress} label="{label} progress" showLabel={false} size="sm" variant={progressTone} />
		{/if}
		{#if trend || footnote}
			<div class="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
				{#if trend}<TrendIndicator {trend} />{/if}
				{#if footnote}<span class="text-xs text-muted-foreground">{footnote}</span>{/if}
			</div>
		{/if}
	</div>
</Card>
