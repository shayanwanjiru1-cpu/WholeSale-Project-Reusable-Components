<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import type { IconName, SpriteRef } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/**
	 * Consistent product image container (fixed aspect ratio → no layout shift).
	 * Renders, in order of preference:
	 *  1. `src` — an individual product photo (object-contain on white, packshot style)
	 *  2. `sprite` — a cell cropped from a contact-sheet photo (the supplied product grid)
	 *  3. a neutral placeholder tile: category icon + pack label, so missing photography
	 *     never looks broken or inconsistent.
	 */
	interface Props {
		src?: string;
		sprite?: SpriteRef;
		alt: string;
		/** Icon for the placeholder tile. */
		icon?: IconName;
		/** Short text on the placeholder tile, e.g. the pack size. */
		label?: string;
		aspect?: 'square' | '4/3' | '16/10' | 'auto';
		/** `contain` for packshots, `cover` for lifestyle/collage imagery. */
		fit?: 'contain' | 'cover';
		loading?: 'lazy' | 'eager';
		/** Zoom slightly on hover of the closest `.group`. */
		hoverZoom?: boolean;
		sizes?: string;
		class?: string;
	}

	let {
		src,
		sprite,
		alt,
		icon = 'package',
		label,
		aspect = '4/3',
		fit = 'contain',
		loading = 'lazy',
		hoverZoom = false,
		sizes,
		class: className
	}: Props = $props();

	let failed = $state(false);
	const aspects = { square: 'aspect-square', '4/3': 'aspect-[4/3]', '16/10': 'aspect-[16/10]', auto: '' };

	const spriteStyle = $derived.by(() => {
		if (!sprite) return '';
		const col = sprite.index % sprite.cols;
		const row = Math.floor(sprite.index / sprite.cols);
		const x = sprite.cols > 1 ? (col / (sprite.cols - 1)) * 100 : 0;
		const y = sprite.rows > 1 ? (row / (sprite.rows - 1)) * 100 : 0;
		return `background-image:url("${sprite.src}");background-size:${sprite.cols * 100}% ${sprite.rows * 100}%;background-position:${x}% ${y}%`;
	});

	const zoom = $derived(hoverZoom && 'transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100');
</script>

<div class={cn('relative overflow-hidden bg-white', aspects[aspect], className)}>
	{#if src && !failed}
		<img
			{src}
			{alt}
			{loading}
			{sizes}
			decoding="async"
			class={cn('absolute inset-0 size-full', fit === 'contain' ? 'object-contain p-4' : 'object-cover', zoom)}
			onerror={() => (failed = true)}
		/>
	{:else if sprite}
		<div role="img" aria-label={alt} class={cn('absolute inset-0 bg-no-repeat', zoom)} style={spriteStyle}></div>
	{:else}
		<!-- Placeholder packshot: neutral tile, same in every card so grids stay consistent. -->
		<div role="img" aria-label={alt} class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-white to-neutral-100 text-neutral-400">
			<span class="grid size-16 place-items-center rounded-full border border-neutral-200 bg-white shadow-sm">
				<Icon name={icon} class="size-8 text-neutral-500" strokeWidth={1.5} />
			</span>
			{#if label}
				<span class="rounded border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-neutral-600">{label}</span>
			{/if}
		</div>
	{/if}
</div>
