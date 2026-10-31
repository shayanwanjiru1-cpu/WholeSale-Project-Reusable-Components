<script lang="ts">
	import { Alert, CatalogListing, Container, Icon } from '$lib';
	import { categoryHref } from '$lib/data/categories';
	import { site } from '$lib/data/site';
	import { breadcrumbJsonLd, categoryDescription, categoryTitle, jsonLdScript } from '$lib/catalog/seo';

	let { data } = $props();
	const c = $derived(data.category);
	const breadcrumbs = $derived([{ label: 'Home', href: '/', icon: 'home' as const }, { label: 'All products', href: '/shop' }, { label: c.name }]);
</script>

<svelte:head>
	<title>{categoryTitle(c.name)}</title>
	<meta name="description" content={categoryDescription(c, data.products.length)} />
	<link rel="canonical" href="{site.url}{categoryHref(c.slug)}" />
	{@html jsonLdScript(breadcrumbJsonLd(breadcrumbs))}
</svelte:head>

<Container size="wide" class="pb-16">
	{#key c.slug}
		<CatalogListing products={data.products} title={c.name} description={c.description} eyebrow="Wholesale" {breadcrumbs} hideFacets={['categories']}>
			{#snippet intro()}
				<nav aria-label="{c.name} ranges" class="mb-6">
					<ul class="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
						{#each c.subcategories as s (s.slug)}
							<li class="shrink-0">
								<a href={categoryHref(c.slug, s.slug)} class="focus-ring inline-flex h-9 items-center gap-1.5 rounded-full border border-border-strong bg-surface px-4 text-sm font-medium whitespace-nowrap hover:border-brand hover:text-primary-text">
									{s.name}<Icon name="chevron-right" class="size-3.5 opacity-60" />
								</a>
							</li>
						{/each}
					</ul>
				</nav>
				{#if c.regulated}
					<Alert tone="warning" title="Trade chemicals — handle responsibly" class="mb-6">
						Products in this category carry hazard labels and are supplied with safety data sheets. Some lines are available to verified trade accounts only. Store away from food and out of reach of children.
					</Alert>
				{/if}
			{/snippet}
		</CatalogListing>
	{/key}
</Container>
