<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';
	import { cn } from '$lib/utils/cn';
	import { toneDot, toneOutline, toneSoft, toneSolid, type Tone } from '$lib/utils/tones';

	/** Tone variants plus `sale` (brand red, for promotions). */
	type BadgeVariant = Tone | 'sale';
	interface Props {
		variant?: BadgeVariant;
		appearance?: 'soft' | 'solid' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		icon?: IconName;
		dot?: boolean;
		pill?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		variant = 'neutral',
		appearance = 'soft',
		size = 'md',
		icon,
		dot = false,
		pill = true,
		class: className,
		children
	}: Props = $props();

	const sale = { soft: 'bg-accent text-accent-foreground', solid: 'bg-primary text-primary-foreground', outline: 'border-brand text-primary-text' };
	const appearances = {
		soft: { ...toneSoft, sale: sale.soft },
		solid: { ...toneSolid, sale: sale.solid },
		outline: { ...toneOutline, sale: sale.outline }
	};
	const dots = { ...toneDot, sale: 'bg-brand' };
	const sizes = {
		sm: 'h-5 px-1.5 text-[0.6875rem] gap-1',
		md: 'h-6 px-2 text-xs gap-1',
		lg: 'h-7 px-2.5 text-sm gap-1.5'
	};
</script>

<span
	class={cn(
		'inline-flex max-w-full shrink-0 items-center font-medium whitespace-nowrap',
		pill ? 'rounded-full' : 'rounded-md',
		appearance === 'outline' && 'border bg-transparent',
		appearances[appearance][variant],
		sizes[size],
		className
	)}
>
	{#if dot}<span class={cn('size-1.5 rounded-full', appearance === 'solid' ? 'bg-current' : dots[variant])} aria-hidden="true"></span>{/if}
	{#if icon}<Icon name={icon} class={size === 'lg' ? 'size-4' : 'size-3.5'} />{/if}
	<span class="truncate">{@render children()}</span>
</span>
