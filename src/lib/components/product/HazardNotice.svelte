<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import type { HazardInfo } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/**
	 * Responsible-handling notice for chemicals and strong cleaners. Uses a hazard
	 * icon + signal word + text (not colour alone).
	 */
	interface Props {
		hazard: HazardInfo;
		variant?: 'inline' | 'full';
		class?: string;
	}

	let { hazard, variant = 'inline', class: className }: Props = $props();
	const danger = $derived(hazard.signal === 'Danger');
</script>

{#if variant === 'inline'}
	<p class={cn('flex items-start gap-1.5 text-xs font-medium', danger ? 'text-danger-strong' : 'text-warning-strong', className)}>
		<Icon name="alert-triangle" class="mt-px size-3.5" />
		<span><span class="font-bold uppercase">{hazard.signal}:</span> {hazard.note}</span>
	</p>
{:else}
	<div role="note" aria-label="Safety information" class={cn('rounded-card border-2 p-4', danger ? 'border-danger/50 bg-danger-soft' : 'border-warning/50 bg-warning-soft', className)}>
		<p class={cn('flex items-center gap-2 font-bold uppercase', danger ? 'text-danger-strong' : 'text-warning-strong')}>
			<Icon name="alert-triangle" class="size-5" />{hazard.signal}
		</p>
		<ul class="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm text-foreground">
			{#each hazard.statements as s (s)}<li>{s}</li>{/each}
		</ul>
		<p class="mt-3 text-xs text-muted-foreground">Safety data sheet supplied with every order. Sold for trade and professional use; store as labelled, away from food.</p>
	</div>
{/if}
