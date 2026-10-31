<script lang="ts">
	import { Button, Container, PageHeader } from '$lib';
	import { site } from '$lib/data/site';

	let { data } = $props();
	const p = $derived(data.page);
</script>

<svelte:head>
	<title>{p.title} | {site.name}</title>
	<meta name="description" content={p.description} />
</svelte:head>

<Container size="narrow" class="pb-16">
	<PageHeader title={p.title} description={p.description} breadcrumbs={[{ label: 'Home', href: '/', icon: 'home' }, { label: p.title }]} divided />
	<div class="mt-8 flex flex-col gap-8">
		{#each p.sections as s (s.heading)}
			<section>
				<h2 class="text-h3">{s.heading}</h2>
				{#each s.body as para (para)}<p class="mt-2 text-body text-muted-foreground">{para}</p>{/each}
			</section>
		{/each}
	</div>
	<div class="mt-10 flex flex-wrap gap-3 border-t border-border pt-8">
		<Button href="/shop" iconLeft="search">Browse products</Button>
		<Button href="/quote" variant="outline" iconLeft="file-text">Request a quote</Button>
	</div>
</Container>
