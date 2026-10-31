<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HeadingLevel } from '$lib/types';

	/** Renders h1–h6 from a number so components can keep document outlines correct. */
	interface Props {
		level?: HeadingLevel;
		id?: string;
		class?: string;
		children: Snippet;
	}

	let { level = 2, id, class: className, children }: Props = $props();
</script>

<svelte:element this={`h${level}`} {id} class={className}>
	{@render children()}
</svelte:element>
