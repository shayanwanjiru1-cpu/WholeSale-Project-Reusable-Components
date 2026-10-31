<script lang="ts">
	import {
		Accordion,
		ActivityFeed,
		AudioPlayer,
		Avatar,
		AvatarGroup,
		Badge,
		Button,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		Chip,
		CodeBlock,
		Collapsible,
		CopyableText,
		DataTable,
		DefinitionList,
		DescriptionList,
		Dropdown,
		EmptyState,
		ErrorState,
		FeatureCard,
		FileAttachment,
		Icon,
		ImageGallery,
		KeyValue,
		KPICard,
		Lightbox,
		List,
		ListItem,
		NoResults,
		NotificationCard,
		Popover,
		PricingCard,
		ProductCard,
		ProfileCard,
		ProgressBar,
		ProgressRing,
		RatingDisplay,
		RowActionMenu,
		Skeleton,
		Spinner,
		StatisticCard,
		StatusBadge,
		Stepper,
		SuccessState,
		SummaryCard,
		TableToolbar,
		TestimonialCard,
		Timeline,
		Tooltip,
		VideoPlayer,
		formatCurrency,
		searchRows,
		type TableColumn,
		type Tone
	} from '$lib';
	import {
		demoActivity,
		demoImages,
		demoPeople,
		demoProducts,
		demoSteps,
		demoTableRows,
		demoTimeline,
		type DemoRow
	} from '$lib/data/showcase-fixtures';
	import Demo from './Demo.svelte';
	import Variant from './Variant.svelte';

	/* ---------- Data table demo state ---------- */
	const statusTone: Record<DemoRow['status'], Tone> = { 'In stock': 'success', 'Low stock': 'warning', 'Out of stock': 'error' };

	const columns: TableColumn<DemoRow>[] = [
		{ key: 'name', header: 'Item', sortable: true, primary: true },
		{ key: 'id', header: 'Code', sortable: true, hideBelow: 'sm', class: 'font-mono text-xs' },
		{ key: 'category', header: 'Category', sortable: true, hideBelow: 'md' },
		{ key: 'quantity', header: 'Qty', sortable: true, align: 'right' },
		{ key: 'price', header: 'Price', sortable: true, align: 'right', format: (v) => formatCurrency(v as number) },
		{ key: 'status', header: 'Status', sortable: true, cell: statusCell }
	];

	let search = $state('');
	let categoryFilters = $state<string[]>([]);
	let selected = $state<(string | number)[]>([]);
	const filteredRows = $derived(
		searchRows(demoTableRows, columns, search).filter((r) => categoryFilters.length === 0 || categoryFilters.includes(r.category))
	);
	function toggleCategory(c: string) {
		categoryFilters = categoryFilters.includes(c) ? categoryFilters.filter((x) => x !== c) : [...categoryFilters, c];
	}

	let tableState = $state<'data' | 'loading' | 'empty'>('data');

	/* ---------- Misc demo state ---------- */
	let notifications = $state([
		{ id: 1, tone: 'info' as Tone, title: 'New price list available', message: 'Prices update on the first of next month.', time: '2m' },
		{ id: 2, tone: 'success' as Tone, title: 'Order confirmed', message: 'Your order has been confirmed and is being prepared.', time: '1h' },
		{ id: 3, tone: 'warning' as Tone, title: 'Payment due soon', message: 'Invoice is due in 3 days.', time: '1d' },
		{ id: 4, tone: 'error' as Tone, title: 'Delivery failed', message: 'The courier could not reach the delivery address.', time: '2d' }
	]);
	let retrying = $state(false);
	let progress = $state(64);
	let chipSelected = $state(true);
	let chips = $state(['Alpha', 'Beta', 'Gamma']);
	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);
	let accordionValue = $state<string[]>(['a1']);

	const faq = [
		{ id: 'a1', title: 'What is the minimum order?', content: 'Minimums are set per item and shown on each product card.' },
		{ id: 'a2', title: 'Do you offer volume pricing?', content: 'Yes — tiered pricing applies automatically at checkout.' },
		{ id: 'a3', title: 'How long does delivery take?', content: 'Typically 2–5 business days depending on region.' },
		{ id: 'a4', title: 'Disabled item', content: 'Not reachable.', disabled: true }
	];

	const codeSample = `<script lang="ts">
  import { ProductCard } from '$lib';
  let { product } = $props();
<\/script>

<ProductCard
  {product}
  variant="horizontal"
  primaryAction={{ label: 'Add to order', icon: 'cart' }}
  showFavorite
/>`;
</script>

