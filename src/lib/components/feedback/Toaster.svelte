<script lang="ts">
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import Icon from '../ui/Icon.svelte';
	import { toasts } from '$lib/stores/toast.svelte';
	import { toneIcon, toneText } from '$lib/utils/tones';

	/** Renders the toast queue in a polite live region (bottom-right, bottom on mobile). */
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
</script>

<div class="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end" role="status" aria-live="polite" aria-relevant="additions">
	{#each toasts.items as t (t.id)}
		<div class="theme-dark pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border border-border bg-surface p-4 text-foreground shadow-overlay" transition:fly={{ y: 16, duration }}>
			<Icon name={toneIcon[t.tone]} class="mt-0.5 size-5 shrink-0 {toneText[t.tone]}" />
			<div class="min-w-0 flex-1">
				<p class="text-sm font-semibold">{t.title}</p>
				{#if t.description}<p class="mt-0.5 text-sm text-muted-foreground">{t.description}</p>{/if}
				{#if t.action}<a href={t.action.href} class="focus-ring mt-2 inline-flex items-center gap-1 rounded text-sm font-semibold text-primary-text hover:underline" onclick={() => toasts.dismiss(t.id)}>{t.action.label}<Icon name="arrow-right" class="size-4" /></a>{/if}
			</div>
			<button type="button" class="focus-ring -m-1 grid size-8 shrink-0 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Dismiss notification" onclick={() => toasts.dismiss(t.id)}><Icon name="x" class="size-4" /></button>
		</div>
	{/each}
</div>
