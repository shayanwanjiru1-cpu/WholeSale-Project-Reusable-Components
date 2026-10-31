<script lang="ts">
	import { cn } from '$lib/utils/cn';

	/** Reusable hamburger trigger. Animates to an "X" when open. */
	interface Props {
		open?: boolean;
		/** id of the element this button controls. */
		controls?: string;
		label?: string;
		size?: 'sm' | 'md';
		onclick?: (event: MouseEvent) => void;
		ref?: HTMLButtonElement | null;
		class?: string;
	}

	let {
		open = $bindable(false),
		controls,
		label = 'Menu',
		size = 'md',
		onclick,
		ref = $bindable(null),
		class: className
	}: Props = $props();

	const bar = 'absolute left-0 h-0.5 w-full rounded-full bg-current transition-transform duration-200 motion-reduce:transition-none';
</script>

<button
	bind:this={ref}
	type="button"
	class={cn(
		'focus-ring inline-grid place-items-center rounded-control text-foreground hover:bg-muted',
		size === 'sm' ? 'size-9' : 'size-11',
		className
	)}
	aria-expanded={open}
	aria-controls={controls}
	aria-label={label}
	onclick={(e) => {
		open = !open;
		onclick?.(e);
	}}
>
	<span class="relative block h-3.5 w-5" aria-hidden="true">
		<span class={cn(bar, 'top-0', open && 'translate-y-[6px] rotate-45')}></span>
		<span class={cn(bar, 'top-1.5 transition-opacity', open && 'opacity-0')}></span>
		<span class={cn(bar, 'top-3', open && '-translate-y-[6px] -rotate-45')}></span>
	</span>
</button>
