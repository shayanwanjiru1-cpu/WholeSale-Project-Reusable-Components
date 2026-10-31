<script lang="ts">
	import {
		AddToCart,
		Badge,
		Container,
		CopyableText,
		DescriptionList,
		HazardNotice,
		Icon,
		PriceDisplay,
		ProductGrid,
		ProductImage,
		Breadcrumbs,
		StockStatus,
		Tabs,
		TierPriceTable
	} from '$lib';
	import { categoryHref } from '$lib/data/categories';
	import { site } from '$lib/data/site';
	import { breadcrumbJsonLd, jsonLdScript, productDescription, productJsonLd, productTitle } from '$lib/catalog/seo';
	import { ORDER_POLICY, formatPrice, pluralUnit } from '$lib/catalog/pricing';
	import { availabilityDetail } from '$lib/catalog/stock';

	let { data } = $props();
	const p = $derived(data.product);
	const c = $derived(data.category);
	let quantity = $state(1);

	const breadcrumbs = $derived([
		{ label: 'Home', href: '/', icon: 'home' as const },
		{ label: c.name, href: categoryHref(c.slug) },
		{ label: p.subcategoryName ?? '', href: categoryHref(c.slug, p.subcategory) },
		{ label: p.name }
	]);

	const facts = $derived(
		[
			{ key: 'SKU', value: p.sku },
			{ key: 'Brand', value: p.brand ?? '—' },
			{ key: 'Selling unit', value: p.unit },
			{ key: 'Pack size', value: p.packSize ?? '—' },
			...(p.casePack ? [{ key: 'Case pack', value: `${p.casePack} units per ${p.unit}` }] : []),
			{ key: 'Minimum order', value: `${p.moq} ${pluralUnit(p.unit, p.moq)}` },
			{ key: 'Availability', value: availabilityDetail(p) ?? '' },
			{ key: 'Category', value: `${p.categoryName} › ${p.subcategoryName}` }
		]
	);

	const tabs = $derived([
		{ id: 'details', label: 'Details', icon: 'info' as const },
		{ id: 'specs', label: 'Specifications', icon: 'sliders' as const },
		{ id: 'delivery', label: 'Delivery & terms', icon: 'truck' as const },
		...(p.hazard ? [{ id: 'safety', label: 'Safety', icon: 'alert-triangle' as const }] : [])
	]);
	let tab = $state('details');
</script>

<svelte:head>
	<title>{productTitle(p)}</title>
	<meta name="description" content={productDescription(p)} />
	<link rel="canonical" href="{site.url}{p.href}" />
	{@html jsonLdScript(productJsonLd(p))}
	{@html jsonLdScript(breadcrumbJsonLd(breadcrumbs))}
</svelte:head>

