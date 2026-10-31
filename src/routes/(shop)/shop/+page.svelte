<script lang="ts">
	import { CatalogListing, Container } from '$lib';
	import { photoFirst, products } from '$lib/data/products';
	import { site } from '$lib/data/site';
	import { breadcrumbJsonLd, jsonLdScript } from '$lib/catalog/seo';

	const breadcrumbs = [{ label: 'Home', href: '/', icon: 'home' as const }, { label: 'All products' }];
</script>

<svelte:head>
	<title>All Wholesale Products | {site.name}</title>
	<meta name="description" content="Browse {products.length} wholesale products across food, beverages, cleaning, personal care, packaging, stationery, hardware, gardening and chemicals. Tiered pricing and clear MOQs." />
	<link rel="canonical" href="{site.url}/shop" />
	{@html jsonLdScript(breadcrumbJsonLd(breadcrumbs))}
</svelte:head>

<Container size="wide" class="pb-16">
	<CatalogListing products={photoFirst(products)} title="All products" description="Search, filter and sort the full wholesale catalog." {breadcrumbs} />
</Container>
