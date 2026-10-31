<script lang="ts">
	import { cn } from '$lib/utils/cn';

	/**
	 * One composable skeleton primitive. Combine shapes for complex placeholders
	 * rather than creating a component per layout.
	 */
	interface Props {
		shape?: 'text' | 'circle' | 'rect' | 'image' | 'card';
		/** Number of text lines (shape="text"). The last line is shortened. */
		lines?: number;
		/** Tailwind sizing classes for custom dimensions, e.g. "h-24 w-40". */
		class?: string;
	}

	let { shape = 'text', lines = 1, class: className }: Props = $props();

	const pulse = 'animate-pulse bg-muted motion-reduce:animate-none';
</script>

{#if shape === 'text'}
	<span class={cn('flex w-full flex-col gap-2', className)} aria-hidden="true">
		{#each Array.from({ length: lines }, (_, i) => i) as i (i)}
			<span class={cn(pulse, 'block h-3.5 rounded', lines > 1 && i === lines - 1 ? 'w-3/5' : 'w-full')}></span>
		{/each}
	</span>
{:else if shape === 'circle'}
	<span class={cn(pulse, 'block size-10 rounded-full', className)} aria-hidden="true"></span>
{:else if shape === 'image'}
	<span class={cn(pulse, 'block aspect-[4/3] w-full rounded-lg', className)} aria-hidden="true"></span>
{:else if shape === 'card'}
	<span class={cn('flex w-full flex-col gap-4 rounded-card border border-border bg-surface p-4', className)} aria-hidden="true">
		<span class={cn(pulse, 'block aspect-[4/3] w-full rounded-lg')}></span>
		<span class={cn(pulse, 'block h-4 w-2/3 rounded')}></span>
		<span class={cn(pulse, 'block h-3.5 w-full rounded')}></span>
		<span class={cn(pulse, 'block h-3.5 w-4/5 rounded')}></span>
	</span>
{:else}
	<span class={cn(pulse, 'block h-24 w-full rounded-lg', className)} aria-hidden="true"></span>
{/if}
