<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Icon from '../ui/Icon.svelte';
	import ProductImage from '../media/ProductImage.svelte';
	import type { Product } from '$lib/types';
	import { quickSearch, searchProducts } from '$lib/catalog/search';
	import { formatPrice } from '$lib/catalog/pricing';
	import { categories, categoryHref } from '$lib/data/categories';
	import { clickOutside } from '$lib/utils/actions';
	import { cn } from '$lib/utils/cn';

	/**
	 * Search-as-you-type (WAI-ARIA combobox + listbox). Suggests products and
	 * categories; Enter on the input opens the full results page.
	 * Works without the dropdown too: it's a real GET form to /shop?q=.
	 */
	interface Props {
		products: Product[];
		placeholder?: string;
		size?: 'md' | 'lg';
		/** Where the full results live. */
		action?: string;
		class?: string;
		id?: string;
	}

	let { products, placeholder = 'Search products, brands or SKU', size = 'md', action = '/shop', class: className, id }: Props = $props();

	const uid = $props.id();
	const inputId = $derived(id ?? `qs-${uid}`);
	const listId = `qs-list-${uid}`;

	// svelte-ignore state_referenced_locally
	let value = $state(page.url.pathname === action ? (page.url.searchParams.get('q') ?? '') : '');
	let open = $state(false);
	let active = $state(-1);

	const productHits = $derived(quickSearch(products, value, 6));
	const total = $derived(value.trim().length >= 2 ? searchProducts(products, value).length : 0);
	const categoryHits = $derived(
		value.trim().length >= 2 ? categories.filter((c) => c.name.toLowerCase().includes(value.trim().toLowerCase())).slice(0, 2) : []
	);
	type Option = { id: string; href: string };
	const options: Option[] = $derived([
		...categoryHits.map((c) => ({ id: `${listId}-c-${c.slug}`, href: categoryHref(c.slug) })),
		...productHits.map((p) => ({ id: `${listId}-p-${p.id}`, href: p.href })),
		...(value.trim() ? [{ id: `${listId}-all`, href: `${action}?q=${encodeURIComponent(value.trim())}` }] : [])
	]);
	const expanded = $derived(open && value.trim().length >= 2);

	function go(href: string) {
		open = false;
		active = -1;
		goto(href);
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			open = true;
			active = Math.min(options.length - 1, active + 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			active = Math.max(-1, active - 1);
		} else if (e.key === 'Escape') {
			if (open) {
				e.preventDefault();
				open = false;
				active = -1;
			} else value = '';
		} else if (e.key === 'Enter' && expanded && active >= 0) {
			e.preventDefault();
			go(options[active].href);
		}
	}

	function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		const q = value.trim();
		open = false;
		goto(q ? `${action}?q=${encodeURIComponent(q)}` : action);
	}

	const optClass = (i: number) => cn('flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left', i === active ? 'bg-muted' : 'hover:bg-muted');
</script>

<form role="search" {action} method="get" class={cn('relative', className)} {onsubmit} use:clickOutside={() => (open = false)}>
	<label for={inputId} class="sr-only">Search the catalog</label>
	<div class="relative">
		<Icon name="search" class="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
		<input
			id={inputId}
			name="q"
			type="search"
			autocomplete="off"
			role="combobox"
			aria-autocomplete="list"
			aria-expanded={expanded}
			aria-controls={listId}
			aria-activedescendant={expanded && active >= 0 ? options[active]?.id : undefined}
			{placeholder}
			bind:value
			oninput={() => {
				open = true;
				active = -1;
			}}
			onfocus={() => (open = true)}
			{onkeydown}
			class={cn(
				'focus-ring w-full rounded-control border border-border-strong bg-surface pr-24 pl-10 text-sm text-foreground placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden',
				size === 'lg' ? 'h-12 text-base' : 'h-11'
			)}
		/>
		<button type="submit" class={cn('focus-ring absolute top-1 right-1 bottom-1 rounded-[calc(var(--radius-control)-2px)] bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover')}>
			Search
		</button>
	</div>

	<div
		id={listId}
		role="listbox"
		aria-label="Search suggestions"
		class={cn('absolute inset-x-0 top-full z-50 mt-2 max-h-[70dvh] overflow-y-auto rounded-card border border-border bg-surface p-1.5 text-foreground shadow-overlay', !expanded && 'hidden')}
	>
		{#if expanded}
			{#if options.length <= 1 && productHits.length === 0}
				<p class="px-3 py-4 text-sm text-muted-foreground">No quick matches. Press Enter to search all products.</p>
			{/if}
			{#each categoryHits as c, i (c.slug)}
				<div id="{listId}-c-{c.slug}" role="option" tabindex="-1" aria-selected={active === i} class={optClass(i)} onclick={() => go(categoryHref(c.slug))} onkeydown={() => {}} onpointermove={() => (active = i)}>
					<span class="grid size-10 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground"><Icon name={c.icon} class="size-5" /></span>
					<span class="flex flex-col"><span class="text-sm font-medium">{c.name}</span><span class="text-xs text-muted-foreground">Category</span></span>
				</div>
			{/each}
			{#each productHits as p, j (p.id)}
				{@const i = categoryHits.length + j}
				<div id="{listId}-p-{p.id}" role="option" tabindex="-1" aria-selected={active === i} class={optClass(i)} onclick={() => go(p.href)} onkeydown={() => {}} onpointermove={() => (active = i)}>
					<ProductImage src={p.image} sprite={p.sprite} alt="" aspect="square" class="size-10 shrink-0 rounded border border-border" />
					<span class="flex min-w-0 flex-1 flex-col">
						<span class="truncate text-sm font-medium">{p.brand ? `${p.brand} ` : ''}{p.name}</span>
						<span class="truncate text-xs text-muted-foreground">{p.packSize} · <span class="font-mono">{p.sku}</span></span>
					</span>
					<span class="shrink-0 text-sm font-semibold text-primary-text tabular-nums">{p.quoteOnly ? 'Quote' : formatPrice(p.price)}</span>
				</div>
			{/each}
			{#if value.trim()}
				{@const i = options.length - 1}
				<div id="{listId}-all" role="option" tabindex="-1" aria-selected={active === i} class={cn(optClass(i), 'mt-1 border-t border-border pt-2.5 text-sm font-medium')} onclick={() => go(options[i].href)} onkeydown={() => {}} onpointermove={() => (active = i)}>
					<Icon name="search" class="size-4 text-muted-foreground" />
					<span class="flex-1">See all {total} result{total === 1 ? '' : 's'} for “{value.trim()}”</span>
					<Icon name="arrow-right" class="size-4" />
				</div>
			{/if}
		{/if}
	</div>
	<p class="sr-only" aria-live="polite">{expanded ? `${productHits.length} suggestions available` : ''}</p>
</form>
