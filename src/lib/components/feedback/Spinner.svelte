<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		/** Accessible label announced to screen readers. */
		label?: string;
		/** Show the label visibly next to the spinner. */
		showLabel?: boolean;
		/** `inline` sits in text/buttons; `block` centres in its container (page/section loading). */
		layout?: 'inline' | 'block';
		/** Hide from assistive tech when a parent already announces loading (e.g. a busy button). */
		decorative?: boolean;
		class?: string;
	}

	let {
		size = 'md',
		label = 'Loading',
		showLabel = false,
		layout = 'inline',
		decorative = false,
		class: className
	}: Props = $props();

	const sizes = { xs: 'size-3', sm: 'size-4', md: 'size-6', lg: 'size-8', xl: 'size-12' };
</script>

<span
	class={cn(
		layout === 'block' ? 'flex flex-col items-center justify-center gap-3 py-8' : 'inline-flex items-center gap-2',
		className
	)}
	role={decorative ? undefined : 'status'}
	aria-hidden={decorative ? 'true' : undefined}
>
	<svg class={cn('animate-spin text-current', sizes[size])} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-20" />
		<path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
	</svg>
	{#if !decorative}
		<span class={showLabel ? 'text-sm text-muted-foreground' : 'sr-only'}>{label}</span>
	{/if}
</span>
