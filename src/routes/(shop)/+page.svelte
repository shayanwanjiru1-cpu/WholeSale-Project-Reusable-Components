<script lang="ts">
	import {
		Accordion,
		Badge,
		Button,
		CatalogListing,
		CategoryCard,
		Container,
		FeatureCard,
		Icon,
		ProductCard,
		ProductImage,
		QuickSearch,
		Section,
		Stepper
	} from '$lib';
	import { categories } from '$lib/data/categories';
	import { photoFirst, products, productsInCategory, saleProducts } from '$lib/data/products';
	import { heroCollage } from '$lib/data/assets';
	import { site, wholesaleTerms } from '$lib/data/site';
	import { brands } from '$lib/data/products';
	import type { IconName, Product } from '$lib/types';

	const coverFor = (slug?: string) => products.find((p) => p.slug === slug);

	// Hero mosaic (used until the supplied collage photo is added to src/lib/assets/source).
	const mosaic = ['long-grain-rice-25kg', 'cooking-oil-20l', 'laundry-detergent-5kg', 'toilet-tissue-48', 'aa-alkaline-batteries', 'exercise-books-96pg']
		.map((slug) => products.find((p) => p.slug === slug))
		.filter(Boolean) as Product[];

	const popularSearches = ['Rice', 'Sona', 'Cooking oil', 'Detergent', 'Bin liners', 'WS-HW-7002'];

	const benefits: { icon: IconName; title: string; description: string }[] = [
		{ icon: 'percent', title: 'Tiered bulk pricing', description: 'Unit prices drop automatically at 10+ and 50+ units — shown on every product.' },
		{ icon: 'package', title: 'Low MOQ options', description: 'Many lines start at a single case, so you can test a product before committing.' },
		{ icon: 'warehouse', title: 'Reliable stock', description: 'Live stock states and lead times on every item. No surprises at dispatch.' },
		{ icon: 'building', title: 'Business accounts', description: 'Multiple buyers, approval limits and one consolidated invoice.' },
		{ icon: 'truck', title: 'Fast fulfilment', description: 'Most in-stock orders dispatch within 1–3 working days.' },
		{ icon: 'calendar', title: 'Flexible payment terms', description: 'Prepaid, Net-30 and Net-60 options for approved accounts.' },
		{ icon: 'repeat', title: 'Repeat ordering', description: 'Reorder your regulars in one click from your order history.' },
		{ icon: 'file-text', title: 'Quote support', description: 'Custom pricing for large volumes, contracts and trade-only lines.' }
	];

	const steps = [
		{ label: 'Open a business account', description: 'Register your company and add buyers.', status: 'complete' as const },
		{ label: 'Build your order', description: 'Search, filter or upload a CSV of SKUs.', status: 'complete' as const },
		{ label: 'Approve & choose terms', description: 'Approval routing, PO numbers, Net-30/60.', status: 'current' as const },
		{ label: 'Delivered to your door', description: 'Business delivery with tracking.', status: 'upcoming' as const }
	];

	const faqs = [
		{ id: 'moq', title: 'What is a minimum order quantity (MOQ)?', content: 'Each product shows its MOQ — the fewest selling units (bags, cartons, cases) you can order. Your whole order also needs to reach the minimum order value shown at the top of the page.' },
		{ id: 'tiers', title: 'How does tiered pricing work?', content: 'Unit prices step down as quantity increases. The product page shows each price break, and your cart applies the best price automatically.' },
		{ id: 'terms', title: 'Can I pay on account?', content: 'Approved business accounts can choose Net-30 or Net-60 terms at checkout. New accounts start on prepaid while credit is reviewed.' },
		{ id: 'chemicals', title: 'Do you supply trade chemicals?', content: 'Yes, to business customers. Chemicals are clearly labelled with hazard information and supplied with safety data sheets. Some lines are quote-only for verified trade accounts.' }
	];
</script>

<svelte:head>
	<title>{site.name} — Wholesale essentials for business</title>
	<meta name="description" content={site.description} />
	<link rel="canonical" href={site.url} />
</svelte:head>

