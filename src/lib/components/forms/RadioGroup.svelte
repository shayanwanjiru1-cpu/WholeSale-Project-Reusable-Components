<script lang="ts">
	import { cn } from '$lib/utils/cn';

	/**
	 * Native radio group in a fieldset. `variant="cards"` renders selectable option
	 * cards (payment terms, delivery options) with the brand accent on the selection.
	 */
	interface Option {
		value: string;
		label: string;
		description?: string;
		disabled?: boolean;
		/** Short note shown when disabled ("Requires approval"). */
		badge?: string;
	}
	interface Props {
		legend: string;
		name: string;
		options: Option[];
		value?: string;
		variant?: 'default' | 'cards';
		columns?: 1 | 2 | 3;
		hideLegend?: boolean;
		error?: string;
		class?: string;
	}

	let { legend, name, options, value = $bindable(''), variant = 'default', columns = 1, hideLegend = false, error, class: className }: Props = $props();
	const cols = { 1: '', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' };
</script>

<fieldset class={className} aria-describedby={error ? `${name}-error` : undefined}>
	<legend class={cn('mb-2 text-sm font-medium text-foreground', hideLegend && 'sr-only')}>{legend}</legend>
	<div class={cn('grid gap-2', cols[columns])}>
		{#each options as o (o.value)}
			{@const selected = value === o.value}
			<label
				class={cn(
					'flex cursor-pointer items-start gap-3 text-sm has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60',
					variant === 'cards' && 'rounded-card border bg-surface p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
					variant === 'cards' && (selected ? 'border-brand ring-1 ring-brand' : 'border-border hover:border-border-strong')
				)}
			>
				<input type="radio" {name} value={o.value} bind:group={value} disabled={o.disabled} class={cn('mt-0.5 size-4 shrink-0 accent-[var(--color-primary)]', variant !== 'cards' && 'focus-ring')} />
				<span class="flex flex-col gap-0.5">
					<span class="font-medium text-foreground">{o.label}{#if o.badge}<span class="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs font-normal text-muted-foreground">{o.badge}</span>{/if}</span>
					{#if o.description}<span class="text-xs text-muted-foreground">{o.description}</span>{/if}
				</span>
			</label>
		{/each}
	</div>
	{#if error}<p id="{name}-error" class="mt-2 text-xs font-medium text-danger-strong">{error}</p>{/if}
</fieldset>
