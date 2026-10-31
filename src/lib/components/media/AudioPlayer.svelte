<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import Collapsible from '../data-display/Collapsible.svelte';
	import { cn } from '$lib/utils/cn';

	/** Titled native audio player with optional artwork and transcript. */
	interface Props {
		src: string;
		title: string;
		subtitle?: string;
		cover?: string;
		duration?: string;
		transcript?: string;
		preload?: 'none' | 'metadata' | 'auto';
		class?: string;
	}

	let { src, title, subtitle, cover, duration, transcript, preload = 'metadata', class: className }: Props = $props();
</script>

<section aria-label="Audio: {title}" class={cn('flex flex-col gap-3 rounded-card border border-border bg-surface p-4 shadow-card', className)}>
	<div class="flex items-center gap-3">
		{#if cover}
			<img src={cover} alt="" class="size-14 shrink-0 rounded-lg object-cover" />
		{:else}
			<span class="grid size-14 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"><Icon name="music" class="size-6" /></span>
		{/if}
		<div class="min-w-0 flex-1">
			<p class="truncate text-sm font-semibold text-foreground">{title}</p>
			{#if subtitle || duration}
				<p class="truncate text-sm text-muted-foreground">{[subtitle, duration].filter(Boolean).join(' · ')}</p>
			{/if}
		</div>
	</div>
	<audio class="h-10 w-full" controls {src} {preload} aria-label={title}>
		Your browser does not support embedded audio. <a href={src}>Download the audio</a>.
	</audio>
	{#if transcript}
		<Collapsible title="Transcript" class="-mb-4 border-t border-border">{transcript}</Collapsible>
	{/if}
</section>
