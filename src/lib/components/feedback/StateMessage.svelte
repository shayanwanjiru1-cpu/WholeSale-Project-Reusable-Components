<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../ui/Icon.svelte';
	import Heading from '../layout/Heading.svelte';
	import type { HeadingLevel, IconName } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { toneSoft, type Tone } from '$lib/utils/tones';

	/**
	 * Shared layout behind EmptyState, ErrorState, SuccessState and NoResults.
	 * Prefer those semantic wrappers; use this directly only for new state types.
	 */
	interface Props {
		title: string;
		description?: string;
		icon?: IconName;
		tone?: Tone;
		size?: 'sm' | 'md' | 'lg';
		/** Visual frame around the message. */
		appearance?: 'plain' | 'dashed' | 'card';
		headingLevel?: HeadingLevel;
		/** Live-region role for dynamic states (e.g. "alert" for errors). */
		role?: 'status' | 'alert';
		/** Custom illustration replacing the icon. */
		media?: Snippet;
		actions?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let {
		title,
		description,
		icon,
		tone = 'neutral',
		size = 'md',
		appearance = 'plain',
		headingLevel = 3,
		role,
		media,
		actions,
		children,
		class: className
	}: Props = $props();

	const pad = { sm: 'py-6 px-4 gap-3', md: 'py-10 px-6 gap-4', lg: 'py-16 px-6 gap-5' };
	const iconBox = { sm: 'size-10', md: 'size-12', lg: 'size-16' };
	const frames = { plain: '', dashed: 'rounded-card border-2 border-dashed border-border', card: 'rounded-card border border-border bg-surface shadow-card' };
</script>

<div {role} class={cn('flex flex-col items-center text-center', pad[size], frames[appearance], className)}>
	{#if media}
		{@render media()}
	{:else if icon}
		<span class={cn('grid place-items-center rounded-full', iconBox[size], toneSoft[tone])}>
			<Icon name={icon} class={size === 'lg' ? 'size-8' : 'size-6'} />
		</span>
	{/if}
	<div class="max-w-md">
		<Heading level={headingLevel} class={cn('font-semibold text-foreground', size === 'lg' ? 'text-xl' : 'text-base')}>{title}</Heading>
		{#if description}<p class="mt-1.5 text-sm text-pretty text-muted-foreground">{description}</p>{/if}
	</div>
	{@render children?.()}
	{#if actions}<div class="mt-1 flex flex-wrap justify-center gap-3">{@render actions()}</div>{/if}
</div>
