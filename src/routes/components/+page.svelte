<script lang="ts">
	import { Logo, MobileMenuButton, PageContainer, PageHeader, Sidebar, SkipLink, Badge } from '$lib';
	import { showcaseNav } from '$lib/data/showcase-fixtures';
	import LayoutDemos from './LayoutDemos.svelte';
	import DataDisplayDemos from './DataDisplayDemos.svelte';

	let collapsed = $state(false);
	let mobileOpen = $state(false);
	const drawerId = 'showcase-nav';
</script>

<svelte:head><title>Component Showcase · Wholesale UI</title></svelte:head>

<SkipLink />

<div id="top" class="flex min-h-dvh">
	<Sidebar items={showcaseNav} bind:collapsed bind:mobileOpen {drawerId} label="Showcase sections">
		{#snippet header()}<Logo name="Wholesale UI" size="sm" href="/" />{/snippet}
		{#snippet footer(narrow)}
			{#if !narrow}<p class="px-1 text-xs text-muted-foreground">Svelte 5 · Tailwind CSS 4</p>{/if}
		{/snippet}
	</Sidebar>

	<div class="min-w-0 flex-1">
		<!-- Mobile top bar: the sidebar becomes a drawer below lg -->
		<div class="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-surface/90 px-2 backdrop-blur lg:hidden">
			<MobileMenuButton bind:open={mobileOpen} controls={drawerId} label="Showcase sections" />
			<Logo name="Wholesale UI" size="sm" />
		</div>

		<PageContainer size="wide">
			<PageHeader
				eyebrow="Development"
				title="Component showcase"
				description="Every reusable component with its variants, states and accessibility behaviour. This page is for development and testing only — it is not the wholesale product page."
				breadcrumbs={[{ label: 'Home', href: '/', icon: 'home' }, { label: 'Components' }]}
				divided
			>
				{#snippet meta()}
					<Badge variant="primary">Svelte 5</Badge>
					<Badge variant="info">Tailwind 4</Badge>
					<Badge variant="success" icon="shield-check">Accessible</Badge>
				{/snippet}
			</PageHeader>

			<section aria-labelledby="group-layout" class="pt-10">
				<h2 id="group-layout" class="text-2xl font-bold tracking-tight sm:text-3xl">Global Layout &amp; Navigation</h2>
				<LayoutDemos />
			</section>

			<section aria-labelledby="group-data" class="pt-16">
				<h2 id="group-data" class="text-2xl font-bold tracking-tight sm:text-3xl">Data Display &amp; Information</h2>
				<DataDisplayDemos />
			</section>
		</PageContainer>
	</div>
</div>
