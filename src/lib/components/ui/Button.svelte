<script lang="ts" module>
	export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
	export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon' | 'icon-lg';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import Icon from './Icon.svelte';
	import Spinner from '../feedback/Spinner.svelte';
	import type { IconName } from './icons';
	import { cn } from '$lib/utils/cn';

	type Common = {
		variant?: ButtonVariant;
		size?: ButtonSize;
		loading?: boolean;
		/** Text announced while loading. */
		loadingLabel?: string;
		fullWidth?: boolean;
		iconLeft?: IconName;
		iconRight?: IconName;
		class?: string;
		children?: Snippet;
		/** Bind to the rendered element (e.g. to return focus to it). */
		ref?: HTMLElement | null;
	};
	type Props = Common &
		((Omit<HTMLButtonAttributes, 'class'> & { href?: undefined }) | (Omit<HTMLAnchorAttributes, 'class'> & { href: string; disabled?: boolean }));

	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		loadingLabel = 'Loading',
		fullWidth = false,
		iconLeft,
		iconRight,
		class: className,
		children,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	const variants: Record<ButtonVariant, string> = {
		primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm',
		secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
		outline: 'border border-border-strong bg-surface text-foreground hover:bg-muted',
		ghost: 'text-foreground hover:bg-muted',
		destructive: 'bg-danger text-white hover:bg-danger-hover shadow-sm',
		link: 'text-primary-text underline-offset-4 hover:underline px-0! h-auto!'
	};
	// Touch targets: md and lg are >= 40/44px tall; sm is for dense desktop UIs.
	const sizes: Record<ButtonSize, string> = {
		sm: 'h-8 px-3 text-sm gap-1.5',
		md: 'h-10 px-4 text-sm gap-2',
		lg: 'h-12 px-6 text-base gap-2',
		'icon-sm': 'size-8',
		icon: 'size-10',
		'icon-lg': 'size-12'
	};
	const iconSize = $derived(size === 'lg' || size === 'icon-lg' ? 'size-5' : 'size-4');
	const isDisabled = $derived(Boolean(rest.disabled) || loading);

	const classes = $derived(
		cn(
			'focus-ring relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-control font-medium transition-colors motion-reduce:transition-none',
			'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
			variants[variant],
			sizes[size],
			fullWidth && 'w-full',
			className
		)
	);
</script>

{#snippet content()}
	{#if loading}
		<Spinner size="sm" decorative class="absolute" />
		<span class="sr-only">{loadingLabel}</span>
	{/if}
	<span class={cn('inline-flex items-center gap-[inherit]', loading && 'invisible')}>
		{#if iconLeft}<Icon name={iconLeft} class={iconSize} />{/if}
		{@render children?.()}
		{#if iconRight}<Icon name={iconRight} class={iconSize} />{/if}
	</span>
{/snippet}

{#if rest.href !== undefined}
	{@const { disabled, ...anchor } = rest as HTMLAnchorAttributes & { disabled?: boolean }}
	<a
		bind:this={ref}
		{...anchor}
		href={anchor.href}
		class={classes}
		aria-disabled={disabled || loading ? 'true' : undefined}
		tabindex={disabled ? -1 : anchor.tabindex}
	>
		{@render content()}
	</a>
{:else}
	{@const button = rest as HTMLButtonAttributes}
	<button
		bind:this={ref}
		type="button"
		{...button}
		class={classes}
		disabled={isDisabled}
		aria-busy={loading ? 'true' : undefined}
	>
		{@render content()}
	</button>
{/if}
