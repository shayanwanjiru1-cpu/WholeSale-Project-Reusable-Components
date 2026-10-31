<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Icon } from '$lib';

	/** Showcase-only wrapper documenting one component. */
	interface Props {
		id: string;
		title: string;
		description: string;
		a11y?: string;
		children: Snippet;
	}
	let { id, title, description, a11y, children }: Props = $props();
</script>

<article {id} class="scroll-mt-20 border-t border-border py-10 first:border-t-0" aria-labelledby="{id}-title">
	<header class="mb-6 max-w-3xl">
		<h3 id="{id}-title" class="text-xl font-bold tracking-tight">{title}</h3>
		<p class="mt-1 text-muted-foreground">{description}</p>
		{#if a11y}
			<p class="mt-3 flex gap-2 rounded-lg bg-info-soft px-3 py-2 text-sm text-info-strong">
				<Icon name="shield-check" class="mt-0.5 size-4" /><span><strong class="font-semibold">Accessibility:</strong> {a11y}</span>
			</p>
		{/if}
	</header>
	<div class="flex flex-col gap-8">{@render children()}</div>
</article>
