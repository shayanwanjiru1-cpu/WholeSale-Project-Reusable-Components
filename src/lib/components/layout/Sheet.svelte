<script lang="ts" module>
	export type SheetSide = 'right' | 'left' | 'bottom' | 'top' | 'center';
	export type SheetSize = 'sm' | 'md' | 'lg' | 'full';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import Icon from '../ui/Icon.svelte';
	import { lockScroll } from '$lib/utils/actions';
	import { cn } from '$lib/utils/cn';

	/**
	 * Panel that slides in from any screen edge (filters, cart, quick view, mobile menu),
	 * or a centered modal with `side="center"` (see Modal).
	 * Built on the native modal <dialog>: focus is contained, the page behind is inert,
	 * Escape closes it and focus returns to whatever opened it.
	 */
	interface Props {
		open?: boolean;
		side?: SheetSide;
		size?: SheetSize;
		title?: string;
		description?: string;
		/** Accessible name when there is no visible title. */
		label?: string;
		/** Custom header content (e.g. a Logo). Replaces title/description. */
		header?: Snippet;
		/** Main content. Receives a close function. */
		children?: Snippet<[() => void]>;
		/** Footer actions. Receives a close function. */
		footer?: Snippet<[() => void]>;
		showClose?: boolean;
		closeOnBackdrop?: boolean;
		onclose?: () => void;
		id?: string;
		class?: string;
		bodyClass?: string;
	}

	let {
		open = $bindable(false),
		side = 'right',
		size = 'md',
		title,
		description,
		label,
		header,
		children,
		footer,
		showClose = true,
		closeOnBackdrop = true,
		onclose,
		id,
		class: className,
		bodyClass
	}: Props = $props();

	const uid = $props.id();
	const titleId = `sheet-title-${uid}`;
	const descId = `sheet-desc-${uid}`;

	let dialog: HTMLDialogElement;
	let visible = $state(false); // drives the slide transition
	let returnFocusTo: HTMLElement | null = null;
	let closeTimer: ReturnType<typeof setTimeout>;

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) {
			clearTimeout(closeTimer);
			returnFocusTo = document.activeElement as HTMLElement | null;
			dialog.showModal();
			// Two frames so the off-screen position is painted before sliding in.
			requestAnimationFrame(() => requestAnimationFrame(() => (visible = true)));
		} else if (!open && dialog.open && visible) {
			visible = false;
			closeTimer = setTimeout(() => dialog.close(), prefersReducedMotion.current ? 0 : 300);
		}
	});

	function close() {
		open = false;
	}

	function handleClose() {
		// Fires after dialog.close(), including the native path.
		visible = false;
		open = false;
		onclose?.();
		returnFocusTo?.focus();
	}

	function handleClick(e: MouseEvent) {
		if (!closeOnBackdrop || e.target !== dialog) return;
		// A click on the dialog element itself outside its box means the backdrop.
		const r = dialog.getBoundingClientRect();
		if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
	}

	const horizontal = $derived(side === 'left' || side === 'right' || side === 'center');

	const sides: Record<SheetSide, { base: string; hidden: string }> = {
		right: { base: 'inset-y-0 right-0 left-auto h-dvh max-h-dvh max-w-none', hidden: 'translate-x-full' },
		left: { base: 'inset-y-0 left-0 right-auto h-dvh max-h-dvh max-w-none', hidden: '-translate-x-full' },
		top: { base: 'inset-x-0 top-0 bottom-auto w-screen max-w-none rounded-b-2xl', hidden: '-translate-y-full' },
		bottom: { base: 'inset-x-0 top-auto bottom-0 w-screen max-w-none rounded-t-2xl pb-[env(safe-area-inset-bottom)]', hidden: 'translate-y-full' },
		center: { base: 'inset-0 m-auto! h-fit max-h-[90dvh] rounded-card transition-[transform,opacity]', hidden: 'scale-95 opacity-0' }
	};
	const widths: Record<SheetSize, string> = {
		sm: 'w-[min(20rem,92vw)]',
		md: 'w-[min(28rem,92vw)]',
		lg: 'w-[min(40rem,92vw)]',
		full: 'w-screen'
	};
	const heights: Record<SheetSize, string> = {
		sm: 'max-h-[40dvh]',
		md: 'max-h-[65dvh]',
		lg: 'max-h-[88dvh]',
		full: 'h-dvh max-h-dvh rounded-none'
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	{id}
	aria-labelledby={title ? titleId : undefined}
	aria-describedby={description ? descId : undefined}
	aria-label={title ? undefined : label}
	class={cn(
		'fixed m-0 flex-col bg-surface p-0 text-foreground shadow-overlay open:flex',
		'transition-transform duration-300 ease-[cubic-bezier(.32,.72,0,1)] motion-reduce:transition-none',
		'backdrop:bg-overlay backdrop:transition-opacity backdrop:duration-300 motion-reduce:backdrop:transition-none',
		sides[side].base,
		horizontal ? widths[size] : heights[size],
		visible ? 'translate-x-0 translate-y-0 backdrop:opacity-100' : cn(sides[side].hidden, 'backdrop:opacity-0'),
		className
	)}
	use:lockScroll={open}
	oncancel={(e) => {
		e.preventDefault(); // animate out instead of closing instantly
		close();
	}}
	onclose={handleClose}
	onclick={handleClick}
>
	{#if side === 'bottom' && size !== 'full'}
		<div class="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-border-strong" aria-hidden="true"></div>
	{/if}

	{#if header || title || showClose}
		<div class={cn('flex shrink-0 items-start gap-3 border-b border-border px-5 py-4', header && 'items-center py-3 pr-3 pl-4')}>
			<div class="min-w-0 flex-1">
				{#if header}
					{@render header()}
				{:else}
					{#if title}<h2 id={titleId} class="text-lg font-semibold text-foreground">{title}</h2>{/if}
					{#if description}<p id={descId} class="mt-0.5 text-sm text-muted-foreground">{description}</p>{/if}
				{/if}
			</div>
			{#if showClose}
				<button
					type="button"
					class="focus-ring -mt-1 -mr-2 grid size-10 shrink-0 place-items-center rounded-control text-muted-foreground hover:bg-muted hover:text-foreground"
					aria-label="Close"
					onclick={close}
				>
					<Icon name="x" class="size-5" />
				</button>
			{/if}
		</div>
	{/if}

	<div class={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain p-5', bodyClass)}>
		{@render children?.(close)}
	</div>

	{#if footer}
		<div class="flex shrink-0 flex-wrap gap-3 border-t border-border bg-surface px-5 py-4 [&>*]:flex-1">
			{@render footer(close)}
		</div>
	{/if}
</dialog>
