<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import type { MediaImage } from '$lib/types';
	import { lockScroll } from '$lib/utils/actions';

	/**
	 * Fullscreen image viewer on a native modal <dialog>: focus is contained, Escape
	 * closes, focus returns to the opener. ←/→ navigate.
	 */
	interface Props {
		images: MediaImage[];
		open?: boolean;
		index?: number;
		label?: string;
	}

	let { images, open = $bindable(false), index = $bindable(0), label = 'Image viewer' }: Props = $props();

	let dialog: HTMLDialogElement;
	let returnFocusTo: HTMLElement | null = null;
	const current = $derived(images[index]);

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) {
			returnFocusTo = document.activeElement as HTMLElement | null;
			dialog.showModal();
		} else if (!open && dialog.open) dialog.close();
	});

	const go = (delta: number) => (index = (index + delta + images.length) % images.length);

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
		else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
	}
	const ctrl = 'focus-ring grid size-12 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20';
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	aria-label={label}
	class="fixed inset-0 m-0 size-full max-h-none max-w-none bg-black/95 p-0 text-white backdrop:bg-black/80"
	onclose={() => { open = false; returnFocusTo?.focus(); }}
	{onkeydown}
	use:lockScroll={open}
>
	{#if current}
		<div class="flex size-full flex-col">
			<div class="flex items-center justify-between gap-4 p-3 sm:p-4">
				<p class="text-sm text-white/80" aria-live="polite">{index + 1} / {images.length}</p>
				<button type="button" class={ctrl} aria-label="Close image viewer" onclick={() => (open = false)}><Icon name="x" class="size-6" /></button>
			</div>
			<figure class="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-4 pb-6 sm:px-20">
				<img src={current.src} alt={current.alt} class="max-h-full min-h-0 max-w-full object-contain" />
				{#if current.caption}<figcaption class="text-center text-sm text-white/80">{current.caption}</figcaption>{/if}
				{#if images.length > 1}
					<button type="button" class="{ctrl} absolute top-1/2 left-2 -translate-y-1/2 sm:left-4" aria-label="Previous image" onclick={() => go(-1)}><Icon name="chevron-left" class="size-6" /></button>
					<button type="button" class="{ctrl} absolute top-1/2 right-2 -translate-y-1/2 sm:right-4" aria-label="Next image" onclick={() => go(1)}><Icon name="chevron-right" class="size-6" /></button>
				{/if}
			</figure>
		</div>
	{/if}
</dialog>
