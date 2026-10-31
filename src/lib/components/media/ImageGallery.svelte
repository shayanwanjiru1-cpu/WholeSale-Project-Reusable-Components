<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import Lightbox from './Lightbox.svelte';
	import type { MediaImage } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/**
	 * Main image + thumbnails with prev/next. ←/→ work when the gallery has focus.
	 * Set `lightbox` to open the active image fullscreen.
	 */
	interface Props {
		images: MediaImage[];
		index?: number;
		thumbnails?: 'bottom' | 'side' | 'none';
		aspect?: 'square' | 'landscape' | 'portrait';
		lightbox?: boolean;
		label?: string;
		class?: string;
	}

	let { images, index = $bindable(0), thumbnails = 'bottom', aspect = 'square', lightbox = true, label = 'Image gallery', class: className }: Props = $props();

	let lightboxOpen = $state(false);
	const current = $derived(images[index]);
	const go = (delta: number) => (index = (index + delta + images.length) % images.length);
	const aspects = { square: 'aspect-square', landscape: 'aspect-[4/3]', portrait: 'aspect-[3/4]' };
	const side = $derived(thumbnails === 'side');

	function onkeydown(e: KeyboardEvent) {
		if ((e.target as HTMLElement).closest('[data-thumbs]')) return;
		if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
		else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
	}
	const navBtn = 'focus-ring absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-foreground shadow-card backdrop-blur hover:bg-surface';
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section aria-label={label} aria-roledescription="gallery" class={cn('flex gap-3', side ? 'flex-col-reverse lg:flex-row' : 'flex-col', className)} {onkeydown}>
	{#if thumbnails !== 'none' && images.length > 1}
		<ul data-thumbs class={cn('flex gap-2 overflow-auto p-0.5', side && 'lg:max-h-[32rem] lg:w-20 lg:flex-col')} aria-label="Thumbnails">
			{#each images as img, i (img.src)}
				<li class="shrink-0">
					<button
						type="button"
						class={cn('focus-ring block size-16 overflow-hidden rounded-md border-2 sm:size-20', i === index ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100')}
						aria-label="Show image {i + 1}: {img.alt}"
						aria-current={i === index ? 'true' : undefined}
						onclick={() => (index = i)}
					>
						<img src={img.thumbnail ?? img.src} alt="" class="size-full object-cover" loading="lazy" />
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	<div class="relative min-w-0 flex-1">
		{#if current}
			<figure class={cn('relative overflow-hidden rounded-card bg-muted', aspects[aspect])}>
				<img src={current.src} alt={current.alt} class="size-full object-cover" />
				{#if lightbox}
					<button type="button" class="focus-ring absolute inset-0 cursor-zoom-in" aria-label="View image {index + 1} fullscreen" onclick={() => (lightboxOpen = true)}>
						<span class="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-surface/90 text-foreground shadow-card"><Icon name="maximize" class="size-5" /></span>
					</button>
				{/if}
			</figure>
			{#if current.caption}<p class="mt-2 text-sm text-muted-foreground">{current.caption}</p>{/if}
			{#if images.length > 1}
				<button type="button" class="{navBtn} left-3" aria-label="Previous image" onclick={() => go(-1)}><Icon name="chevron-left" class="size-5" /></button>
				<button type="button" class="{navBtn} right-3" aria-label="Next image" onclick={() => go(1)}><Icon name="chevron-right" class="size-5" /></button>
			{/if}
			<p class="sr-only" aria-live="polite">Image {index + 1} of {images.length}: {current.alt}</p>
		{/if}
	</div>
</section>

{#if lightbox}<Lightbox {images} bind:index bind:open={lightboxOpen} />{/if}
