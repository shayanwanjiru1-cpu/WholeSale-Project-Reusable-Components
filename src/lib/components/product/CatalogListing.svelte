<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import PageHeader from '../layout/PageHeader.svelte';
	import Sheet from '../layout/Sheet.svelte';
	import Button from '../ui/Button.svelte';
	import Chip from '../ui/Chip.svelte';
	import Icon from '../ui/Icon.svelte';
	import SearchInput from '../ui/SearchInput.svelte';
	import Select from '../forms/Select.svelte';
	import NoResults from '../feedback/NoResults.svelte';
	import FilterPanel from './FilterPanel.svelte';
	import ProductGrid from './ProductGrid.svelte';
	import type { BreadcrumbItem, Facets, FilterState, Product, SortKey } from '$lib/types';
	import { activeFilterChips, computeFacets, countActiveFilters, emptyFilters, isSortKey, queryCatalog, removeFilter, SORT_OPTIONS } from '$lib/catalog/filters';
	import { suggestTerms } from '$lib/catalog/search';
	import { getCategory } from '$lib/data/categories';
	import { cn } from '$lib/utils/cn';

	/**
	 * Product listing layout shared by /shop, category, subcategory and deals pages:
	 * breadcrumbs → header → search/sort toolbar → [filter sidebar | grid] → load more.
	 * Below lg the filters move into a drawer. Query + sort are kept in the URL so
	 * results are shareable and the header search lands here.
	 */
	interface Props {
		products: Product[];
		title: string;
		description?: string;
		eyebrow?: string;
		breadcrumbs?: BreadcrumbItem[];
		/** Facets fixed by the page and therefore hidden. */
		hideFacets?: (keyof Facets)[];
		pageSize?: number;
		/** Extra content under the header (subcategory chips, notices). */
		intro?: Snippet;
		/** 2 when embedded below another page heading (e.g. the home page). */
		headingLevel?: 1 | 2;
	}

	let { products, title, description, eyebrow, breadcrumbs, hideFacets = [], pageSize = 24, intro, headingLevel = 1 }: Props = $props();

	// ----- state -----
	let query = $state(page.url.searchParams.get('q') ?? '');
	let sort = $state<SortKey>(isSortKey(page.url.searchParams.get('sort')) ? (page.url.searchParams.get('sort') as SortKey) : 'relevance');
	let filters = $state<FilterState>(emptyFilters());
	// svelte-ignore state_referenced_locally
	let visible = $state(pageSize);
	let filtersOpen = $state(false);
	let view = $state<'grid' | 'list'>('grid');

	// Follow URL changes made elsewhere (header search, back/forward).
	let lastUrlQuery = page.url.searchParams.get('q') ?? '';
	$effect(() => {
		const q = page.url.searchParams.get('q') ?? '';
		if (q !== lastUrlQuery) {
			lastUrlQuery = q;
			untrack(() => (query = q));
		}
	});

	// New result set → reset to the first page.
	$effect(() => {
		void query;
		void sort;
		void JSON.stringify(filters);
		void products;
		untrack(() => (visible = pageSize));
	});

	// Write query + sort to the URL (debounced, no scroll, keeps focus).
	let urlTimer: ReturnType<typeof setTimeout>;
	$effect(() => {
		const q = query.trim();
		const s = sort;
		clearTimeout(urlTimer);
		urlTimer = setTimeout(() => {
			const url = new URL(page.url);
			if (q) url.searchParams.set('q', q);
			else url.searchParams.delete('q');
			if (s !== 'relevance') url.searchParams.set('sort', s);
			else url.searchParams.delete('sort');
			if (url.search !== page.url.search) {
				lastUrlQuery = q;
				goto(url, { replaceState: true, keepFocus: true, noScroll: true });
			}
		}, 350);
		return () => clearTimeout(urlTimer);
	});

	// ----- derived catalog -----
	const labels = {
		category: (s: string) => getCategory(s)?.name ?? s,
		subcategory: (s: string) => products.find((p) => p.subcategory === s)?.subcategoryName ?? s
	};
	const searched = $derived(query.trim() ? queryCatalog(products, { query, filters: emptyFilters(), sort: 'relevance' }) : products);
	const results = $derived(queryCatalog(products, { query, filters, sort }));
	const facets = $derived(computeFacets(searched, filters, labels));
	const chips = $derived(activeFilterChips(filters, labels));
	const activeCount = $derived(countActiveFilters(filters));
	const shown = $derived(results.slice(0, visible));
	const suggestions = $derived(results.length === 0 && query ? suggestTerms(products, query) : []);

	function clearAll() {
		filters = emptyFilters();
	}
	function clearEverything() {
		filters = emptyFilters();
		query = '';
	}
</script>

