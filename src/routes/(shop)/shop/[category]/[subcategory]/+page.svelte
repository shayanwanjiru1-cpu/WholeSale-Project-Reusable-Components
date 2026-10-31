<script lang="ts">
	import { CatalogListing, Container } from '$lib';
	import { categoryHref } from '$lib/data/categories';
	import { site } from '$lib/data/site';
	import { breadcrumbJsonLd, categoryDescription, categoryTitle, jsonLdScript } from '$lib/catalog/seo';

	let { data } = $props();
	const c = $derived(data.category);
	const s = $derived(data.subcategory);
	const breadcrumbs = $derived([
		{ label: 'Home', href: '/', icon: 'home' as const },
		{ label: c.name, href: categoryHref(c.slug) },
		{ label: s.name }
	]);
</script>

<svelte:head>
	<title>{categoryTitle(s.name)}</title>
	<meta name="description" content={categoryDescription({ name: s.name, description: c.description }, data.products.length)} />
	<link rel="canonical" href="{site.url}{categoryHref(c.slug, s.slug)}" />
	{@html jsonLdScript(breadcrumbJsonLd(breadcrumbs))}
</svelte:head>

<Container size="wide" class="pb-16">
	{#key s.slug}
		<CatalogListing products={data.products} title={s.name} eyebrow={c.name} description="Wholesale {s.name.toLowerCase()} with tiered pricing and clear minimum order quantities." {breadcrumbs} hideFacets={['categories', 'subcategories']} />
	{/key}
</Container>
