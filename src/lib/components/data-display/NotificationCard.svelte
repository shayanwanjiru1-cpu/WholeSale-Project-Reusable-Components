<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../ui/Icon.svelte';
	import type { IconName } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { toneIcon, toneSoft, type Tone } from '$lib/utils/tones';

	/**
	 * Inline message / alert. Use `live` for messages that appear dynamically so they're
	 * announced ("polite" → status, "assertive" → alert).
	 */
	interface Props {
		title: string;
		message?: string;
		tone?: Tone;
		icon?: IconName;
		time?: string;
		unread?: boolean;
		appearance?: 'card' | 'soft';
		live?: 'polite' | 'assertive';
		ondismiss?: () => void;
		actions?: Snippet;
		class?: string;
	}

	let {
		title,
		message,
		tone = 'info',
		icon,
		time,
		unread = false,
		appearance = 'card',
		live,
		ondismiss,
		actions,
		class: className
	}: Props = $props();

	const accent: Record<Tone, string> = {
		neutral: 'border-l-border-strong',
		primary: 'border-l-primary',
		success: 'border-l-success',
		warning: 'border-l-warning',
		error: 'border-l-danger',
		info: 'border-l-info'
	};
</script>

<div
	role={live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined}
	class={cn(
		'relative flex gap-3 rounded-card p-4',
		appearance === 'card' ? cn('border border-l-4 border-border bg-surface shadow-card', accent[tone]) : toneSoft[tone],
		className
	)}
>
	<span class={cn('grid size-9 shrink-0 place-items-center rounded-full', appearance === 'card' ? toneSoft[tone] : 'bg-surface/60')}>
		<Icon name={icon ?? toneIcon[tone]} class="size-5" />
	</span>
	<div class="min-w-0 flex-1">
		<div class="flex items-start gap-2">
			<p class={cn('flex-1 text-sm font-semibold', appearance === 'card' && 'text-foreground')}>
				{#if unread}<span class="mr-1.5 inline-block size-2 rounded-full bg-primary align-middle" aria-hidden="true"></span><span class="sr-only">Unread: </span>{/if}{title}
			</p>
			{#if time}<span class="shrink-0 text-xs opacity-75">{time}</span>{/if}
		</div>
		{#if message}<p class={cn('mt-1 text-sm', appearance === 'card' && 'text-muted-foreground')}>{message}</p>{/if}
		{#if actions}<div class="mt-3 flex flex-wrap gap-2">{@render actions()}</div>{/if}
	</div>
	{#if ondismiss}
		<button type="button" class="focus-ring -mt-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-md opacity-70 hover:bg-muted hover:opacity-100" aria-label="Dismiss notification" onclick={ondismiss}>
			<Icon name="x" class="size-4" />
		</button>
	{/if}
</div>
