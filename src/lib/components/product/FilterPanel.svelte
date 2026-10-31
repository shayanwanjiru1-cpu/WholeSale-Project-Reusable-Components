<script lang="ts">
	import type { Snippet } from 'svelte';
	import Collapsible from '../data-display/Collapsible.svelte';
	import Checkbox from '../forms/Checkbox.svelte';
	import RadioGroup from '../forms/RadioGroup.svelte';
	import type { FacetOption, Facets, FilterState } from '$lib/types';
	import { MOQ_OPTIONS } from '$lib/catalog/filters';

	/**
	 * Faceted filters. Purely presentational: receives facet options with counts and a
	 * bindable FilterState; the filtering itself lives in $lib/catalog/filters.
	 * Used in the desktop sidebar and inside the mobile filter drawer.
	 */
	interface Props {
		facets: Facets;
		filters: FilterState;
		/** Hide facets that are fixed by the page (e.g. category on a category page). */
		hide?: (keyof Facets)[];
		headingLevel?: 2 | 3 | 4;
		footer?: Snippet;
		class?: string;
	}

	let { facets, filters = $bindable(), hide = [], headingLevel = 3, footer, class: className }: Props = $props();

	const uid = $props.id();
	const shown = (k: keyof Facets, opts: FacetOption[]) => !hide.includes(k) && opts.length > 1;
	let showAllBrands = $state(false);
	let showAllPacks = $state(false);

	function toggle(key: 'categories' | 'subcategories' | 'brands' | 'units' | 'packSizes' | 'stock', value: string, on: boolean) {
		const list = filters[key] as string[];
		(filters[key] as string[]) = on ? [...list, value] : list.filter((v) => v !== value);
	}

	// MOQ radio uses strings; "" = any.
	let moq = $state('');
	$effect.pre(() => {
		moq = filters.maxMoq === undefined ? '' : String(filters.maxMoq);
	});
	function setMoq(v: string) {
		moq = v;
		filters.maxMoq = v === '' ? undefined : Number(v);
	}

	function setPrice(which: 'min' | 'max', raw: string) {
		const n = parseInt(raw, 10);
		filters.price = { ...filters.price, [which]: Number.isFinite(n) && n >= 0 ? n : undefined };
	}

	const brandList = $derived(showAllBrands ? facets.brands : facets.brands.slice(0, 8));
	const packList = $derived(showAllPacks ? facets.packSizes : facets.packSizes.slice(0, 8));
</script>

{#snippet checkboxes(key: 'categories' | 'subcategories' | 'brands' | 'units' | 'packSizes' | 'stock', options: FacetOption[])}
	<ul class="flex flex-col">
		{#each options as o (o.value)}
			<li>
				<Checkbox
					label={o.label}
					meta={o.count}
					checked={(filters[key] as string[]).includes(o.value)}
					onchange={(e) => toggle(key, o.value, e.currentTarget.checked)}
				/>
			</li>
		{/each}
	</ul>
{/snippet}

<div class={className}>
	<div class="divide-y divide-border">
		{#if shown('categories', facets.categories)}
			<Collapsible title="Category" open {headingLevel}>{@render checkboxes('categories', facets.categories)}</Collapsible>
		{/if}
		{#if shown('subcategories', facets.subcategories)}
			<Collapsible title="Range" open {headingLevel}>{@render checkboxes('subcategories', facets.subcategories)}</Collapsible>
		{/if}
		{#if facets.stock.length}
			<Collapsible title="Availability" open {headingLevel}>{@render checkboxes('stock', facets.stock)}</Collapsible>
		{/if}
		<Collapsible title="Price per unit (KES)" open {headingLevel}>
			<div class="flex items-end gap-2">
				<label class="flex flex-1 flex-col gap-1 text-xs text-muted-foreground">
					Min
					<input type="number" inputmode="numeric" min="0" placeholder={String(facets.priceBounds.min)} value={filters.price.min ?? ''} onchange={(e) => setPrice('min', e.currentTarget.value)} class="focus-ring no-spin h-9 w-full rounded-control border border-border-strong bg-surface px-2 text-sm text-foreground" />
				</label>
				<span class="pb-2 text-muted-foreground" aria-hidden="true">–</span>
				<label class="flex flex-1 flex-col gap-1 text-xs text-muted-foreground">
					Max
					<input type="number" inputmode="numeric" min="0" placeholder={String(facets.priceBounds.max)} value={filters.price.max ?? ''} onchange={(e) => setPrice('max', e.currentTarget.value)} class="focus-ring no-spin h-9 w-full rounded-control border border-border-strong bg-surface px-2 text-sm text-foreground" />
				</label>
			</div>
		</Collapsible>
		<Collapsible title="Minimum order (MOQ)" open {headingLevel}>
			<RadioGroup
				legend="Maximum MOQ"
				hideLegend
				name="moq-{uid}"
				bind:value={() => moq, setMoq}
				options={[{ value: '', label: 'Any MOQ' }, ...MOQ_OPTIONS.map((n) => ({ value: String(n), label: n === 1 ? 'Single unit (MOQ 1)' : `MOQ ${n} or less` }))]}
			/>
		</Collapsible>
		<Collapsible title="Promotions" open {headingLevel}>
			<Checkbox label="On sale" checked={filters.saleOnly} onchange={(e) => (filters.saleOnly = e.currentTarget.checked)} />
		</Collapsible>
		{#if shown('brands', facets.brands)}
			<Collapsible title="Brand" open {headingLevel}>
				{@render checkboxes('brands', brandList)}
				{#if facets.brands.length > 8}
					<button type="button" class="focus-ring mt-1 rounded text-sm font-medium text-primary-text hover:underline" aria-expanded={showAllBrands} onclick={() => (showAllBrands = !showAllBrands)}>
						{showAllBrands ? 'Show fewer brands' : `Show all ${facets.brands.length} brands`}
					</button>
				{/if}
			</Collapsible>
		{/if}
		{#if shown('packSizes', facets.packSizes)}
			<Collapsible title="Pack size" {headingLevel}>
				{@render checkboxes('packSizes', packList)}
				{#if facets.packSizes.length > 8}
					<button type="button" class="focus-ring mt-1 rounded text-sm font-medium text-primary-text hover:underline" aria-expanded={showAllPacks} onclick={() => (showAllPacks = !showAllPacks)}>
						{showAllPacks ? 'Show fewer' : `Show all ${facets.packSizes.length} pack sizes`}
					</button>
				{/if}
			</Collapsible>
		{/if}
		{#if shown('units', facets.units)}
			<Collapsible title="Selling unit" {headingLevel}>{@render checkboxes('units', facets.units)}</Collapsible>
		{/if}
	</div>
	{@render footer?.()}
</div>
