<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setCardContext, type CardSize } from './card-context';
	import { cn } from '$lib/utils/cn';

	/**
	 * Base surface for every card in the library. Compose with CardHeader / CardBody /
	 * CardFooter, which pick up `size` (padding) from context.
	 *
	 * - `interactive`: hover/focus-within lift for cards containing their own links/buttons
	 * - `href`: the whole card is one link (only when it contains no other interactive elements)
	 */
	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'class'> {
		variant?: 'default' | 'outlined' | 'elevated' | 'flat';
		size?: CardSize;
		interactive?: boolean;
		href?: string;
		as?: 'div' | 'article' | 'section' | 'li';
		class?: string;
		children: Snippet;
	}

	let { variant = 'default', size = 'default', interactive = false, href, as = 'div', class: className, children, ...rest }: Props = $props();

	setCardContext({ get size() { return size; } });

	const variants = {
		default: 'border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--card-shadow)]',
		outlined: 'border border-border-strong bg-[var(--card-bg)]',
		elevated: 'border border-transparent bg-[var(--card-bg)] shadow-raised',
		flat: 'bg-muted'
	};
	const classes = $derived(
		cn(
			'relative flex flex-col overflow-hidden rounded-card text-[var(--card-text)]',
			variants[variant],
			(interactive || href) && 'transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-raised focus-within:shadow-raised motion-reduce:transform-none motion-reduce:transition-none',
			href && 'focus-ring',
			className
		)
	);
</script>

{#if href}
	<a {href} class={classes} {...rest}>{@render children()}</a>
{:else}
	<svelte:element this={as} class={classes} {...rest}>{@render children()}</svelte:element>
{/if}
