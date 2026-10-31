<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { clamp } from '$lib/utils/format';
	import type { Tone } from '$lib/utils/tones';

	interface Props {
		/** 0–max. Omit for an indeterminate spinner-style ring. */
		value?: number;
		max?: number;
		label: string;
		showValue?: boolean;
		size?: 'sm' | 'md' | 'lg';
		variant?: Tone;
		class?: string;
	}

	let { value, max = 100, label, showValue = true, size = 'md', variant = 'primary', class: className }: Props = $props();

	const R = 16;
	const C = 2 * Math.PI * R;
	const indeterminate = $derived(value === undefined);
	const pct = $derived(indeterminate ? 25 : Math.round((clamp(value!, 0, max) / max) * 100));
	const sizes = { sm: 'size-10 text-[0.625rem]', md: 'size-16 text-sm', lg: 'size-24 text-lg' };
	const strokes: Record<Tone, string> = {
		neutral: 'text-muted-foreground',
		primary: 'text-primary-text',
		success: 'text-success',
		warning: 'text-warning',
		error: 'text-danger',
		info: 'text-info'
	};
</script>

<div
	role="progressbar"
	aria-label={label}
	aria-valuemin={indeterminate ? undefined : 0}
	aria-valuemax={indeterminate ? undefined : max}
	aria-valuenow={indeterminate ? undefined : value}
	aria-valuetext={indeterminate ? 'Loading' : `${pct}%`}
	class={cn('relative inline-grid shrink-0 place-items-center', sizes[size], className)}
>
	<svg viewBox="0 0 40 40" class={cn('size-full -rotate-90', indeterminate && 'animate-spin motion-reduce:animate-none')} aria-hidden="true">
		<circle cx="20" cy="20" r={R} fill="none" stroke="currentColor" stroke-width="4" class="text-muted" />
		<circle
			cx="20"
			cy="20"
			r={R}
			fill="none"
			stroke="currentColor"
			stroke-width="4"
			stroke-linecap="round"
			stroke-dasharray={C}
			stroke-dashoffset={C - (pct / 100) * C}
			class={cn('transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none', strokes[variant])}
		/>
	</svg>
	{#if showValue && !indeterminate}
		<span class="absolute font-semibold text-foreground tabular-nums" aria-hidden="true">{pct}%</span>
	{/if}
</div>