<div class="flex flex-col">
	<PageHeader {title} {description} {eyebrow} {breadcrumbs} {headingLevel} size="default" />
	{@render intro?.()}

	<!-- Toolbar -->
	<div class="sticky top-[var(--header-h)] z-20 -mx-4 mb-6 flex flex-col gap-3 border-y border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:flex-row lg:items-end lg:rounded-card lg:border lg:bg-surface lg:px-4">
		<SearchInput bind:value={query} label="Search within {title}" placeholder="Search name, brand or SKU…" class="lg:max-w-sm lg:flex-1" />
		<div class="flex items-end gap-2 lg:ml-auto">
			<Button variant="outline" iconLeft="sliders" class="lg:hidden" onclick={() => (filtersOpen = true)} aria-haspopup="dialog">
				Filters{#if activeCount}<span class="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs text-white">{activeCount}</span>{/if}
			</Button>
			<Select label="Sort by" hideLabel bind:value={sort} options={SORT_OPTIONS} class="min-w-0 flex-1 sm:w-56 sm:flex-none" />
			<div class="hidden rounded-control border border-border-strong p-0.5 sm:flex" role="group" aria-label="Layout">
				<button type="button" class={cn('focus-ring grid size-9 place-items-center rounded', view === 'grid' ? 'bg-ink text-white' : 'text-muted-foreground hover:bg-muted')} aria-pressed={view === 'grid'} aria-label="Grid view" onclick={() => (view = 'grid')}><Icon name="grid" class="size-4" /></button>
				<button type="button" class={cn('focus-ring grid size-9 place-items-center rounded', view === 'list' ? 'bg-ink text-white' : 'text-muted-foreground hover:bg-muted')} aria-pressed={view === 'list'} aria-label="List view" onclick={() => (view = 'list')}><Icon name="list" class="size-4" /></button>
			</div>
		</div>
	</div>

	<div class="grid gap-8 lg:grid-cols-[16rem_1fr] xl:grid-cols-[17rem_1fr]">
		<!-- Desktop filters -->
		<aside class="hidden lg:block" aria-labelledby="filters-heading">
			<div class="sticky top-[calc(var(--header-h)+1rem)] max-h-[calc(100dvh-var(--header-h)-2rem)] overflow-y-auto pr-1">
				<div class="mb-2 flex items-center justify-between">
					<h2 id="filters-heading" class="text-sm font-bold tracking-wide uppercase">Filters</h2>
					{#if activeCount}<button type="button" class="focus-ring rounded text-sm font-medium text-primary-text hover:underline" onclick={clearAll}>Clear all ({activeCount})</button>{/if}
				</div>
				<FilterPanel {facets} bind:filters hide={hideFacets} />
			</div>
		</aside>

		<!-- Results -->
		<section aria-labelledby="results-heading" class="min-w-0">
			<div class="mb-4 flex flex-wrap items-center gap-2">
				<h2 id="results-heading" class="mr-2 text-sm text-muted-foreground" aria-live="polite">
					<span class="font-semibold text-foreground">{results.length}</span>
					{results.length === 1 ? 'product' : 'products'}{#if query.trim()}&nbsp;for “{query.trim()}”{/if}
				</h2>
				{#each chips as chip (chip.key + (chip.value ?? ''))}
					<Chip size="sm" onremove={() => (filters = removeFilter(filters, chip))} removeLabel="Remove filter: {chip.label}">{chip.label}</Chip>
				{/each}
				{#if chips.length > 1}
					<button type="button" class="focus-ring rounded px-1 text-sm font-medium text-primary-text hover:underline" onclick={clearAll}>Clear all</button>
				{/if}
			</div>

			{#if results.length}
				<ProductGrid products={shown} columns={3} cardVariant={view === 'list' ? 'horizontal' : 'default'} priorityCount={3} label="{title} products" />
				{#if visible < results.length}
					<div class="mt-8 flex flex-col items-center gap-3">
						<p class="text-sm text-muted-foreground">Showing {shown.length} of {results.length}</p>
						<div class="h-1 w-48 overflow-hidden rounded-full bg-muted" aria-hidden="true"><div class="h-full bg-brand" style="width:{(shown.length / results.length) * 100}%"></div></div>
						<Button variant="outline" iconRight="chevron-down" onclick={() => (visible += pageSize)}>Load {Math.min(pageSize, results.length - visible)} more</Button>
					</div>
				{/if}
			{:else}
				<NoResults
					query={query.trim() || undefined}
					activeFilters={activeCount}
					{suggestions}
					onsuggestion={(s) => (query = s)}
					onclear={query || activeCount ? clearEverything : undefined}
					class="rounded-card border border-dashed border-border bg-surface"
				/>
			{/if}
		</section>
	</div>
</div>

<!-- Mobile filters -->
<Sheet bind:open={filtersOpen} side="left" size="md" title="Filters" description="{results.length} matching products">
	<FilterPanel {facets} bind:filters hide={hideFacets} />
	{#snippet footer(close)}
		<Button variant="outline" onclick={clearAll} disabled={!activeCount}>Clear{#if activeCount}&nbsp;({activeCount}){/if}</Button>
		<Button onclick={close}>Show {results.length} results</Button>
	{/snippet}
</Sheet>
