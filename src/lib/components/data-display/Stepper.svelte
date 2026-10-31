<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import type { StepItem, StepStatus } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/**
	 * Progress through a multi-step process. Status comes from each step's `status`
	 * or is derived from `current` (0-based index).
	 */
	interface Props {
		steps: StepItem[];
		current?: number;
		orientation?: 'horizontal' | 'vertical';
		label?: string;
		class?: string;
	}

	let { steps, current = 0, orientation = 'horizontal', label = 'Progress', class: className }: Props = $props();

	const statusOf = (s: StepItem, i: number): StepStatus => s.status ?? (i < current ? 'complete' : i === current ? 'current' : 'upcoming');
	const statusText: Record<StepStatus, string> = { complete: 'Completed', current: 'Current step', upcoming: 'Upcoming', error: 'Error' };
	const marker: Record<StepStatus, string> = {
		complete: 'bg-primary text-primary-foreground',
		current: 'border-2 border-primary bg-surface text-primary-text',
		upcoming: 'border-2 border-border-strong bg-surface text-muted-foreground',
		error: 'bg-danger text-white'
	};
	const horizontal = $derived(orientation === 'horizontal');
</script>

<nav aria-label={label} class={className}>
	<ol class={cn('flex', horizontal ? 'flex-col gap-4 sm:flex-row sm:gap-0' : 'flex-col')}>
		{#each steps as step, i (step.label)}
			{@const status = statusOf(step, i)}
			{@const last = i === steps.length - 1}
			<li class={cn('relative flex gap-3', horizontal ? 'sm:flex-1 sm:flex-col sm:items-center sm:text-center' : 'pb-8 last:pb-0')} aria-current={status === 'current' ? 'step' : undefined}>
				{#if !last}
					<span
						class={cn(
							'absolute',
							horizontal ? 'top-4 left-[calc(50%+1.25rem)] hidden h-0.5 w-[calc(100%-2.5rem)] sm:block' : 'top-9 bottom-1 left-4 w-0.5 -translate-x-1/2',
							status === 'complete' ? 'bg-primary' : 'bg-border'
						)}
						aria-hidden="true"
					></span>
				{/if}
				<span class={cn('relative z-10 grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold', marker[status])}>
					{#if status === 'complete'}<Icon name="check" class="size-4" />
					{:else if status === 'error'}<Icon name="x" class="size-4" />
					{:else}{i + 1}{/if}
				</span>
				<span class={cn('flex flex-col', horizontal && 'sm:px-2')}>
					<span class={cn('text-sm font-medium', status === 'upcoming' ? 'text-muted-foreground' : status === 'error' ? 'text-danger' : 'text-foreground')}>{step.label}</span>
					<span class="sr-only">({statusText[status]})</span>
					{#if step.description}<span class="text-xs text-muted-foreground">{step.description}</span>{/if}
				</span>
			</li>
		{/each}
	</ol>
</nav>
