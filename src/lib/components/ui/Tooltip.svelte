<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onDestroy } from 'svelte';
	import { floatingClasses, type Placement } from '$lib/utils/position';
	import { cn } from '$lib/utils/cn';

	/**
	 * Supplementary hint on hover AND keyboard focus. Never put essential information
	 * only in a tooltip. The trigger snippet receives `aria-describedby` to spread onto
	 * the focusable element.
	 */
	interface Props {
		text: string;
		placement?: Placement;
		/** Delay before showing, in ms. */
		delay?: number;
		disabled?: boolean;
		class?: string;
		children: Snippet<[{ 'aria-describedby': string }]>;
	}

	let { text, placement = 'top', delay = 300, disabled = false, class: className, children }: Props = $props();

	const uid = $props.id();
	const id = `tooltip-${uid}`;
	let visible = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	function show(immediate = false) {
		if (disabled) return;
		clearTimeout(timer);
		if (immediate) visible = true;
		else timer = setTimeout(() => (visible = true), delay);
	}
	function hide() {
		clearTimeout(timer);
		visible = false;
	}
	onDestroy(() => clearTimeout(timer));

</script>

<!-- Hovering the tooltip itself keeps it open (WCAG 1.4.13: hoverable, dismissible, persistent). -->
<span
	class={cn('relative inline-flex', className)}
	role="presentation"
	onpointerenter={() => show()}
	onpointerleave={hide}
	onfocusin={() => show(true)}
	onfocusout={hide}
	onkeydown={(e) => e.key === 'Escape' && hide()}
>
	{@render children({ 'aria-describedby': id })}
	<span
		{id}
		role="tooltip"
		class={cn(
			'pointer-events-none absolute z-50 w-max max-w-64 transition-opacity duration-150 motion-reduce:transition-none',
			floatingClasses(placement, 'center'),
			visible && !disabled ? 'visible opacity-100' : 'invisible opacity-0'
		)}
	>
		<span class="relative block rounded-md bg-inverse px-2.5 py-1.5 text-xs font-medium text-inverse-foreground shadow-raised">
			{text}
		</span>
	</span>
</span>
