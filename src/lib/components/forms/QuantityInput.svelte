<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import { cn } from '$lib/utils/cn';

	/**
	 * Quantity stepper: − / number / +. The input stays editable; values below `min`
	 * are allowed while typing and reported through `error` (MOQ validation lives in
	 * the caller so the rule can come from pricing logic).
	 */
	interface Props {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		/** Accessible name, e.g. "Quantity for Long Grain White Rice". */
		label: string;
		/** Unit shown after the number ("bags"). */
		unit?: string;
		error?: string;
		size?: 'sm' | 'md';
		disabled?: boolean;
		onchange?: (value: number) => void;
		id?: string;
		class?: string;
	}

	let { value = $bindable(1), min = 1, max = 99999, step = 1, label, unit, error, size = 'md', disabled = false, onchange, id, class: className }: Props = $props();

	const uid = $props.id();
	const inputId = $derived(id ?? `qty-${uid}`);

	function set(n: number) {
		const next = Math.min(max, Math.max(1, Math.floor(n || 0)));
		value = next;
		onchange?.(next);
	}

	const btn = $derived(cn(
		'focus-ring grid shrink-0 place-items-center text-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-40',
		size === 'sm' ? 'size-8' : 'size-10'
	));
</script>

<div class={cn('flex flex-col gap-1', className)}>
	<div class={cn('inline-flex w-fit items-stretch overflow-hidden rounded-control border bg-surface', error ? 'border-danger' : 'border-border-strong')}>
		<button type="button" class={btn} aria-label="Decrease quantity" disabled={disabled || value <= 1} onclick={() => set(value - step)} aria-controls={inputId}>
			<Icon name="minus" class="size-4" />
		</button>
		<label for={inputId} class="sr-only">{label}</label>
		<input
			id={inputId}
			type="number"
			inputmode="numeric"
			min={1}
			{max}
			{step}
			{disabled}
			value={value}
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={error ? `${inputId}-err` : unit ? `${inputId}-unit` : undefined}
			class={cn('no-spin w-14 border-x border-border bg-transparent text-center text-sm font-semibold text-foreground tabular-nums outline-none focus-visible:bg-muted', size === 'sm' ? 'h-8' : 'h-10')}
			oninput={(e) => {
				const n = parseInt(e.currentTarget.value, 10);
				if (Number.isFinite(n)) {
					value = n;
					onchange?.(n);
				}
			}}
			onblur={(e) => set(parseInt(e.currentTarget.value, 10) || min)}
		/>
		<button type="button" class={btn} aria-label="Increase quantity" disabled={disabled || value >= max} onclick={() => set(value + step)} aria-controls={inputId}>
			<Icon name="plus" class="size-4" />
		</button>
	</div>
	{#if unit && !error}<span id="{inputId}-unit" class="sr-only">{unit}</span>{/if}
	{#if error}
		<p id="{inputId}-err" class="flex items-center gap-1 text-xs font-medium text-danger-strong"><Icon name="alert-circle" class="size-3.5" />{error}</p>
	{/if}
</div>
