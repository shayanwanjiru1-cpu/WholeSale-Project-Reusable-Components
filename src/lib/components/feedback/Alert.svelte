<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../ui/Icon.svelte';
	import type { IconName } from '$lib/types';
	import { toneIcon, toneSoft, type Tone } from '$lib/utils/tones';
	import { cn } from '$lib/utils/cn';

	/** Inline message banner (MOQ warnings, approval notices, form errors). */
	interface Props {
		tone?: Tone;
		title?: string;
		icon?: IconName;
		/** `alert` interrupts screen readers; use for errors that block progress. */
		role?: 'status' | 'alert' | 'note';
		ondismiss?: () => void;
		actions?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let { tone = 'info', title, icon, role = 'note', ondismiss, actions, children, class: className }: Props = $props();
	const borders: Record<Tone, string> = {
		neutral: 'border-l-border-strong',
		primary: 'border-l-brand',
		success: 'border-l-success',
		warning: 'border-l-warning',
		error: 'border-l-danger',
		info: 'border-l-info'
	};
</script>

<div {role} class={cn('flex gap-3 rounded-card border border-l-4 border-border p-4 text-sm', toneSoft[tone], borders[tone], className)}>
	<Icon name={icon ?? toneIcon[tone]} class="mt-0.5 size-5 shrink-0" />
	<div class="min-w-0 flex-1">
		{#if title}<p class="font-semibold">{title}</p>{/if}
		{#if children}<div class={cn('text-foreground/90', title && 'mt-0.5')}>{@render children()}</div>{/if}
		{#if actions}<div class="mt-3 flex flex-wrap gap-2">{@render actions()}</div>{/if}
	</div>
	{#if ondismiss}
		<button type="button" class="focus-ring -m-1 grid size-8 shrink-0 place-items-center rounded hover:bg-black/5" aria-label="Dismiss" onclick={ondismiss}><Icon name="x" class="size-4" /></button>
	{/if}
</div>
