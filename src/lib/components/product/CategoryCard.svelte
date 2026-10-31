<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import ProductImage from '../media/ProductImage.svelte';
	import Heading from '../layout/Heading.svelte';
	import type { Category, HeadingLevel, Product } from '$lib/types';
	import { categoryHref } from '$lib/data/categories';
	import { cn } from '$lib/utils/cn';

	/**
	 * Category tile driven by Category data. Uses the category photo when there is one,
	 * otherwise the cover product's packshot (or the shared placeholder).
	 */
	interface Props {
		category: Category;
		/** Product whose image represents the category. */
		cover?: Product;
		count?: number;
		variant?: 'tile' | 'compact';
		headingLevel?: HeadingLevel;
		class?: string;
	}

	let { category, cover, count, variant = 'tile', headingLevel = 3, class: className }: Props = $props();
	const href = $derived(categoryHref(category.slug));
</script>

{#if variant === 'compact'}
	<a {href} class={cn('focus-ring group flex items-center gap-3 rounded-card border border-border bg-surface p-3 transition-colors hover:border-brand', className)}>
		<span class="grid size-10 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground"><Icon name={category.icon} class="size-5" /></span>
		<span class="min-w-0 flex-1">
			<span class="block truncate text-sm font-semibold text-foreground">{category.name}</span>
			{#if count !== undefined}<span class="text-xs text-muted-foreground">{count} products</span>{/if}
		</span>
		<Icon name="chevron-right" class="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
	</a>
{:else}
	<article class={cn('group relative flex flex-col overflow-hidden rounded-card border border-[var(--card-border)] bg-[var(--card-bg)] transition-[border-color,box-shadow] hover:border-brand hover:shadow-raised motion-reduce:transition-none', className)}>
		{#if category.image}
			<ProductImage src={category.image} alt="" fit="cover" aspect="4/3" hoverZoom class="border-b border-[var(--card-border)]" />
		{:else}
			<ProductImage src={cover?.image} sprite={cover?.sprite} alt={cover ? cover.imageAlt : ''} icon={category.icon} aspect="16/10" hoverZoom class="border-b border-[var(--card-border)]" />
		{/if}
		<div class="flex flex-1 items-start gap-3 p-4">
			<span class="grid size-9 shrink-0 place-items-center rounded-md bg-ink text-white group-hover:bg-primary">
				<Icon name={category.icon} class="size-4.5" />
			</span>
			<div class="min-w-0 flex-1">
				<Heading level={headingLevel} class="text-base leading-snug font-semibold text-foreground">
					<a {href} class="focus-ring rounded-sm after:absolute after:inset-0 after:content-['']">{category.name}</a>
				</Heading>
				<p class="mt-0.5 text-xs text-muted-foreground">
					{#if count !== undefined}{count} products · {/if}{category.subcategories.length} ranges
				</p>
			</div>
			<Icon name="arrow-right" class="mt-1 size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary-text motion-reduce:transition-none" />
		</div>
		{#if category.regulated}
			<p class="mx-4 mb-4 -mt-1 flex items-center gap-1.5 text-xs font-medium text-warning-strong"><Icon name="alert-triangle" class="size-3.5" />Trade use · SDS supplied</p>
		{/if}
	</article>
{/if}
