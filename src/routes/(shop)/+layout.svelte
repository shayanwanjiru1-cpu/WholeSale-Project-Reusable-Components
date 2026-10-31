<script lang="ts">
	import { page } from '$app/state';
	import { Button, CartDrawer, Container, Dropdown, Footer, Icon, Logo, Navbar, QuickSearch, Sidebar, SkipLink, ThemeToggle } from '$lib';
	import { headerNav, mobileNav, sidebarNav } from '$lib/data/navigation';
	import { footerColumns, legalLinks, site } from '$lib/data/site';
	import { products } from '$lib/data/products';
	import { brandImages } from '$lib/data/assets';
	import { account } from '$lib/data/account';
	import { ORDER_POLICY, formatPrice } from '$lib/catalog/pricing';
	import { jsonLdScript, organizationJsonLd } from '$lib/catalog/seo';
	import { cart } from '$lib/stores/cart.svelte';
	import { quote } from '$lib/stores/quote.svelte';

	let { children } = $props();

	let mobileOpen = $state(false);
	let railCollapsed = $state(true);
	const activeHref = $derived(page.url.pathname);

	const accountItems = [
		{ type: 'label' as const, label: account.company },
		{ label: 'Account overview', icon: 'user' as const, href: '/account' },
		{ label: 'Order history', icon: 'clipboard' as const, href: '/account/orders' },
		{ label: 'Quick reorder', icon: 'repeat' as const, href: '/account/orders#reorder' },
		{ label: 'Quote requests', icon: 'file-text' as const, href: '/quote' },
		{ label: 'Bulk order upload', icon: 'upload' as const, href: '/bulk-order' },
		{ type: 'divider' as const },
		{ label: 'Sign out (demo)', icon: 'log-out' as const, disabled: true }
	];
</script>

<svelte:head>
	{@html jsonLdScript(organizationJsonLd())}
</svelte:head>

<SkipLink />

<!--
  Shell layout. --header-h is the sticky header's height at each breakpoint; sticky
  toolbars and the sidebar rail offset themselves by it.
  below lg: main row (64) + search row (56) · lg: main row + nav row (64 + 44)
