<script lang="ts">
	import { tick } from 'svelte';
	import { Alert, Button, Container, EmptyState, Icon, Input, PageHeader, ProductImage, QuantityInput, Select, SuccessState, Textarea } from '$lib';
	import { quote } from '$lib/stores/quote.svelte';
	import { account } from '$lib/data/account';
	import { getCategory } from '$lib/data/categories';
	import { site } from '$lib/data/site';
	import { formatPrice, pluralUnit } from '$lib/catalog/pricing';

	/** Quote request: selected products + quantities, business details, delivery needs. Mock submit. */
	let form = $state({ company: account.company, contact: account.buyer.name, email: account.buyer.email, phone: '', frequency: 'once', deliveryBy: '', location: '', notes: '' });
	let errors = $state<Record<string, string>>({});
	let sent = $state<string | null>(null);
	let submitting = $state(false);
	let summaryEl = $state<HTMLDivElement>();

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		const next: Record<string, string> = {};
		if (!form.company.trim()) next.company = 'Enter the business name.';
		if (!form.contact.trim()) next.contact = 'Enter a contact name.';
		if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
		if (!form.location.trim()) next.location = 'Enter the delivery town or site.';
		if (quote.count === 0 && !form.notes.trim()) next.notes = 'Add products to the request, or describe what you need here.';
		errors = next;
		if (Object.keys(next).length) {
			await tick();
			summaryEl?.focus();
			return;
		}
		submitting = true;
		await new Promise((r) => setTimeout(r, 600));
		sent = `QR-${2200 + Math.floor(Math.random() * 700)}`;
		quote.clear();
		submitting = false;
		window.scrollTo({ top: 0 });
	}
</script>

<svelte:head>
	<title>Request a Wholesale Quote | {site.name}</title>
	<meta name="description" content="Request volume pricing for large, recurring or custom wholesale orders." />
</svelte:head>

<Container size="wide" class="pb-16">
	<PageHeader
		title="Request a quote"
		description="For large volumes, recurring supply, trade-only lines or anything not listed. We reply within one working day (demo)."
		breadcrumbs={[{ label: 'Home', href: '/', icon: 'home' }, { label: 'Request a quote' }]}
	/>

	{#if sent}
		<SuccessState size="lg" appearance="card" title="Quote request {sent} sent" description="The account team will email {form.email} with pricing and availability. This is a demo — no request is actually sent.">
			{#snippet actions()}
				<Button href="/shop">Continue browsing</Button>
				<Button href="/" variant="outline">Back to home</Button>
			{/snippet}
		</SuccessState>
	{:else}
		<form class="grid items-start gap-8 lg:grid-cols-[1fr_26rem]" novalidate onsubmit={submit}>
			<section aria-labelledby="qp-title" class="flex flex-col gap-4">
				{#if Object.keys(errors).length}
					<div bind:this={summaryEl} tabindex="-1" class="outline-none">
						<Alert tone="error" role="alert" title="Please check the highlighted fields">
							<ul class="list-disc pl-5">{#each Object.entries(errors) as [k, m] (k)}<li><a class="underline" href="#q-{k}">{m}</a></li>{/each}</ul>
						</Alert>
					</div>
				{/if}
				<div class="flex items-center justify-between">
					<h2 id="qp-title" class="text-h3">Products ({quote.count})</h2>
					<Button href="/shop" variant="outline" size="sm" iconLeft="plus">Add products</Button>
				</div>
				{#if quote.count === 0}
					<EmptyState icon="file-text" title="No products added yet" description="Use “Request quote” on any product, or describe your requirements in the notes." size="sm" />
				{:else}
					<ul class="divide-y divide-border rounded-card border border-border bg-surface">
						{#each quote.items as item (item.sku)}
							{@const p = item.product}
							<li class="grid gap-4 p-4 sm:grid-cols-[4.5rem_1fr_auto] sm:items-start">
								<ProductImage src={p.image} sprite={p.sprite} alt="" icon={getCategory(p.category)?.icon} aspect="square" class="hidden rounded-md border border-border sm:block" />
								<div class="min-w-0">
									<p class="text-xs text-muted-foreground">{p.brand} · <span class="font-mono">{p.sku}</span></p>
									<a href={p.href} class="focus-ring rounded-sm font-semibold hover:text-primary-text">{p.name}</a>
									<p class="text-sm text-muted-foreground">{p.packSize} per {p.unit} · {p.quoteOnly ? 'Price on request' : `list ${formatPrice(p.price)} / ${p.unit}`}</p>
									<Input label="Note for {p.name}" hideLabel size="sm" placeholder="Note (brand alternatives, delivery split…)" value={item.note ?? ''} oninput={(e) => quote.update(item.sku, { note: e.currentTarget.value })} class="mt-2" />
								</div>
								<div class="flex items-start gap-2 sm:flex-col sm:items-end">
									<QuantityInput value={item.quantity} size="sm" label="Requested quantity for {p.name}" unit={pluralUnit(p.unit, item.quantity)} onchange={(q) => quote.update(item.sku, { quantity: q })} />
									<button type="button" class="focus-ring inline-flex h-8 items-center gap-1 rounded px-2 text-sm text-muted-foreground hover:text-danger-strong" onclick={() => quote.remove(item.sku)}><Icon name="trash" class="size-4" />Remove<span class="sr-only"> {p.name}</span></button>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
				<Textarea id="q-notes" label="Requirements & notes" rows={4} placeholder="Products not listed, target prices, brand preferences, packaging…" bind:value={form.notes} error={errors.notes} />
			</section>

			<section aria-labelledby="qd-title" class="flex flex-col gap-4 rounded-card border border-border bg-surface p-5 sm:p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
				<h2 id="qd-title" class="text-lg font-semibold">Your details</h2>
				<Input id="q-company" label="Business name" required bind:value={form.company} error={errors.company} autocomplete="organization" />
				<Input id="q-contact" label="Contact name" required bind:value={form.contact} error={errors.contact} autocomplete="name" />
				<Input id="q-email" label="Email" type="email" required bind:value={form.email} error={errors.email} autocomplete="email" />
				<Input label="Phone" type="tel" bind:value={form.phone} autocomplete="tel" />
				<h3 class="mt-2 font-semibold">Delivery requirements</h3>
				<Input id="q-location" label="Delivery town / site" required bind:value={form.location} error={errors.location} />
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
					<Input label="Needed by" type="date" bind:value={form.deliveryBy} />
					<Select label="Order frequency" bind:value={form.frequency} options={[{ value: 'once', label: 'One-off' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'contract', label: 'Supply contract' }]} />
				</div>
				<Button type="submit" size="lg" iconLeft="file-text" loading={submitting} loadingLabel="Sending request" fullWidth>Request quote</Button>
				<p class="text-xs text-muted-foreground">Quotes are valid for 14 days. Demo form — nothing is sent.</p>
			</section>
		</form>
	{/if}
</Container>
