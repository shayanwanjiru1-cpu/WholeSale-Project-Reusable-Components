<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { initials } from '$lib/utils/format';

	/**
	 * Brand lockup. No business logo is baked in: pass `markSrc` or a `mark` snippet,
	 * otherwise a neutral monogram is generated from `name`.
	 */
	interface Props {
		name: string;
		tagline?: string;
		variant?: 'combined' | 'wordmark' | 'mark';
		size?: 'sm' | 'md' | 'lg';
		/** `inverse` for dark backgrounds. */
		tone?: 'default' | 'inverse';
		href?: string;
		markSrc?: string;
		mark?: Snippet;
		/** Colour the last word of `name` in the brand red (matches the logo artwork). */
		accentLastWord?: boolean;
		class?: string;
	}

	let {
		name,
		tagline,
		variant = 'combined',
		size = 'md',
		tone = 'default',
		href,
		markSrc,
		mark,
		accentLastWord = false,
		class: className
	}: Props = $props();

	const markSizes = { sm: 'size-7 text-xs', md: 'size-9 text-sm', lg: 'size-12 text-base' };
	// Image marks (e.g. the cart artwork) carry their own shape, so they get more room.
	const imageMarkSizes = { sm: 'h-9 w-11', md: 'h-11 w-14', lg: 'h-14 w-[4.5rem]' };
	const words = $derived(name.trim().split(/\s+/));
	const textSizes = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' };
	const showMark = $derived(variant !== 'wordmark');
	const showText = $derived(variant !== 'mark');
</script>

{#snippet lockup()}
	{#if showMark}
		<span class={cn('grid shrink-0 place-items-center overflow-hidden', markSrc && !mark ? imageMarkSizes[size] : cn('rounded-md', markSizes[size]), !mark && !markSrc && 'bg-primary text-primary-foreground')} aria-hidden="true">
			{#if mark}
				{@render mark()}
			{:else if markSrc}
				<img src={markSrc} alt="" class="size-full object-contain" />
			{:else}
				<span class="font-bold">{initials(name)}</span>
			{/if}
		</span>
	{/if}
	{#if showText}
		<span class="flex flex-col leading-tight">
			<span class={cn('font-extrabold tracking-tight', textSizes[size], tone === 'inverse' ? 'text-white' : 'text-foreground')}>
				{#if accentLastWord && words.length > 1}{words.slice(0, -1).join(' ')} <span class={tone === 'inverse' ? 'text-[#ff6b66]' : 'text-primary-text'}>{words.at(-1)}</span>{:else}{name}{/if}
			</span>
			{#if tagline}<span data-logo-tagline class={cn('text-[0.625rem] font-semibold tracking-[0.22em] uppercase', tone === 'inverse' ? 'text-white/70' : 'text-muted-foreground')}>{tagline}</span>{/if}
		</span>
	{:else}
		<span class="sr-only">{name}</span>
	{/if}
{/snippet}

{#if href}
	<a {href} class={cn('focus-ring inline-flex items-center gap-2.5 rounded-md', className)}>
		{@render lockup()}
	</a>
{:else}
	<span class={cn('inline-flex items-center gap-2.5', className)}>{@render lockup()}</span>
{/if}
