<script lang="ts" module>
	export type PopoverTriggerProps = {
		'aria-expanded': boolean;
		'aria-controls': string;
		'aria-haspopup': 'dialog';
		'data-popover-trigger': '';
		onclick: (event: MouseEvent) => void;
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { clickOutside, focusableWithin } from '$lib/utils/actions';
	import { floatingClasses, type Align, type Placement } from '$lib/utils/position';
	import { cn } from '$lib/utils/cn';

	/**
	 * Non-modal dialog anchored to a trigger, for interactive content
	 * (forms, filters, details). Use Tooltip for plain hints.
	 */
	interface Props {
		open?: boolean;
		placement?: Placement;
		align?: Align;
		/** Accessible name for the popover dialog. */
		label: string;
		trigger: Snippet<[PopoverTriggerProps]>;
		children: Snippet<[() => void]>;
		closeOnOutsideClick?: boolean;
		class?: string;
		panelClass?: string;
	}

	let {
		open = $bindable(false),
		placement = 'bottom',
		align = 'left',
		label,
		trigger,
		children,
		closeOnOutsideClick = true,
		class: className,
		panelClass
	}: Props = $props();

	const uid = $props.id();
	const panelId = `popover-${uid}`;
	let wrapper: HTMLDivElement;
	let panel: HTMLDivElement | undefined = $state();

	function close(returnFocus = true) {
		open = false;
		if (returnFocus) wrapper?.querySelector<HTMLElement>('[data-popover-trigger]')?.focus();
	}

	$effect(() => {
		if (!open) return;
		tick().then(() => {
			if (!panel) return;
			(focusableWithin(panel)[0] ?? panel).focus();
		});
	});

	const triggerProps: PopoverTriggerProps = $derived({
		'aria-expanded': open,
		'aria-controls': panelId,
		'aria-haspopup': 'dialog',
		'data-popover-trigger': '',
		onclick: () => (open = !open)
	});
</script>

<div
	bind:this={wrapper}
	class={cn('relative inline-block', className)}
	use:clickOutside={() => open && closeOnOutsideClick && close(false)}
>
	{@render trigger(triggerProps)}
	{#if open}
		<div class={cn('absolute z-50', floatingClasses(placement, align))}>
			<div
				bind:this={panel}
				id={panelId}
				role="dialog"
				aria-label={label}
				tabindex="-1"
				class={cn(
					'w-72 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-surface p-4 text-sm text-foreground shadow-raised outline-none',
					panelClass
				)}
				onkeydown={(e) => {
					if (e.key === 'Escape') {
						e.stopPropagation();
						close();
					}
				}}
				transition:fly={{ y: placement === 'top' ? 4 : -4, duration: prefersReducedMotion.current ? 0 : 120 }}
			>
				{@render children(() => close())}
			</div>
		</div>
	{/if}
</div>