<!-- HERO -->
<section class="theme-dark relative overflow-hidden border-b border-border bg-background" aria-labelledby="hero-title">
	<Container size="wide" class="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-20">
		<div>
			<p class="mb-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
				<span class="size-2 rounded-full bg-brand" aria-hidden="true"></span>{site.name} · demo store
			</p>
			<h1 id="hero-title" class="text-h1 text-balance text-foreground">
				Wholesale essentials. <span class="text-primary-text">Better prices.</span> Built for business.
			</h1>
			<p class="mt-5 max-w-xl text-body text-muted-foreground sm:text-lg">
				Source food, drinks, cleaning, personal care, packaging, stationery, hardware and trade chemicals in bulk — with clear MOQs, tiered pricing and business delivery on account.
			</p>
			<div class="mt-8 flex flex-col gap-3 sm:flex-row">
				<Button href="#catalog" size="lg" iconRight="arrow-right">Shop Wholesale</Button>
				<Button href="#categories" size="lg" variant="outline" iconLeft="grid">Browse Categories</Button>
			</div>
			<dl class="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6 sm:grid-cols-4">
				<div><dt class="text-xs text-muted-foreground">Products</dt><dd class="text-2xl font-bold">{products.length}</dd></div>
				<div><dt class="text-xs text-muted-foreground">Categories</dt><dd class="text-2xl font-bold">{categories.length}</dd></div>
				<div><dt class="text-xs text-muted-foreground">Brands</dt><dd class="text-2xl font-bold">{brands.length}</dd></div>
				<div><dt class="text-xs text-muted-foreground">MOQ from</dt><dd class="text-2xl font-bold">1 unit</dd></div>
			</dl>
		</div>

		<div class="relative">
			{#if heroCollage}
				<img src={heroCollage} alt="Wholesale products across food, beverages, cleaning, personal care, hardware, stationery, packaging, gardening and chemicals" width="1536" height="1024" class="aspect-[3/2] w-full rounded-card border border-border object-cover" fetchpriority="high" />
			{:else}
				<ul class="grid grid-cols-3 gap-2 sm:gap-3" aria-label="A selection of wholesale products">
					{#each mosaic as p, i (p.id)}
						<li class="overflow-hidden rounded-card border border-border {i === 0 ? 'col-span-2 row-span-2' : ''}">
							<a href={p.href} class="focus-ring group relative block h-full">
								<ProductImage src={p.image} sprite={p.sprite} alt={p.imageAlt} icon={categories.find((c) => c.slug === p.category)?.icon} label={p.packSize} aspect="square" loading="eager" hoverZoom class="h-full" />
								<span class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pt-6 pb-2 text-xs font-semibold text-white">{p.name}</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
			<div class="absolute -bottom-4 left-4 flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3 shadow-overlay sm:left-auto sm:-right-2">
				<span class="grid size-10 place-items-center rounded-md bg-primary text-white"><Icon name="truck" class="size-5" /></span>
				<span class="text-sm"><span class="block font-semibold">Business delivery</span><span class="text-muted-foreground">Dispatch in 1–3 days</span></span>
			</div>
		</div>
	</Container>
</section>

<!-- QUICK SEARCH -->
<section aria-labelledby="quick-search-title" class="border-b border-border bg-surface">
	<Container size="wide" class="flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:gap-10">
		<div class="lg:w-72 lg:shrink-0">
			<h2 id="quick-search-title" class="text-h3">Know what you need?</h2>
			<p class="text-sm text-muted-foreground">Search by product, brand or SKU — partial SKUs work too.</p>
		</div>
		<div class="flex-1">
			<QuickSearch {products} size="lg" id="home-search" />
			<p class="mt-3 flex flex-wrap items-center gap-2 text-sm">
				<span class="text-muted-foreground">Popular:</span>
				{#each popularSearches as term (term)}
					<a href="/?q={encodeURIComponent(term)}#catalog" class="focus-ring rounded-full border border-border-strong px-3 py-1 text-foreground hover:border-brand hover:text-primary-text">{term}</a>
				{/each}
			</p>
		</div>
	</Container>
</section>

<!-- CATEGORIES -->
<Section id="categories" title="Shop by category" description="Nine departments covering everything a shop, kitchen, office or site goes through." containerSize="wide" spacing="lg">
	{#snippet actions()}<Button href="#catalog" variant="outline" iconRight="arrow-right">All products</Button>{/snippet}
	<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
		{#each categories as category (category.slug)}
			<li><CategoryCard {category} cover={coverFor(category.coverProduct)} count={productsInCategory(category.slug).length} class="h-full" /></li>
		{/each}
	</ul>
</Section>

<!-- CATALOG: search, filter, sort, add to cart -->
<section id="catalog" aria-label="Wholesale catalog" class="border-y border-border bg-surface/40">
	<Container size="wide" class="pb-16">
		<CatalogListing products={photoFirst(products)} title="Wholesale catalog" eyebrow="All {products.length} products" description="Search by name, brand, category or SKU. Demo prices shown per selling unit, excluding VAT." headingLevel={2} pageSize={12} />
	</Container>
</section>

<!-- BENEFITS -->
<Section title="Why businesses buy wholesale here" description="Built for repeat buyers: shops, restaurants, schools, offices and facilities teams." containerSize="wide" spacing="lg">
	<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each benefits as b (b.title)}
			<li><FeatureCard icon={b.icon} title={b.title} description={b.description} variant="outlined" class="h-full" /></li>
		{/each}
	</ul>
</Section>

<!-- DEALS -->
<Section background="dark" containerSize="wide" spacing="lg" title="Bulk deals" eyebrow="Limited-time case prices" description="Reduced prices on selected lines while stock lasts. Demo promotions.">
	{#snippet actions()}<Button href="/deals" iconRight="arrow-right">See all {saleProducts.length} deals</Button>{/snippet}
	<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each photoFirst(saleProducts).slice(0, 4) as product (product.id)}
			<li class="flex"><ProductCard {product} class="w-full" /></li>
		{/each}
	</ul>
</Section>

<!-- BUSINESS ORDERING INFO -->
<Section background="surface" containerSize="wide" spacing="lg" divided title="Business ordering, made simple" description="Clear terms up front. All figures are fictional demo policy.">
	<dl class="grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
		{#each wholesaleTerms as term (term.title)}
			<div class="flex flex-col gap-1 bg-surface p-5">
				<dt class="flex items-center gap-2 text-sm text-muted-foreground"><Icon name={term.icon} class="size-4 text-primary-text" />{term.title}</dt>
				<dd class="text-lg font-bold text-foreground">{term.value}</dd>
				<dd class="text-sm text-muted-foreground">{term.description}</dd>
			</div>
		{/each}
	</dl>
	<div class="mt-12 grid gap-10 lg:grid-cols-2">
		<div>
			<h3 class="text-h3 mb-6">How ordering works</h3>
			<Stepper {steps} orientation="vertical" label="Ordering steps" />
		</div>
		<div>
			<h3 class="text-h3 mb-4">Common questions</h3>
			<Accordion items={faqs} variant="bordered" headingLevel={4} />
		</div>
	</div>
</Section>

<!-- CTA -->
<Section containerSize="wide" spacing="md">
	<div class="theme-dark relative overflow-hidden rounded-card border border-border bg-background p-8 sm:p-12">
		<div class="absolute inset-y-0 right-0 hidden w-1/3 bg-[repeating-linear-gradient(135deg,transparent_0_18px,rgb(229_57_53/0.08)_18px_36px)] lg:block" aria-hidden="true"></div>
		<div class="relative max-w-2xl">
			<Badge variant="sale" appearance="solid" pill={false} icon="file-text">Large or custom orders</Badge>
			<h2 class="text-h2 mt-4 text-foreground">Need volume pricing or a recurring supply contract?</h2>
			<p class="mt-3 text-muted-foreground">Send us your list — quantities, delivery schedule and any trade-only lines — and the account team will come back with a quote.</p>
			<div class="mt-6 flex flex-col gap-3 sm:flex-row">
				<Button href="/quote" size="lg" iconLeft="file-text">Request a quote</Button>
				<Button href="/bulk-order" size="lg" variant="outline" iconLeft="upload">Upload a bulk order</Button>
			</div>
		</div>
	</div>
</Section>