-->
<div class="flex min-h-dvh flex-col [--header-h:7.5rem] lg:[--header-h:6.75rem]">
	<!-- Utility strip: key wholesale terms (scrolls away) -->
	<div class="theme-dark border-b border-border bg-surface text-xs text-muted-foreground">
		<Container size="wide" class="flex h-9 items-center justify-between gap-4">
			<p class="flex min-w-0 items-center gap-4 overflow-hidden whitespace-nowrap">
				<span class="inline-flex items-center gap-1.5"><Icon name="wallet" class="size-3.5 text-primary-text" />Min. order {formatPrice(ORDER_POLICY.minimumOrderValue)}</span>
				<span class="hidden items-center gap-1.5 sm:inline-flex"><Icon name="truck" class="size-3.5 text-primary-text" />Free delivery over {formatPrice(ORDER_POLICY.freeDeliveryThreshold)}</span>
				<span class="hidden items-center gap-1.5 lg:inline-flex"><Icon name="calendar" class="size-3.5 text-primary-text" />Net-30 / Net-60 for approved accounts</span>
			</p>
			<p class="hidden shrink-0 items-center gap-4 md:flex">
				<a href="tel:{site.phone.replace(/\s/g, '')}" class="focus-ring inline-flex items-center gap-1.5 rounded hover:text-foreground"><Icon name="phone" class="size-3.5" />{site.phone}</a>
				<span>{site.hours}</span>
			</p>
		</Container>
	</div>

	<Navbar
		items={headerNav}
		mobileItems={mobileNav}
		{activeHref}
		variant="dark"
		layout="stacked"
		sticky
		containerSize="wide"
		bind:mobileOpen
	>
		{#snippet brand()}
			<Logo name={site.shortName} tagline={site.tagline} markSrc={brandImages.markInverse} accentLastWord href="/" tone="inverse" size="sm" class="max-[379px]:[&_[data-logo-tagline]]:hidden max-[379px]:[&_.text-base]:text-sm" />
		{/snippet}
		{#snippet search()}
			<QuickSearch {products} />
		{/snippet}
		{#snippet actions()}
			<div class="hidden lg:block">
				<Dropdown items={accountItems} trigger="click-or-hover" align="right" triggerVariant="ghost" triggerIcon="user" label="Account" />
			</div>
			<div class="hidden sm:block">
				<Button href="/quote" variant="ghost" size="icon" aria-label="Quote request, {quote.count} items" class="relative">
					<Icon name="file-text" class="size-5" />
					{#if quote.count}<span class="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-secondary px-1 text-[10px] font-bold text-secondary-foreground" aria-hidden="true">{quote.count}</span>{/if}
				</Button>
			</div>
			<ThemeToggle />
			<Button variant="primary" class="relative gap-2 px-3" onclick={() => (cart.drawerOpen = true)} aria-haspopup="dialog" aria-label="Cart, {cart.count} {cart.count === 1 ? 'product' : 'products'}">
				<Icon name="cart" class="size-5" />
				<span class="hidden font-semibold sm:inline" aria-hidden="true">Cart</span>
				<span class="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-xs font-bold text-ink tabular-nums" aria-hidden="true">{cart.count}</span>
			</Button>
		{/snippet}
		{#snippet navExtra()}
			<a href="/account/orders#reorder" class="focus-ring inline-flex items-center gap-1.5 rounded hover:text-foreground"><Icon name="repeat" class="size-4" />Quick reorder</a>
			<span class="inline-flex items-center gap-1.5"><Icon name="building" class="size-4" />{account.company}</span>
		{/snippet}
		{#snippet mobileActions()}
			<Button href="/account" variant="outline" iconLeft="user">Account</Button>
			<Button href="/quote" variant="secondary" iconLeft="file-text">Quote ({quote.count})</Button>
		{/snippet}
	</Navbar>

	<div class="flex flex-1">
		<!-- Category rail: collapsed icon rail, expands on hover / focus / hamburger click (lg+). -->
		<Sidebar
			items={sidebarNav}
			{activeHref}
			bind:collapsed={railCollapsed}
			expandOnHover
			expandOnClick
			mobileDrawer={false}
			variant="dark"
			label="Shop departments"
			class="sticky top-[var(--header-h)] h-[calc(100dvh-var(--header-h))]"
		>
			{#snippet header()}<span class="text-sm font-semibold text-foreground">Departments</span>{/snippet}
			{#snippet footer(narrow)}
				{#if narrow}
					<a href="/info/contact" class="focus-ring mx-auto grid size-10 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" title="Order support"><Icon name="headphones" class="size-5" /><span class="sr-only">Order support</span></a>
				{:else}
					<div class="flex flex-col gap-0.5 px-1 text-xs whitespace-normal text-muted-foreground">
						<span class="font-semibold text-foreground">Order support</span>
						<a href="tel:{site.phone.replace(/\s/g, '')}" class="focus-ring rounded hover:text-foreground">{site.phone}</a>
						<span>{site.hours}</span>
					</div>
				{/if}
			{/snippet}
		</Sidebar>

		<div class="flex min-w-0 flex-1 flex-col">
			<main id="main-content" tabindex="-1" class="flex-1 outline-none">
				{@render children()}
			</main>

			<Footer variant="dark" description={site.description} columns={footerColumns} legal={legalLinks} contact={{ email: site.email, phone: site.phone, address: site.address }} copyright="© {new Date().getFullYear()} {site.name}. {site.demoNotice}">
				{#snippet brand()}
					<a href="/" class="focus-ring inline-block rounded-md"><img src={brandImages.fullInverse} alt="{site.name} — home" width="900" height="370" class="h-auto w-52" loading="lazy" /></a>
				{/snippet}
				{#snippet extra()}
					<p class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
						<span>We accept:</span>
						{#each ['M-Pesa', 'Bank transfer', 'Card', 'Net-30 / Net-60'] as m (m)}<span class="rounded border border-border px-2 py-0.5">{m}</span>{/each}
					</p>
				{/snippet}
			</Footer>
		</div>
	</div>
</div>

<CartDrawer />
