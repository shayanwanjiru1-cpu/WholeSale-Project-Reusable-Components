<script lang="ts" module>
	export type ContainerSize = 'narrow' | 'default' | 'wide' | 'full';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	/**
	 * Generic width-constraint primitive. Use anywhere content needs a max width and
	 * consistent gutters (inside Section, Navbar, Footer...). For the page-level
	 * <main> landmark use PageContainer, which builds on this.
	 */
	interface Props {
		size?: ContainerSize;
		/** Responsive horizontal gutters. */
		padded?: boolean;
		centered?: boolean;
		as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'nav';
		class?: string;
		children: Snippet;
	}

	let { size = 'default', padded = true, centered = true, as = 'div', class: className, children }: Props = $props();

	const sizes: Record<ContainerSize, string> = {
		narrow: 'max-w-narrow',
		default: 'max-w-page',
		wide: 'max-w-wide',
		full: 'max-w-none'
	};
</script>

<svelte:element
	this={as}
	class={cn('w-full', sizes[size], centered && 'mx-auto', padded && 'px-4 sm:px-6 lg:px-8', className)}
>
	{@render children()}
</svelte:element>
