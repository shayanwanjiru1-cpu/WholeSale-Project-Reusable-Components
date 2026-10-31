<script lang="ts">
	import type { Snippet } from 'svelte';
	import Container, { type ContainerSize } from './Container.svelte';
	import { cn } from '$lib/utils/cn';

	/**
	 * Page-level wrapper: renders the <main> landmark (the SkipLink target) with the
	 * site's standard width and vertical rhythm. Use once per page.
	 */
	interface Props {
		size?: ContainerSize;
		spacing?: 'none' | 'sm' | 'md' | 'lg';
		/** id targeted by SkipLink. */
		id?: string;
		/** Render as <div> when the page already has a <main> elsewhere. */
		landmark?: boolean;
		class?: string;
		children: Snippet;
	}

	let { size = 'default', spacing = 'md', id = 'main-content', landmark = true, class: className, children }: Props = $props();

	const spacings = { none: '', sm: 'py-6', md: 'py-8 sm:py-12', lg: 'py-12 sm:py-16 lg:py-20' };
</script>

<svelte:element
	this={landmark ? 'main' : 'div'}
	{id}
	tabindex={landmark ? -1 : undefined}
	class={cn('outline-none', spacings[spacing], className)}
>
	<Container {size}>
		{@render children()}
	</Container>
</svelte:element>
