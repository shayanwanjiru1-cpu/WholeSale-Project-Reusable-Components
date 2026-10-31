<script lang="ts">
	import {
		Breadcrumbs,
		Button,
		Badge,
		Chip,
		Container,
		Dropdown,
		Footer,
		Icon,
		Logo,
		MegaMenu,
		MobileMenuButton,
		MobileNavigation,
		Navbar,
		NavigationMenu,
		PageHeader,
		Section,
		Sheet,
		Sidebar,
		Tabs,
		Tooltip
	} from '$lib';
	import {
		demoBreadcrumbs,
		demoDropdownItems,
		demoFooterColumns,
		demoNav,
		demoSocial,
		demoTabs
	} from '$lib/data/showcase-fixtures';
	import { placeholderImage } from '$lib/data/placeholder';
	const demoImageSrc = placeholderImage('Product image', 210);
	import Demo from './Demo.svelte';
	import Variant from './Variant.svelte';

	let loading = $state(false);
	function fakeLoad() {
		loading = true;
		setTimeout(() => (loading = false), 1500);
	}

	let drawerLeft = $state(false);
	let drawerRight = $state(false);

	let sidebarCollapsed = $state(true);
	let sidebarHover = $state(true);
	let sidebarClick = $state(true);
	let sidebarMobile = $state(false);

	let sheetOpen = $state(false);
	let sheetSide = $state<'right' | 'left' | 'bottom' | 'top'>('right');
	let sheetSize = $state<'sm' | 'md' | 'lg' | 'full'>('md');
	let sheetBackdrop = $state(true);
	let quickViewOpen = $state(false);
	let bottomOpen = $state(false);
	let sheetCategories = $state(['Category A']);
	const toggleSheetCategory = (c: string) =>
		(sheetCategories = sheetCategories.includes(c) ? sheetCategories.filter((x) => x !== c) : [...sheetCategories, c]);

	let lastAction = $state('—');
	let tab = $state('overview');
</script>

