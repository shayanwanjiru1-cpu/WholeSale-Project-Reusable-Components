<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import type { IconName } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { clamp } from '$lib/utils/format';

	/** Read-only rating. Supports partial fills; announced as one phrase to screen readers. */
	interface Props {
		value: number;
		max?: number;
		icon?: IconName;
		size?: 'sm' | 'md' | 'lg';
		showValue?: boolean;
		reviewCount?: number;
		class?: string;
	}

	let { value, max = 5, icon = 'star', size = 'md', showValue = false, reviewCount, class: className }: Props = $props();

	const v = $derived(clamp(value, 0, max));
	const sizes = { sm: 'size-3.5', md: 'size-4', lg: 'size-5' };
	const label = $derived(
		`Rated ${v.toFixed(1)} out of ${max}` + (reviewCount !== undefined ? `, ${reviewCount.toLocaleString()} reviews` : '')
	);
	const fill = (i: number) => clamp(v - i, 0, 1) * 100;
</script>

<span class={cn('inline-flex items-center gap-1.5', className)} role="img" aria-label={label}>
	<span class="flex" aria-hidden="true">
		{#each Array.from({ length: max }, (_, i) => i) as i (i)}
			<span class="relative">
				<Icon name={icon} class={cn(sizes[size], 'text-border-strong')} filled strokeWidth={0} />
				<span class="absolute inset-0 overflow-hidden" style:width="{fill(i)}%">
					<Icon name={icon} class={cn(sizes[size], 'text-rating')} filled strokeWidth={0} />
				</span>
			</span>
		{/each}
	</span>
	{#if showValue}<span class="text-sm font-semibold text-foreground" aria-hidden="true">{v.toFixed(1)}</span>{/if}
	{#if reviewCount !== undefined}<span class="text-sm text-muted-foreground" aria-hidden="true">({reviewCount.toLocaleString()})</span>{/if}
</span>