<Container size="wide" class="pt-6 pb-16">
	<Breadcrumbs items={breadcrumbs} class="mb-6" />

	<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
		<!-- Gallery -->
		<div class="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
			<div class="relative overflow-hidden rounded-card border border-border">
				<ProductImage src={p.image} sprite={p.sprite} alt={p.imageAlt} icon={c.icon} label={p.packSize} aspect="square" loading="eager" />
				<div class="absolute top-3 left-3 flex flex-col items-start gap-1.5">
					{#if p.sale}<Badge variant="sale" appearance="solid" pill={false} icon="tag">Sale</Badge>{/if}
					{#if p.featured}<Badge variant="neutral" appearance="solid" pill={false} icon="star">Featured</Badge>{/if}
				</div>
			</div>
			<p class="mt-3 text-center text-xs text-muted-foreground">Image for illustration. Packaging may vary by batch.</p>
		</div>

		<!-- Buy box -->
		<div class="flex flex-col gap-6">
			<div>
				<p class="text-sm text-muted-foreground">
					{#if p.brand}<span class="font-semibold text-foreground">{p.brand}</span> · {/if}<a href={categoryHref(c.slug, p.subcategory)} class="focus-ring rounded hover:text-primary-text hover:underline">{p.subcategoryName}</a>
				</p>
				<h1 class="text-h2 mt-1 text-balance">{p.name}</h1>
				<div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
					<span>{p.packSize} per {p.unit}</span>
					<CopyableText value={p.sku} label="SKU" mono />
				</div>
			</div>

			<div class="flex flex-col gap-3 border-y border-border py-5">
				<PriceDisplay product={p} size="lg" showVatNote />
				<div class="flex flex-wrap items-center gap-3">
					<span class="inline-flex items-center gap-1.5 rounded bg-accent px-2 py-1 text-sm font-semibold text-accent-foreground">
						<Icon name="package" class="size-4" />Minimum order: {p.moq} {pluralUnit(p.unit, p.moq)}
					</span>
					{#if p.casePack}<span class="text-sm text-muted-foreground">Case pack: {p.casePack} units</span>{/if}
				</div>
				<StockStatus product={p} size="md" />
			</div>

			{#if p.hazard}<HazardNotice hazard={p.hazard} variant="full" />{/if}

			{#if !p.quoteOnly}
				<section aria-labelledby="tiers-title">
					<h2 id="tiers-title" class="mb-2 text-sm font-semibold">Wholesale price breaks</h2>
					<TierPriceTable product={p} {quantity} />
				</section>
			{/if}

			<AddToCart product={p} variant="full" bind:quantity />

			<ul class="grid gap-3 rounded-card border border-border bg-surface p-4 text-sm sm:grid-cols-3">
				<li class="flex gap-2"><Icon name="truck" class="mt-0.5 size-4 shrink-0 text-primary-text" /><span>Free delivery over {formatPrice(ORDER_POLICY.freeDeliveryThreshold)}</span></li>
				<li class="flex gap-2"><Icon name="calendar" class="mt-0.5 size-4 shrink-0 text-primary-text" /><span>Net-30 / Net-60 on approved accounts</span></li>
				<li class="flex gap-2"><Icon name="file-text" class="mt-0.5 size-4 shrink-0 text-primary-text" /><span>Volume quotes for large orders</span></li>
			</ul>
		</div>
	</div>

	<!-- Product information -->
	<section class="mt-14" aria-label="Product information">
		<Tabs {tabs} bind:value={tab} variant="underline" label="Product information">
			{#snippet panel(t)}
				<div class="max-w-3xl py-4">
					{#if t.id === 'details'}
						<p class="text-body text-foreground">{p.description ?? `${p.brand ? `${p.brand} ` : ''}${p.name}, supplied as ${p.packSize} per ${p.unit}. Ideal for retailers, kitchens, offices and institutions buying in bulk.`}</p>
						{#if p.tags?.length}
							<p class="mt-4 flex flex-wrap gap-2">{#each p.tags as tag (tag)}<Badge variant="neutral">{tag}</Badge>{/each}</p>
						{/if}
					{:else if t.id === 'specs'}
						<DescriptionList items={facts} divided />
					{:else if t.id === 'delivery'}
						<ul class="flex list-disc flex-col gap-2 pl-5 text-body">
							<li>Business delivery within the delivery zone; free over {formatPrice(ORDER_POLICY.freeDeliveryThreshold)}, otherwise {formatPrice(ORDER_POLICY.deliveryFee)}.</li>
							<li>{availabilityDetail(p)}.</li>
							<li>Payment: prepaid, or Net-30 / Net-60 for approved accounts.</li>
							<li>Damaged or short deliveries must be reported within 48 hours. <a href="/info/returns" class="text-primary-text underline">Returns policy</a></li>
						</ul>
					{:else if t.id === 'safety' && p.hazard}
						<HazardNotice hazard={p.hazard} variant="full" />
					{/if}
				</div>
			{/snippet}
		</Tabs>
	</section>

	{#if data.related.length}
		<section class="mt-14" aria-labelledby="related-title">
			<div class="mb-6 flex items-end justify-between gap-4">
				<h2 id="related-title" class="text-h3">Related products</h2>
				<a href={categoryHref(c.slug, p.subcategory)} class="focus-ring rounded text-sm font-semibold text-primary-text hover:underline">More in {p.subcategoryName}</a>
			</div>
			<ProductGrid products={data.related} columns={4} />
		</section>
	{/if}
</Container>