{#snippet brand()}<Logo name="Brand" tagline="Placeholder logo" href="#" size="sm" />{/snippet}

{#snippet navActions()}
	<Tooltip text="Search">
		{#snippet children(props)}
			<Button variant="ghost" size="icon" aria-label="Search" {...props}><Icon name="search" /></Button>
		{/snippet}
	</Tooltip>
	<Dropdown
		iconOnly
		triggerIcon="user"
		triggerVariant="ghost"
		label="Account"
		align="right"
		items={[{ label: 'Profile', icon: 'user' }, { label: 'Orders', icon: 'package' }, { type: 'divider' }, { label: 'Sign out', icon: 'log-out' }]}
	/>
	<Button size="sm" class="hidden sm:inline-flex">Get a quote</Button>
{/snippet}

{#snippet panel(t: { id: string; label: string })}
	<p class="text-sm text-muted-foreground">Panel content for <strong class="text-foreground">{t.label}</strong>.</p>
{/snippet}

{#snippet drawerActions()}
	<Button fullWidth>Get a quote</Button>
{/snippet}

<!-- BUTTON -->
<Demo id="button" title="Button" description="One component for every action. Variants, sizes and states are props; renders an <a> when given href." a11y="Native <button>/<a> semantics, visible focus ring, aria-busy while loading, icon-only buttons require aria-label.">
	<Variant label="Variants">
		<div class="flex flex-wrap gap-3">
			<Button>Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Destructive</Button>
			<Button variant="link">Link</Button>
		</div>
	</Variant>
	<Variant label="Sizes & icons">
		<div class="flex flex-wrap items-center gap-3">
			<Button size="sm">Small</Button>
			<Button size="md" iconLeft="plus">Medium</Button>
			<Button size="lg" iconRight="arrow-right">Large</Button>
			<Button size="icon" variant="outline" aria-label="Add to favourites"><Icon name="heart" /></Button>
			<Button href="#button" variant="secondary" iconLeft="link">As link</Button>
		</div>
	</Variant>
	<Variant label="States">
		<div class="flex flex-wrap items-center gap-3">
			<Button {loading} onclick={fakeLoad}>{loading ? 'Saving' : 'Click to load'}</Button>
			<Button loading>Loading</Button>
			<Button disabled>Disabled</Button>
			<Button variant="outline" disabled>Disabled outline</Button>
			<Button fullWidth variant="secondary" class="sm:w-auto">Full width on mobile</Button>
		</div>
	</Variant>
</Demo>

<!-- NAVBAR -->
<Demo id="navbar" title="Navbar / Header" description="Data-driven site header. Desktop renders NavigationMenu (dropdowns + mega menu); below lg it collapses to a hamburger that opens MobileNavigation." a11y="<header> + <nav aria-label>, aria-current on the active link, disclosure buttons with aria-expanded; the drawer is a modal dialog.">
	<Variant label="Default (resize below 1024px to see the mobile menu)" frame="none">
		<div class="rounded-card border border-border">
			<Navbar items={demoNav} activeHref="#" brand={brand} actions={navActions} mobileActions={drawerActions} />
			<div class="h-40 bg-background p-6 text-sm text-muted-foreground">Page content… Hover or click “Catalogue” for the mega menu, “Services” for a dropdown.</div>
		</div>
	</Variant>
	<div class="grid gap-6 lg:grid-cols-2">
		<Variant label="Compact" frame="none">
			<div class="rounded-card border border-border">
				<Navbar items={demoNav.slice(0, 3)} compact brand={brand} />
			</div>
		</Variant>
		<Variant label="Dark" frame="none">
			<div class="overflow-visible rounded-card">
				<Navbar items={demoNav.slice(0, 3)} variant="dark" brand={brand} />
			</div>
		</Variant>
	</div>
	<Variant label="Transparent (over a hero)" frame="none">
		<div class="rounded-card bg-gradient-to-br from-accent to-muted">
			<Navbar items={demoNav.slice(0, 4)} variant="transparent" brand={brand} />
			<div class="px-6 pt-6 pb-12 text-sm text-muted-foreground">The <code>sticky</code> prop pins the header to the top of the viewport while scrolling.</div>
		</div>
	</Variant>
</Demo>

<!-- LOGO -->
<Demo id="logo" title="Logo" description="Brand lockup without a baked-in brand. Pass markSrc/mark for a real logo; otherwise a monogram is generated from the name.">
	<Variant label="Variants & sizes">
		<div class="flex flex-wrap items-center gap-8">
			<Logo name="Brand Name" tagline="Combined" />
			<Logo name="Brand Name" variant="wordmark" />
			<Logo name="Brand Name" variant="mark" />
			<Logo name="Brand Name" size="sm" />
			<Logo name="Brand Name" size="lg" href="#logo" />
		</div>
	</Variant>
	<Variant label="Inverse (dark backgrounds)" frame="none">
		<div class="flex flex-wrap items-center gap-8 rounded-card bg-slate-900 p-6">
			<Logo name="Brand Name" tone="inverse" tagline="On dark" />
			<Logo name="Brand Name" tone="inverse" variant="mark" />
		</div>
	</Variant>
</Demo>

<!-- NAVIGATION MENU -->
<Demo id="navigation-menu" title="Navigation menu" description="Renders any NavItem[] tree. Horizontal mode uses the disclosure pattern for dropdowns and mega menus; vertical mode renders a nested expandable list." a11y="Enter/Space toggles, ArrowDown moves into a panel, Up/Down move between links, Escape closes and returns focus, Tab away closes.">
	<div class="grid gap-6 xl:grid-cols-3">
		<Variant label='trigger="click"' class="relative">
			<NavigationMenu items={demoNav.slice(2, 4)} trigger="click" label="Click demo" />
		</Variant>
		<Variant label='trigger="hover"' class="relative">
			<NavigationMenu items={demoNav.slice(2, 4)} trigger="hover" label="Hover demo" />
		</Variant>
		<Variant label='trigger="click-or-hover" (default)' class="relative">
			<NavigationMenu items={demoNav.slice(2, 4)} label="Click or hover demo" />
		</Variant>
	</div>
	<Variant label="Vertical orientation" class="max-w-sm">
		<NavigationMenu items={demoNav} orientation="vertical" activeHref="#a" label="Vertical demo" />
	</Variant>
</Demo>

<!-- MEGA MENU -->
<Demo id="mega-menu" title="Mega menu" description="Grouped link columns with optional featured card. NavigationMenu shows it for items with a `mega` field; it can also be rendered standalone.">
	<Variant label="Standalone panel" frame="canvas">
		{#if demoNav[1].mega}<MegaMenu content={demoNav[1].mega} />{/if}
	</Variant>
</Demo>

<!-- MOBILE NAVIGATION -->
<Demo id="mobile-navigation" title="Mobile navigation & menu button" description="MobileMenuButton is a reusable animated hamburger. MobileNavigation is a drawer built on the native modal <dialog>." a11y="Focus moves into the drawer and is contained; Escape, the close button or the backdrop close it; focus returns to the trigger; page scroll is locked; nested groups are disclosure buttons.">
	<Variant label="Drawer from either side">
		<div class="flex flex-wrap items-center gap-6">
			<div class="flex items-center gap-2">
				<MobileMenuButton bind:open={drawerLeft} controls="demo-drawer-left" label="Open left menu" />
				<span class="text-sm text-muted-foreground">Left drawer</span>
			</div>
			<div class="flex items-center gap-2">
				<MobileMenuButton bind:open={drawerRight} controls="demo-drawer-right" label="Open right menu" />
				<span class="text-sm text-muted-foreground">Right drawer</span>
			</div>
		</div>
		<MobileNavigation id="demo-drawer-left" bind:open={drawerLeft} items={demoNav} activeHref="#delivery" header={brand} footer={drawerActions} />
		<MobileNavigation id="demo-drawer-right" bind:open={drawerRight} items={demoNav} side="right" header={brand} />
	</Variant>
</Demo>

<!-- SHEET -->
<Demo id="sheet" title="Sheet" description="A panel that slides in from any edge for focused tasks: filters, an order summary, a quick view, or the mobile menu (MobileNavigation is built on it). Four sides, four sizes, optional footer actions." a11y="Native modal <dialog>: focus is contained and the page behind is inert; labelled by its title and described by its description; Escape, the close button or the backdrop close it; focus returns to the opener; page scroll is locked; no slide animation under reduced motion.">
	<Variant label="Playground">
		<div class="flex flex-col gap-4">
			<div class="flex flex-wrap items-center gap-x-6 gap-y-3">
				<div class="flex flex-wrap items-center gap-2" role="group" aria-label="Side">
					<span class="text-sm text-muted-foreground">Side</span>
					{#each ['right', 'left', 'bottom', 'top'] as const as s (s)}
						<Button size="sm" variant={sheetSide === s ? 'primary' : 'outline'} aria-pressed={sheetSide === s} onclick={() => (sheetSide = s)}>{s}</Button>
					{/each}
				</div>
				<div class="flex flex-wrap items-center gap-2" role="group" aria-label="Size">
					<span class="text-sm text-muted-foreground">Size</span>
					{#each ['sm', 'md', 'lg', 'full'] as const as z (z)}
						<Button size="sm" variant={sheetSize === z ? 'primary' : 'outline'} aria-pressed={sheetSize === z} onclick={() => (sheetSize = z)}>{z}</Button>
					{/each}
				</div>
				<label class="flex items-center gap-2 text-sm"><input type="checkbox" class="size-4 accent-primary" bind:checked={sheetBackdrop} /> Close when clicking outside</label>
			</div>
			<div><Button iconLeft="filter" aria-haspopup="dialog" onclick={() => (sheetOpen = true)}>Open filters sheet</Button></div>
		</div>
		<Sheet bind:open={sheetOpen} side={sheetSide} size={sheetSize} closeOnBackdrop={sheetBackdrop} title="Filters" description="Narrow down the list">
			<div class="flex flex-col gap-6 text-sm">
				<fieldset class="flex flex-col gap-3">
					<legend class="mb-3 font-semibold">Category</legend>
					<div class="flex flex-wrap gap-2">
						{#each ['Category A', 'Category B', 'Category C'] as c (c)}
							<Chip selectable bind:selected={() => sheetCategories.includes(c), () => toggleSheetCategory(c)}>{c}</Chip>
						{/each}
					</div>
				</fieldset>
				<fieldset class="flex flex-col gap-2">
					<legend class="mb-2 font-semibold">Availability</legend>
					<label class="flex items-center gap-2"><input type="checkbox" class="size-4 accent-primary" checked /> In stock</label>
					<label class="flex items-center gap-2"><input type="checkbox" class="size-4 accent-primary" checked /> Low stock</label>
					<label class="flex items-center gap-2"><input type="checkbox" class="size-4 accent-primary" /> Pre-order</label>
				</fieldset>
			</div>
			{#snippet footer(close)}
				<Button variant="outline" onclick={() => (sheetCategories = [])}>Clear all</Button>
				<Button onclick={close}>Show results</Button>
			{/snippet}
		</Sheet>
	</Variant>
	<Variant label="Common uses">
		<div class="flex flex-wrap gap-3">
			<Button variant="outline" iconLeft="eye" aria-haspopup="dialog" onclick={() => (quickViewOpen = true)}>Quick view (right, lg)</Button>
			<Button variant="outline" iconLeft="cart" aria-haspopup="dialog" onclick={() => (bottomOpen = true)}>Order summary (bottom)</Button>
		</div>
		<Sheet bind:open={quickViewOpen} size="lg" title="Sample product" description="Category · SKU-0001">
			<div class="flex flex-col gap-4">
				<img src={demoImageSrc} alt="Placeholder product" class="aspect-[4/3] w-full rounded-card object-cover" />
				<p class="text-2xl font-bold tabular-nums">$128.50 <span class="text-sm font-normal text-muted-foreground">/ case</span></p>
				<p class="text-sm text-muted-foreground">Short product description shown in the quick view.</p>
			</div>
			{#snippet footer(close)}
				<Button variant="outline" onclick={close}>Full details</Button>
				<Button iconLeft="cart" onclick={close}>Add to order</Button>
			{/snippet}
		</Sheet>
		<Sheet bind:open={bottomOpen} side="bottom" title="Order summary" description="3 items">
			<dl class="flex flex-col gap-2 text-sm">
				<div class="flex justify-between"><dt class="text-muted-foreground">Subtotal</dt><dd class="tabular-nums">$7,520.00</dd></div>
				<div class="flex justify-between"><dt class="text-muted-foreground">Volume discount</dt><dd class="tabular-nums">−$376.00</dd></div>
				<div class="flex justify-between border-t border-border pt-2 font-semibold"><dt>Total</dt><dd class="tabular-nums">$7,189.00</dd></div>
			</dl>
			{#snippet footer(close)}<Button size="lg" onclick={close}>Checkout</Button>{/snippet}
		</Sheet>
	</Variant>
</Demo>

<!-- SIDEBAR -->
<Demo id="sidebar" title="Sidebar" description="One sidebar with expanded, collapsed (icon rail), hover-to-expand and click-to-expand behaviour. Hover-expansion overlays content instead of shifting layout. Below lg the same items render as a tap-driven drawer. This page's own navigation is a Sidebar too." a11y="Focusing into the collapsed rail expands it so labels are visible; Escape collapses a hover-expanded rail; collapsed labels remain available to screen readers; never hover-only.">
	<Variant label="Controls">
		<div class="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
			<Button variant="outline" size="sm" onclick={() => (sidebarCollapsed = !sidebarCollapsed)}>{sidebarCollapsed ? 'Expand' : 'Collapse'}</Button>
			<label class="flex items-center gap-2"><input type="checkbox" class="size-4 accent-primary" bind:checked={sidebarHover} /> expandOnHover</label>
			<label class="flex items-center gap-2"><input type="checkbox" class="size-4 accent-primary" bind:checked={sidebarClick} /> expandOnClick (hamburger toggle)</label>
			<Button variant="secondary" size="sm" class="lg:hidden" onclick={() => (sidebarMobile = true)}>Open mobile drawer</Button>
		</div>
	</Variant>
	<Variant label="Desktop rail (lg and up) — hover it, or click the hamburger" frame="none">
		<div class="relative hidden h-[30rem] overflow-hidden rounded-card border border-border bg-background lg:flex">
			<Sidebar
				items={[
					{ label: 'Dashboard', href: '#sidebar', icon: 'home' },
					{ label: 'Catalogue', icon: 'package', children: [{ label: 'All items', href: '#s1' }, { label: 'Categories', href: '#s2' }] },
					{ label: 'Orders', href: '#s3', icon: 'cart', badge: 4 },
					{ label: 'Shipments', href: '#s4', icon: 'truck' },
					{ label: 'Reports', href: '#s5', icon: 'bar-chart' }
				]}
				activeHref="#sidebar"
				bind:collapsed={sidebarCollapsed}
				expandOnHover={sidebarHover}
				expandOnClick={sidebarClick}
				bind:mobileOpen={sidebarMobile}
				label="Demo sidebar"
				class="h-full"
			>
				{#snippet header()}<Logo name="Brand" size="sm" />{/snippet}
				{#snippet footer(narrow)}
					<Button variant="ghost" size={narrow ? 'icon' : 'md'} fullWidth={!narrow} iconLeft={narrow ? undefined : 'log-out'} aria-label={narrow ? 'Sign out' : undefined}>
						{#if narrow}<Icon name="log-out" />{:else}Sign out{/if}
					</Button>
				{/snippet}
			</Sidebar>
			<div class="flex-1 p-6 text-sm text-muted-foreground">Main content area. The layout keeps its width while the rail expands over it.</div>
		</div>
		<p class="text-sm text-muted-foreground lg:hidden">On small screens the sidebar is a drawer — use “Open mobile drawer” above.</p>
	</Variant>
</Demo>

<!-- DROPDOWN -->
<Demo id="dropdown" title="Dropdown" description="One dropdown with configurable trigger mode (click, hover, click-or-hover), alignment, placement, disabled items, dividers, labels and custom content." a11y="role=menu with roving focus: Arrow keys, Home/End and type-ahead move between items; Enter/Space or ArrowDown on the trigger opens it from the keyboard in every mode; Escape closes and restores focus; outside click closes.">
	<Variant label="Trigger modes">
		<div class="flex flex-wrap gap-3">
			<Dropdown label='trigger="click"' items={demoDropdownItems} onselect={(i) => (lastAction = 'label' in i ? i.label : '')} />
			<Dropdown label='trigger="hover"' trigger="hover" items={demoDropdownItems} onselect={(i) => (lastAction = 'label' in i ? i.label : '')} />
			<Dropdown label='trigger="click-or-hover"' trigger="click-or-hover" items={demoDropdownItems} onselect={(i) => (lastAction = 'label' in i ? i.label : '')} />
		</div>
		<p class="mt-3 text-sm text-muted-foreground" aria-live="polite">Last selected: <strong class="text-foreground">{lastAction}</strong></p>
	</Variant>
	<Variant label="Alignment, placement & states">
		<div class="flex flex-wrap items-center gap-3">
			<Dropdown label="Align center" align="center" items={demoDropdownItems} triggerVariant="secondary" />
			<Dropdown label="Align right" align="right" items={demoDropdownItems} triggerVariant="secondary" />
			<Dropdown label="Opens upward" placement="top" items={demoDropdownItems} triggerVariant="secondary" />
			<Dropdown label="More options" iconOnly triggerIcon="more-horizontal" triggerVariant="ghost" items={demoDropdownItems} />
			<Dropdown label="Disabled" disabled items={demoDropdownItems} />
		</div>
	</Variant>
	<Variant label="Custom trigger & custom panel content">
		<div class="flex flex-wrap items-center gap-3">
			<Dropdown items={demoDropdownItems} trigger="click-or-hover">
				{#snippet triggerContent(props)}
					<button {...props} class="focus-ring inline-flex items-center gap-2 rounded-full border border-border-strong py-1 pr-3 pl-1 text-sm hover:bg-muted">
						<span class="grid size-7 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">AM</span>
						Custom trigger
						<Icon name="chevron-down" class="size-4" />
					</button>
				{/snippet}
			</Dropdown>
			<Dropdown label="Filter panel" triggerIcon="filter" menuClass="w-72 p-4">
				{#snippet children(close)}
					<fieldset class="flex flex-col gap-2 text-sm">
						<legend class="mb-2 font-semibold">Show items</legend>
						<label class="flex items-center gap-2"><input type="checkbox" class="size-4 accent-primary" checked /> In stock</label>
						<label class="flex items-center gap-2"><input type="checkbox" class="size-4 accent-primary" /> Low stock</label>
						<label class="flex items-center gap-2"><input type="checkbox" class="size-4 accent-primary" /> Out of stock</label>
					</fieldset>
					<Button size="sm" class="mt-4" fullWidth onclick={close}>Apply</Button>
				{/snippet}
			</Dropdown>
		</div>
	</Variant>
</Demo>

<!-- TABS -->
<Demo id="tabs" title="Tabs" description="Accessible tabs with default, underline, pills and boxed variants. The tab list scrolls horizontally when it overflows on small screens." a11y="tablist/tab/tabpanel roles, roving tabindex, Arrow keys / Home / End; automatic or manual activation; disabled tabs are skipped.">
	<div class="grid gap-6 lg:grid-cols-2">
		<Variant label="Default"><Tabs tabs={demoTabs} bind:value={tab} label="Default tabs" {panel} /></Variant>
		<Variant label="Underline"><Tabs tabs={demoTabs} variant="underline" label="Underline tabs" {panel} /></Variant>
		<Variant label="Pills"><Tabs tabs={demoTabs} variant="pills" label="Pill tabs" {panel} /></Variant>
		<Variant label="Boxed, full width, manual activation"><Tabs tabs={demoTabs.slice(0, 3)} variant="boxed" fullWidth activation="manual" label="Boxed tabs" {panel} /></Variant>
	</div>
</Demo>

<!-- BREADCRUMBS -->
<Demo id="breadcrumbs" title="Breadcrumbs" description="Data-driven trail. Long trails collapse behind an expandable “…”; on small screens only the last two levels show." a11y='<nav aria-label="Breadcrumb"> with an ordered list; the current page has aria-current="page".'>
	<Variant label="Chevron separator">
		<Breadcrumbs items={demoBreadcrumbs} maxVisible={10} />
	</Variant>
	<Variant label="Slash separator, collapsed (maxVisible = 3)">
		<Breadcrumbs items={demoBreadcrumbs} separator="slash" maxVisible={3} />
	</Variant>
</Demo>

<!-- PAGE HEADER -->
<Demo id="page-header" title="Page header" description="Breadcrumbs, eyebrow, title, description, meta and page-level actions in compact/default/large sizes, left or centred." a11y="Heading level is configurable (defaults to h1) so the document outline stays correct.">
	<Variant label="Default with breadcrumbs, meta and actions">
		<PageHeader
			eyebrow="Eyebrow"
			title="Page title"
			description="A short description of what this page contains."
			breadcrumbs={demoBreadcrumbs.slice(0, 3).concat({ label: 'Page title' })}
			headingLevel={4}
		>
			{#snippet meta()}<Badge variant="success" dot>Active</Badge><span class="text-sm text-muted-foreground">Updated 2 days ago</span>{/snippet}
			{#snippet actions()}
				<Button variant="outline" iconLeft="download">Export</Button>
				<Button iconLeft="plus">New item</Button>
			{/snippet}
		</PageHeader>
	</Variant>
	<div class="grid gap-6 lg:grid-cols-2">
		<Variant label="Compact with icon">
			<PageHeader title="Compact header" description="Dense layouts and sub-pages." icon="package" size="compact" headingLevel={4} />
		</Variant>
		<Variant label="Large, centred">
			<PageHeader title="Large centred" eyebrow="Landing" description="For hero-like page intros." size="large" align="center" headingLevel={4}>
				{#snippet actions()}<Button>Primary action</Button>{/snippet}
			</PageHeader>
		</Variant>
	</div>
</Demo>

<!-- SECTION -->
<Demo id="section" title="Section" description="Core layout primitive: vertical spacing, background, optional heading/actions and built-in Container. The dark background re-themes every nested component through tokens." a11y="Rendered as <section aria-labelledby> when titled.">
	<div class="flex flex-col gap-4 overflow-hidden rounded-card border border-border">
		{#each [['default', 'Default'], ['muted', 'Muted'], ['surface', 'Surface'], ['accent', 'Accent'], ['dark', 'Dark']] as const as [bg, name] (bg)}
			<Section background={bg} spacing="sm" eyebrow="background=&quot;{bg}&quot;" title="{name} section" description="Content inherits the right colours automatically." headingLevel={4} containerSize="full">
				{#snippet actions()}
					<Button variant="outline" size="sm">Secondary</Button>
					<Button size="sm">Primary</Button>
				{/snippet}
			</Section>
		{/each}
	</div>
	<Variant label="Centred heading, spacing variants: none · sm · md · lg · xl">
		<Section spacing="md" align="center" title="Centred section heading" eyebrow="align=&quot;center&quot;" description="Actions move below the heading when centred." headingLevel={4} containerSize="narrow">
			{#snippet actions()}<Button>Call to action</Button>{/snippet}
		</Section>
	</Variant>
</Demo>

<!-- CONTAINERS -->
<Demo id="containers" title="Container & Page container" description="Container is the generic width/gutter primitive (narrow · default · wide · full, optional fluid). PageContainer builds on it to render the page's <main id=&quot;main-content&quot;> landmark with vertical rhythm — kept separate because it carries landmark semantics; use it once per page.">
	<Variant label="Container sizes" frame="canvas" class="overflow-hidden px-0 sm:px-0">
		<div class="flex flex-col gap-2">
			{#each ['narrow', 'default', 'wide', 'full'] as const as size (size)}
				<Container {size}>
					<div class="rounded-md bg-accent px-3 py-2 text-xs font-medium text-accent-foreground">size="{size}"</div>
				</Container>
			{/each}
		</div>
	</Variant>
</Demo>

<!-- SKIP LINK -->
<Demo id="skip-link" title="Skip link" description="Hidden until focused. Press Tab from the very top of this page (or reload and press Tab) to see it appear in the top-left corner; activating it moves focus to the main content." a11y="Targets the PageContainer's <main id=&quot;main-content&quot; tabindex=&quot;-1&quot;> so focus actually moves.">
	<Variant label="Usage">
		<code class="text-sm">&lt;SkipLink /&gt; … &lt;PageContainer&gt;…&lt;/PageContainer&gt;</code>
	</Variant>
</Demo>

<!-- FOOTER -->
<Demo id="footer" title="Footer" description="Brand, description, contact details, link columns, legal links and social links — all configurable through props. Columns stack responsively.">
	<Variant label="Default" frame="none">
		<div class="overflow-hidden rounded-card border border-border">
			<Footer
				brand={brand}
				description="A short description of the business for the footer."
				columns={demoFooterColumns}
				contact={{ email: 'hello@example.com', phone: '+1 (555) 010-0000', address: '123 Example Street, City' }}
				social={demoSocial}
				legal={[{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }]}
				copyright="© 2026 Brand Name. All rights reserved."
			/>
		</div>
	</Variant>
	<Variant label="Dark, minimal" frame="none">
		<div class="overflow-hidden rounded-card">
			<Footer variant="dark" copyright="© 2026 Brand Name" legal={[{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }]} social={demoSocial} />
		</div>
	</Variant>
</Demo>
