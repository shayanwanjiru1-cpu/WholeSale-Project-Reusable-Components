<script lang="ts">
	import { page } from '$app/state';
	import { Button, Container, ErrorState, Logo } from '$lib';
	import { site } from '$lib/data/site';
	import { brandImages } from '$lib/data/assets';
</script>

<svelte:head><title>{page.status === 404 ? 'Page not found' : 'Something went wrong'} | {site.name}</title></svelte:head>

<div class="theme-dark border-b border-border bg-background">
	<Container class="flex h-16 items-center"><Logo name={site.shortName} tagline={site.tagline} markSrc={brandImages.markInverse} accentLastWord href="/" tone="inverse" size="sm" /></Container>
</div>
<main id="main-content" class="py-16">
	<Container size="narrow">
		<ErrorState
			title={page.status === 404 ? 'We couldn’t find that page' : 'Something went wrong'}
			description={page.status === 404 ? 'The product or page may have moved. Search the catalog or browse categories instead.' : (page.error?.message ?? 'Please try again.')}
			size="lg"
		>
			{#snippet secondaryAction()}
				<Button href="/shop" iconLeft="search">Search products</Button>
				<Button href="/" variant="outline">Go to home</Button>
			{/snippet}
		</ErrorState>
	</Container>
</main>
