<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib';

	/** Labelled preview area for one variant/state group. */
	interface Props {
		label: string;
		/** Preview frame style. */
		frame?: 'box' | 'none' | 'canvas';
		class?: string;
		children: Snippet;
	}
	let { label, frame = 'box', class: className, children }: Props = $props();
</script>

<div>
	<p class="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
	<div class={cn(frame === 'box' && 'rounded-card border border-border bg-surface p-4 sm:p-6', frame === 'canvas' && 'rounded-card border border-dashed border-border-strong bg-background p-4 sm:p-6', className)}>
		{@render children()}
	</div>
</div>
