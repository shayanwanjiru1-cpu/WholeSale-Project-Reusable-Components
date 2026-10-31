<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cardPadding, getCardSize } from './card-context';
	import { cn } from '$lib/utils/cn';

	interface Props {
		align?: 'start' | 'end' | 'between' | 'stretch';
		divided?: boolean;
		muted?: boolean;
		class?: string;
		children: Snippet;
	}
	let { align = 'start', divided = false, muted = false, class: className, children }: Props = $props();
	const size = getCardSize();
	const aligns = { start: 'justify-start', end: 'justify-end', between: 'justify-between', stretch: '[&>*]:flex-1' };
</script>

<div class={cn(cardPadding[size], divided ? 'border-t border-border' : 'pt-0!', muted && 'bg-muted', 'flex flex-wrap items-center gap-3', aligns[align], className)}>
	{@render children()}
</div>
