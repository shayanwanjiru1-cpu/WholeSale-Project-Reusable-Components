<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ProductCard from './ProductCard.svelte';
	import Skeleton from '../feedback/Skeleton.svelte';
	import type { HeadingLevel, Product } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/**
	 * Responsive product grid. Mobile 1 col → tablet 2–3 → desktop 3–4.
	 * `columns` sets the maximum at wide viewports (use 3 next to a filter sidebar).
	 */
	interface Props {
		products: Product[];
		columns?: 3 | 4 | 5;
		cardVariant?: ComponentProps<typeof ProductCard>['variant'];
		headingLevel?: HeadingLevel;
		/** Number of cards whose images load eagerly (above the fold). */
		priorityCount?: number;
		loading?: boolean;
		skeletonCount?: number;
		/** Accessible list label, e.g. "Featured products". */
		label?: string;
		class?: string;
	}

	let { products, columns = 4, cardVariant = 'default', headingLevel = 3, priorityCount = 0, loading = false, skeletonCount = 8, label, class: className }: Props = $props();

	const horizontal = $derived(cardVariant === 'horizontal');
	const cols = {
		3: 'sm:grid-cols-2 lg:grid-cols-3',
		4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
		5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
	};
</script>

<ul class={cn('grid gap-4 sm:gap-5', horizontal ? 'grid-cols-1 xl:grid-cols-2' : cols[columns], className)} aria-label={label} aria-busy={loading ? 'true' : undefined}>
	{#if loading}
		{#each { length: skeletonCount } as _, i (i)}
			<li class="flex flex-col gap-3 rounded-card border border-border bg-surface p-4" aria-hidden="true">
				<Skeleton class="aspect-[4/3] w-full" />
				<Skeleton class="h-3 w-1/3" />
				<Skeleton class="h-4 w-4/5" />
				<Skeleton class="h-6 w-1/2" />
				<Skeleton class="h-10 w-full" />
			</li>
		{/each}
	{:else}
		{#each products as product, i (product.id)}
			<li class="flex">
				<ProductCard {product} variant={cardVariant} {headingLevel} priority={i < priorityCount} class="w-full" />
			</li>
		{/each}
	{/if}
</ul>
