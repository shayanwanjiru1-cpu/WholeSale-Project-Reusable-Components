<script lang="ts">
	import { Alert, CatalogListing, Container } from '$lib';
	import { saleProducts } from '$lib/data/products';
	import { site } from '$lib/data/site';

	const breadcrumbs = [{ label: 'Home', href: '/', icon: 'home' as const }, { label: 'Deals' }];
</script>

<svelte:head>
	<title>Wholesale Deals & Bulk Promotions | {site.name}</title>
	<meta name="description" content="Reduced wholesale case prices on staples, cleaning, personal care and hardware. Limited-time bulk deals for business buyers." />
</svelte:head>

<Container size="wide" class="pb-16">
	<CatalogListing products={saleProducts} title="Bulk deals" eyebrow="Promotions" description="Reduced case prices on selected lines while stock lasts." {breadcrumbs}>
		{#snippet intro()}
			<Alert tone="primary" icon="tag" title="Deal prices stack with quantity breaks" class="mb-6">
				Tier discounts apply on top of the reduced unit price. Demo promotions — not real offers.
			</Alert>
		{/snippet}
	</CatalogListing>
</Container>