{#snippet statusCell(row: DemoRow)}
	<StatusBadge status={statusTone[row.status]} label={row.status} size="sm" indicator="dot" />
{/snippet}

<!-- CARDS -->
<Demo id="cards" title="Card system" description="Card + CardHeader / CardBody / CardFooter. Variants control the surface; size controls padding (shared with sub-components via context). Specialised cards below are built from these primitives.">
	<Variant label="Variants" frame="canvas">
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each ['default', 'outlined', 'elevated', 'flat'] as const as variant (variant)}
				<Card {variant}>
					<CardHeader title="{variant[0].toUpperCase()}{variant.slice(1)}" description='variant="{variant}"' headingLevel={4} />
					<CardBody><p class="text-muted-foreground">Flexible card content.</p></CardBody>
				</Card>
			{/each}
		</div>
	</Variant>
	<Variant label="Sizes, interactive & clickable" frame="canvas">
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<Card size="compact"><CardHeader title="Compact" headingLevel={4} /><CardBody>size="compact"</CardBody></Card>
			<Card size="spacious"><CardHeader title="Spacious" headingLevel={4} /><CardBody>size="spacious"</CardBody></Card>
			<Card interactive><CardHeader title="Interactive" headingLevel={4} /><CardBody>Lifts on hover / focus-within.</CardBody></Card>
			<Card href="#cards"><CardHeader title="Clickable" headingLevel={4} /><CardBody>The whole card is a single link.</CardBody></Card>
		</div>
	</Variant>
	<Variant label="Composition: header actions, divided footer" frame="canvas">
		<Card class="max-w-md">
			<CardHeader title="Card title" description="Supporting description" icon="package" headingLevel={4} divided>
				{#snippet actions()}<Dropdown iconOnly triggerIcon="more-horizontal" triggerVariant="ghost" triggerSize="icon-sm" label="Card actions" align="right" items={[{ label: 'Edit' }, { label: 'Delete', destructive: true }]} />{/snippet}
			</CardHeader>
			<CardBody><p class="text-muted-foreground">Body content can be anything: text, lists, tables or media.</p></CardBody>
			<CardFooter divided muted align="end">
				<Button variant="ghost" size="sm">Cancel</Button>
				<Button size="sm">Save</Button>
			</CardFooter>
		</Card>
	</Variant>

	<Variant label="Statistic & KPI cards" frame="canvas">
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<StatisticCard label="Revenue" value="$48,210" icon="dollar" trend={{ value: '12.5%', direction: 'up', label: 'vs last month' }} />
			<StatisticCard label="Open orders" value="132" icon="cart" tone="info" trend={{ value: '4', direction: 'down', positive: true, label: 'fewer delays' }} />
			<KPICard label="Monthly target" value="$84k" target="$100k" progress={84} status={{ label: 'On track', tone: 'success' }} trend={{ value: '6%', direction: 'up' }} />
			<KPICard label="Fulfilment rate" value="71%" target="95%" progress={71} status={{ label: 'At risk', tone: 'warning' }} footnote="Updated hourly" />
		</div>
	</Variant>

	<Variant label="Summary, feature & service cards" frame="canvas">
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<SummaryCard
				title="Order summary"
				headingLevel={4}
				items={[{ key: 'Subtotal', value: '$1,280.00' }, { key: 'Volume discount', value: '−$64.00' }, { key: 'Delivery', value: '$45.00' }]}
				total={{ key: 'Total', value: '$1,261.00' }}
			>
				{#snippet actions()}<Button>Checkout</Button>{/snippet}
			</SummaryCard>
			<FeatureCard icon="truck" title="Feature card" description="Icon, title and description with a stretched link." href="#cards" headingLevel={4} />
			<FeatureCard
				icon="shield-check"
				title="Service card"
				description="Same component, with included items and a custom action."
				items={['Dedicated account manager', 'Net-30 payment terms', 'Priority dispatch']}
				headingLevel={4}
			>
				{#snippet action()}<Button variant="outline" fullWidth>Request service</Button>{/snippet}
			</FeatureCard>
			<FeatureCard icon="globe" title="Centred layout" description='layout="centered"' layout="centered" variant="flat" headingLevel={4} />
			<FeatureCard icon="building" title="Horizontal layout" description='layout="horizontal" — icon beside text.' layout="horizontal" variant="outlined" headingLevel={4} class="md:col-span-2" />
		</div>
	</Variant>

	<Variant label="Profile & testimonial cards" frame="canvas">
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<ProfileCard name="Alex Morgan" role="Account manager" location="Remote" bio="Short bio text describing this person." stats={[{ label: 'Clients', value: 48 }, { label: 'Years', value: 6 }, { label: 'Rating', value: '4.9' }]} headingLevel={4}>
				{#snippet actions()}<Button variant="outline" iconLeft="mail">Message</Button><Button iconLeft="phone">Call</Button>{/snippet}
			</ProfileCard>
			<ProfileCard name="Sam Lee" role="Logistics lead" avatar={demoPeople[0].src} bio="Horizontal layout for lists of people." layout="horizontal" headingLevel={4} />
			<TestimonialCard quote="Reliable deliveries and clear pricing. Ordering in bulk has never been simpler." author={{ name: 'Jordan Taylor', role: 'Buyer', company: 'Example Co.' }} rating={5} />
			<TestimonialCard variant="featured" quote="The featured variant gives a quote more visual weight." author={{ name: 'Riley Chen', role: 'Operations' }} class="md:col-span-2 lg:col-span-3" />
		</div>
	</Variant>

	<Variant label="Pricing cards" frame="canvas">
		<div class="grid gap-4 md:grid-cols-3">
			<PricingCard name="Starter" price="$0" period="mo" description="For occasional orders." features={[{ label: 'Standard pricing' }, { label: 'Email support' }, { label: 'Volume discounts', included: false }]} cta={{ label: 'Get started' }} headingLevel={4} />
			<PricingCard name="Business" price="$49" period="mo" description="For regular buyers." badge="Popular" highlighted features={[{ label: 'Tiered pricing' }, { label: 'Priority support' }, { label: 'Volume discounts' }]} cta={{ label: 'Choose Business' }} headingLevel={4} />
			<PricingCard name="Enterprise" price="Custom" description="Contracted terms." features={[{ label: 'Dedicated manager' }, { label: 'Custom invoicing' }, { label: 'API access' }]} cta={{ label: 'Contact sales' }} headingLevel={4} />
		</div>
	</Variant>

	<Variant label="Notification cards (dismissible)" frame="canvas">
		<div class="flex flex-col gap-3">
			{#each notifications as n, i (n.id)}
				<NotificationCard title={n.title} message={n.message} tone={n.tone} time={n.time} unread={i === 0} appearance={i % 2 ? 'soft' : 'card'} ondismiss={() => (notifications = notifications.filter((x) => x.id !== n.id))}>
					{#snippet actions()}{#if i === 0}<Button size="sm" variant="outline">View</Button>{/if}{/snippet}
				</NotificationCard>
			{:else}
				<EmptyState title="All caught up" description="Notifications you dismiss disappear from this list." icon="bell" size="sm" />
			{/each}
		</div>
	</Variant>
</Demo>

<!-- PRODUCT CARD -->
<Demo id="product-card" title="Product card" description="One ProductCard with four variants, driven by catalog data: image → brand/category → name → pack → price → MOQ/stock → actions. Out-of-stock and quote-only products switch to Request quote; hazardous products show a handling notice." a11y="Article labelled by the product name, which is a stretched link (the whole card opens the product) while buttons stay separately focusable. Prices, MOQ and stock have text labels; stock pairs colour with icon and text.">
	<Variant label="Default · featured · hidden price (customer-specific pricing)" frame="canvas">
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<ProductCard product={demoProducts[0]} headingLevel={4} />
			<ProductCard product={demoProducts[1]} variant="featured" headingLevel={4} />
			<ProductCard product={demoProducts[5]} headingLevel={4} hidePrices />
		</div>
	</Variant>
	<Variant label="Compact grid (in stock · low stock · backorder · out of stock · quote only) · loading skeleton" frame="canvas">
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
			{#each demoProducts.slice(0, 5) as product (product.id)}
				<ProductCard {product} variant="compact" headingLevel={4} />
			{/each}
			<Skeleton shape="card" />
		</div>
	</Variant>
	<Variant label="Horizontal (stacks on mobile)" frame="canvas">
		<div class="flex flex-col gap-4">
			<ProductCard product={demoProducts[0]} variant="horizontal" headingLevel={4} />
			<ProductCard product={demoProducts[4]} variant="horizontal" headingLevel={4} />
		</div>
	</Variant>
</Demo>

<!-- DATA TABLE -->
<Demo id="data-table" title="Data table" description="DataTable handles headers, rows, cells, sorting, selection, expandable rows, row actions, loading/empty states and pagination. TableToolbar adds search, filters (as removable chips) and a bulk-action mode; TablePagination and RowActionMenu are separate because they're useful on their own." a11y="Real <table> with caption, scope=col/row headers and aria-sort; sortable headers are buttons; every checkbox and action menu is labelled with the row name; the scroll region is focusable for keyboard scrolling.">
	<Variant label='Full example — responsive="stack" (cards below md)' frame="none">
		<div class="flex flex-col gap-4">
			<TableToolbar
				bind:search
				searchPlaceholder="Search items…"
				activeFilters={categoryFilters.map((c) => ({ id: c, label: `Category: ${c}` }))}
				onremovefilter={toggleCategory}
				onclearfilters={() => (categoryFilters = [])}
				selectedCount={selected.length}
				onclearselection={() => (selected = [])}
			>
				{#snippet filters()}
					<Dropdown label="Category" triggerIcon="filter" triggerSize="md" menuClass="w-56 p-3">
						{#snippet children()}
							<fieldset class="flex flex-col gap-2 text-sm">
								<legend class="mb-1 font-semibold">Category</legend>
								{#each ['Alpha', 'Beta', 'Gamma'] as c (c)}
									<label class="flex items-center gap-2"><input type="checkbox" class="size-4 accent-primary" checked={categoryFilters.includes(c)} onchange={() => toggleCategory(c)} />{c}</label>
								{/each}
							</fieldset>
						{/snippet}
					</Dropdown>
				{/snippet}
				{#snippet actions()}<Button variant="outline" iconLeft="download">Export</Button>{/snippet}
				{#snippet bulkActions()}
					<Button size="sm" variant="outline" iconLeft="download">Export selected</Button>
					<Button size="sm" variant="destructive" iconLeft="trash" onclick={() => (selected = [])}>Delete</Button>
				{/snippet}
			</TableToolbar>

			<DataTable
				{columns}
				rows={filteredRows}
				rowKey={(r) => r.id}
				rowLabel={(r) => r.name}
				caption="Inventory items"
				selectable
				bind:selected
				responsive="stack"
				pageSize={8}
				pageSizeOptions={[5, 8, 15]}
				sort={{ key: 'name', direction: 'asc' }}
			>
				{#snippet rowActions(row)}
					<RowActionMenu rowLabel={row.name} items={[{ label: 'View', icon: 'eye' }, { label: 'Edit', icon: 'pencil' }, { type: 'divider' }, { label: 'Delete', icon: 'trash', destructive: true }]} />
				{/snippet}
				{#snippet expanded(row)}
					<DescriptionList layout="inline" compact items={[{ key: 'Code', value: row.id }, { key: 'Category', value: row.category }, { key: 'Stock value', value: formatCurrency(row.price * row.quantity) }]} />
				{/snippet}
				{#snippet empty()}
					<NoResults query={search || undefined} activeFilters={categoryFilters.length} onclear={() => { search = ''; categoryFilters = []; }} size="sm" headingLevel={4} />
				{/snippet}
			</DataTable>
		</div>
	</Variant>

	<Variant label='responsive="scroll" with hidden columns · loading · empty' frame="none">
		<div class="mb-3 flex flex-wrap gap-2" role="group" aria-label="Table state">
			{#each ['data', 'loading', 'empty'] as const as s (s)}
				<Button size="sm" variant={tableState === s ? 'primary' : 'outline'} aria-pressed={tableState === s} onclick={() => (tableState = s)}>{s}</Button>
			{/each}
		</div>
		<DataTable
			{columns}
			rows={tableState === 'empty' ? [] : demoTableRows.slice(0, 6)}
			rowKey={(r) => r.id}
			caption="Compact striped table"
			showCaption
			loading={tableState === 'loading'}
			density="compact"
			striped
			emptyTitle="No items yet"
			emptyDescription="Items you add will appear here."
		/>
	</Variant>
</Demo>

<!-- LISTS -->
<Demo id="lists" title="List & list item" description="Ordered/unordered lists with markers, icon lists, rich and interactive rows, dividers and density variants.">
	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		<Variant label="Unordered / ordered markers">
			<List marker="default"><ListItem>First item</ListItem><ListItem>Second item</ListItem><ListItem>Third item</ListItem></List>
			<List ordered marker="default" class="mt-4"><ListItem>Step one</ListItem><ListItem>Step two</ListItem></List>
		</Variant>
		<Variant label="Icon list (compact)">
			<List density="compact">
				<ListItem icon="check" iconClass="text-success">Free delivery over $500</ListItem>
				<ListItem icon="check" iconClass="text-success">Net-30 terms available</ListItem>
				<ListItem icon="x" iconClass="text-danger">No returns on custom orders</ListItem>
			</List>
		</Variant>
		<Variant label="Interactive, divided, bordered" frame="none">
			<List divided bordered label="Account links">
				<ListItem title="Orders" description="Track and manage orders" icon="package" href="#lists" />
				<ListItem title="Invoices" description="Download statements" icon="file-text" href="#lists" selected />
				<ListItem title="Settings" icon="sliders" onclick={() => {}}>
					{#snippet trailing()}<Badge size="sm">New</Badge>{/snippet}
				</ListItem>
			</List>
		</Variant>
	</div>
	<Variant label="Spacious rich rows with avatars" class="max-w-xl">
		<List divided density="spacious">
			{#each demoPeople.slice(0, 3) as p (p.name)}
				<ListItem title={p.name} description="Team member">
					{#snippet leading()}<Avatar name={p.name} src={p.src} size="sm" labelled={false} />{/snippet}
					{#snippet trailing()}<Button size="sm" variant="ghost">Message</Button>{/snippet}
				</ListItem>
			{/each}
		</List>
	</Variant>
</Demo>

<!-- DESCRIPTION LISTS -->
<Demo id="description-lists" title="Description list, key-value & definition list" description="DescriptionList is for attribute data (horizontal, vertical, grid, inline) and composes KeyValue. DefinitionList is for glossary-style terms — a different meaning, so a separate component." a11y="Semantic <dl>/<dt>/<dd>. A standalone KeyValue renders its own <dl>.">
	<div class="grid gap-6 lg:grid-cols-2">
		<Variant label='layout="horizontal" divided (stacks on mobile)'>
			<DescriptionList divided items={[{ key: 'Product', value: 'Sample product' }, { key: 'Category', value: 'Category A' }, { key: 'Code', value: 'SKU-0001' }, { key: 'Minimum order', value: '50 units' }]} />
		</Variant>
		<Variant label='layout="grid" with rich values'>
			<DescriptionList layout="grid">
				<KeyValue label="Status"><StatusBadge status="success" label="Active" size="sm" /></KeyValue>
				<KeyValue label="Code"><CopyableText value="SKU-0001" appearance="plain" /></KeyValue>
				<KeyValue label="Lead time" value="3–5 days" icon="clock" />
				<KeyValue label="Origin" value="Region" icon="map-pin" />
				<KeyValue label="Pack size" value="12 × 1 kg" />
				<KeyValue label="Rating"><RatingDisplay value={4.4} size="sm" showValue /></KeyValue>
			</DescriptionList>
		</Variant>
		<Variant label='layout="inline" compact · standalone KeyValue'>
			<DescriptionList layout="inline" compact items={[{ key: 'SKU', value: 'WH-001' }, { key: 'Unit', value: 'case' }, { key: 'MOQ', value: 50 }]} />
			<div class="mt-4 border-t border-border pt-4"><KeyValue label="Standalone" value="renders its own <dl>" /></div>
		</Variant>
		<Variant label="Definition list (glossary)">
			<DefinitionList terms={[
				{ term: 'MOQ', definitions: ['Minimum order quantity — the smallest amount that can be ordered.'] },
				{ term: 'Lead time', definitions: ['Time between order and dispatch.', 'May vary by season.'] }
			]} />
		</Variant>
	</div>
</Demo>

<!-- ACCORDION -->
<Demo id="accordion" title="Accordion & collapsible" description="Collapsible is a single disclosure; Accordion groups them with single- or multiple-open modes. Height animates with CSS and is disabled under reduced motion." a11y="Buttons with aria-expanded/aria-controls inside headings, region panels; Up/Down/Home/End move between headers; collapsed content is hidden from AT and tab order.">
	<div class="grid gap-6 lg:grid-cols-2">
		<Variant label='type="single" (default variant)'>
			<Accordion items={faq} bind:value={accordionValue} headingLevel={4} />
		</Variant>
		<Variant label='type="multiple", variant="separated"' frame="canvas">
			<Accordion items={faq.slice(0, 3)} type="multiple" variant="separated" headingLevel={4} />
		</Variant>
		<Variant label='variant="bordered" with rich content' frame="none">
			<Accordion items={faq.slice(0, 2)} variant="bordered" headingLevel={4}>
				{#snippet content(item)}
					<p>{item.content}</p>
					<Button variant="link" size="sm" class="mt-2">Read more</Button>
				{/snippet}
			</Accordion>
		</Variant>
		<Variant label="Standalone collapsible">
			<Collapsible title="Show specifications" icon="sliders">
				{#snippet meta()}<Badge size="sm">4</Badge>{/snippet}
				<DescriptionList layout="inline" compact items={[{ key: 'Weight', value: '1 kg' }, { key: 'Pack', value: '12' }, { key: 'Shelf life', value: '12 mo' }, { key: 'Storage', value: 'Dry' }]} />
			</Collapsible>
		</Variant>
	</div>
</Demo>

<!-- TIMELINE / ACTIVITY -->
<Demo id="timeline" title="Timeline & activity feed" description="Timeline shows dated events with status; ActivityFeed shows who did what, when.">
	<div class="grid gap-6 lg:grid-cols-2">
		<Variant label="Timeline"><Timeline items={demoTimeline} label="Order history" /></Variant>
		<Variant label="Activity feed"><ActivityFeed items={demoActivity} /></Variant>
	</div>
</Demo>

<!-- PROGRESS / STEPPER -->
<Demo id="progress" title="Progress bar, progress ring & stepper" description="Determinate and indeterminate progress in several sizes and tones; stepper with complete, current, upcoming and error states." a11y="role=progressbar with aria-valuenow/valuetext (omitted when indeterminate); stepper uses an ordered list with aria-current=step and text status for each step.">
	<div class="grid gap-6 lg:grid-cols-2">
		<Variant label="Progress bars">
			<div class="flex flex-col gap-5">
				<ProgressBar value={progress} label="Upload progress" />
				<div class="flex gap-2"><Button size="sm" variant="outline" onclick={() => (progress = Math.max(0, progress - 10))}>−10</Button><Button size="sm" variant="outline" onclick={() => (progress = Math.min(100, progress + 10))}>+10</Button></div>
				<ProgressBar value={100} label="Complete" variant="success" size="sm" />
				<ProgressBar value={35} label="Storage used" variant="warning" size="lg" />
				<ProgressBar label="Indeterminate" />
			</div>
		</Variant>
		<Variant label="Progress rings">
			<div class="flex flex-wrap items-center gap-6">
				<ProgressRing value={progress} label="Upload progress" size="lg" />
				<ProgressRing value={82} label="Fulfilment" variant="success" />
				<ProgressRing value={23} label="Capacity" variant="error" size="sm" />
				<ProgressRing label="Loading" />
			</div>
		</Variant>
		<Variant label="Stepper — horizontal (stacks on mobile)"><Stepper steps={demoSteps} current={2} label="Checkout progress" /></Variant>
		<Variant label="Stepper — vertical with error">
			<Stepper steps={[{ ...demoSteps[0], status: 'complete' }, { ...demoSteps[1], status: 'error', description: 'Address could not be verified' }, { ...demoSteps[2], status: 'upcoming' }]} orientation="vertical" label="Order steps" />
		</Variant>
	</div>
	<Variant label="Rating display (read-only)">
		<div class="flex flex-wrap items-center gap-8">
			<RatingDisplay value={4.5} showValue reviewCount={128} />
			<RatingDisplay value={3.2} size="lg" />
			<RatingDisplay value={2.7} size="sm" showValue />
			<RatingDisplay value={4} icon="heart" />
		</div>
	</Variant>
</Demo>

<!-- BADGES & AVATARS -->
<Demo id="badges" title="Badge, status badge, chip & avatar" description="Badge has tone × appearance × size. StatusBadge always pairs colour with an icon and text. Chip can be static, removable or selectable." a11y="State is never shown by colour alone; selectable chips are toggle buttons (aria-pressed); remove buttons are labelled; avatars expose the person's name (and status) once.">
	<Variant label="Badge tones × appearances">
		<div class="flex flex-col gap-3">
			{#each ['soft', 'solid', 'outline'] as const as appearance (appearance)}
				<div class="flex flex-wrap items-center gap-2">
					{#each ['neutral', 'primary', 'success', 'warning', 'error', 'info'] as const as tone (tone)}
						<Badge variant={tone} {appearance}>{tone}</Badge>
					{/each}
				</div>
			{/each}
			<div class="flex flex-wrap items-center gap-2">
				<Badge size="sm">Small</Badge><Badge size="md">Medium</Badge><Badge size="lg">Large</Badge>
				<Badge variant="success" dot>With dot</Badge><Badge variant="info" icon="truck">With icon</Badge><Badge pill={false}>Square</Badge>
			</div>
		</div>
	</Variant>
	<div class="grid gap-6 lg:grid-cols-2">
		<Variant label="Status badges">
			<div class="flex flex-wrap gap-2">
				<StatusBadge status="success" label="In stock" />
				<StatusBadge status="warning" label="Low stock" />
				<StatusBadge status="error" label="Out of stock" />
				<StatusBadge status="info" label="Pre-order" />
				<StatusBadge status="neutral" label="Draft" indicator="dot" />
			</div>
		</Variant>
		<Variant label="Chips / tags">
			<div class="flex flex-wrap items-center gap-2">
				<Chip icon="tag">Static</Chip>
				<Chip selectable bind:selected={chipSelected}>Selectable</Chip>
				<Chip selectable>Toggle me</Chip>
				{#each chips as c (c)}
					<Chip onremove={() => (chips = chips.filter((x) => x !== c))} removeLabel="Remove {c}">{c}</Chip>
				{/each}
				{#if chips.length === 0}<Button size="sm" variant="link" onclick={() => (chips = ['Alpha', 'Beta', 'Gamma'])}>Reset chips</Button>{/if}
			</div>
		</Variant>
		<Variant label="Avatars: sizes, image, initials, status, fallback">
			<div class="flex flex-wrap items-end gap-3">
				<Avatar name="Alex Morgan" size="xs" />
				<Avatar name="Sam Lee" size="sm" status="online" />
				<Avatar name="Alex Morgan" src={demoPeople[0].src} size="md" status="away" />
				<Avatar name="Jordan Taylor" size="lg" status="busy" shape="square" />
				<Avatar name="Broken Image" src="/does-not-exist.png" size="xl" status="offline" />
			</div>
		</Variant>
		<Variant label="Avatar group with overflow">
			<div class="flex flex-col gap-4">
				<AvatarGroup people={demoPeople} max={4} />
				<AvatarGroup people={demoPeople} max={3} size="sm" />
			</div>
		</Variant>
	</div>
</Demo>

<!-- TOOLTIP / POPOVER -->
<Demo id="overlays" title="Tooltip & popover" description="Tooltip shows a short supplementary hint on hover and keyboard focus. Popover is a non-modal dialog for interactive content." a11y="Tooltip uses role=tooltip + aria-describedby, stays open while hovered, Escape dismisses it, and never holds essential info. Popover moves focus inside, Escape/outside-click close it, focus returns to the trigger.">
	<div class="grid gap-6 lg:grid-cols-2">
		<Variant label="Tooltip placements, delay & disabled">
			<div class="flex flex-wrap items-center gap-3 py-8">
				{#each ['top', 'bottom', 'left', 'right'] as const as placement (placement)}
					<Tooltip text="Tooltip on {placement}" {placement}>
						{#snippet children(props)}<Button variant="outline" size="sm" {...props}>{placement}</Button>{/snippet}
					</Tooltip>
				{/each}
				<Tooltip text="Shows immediately" delay={0}>
					{#snippet children(props)}<Button variant="outline" size="sm" {...props}>No delay</Button>{/snippet}
				</Tooltip>
				<Tooltip text="You won't see this" disabled>
					{#snippet children(props)}<Button variant="outline" size="sm" {...props}>Disabled</Button>{/snippet}
				</Tooltip>
			</div>
		</Variant>
		<Variant label="Popover">
			<div class="flex flex-wrap gap-3 pb-48">
				<Popover label="Quick quote">
					{#snippet trigger(props)}<Button {...props} iconLeft="mail">Quick quote</Button>{/snippet}
					{#snippet children(close)}
						<form class="flex flex-col gap-3" onsubmit={(e) => { e.preventDefault(); close(); }}>
							<p class="font-semibold">Request a quote</p>
							<label class="flex flex-col gap-1 text-sm">Quantity<input type="number" min="1" value="50" class="focus-ring h-9 rounded-md border border-border-strong bg-surface px-2" /></label>
							<div class="flex justify-end gap-2"><Button size="sm" variant="ghost" onclick={close}>Cancel</Button><Button size="sm" type="submit">Send</Button></div>
						</form>
					{/snippet}
				</Popover>
				<Popover label="Item information" align="right">
					{#snippet trigger(props)}<Button {...props} variant="ghost" size="icon" aria-label="More information"><Icon name="info" /></Button>{/snippet}
					{#snippet children()}
						<p class="text-sm text-muted-foreground">Popovers can hold any content, including links: <a class="text-primary-text underline" href="#overlays">learn more</a>.</p>
					{/snippet}
				</Popover>
			</div>
		</Variant>
	</div>
</Demo>

<!-- STATES -->
<Demo id="states" title="Empty, error, success, no-results & loading states" description="EmptyState (nothing exists yet), ErrorState (load failed, with retry), SuccessState (action completed) and NoResults (search/filter matched nothing) share one internal layout but stay separate for meaning. Spinner and Skeleton cover loading." a11y="Error state uses role=alert; success and no-results use role=status; spinners have a status role with a label; skeletons are hidden from assistive tech (pair with aria-busy on the container).">
	<div class="grid gap-6 md:grid-cols-2">
		<Variant label="Empty state" frame="none">
			<EmptyState title="No orders yet" description="When you place an order it will show up here." headingLevel={4}>
				{#snippet actions()}<Button iconLeft="plus">Create order</Button><Button variant="outline">Browse catalogue</Button>{/snippet}
			</EmptyState>
		</Variant>
		<Variant label="Error state with retry" frame="none">
			<ErrorState description="We couldn’t load this content. Check your connection and try again." appearance="card" headingLevel={4} {retrying} onretry={() => { retrying = true; setTimeout(() => (retrying = false), 1500); }}>
				{#snippet secondaryAction()}<Button variant="ghost">Contact support</Button>{/snippet}
			</ErrorState>
		</Variant>
		<Variant label="Success state" frame="none">
			<SuccessState title="Quote request sent" description="We’ll get back to you within one business day." appearance="card" headingLevel={4}>
				{#snippet actions()}<Button>View request</Button><Button variant="outline">Back to catalogue</Button>{/snippet}
			</SuccessState>
		</Variant>
		<Variant label="No results" frame="none">
			<NoResults query="widgets" activeFilters={2} suggestions={['widget', 'gadgets', 'parts']} onclear={() => {}} headingLevel={4} class="rounded-card border border-border bg-surface" />
		</Variant>
	</div>
	<div class="grid gap-6 md:grid-cols-2">
		<Variant label="Spinner: sizes · inline · in button · block (page/section)">
			<div class="flex flex-wrap items-center gap-6">
				<Spinner size="xs" /><Spinner size="sm" /><Spinner /><Spinner size="lg" /><Spinner size="xl" class="text-primary-text" />
				<span class="text-sm">Inline <Spinner size="sm" showLabel label="Saving…" /></span>
				<Button loading>Saving</Button>
			</div>
			<Spinner layout="block" size="lg" showLabel label="Loading products…" class="text-primary-text" />
		</Variant>
		<Variant label="Skeleton shapes (compose for any layout)">
			<div class="flex flex-col gap-4">
				<div class="flex items-center gap-3"><Skeleton shape="circle" /><Skeleton lines={2} class="flex-1" /></div>
				<Skeleton lines={3} />
				<div class="grid grid-cols-3 gap-3"><Skeleton shape="image" /><Skeleton shape="image" /><Skeleton shape="rect" class="h-full" /></div>
			</div>
		</Variant>
	</div>
</Demo>

<!-- MEDIA -->
<Demo id="media" title="Image gallery, lightbox, video, audio & file attachment" description="Media components rely on native elements where possible (native video/audio controls, native modal dialog)." a11y="Gallery thumbnails are buttons with aria-current and ←/→ navigation; the active image is announced; Lightbox is a modal dialog with Escape, ←/→ and focus return; video/audio have accessible names and support caption tracks.">
	<div class="grid gap-6 lg:grid-cols-2">
		<Variant label="Gallery — thumbnails below"><ImageGallery images={demoImages} aspect="landscape" /></Variant>
		<Variant label="Gallery — thumbnails beside (lg)"><ImageGallery images={demoImages} thumbnails="side" /></Variant>
	</div>
	<Variant label="Standalone lightbox">
		<div class="flex flex-wrap gap-2">
			{#each demoImages as img, i (img.src)}
				<button type="button" class="focus-ring overflow-hidden rounded-md" aria-label="Open {img.alt} fullscreen" onclick={() => { lightboxIndex = i; lightboxOpen = true; }}>
					<img src={img.src} alt="" class="size-20 object-cover" />
				</button>
			{/each}
		</div>
		<Lightbox images={demoImages} bind:open={lightboxOpen} bind:index={lightboxIndex} />
	</Variant>
	<div class="grid gap-6 lg:grid-cols-2">
		<Variant label="Video player (native controls)">
			<VideoPlayer title="Sample video" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" poster={demoImages[0].src} caption="Sample CC0 clip from MDN." />
		</Variant>
		<Variant label="Audio player">
			<AudioPlayer title="Sample audio" subtitle="CC0 clip" duration="0:03" src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" transcript="[Loud dinosaur roar]" />
		</Variant>
	</div>
	<Variant label="File attachments: complete · uploading · indeterminate · error">
		<div class="grid gap-3 md:grid-cols-2">
			<FileAttachment name="price-list-2026.pdf" size={2_480_000} href="#media" onremove={() => {}} />
			<FileAttachment name="product-photo.jpg" size={845_000} status="uploading" progress={progress} onremove={() => {}} />
			<FileAttachment name="catalogue.xlsx" status="uploading" onremove={() => {}} />
			<FileAttachment name="invoice-scan.png" status="error" error="File exceeds the 10 MB limit" onretry={() => {}} onremove={() => {}} />
		</div>
	</Variant>
</Demo>

<!-- CODE -->
<Demo id="code" title="Code block & copyable text" description="CodeBlock shows code with a language label, copy button and optional line numbers (no highlighter dependency). CopyableText is for short values such as codes and IDs." a11y="Copy results are announced via a polite live region; the code area is keyboard-scrollable.">
	<Variant label="Code block with line numbers" frame="none">
		<CodeBlock code={codeSample} language="svelte" title="ProductCard usage" lineNumbers />
	</Variant>
	<Variant label="Copyable text">
		<div class="flex flex-wrap items-center gap-4">
			<CopyableText value="SKU-0001" label="SKU" />
			<CopyableText value="ORD-2026-000431" />
			<CopyableText value="a-very-long-identifier-that-will-truncate-on-small-screens-0123456789" truncate class="max-w-64" />
			<CopyableText value="plain appearance" mono={false} appearance="plain" />
		</div>
	</Variant>
</Demo>
