<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { clamp } from '$lib/utils/format';
	import type { Tone } from '$lib/utils/tones';

	interface Props {
		/** 0–max. Omit for an indeterminate bar. */
		value?: number;
		max?: number;
		label: string;
		showLabel?: boolean;
		showValue?: boolean;
		size?: 'sm' | 'md' | 'lg';
		variant?: Tone;
		class?: string;
	}

	let { value, max = 100, label, showLabel = true, showValue = true, size = 'md', variant = 'primary', class: className }: Props = $props();

	const indeterminate = $derived(value === undefined);
	const pct = $derived(indeterminate ? 0 : Math.round((clamp(value!, 0, max) / max) * 100));
	const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
	const fills: Record<Tone, string> = {
		neutral: 'bg-muted-foreground',
		primary: 'bg-primary',
		success: 'bg-success',
		warning: 'bg-warning',
		error: 'bg-danger',
		info: 'bg-info'
	};
</script>

<div class={cn('w-full', className)}>
	{#if showLabel || (showValue && !indeterminate)}
		<div class="mb-1.5 flex items-center justify-between gap-2 text-sm">
			<span class={showLabel ? 'font-medium text-foreground' : 'sr-only'}>{label}</span>
			{#if showValue && !indeterminate}<span class="text-muted-foreground tabular-nums" aria-hidden="true">{pct}%</span>{/if}
		</div>
	{/if}
	<div
		role="progressbar"
		aria-label={label}
		aria-valuemin={indeterminate ? undefined : 0}
		aria-valuemax={indeterminate ? undefined : max}
		aria-valuenow={indeterminate ? undefined : value}
		aria-valuetext={indeterminate ? 'Loading' : `${pct}%`}
		class={cn('relative w-full overflow-hidden rounded-full bg-muted', heights[size])}
	>
		{#if indeterminate}
			<div class={cn('absolute inset-y-0 w-2/5 rounded-full animate-indeterminate motion-reduce:w-full motion-reduce:animate-none motion-reduce:opacity-40', fills[variant])}></div>
		{:else}
			<div class={cn('h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none', fills[variant])} style:width="{pct}%"></div>
		{/if}
	</div>
</div>
