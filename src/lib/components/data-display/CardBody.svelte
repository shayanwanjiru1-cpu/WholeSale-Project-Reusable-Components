<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cardPadding, getCardSize } from './card-context';
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
		children: Snippet;
	}
	let { class: className, children }: Props = $props();
	const size = getCardSize();
</script>

<div class={cn(cardPadding[size], 'flex-1 text-sm', className)}>{@render children()}</div>
