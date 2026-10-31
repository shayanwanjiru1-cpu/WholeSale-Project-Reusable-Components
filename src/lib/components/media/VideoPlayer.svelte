<script lang="ts">
	import { cn } from '$lib/utils/cn';

	/**
	 * Responsive wrapper around the native <video> element (native controls are
	 * keyboard- and screen-reader accessible). Supply caption tracks for spoken content.
	 */
	interface Props {
		src?: string;
		sources?: { src: string; type: string }[];
		poster?: string;
		/** Accessible name for the player. */
		title: string;
		caption?: string;
		tracks?: { src: string; srclang: string; label: string; kind?: 'captions' | 'subtitles' | 'descriptions'; default?: boolean }[];
		aspect?: '16/9' | '4/3' | '1/1' | '9/16';
		controls?: boolean;
		autoplay?: boolean;
		muted?: boolean;
		loop?: boolean;
		preload?: 'none' | 'metadata' | 'auto';
		paused?: boolean;
		class?: string;
	}

	let {
		src,
		sources = [],
		poster,
		title,
		caption,
		tracks = [],
		aspect = '16/9',
		controls = true,
		autoplay = false,
		muted = autoplay,
		loop = false,
		preload = 'metadata',
		paused = $bindable(true),
		class: className
	}: Props = $props();

	const aspects = { '16/9': 'aspect-video', '4/3': 'aspect-[4/3]', '1/1': 'aspect-square', '9/16': 'aspect-[9/16]' };
</script>

<figure class={cn('flex flex-col gap-2', className)}>
	<div class={cn('overflow-hidden rounded-card bg-black', aspects[aspect])}>
		<!-- svelte-ignore a11y_media_has_caption -->
		<video
			class="size-full"
			{src}
			{poster}
			{controls}
			{autoplay}
			{muted}
			{loop}
			{preload}
			playsinline
			aria-label={title}
			bind:paused
		>
			{#each sources as s (s.src)}<source src={s.src} type={s.type} />{/each}
			{#each tracks as t (t.src)}<track kind={t.kind ?? 'captions'} src={t.src} srclang={t.srclang} label={t.label} default={t.default} />{/each}
			Your browser does not support embedded video.
		</video>
	</div>
	{#if caption}<figcaption class="text-sm text-muted-foreground">{caption}</figcaption>{/if}
</figure>
