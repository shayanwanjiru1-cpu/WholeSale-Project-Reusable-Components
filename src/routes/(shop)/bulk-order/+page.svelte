<script lang="ts">
	import { Alert, Button, Container, Icon, PageHeader, StatusBadge, Textarea } from '$lib';
	import { BULK_TEMPLATE, parseBulkOrder, type BulkRowStatus } from '$lib/catalog/bulk';
	import { formatPrice, lineTotal } from '$lib/catalog/pricing';
	import { cart } from '$lib/stores/cart.svelte';
	import { toasts } from '$lib/stores/toast.svelte';
	import { site } from '$lib/data/site';
	import type { Tone } from '$lib/types';

	/** Bulk order upload: paste or upload a CSV of SKUs + quantities, review, add to cart. */
	let text = $state('');
	let fileName = $state('');
	const rows = $derived(parseBulkOrder(text));
	const valid = $derived(rows.filter((r) => r.status === 'ok' || r.status === 'raised-to-moq'));
	const total = $derived(valid.reduce((n, r) => n + (r.product ? lineTotal(r.product, r.quantity) : 0), 0));
	const templateHref = `data:text/csv;charset=utf-8,${encodeURIComponent(BULK_TEMPLATE)}`;

	const tone: Record<BulkRowStatus, Tone> = { ok: 'success', 'raised-to-moq': 'warning', 'unknown-sku': 'error', unavailable: 'neutral', 'invalid-quantity': 'error' };

	async function onfile(e: Event & { currentTarget: HTMLInputElement }) {
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		fileName = file.name;
		text = await file.text();
	}

	function addAll() {
		cart.addMany(valid.map((r) => ({ sku: r.sku, quantity: r.quantity })));
		toasts.show({ title: `${valid.length} lines added to cart`, description: `${formatPrice(total)} excl. VAT`, action: { label: 'View cart', href: '/cart' } });
	}
</script>

<svelte:head>
	<title>Bulk Order Upload | {site.name}</title>
	<meta name="description" content="Upload a CSV of SKUs and quantities to build a wholesale order in one step." />
</svelte:head>

<Container size="wide" class="pb-16">
	<PageHeader title="Bulk order upload" description="Paste or upload a CSV with two columns: SKU and quantity. We’ll check each line against the catalog, MOQs and stock." breadcrumbs={[{ label: 'Home', href: '/', icon: 'home' }, { label: 'Bulk order' }]} />

	<div class="grid items-start gap-8 lg:grid-cols-[24rem_1fr]">
		<section aria-labelledby="input-title" class="flex flex-col gap-4 rounded-card border border-border bg-surface p-5">
			<h2 id="input-title" class="font-semibold">1. Add your lines</h2>
			<label class="focus-within:outline-ring flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed border-border-strong p-6 text-center hover:border-brand focus-within:outline-2 focus-within:outline-offset-2">
				<Icon name="upload" class="size-6 text-muted-foreground" />
				<span class="text-sm font-medium">{fileName || 'Choose a CSV file'}</span>
				<span class="text-xs text-muted-foreground">.csv or .txt · SKU, quantity</span>
				<input type="file" accept=".csv,.txt,text/csv,text/plain" class="sr-only" onchange={onfile} />
			</label>
			<Textarea label="Or paste lines" rows={8} bind:value={text} placeholder={'WS-FG-1001, 10\nWS-CH-3001, 6'} hint="One line per product. Header row optional." class="[&_textarea]:font-mono" />
			<div class="flex flex-wrap gap-2">
				<Button variant="outline" size="sm" iconLeft="download" href={templateHref} download="bulk-order-template.csv">Download template</Button>
				<Button variant="ghost" size="sm" onclick={() => (text = BULK_TEMPLATE)}>Use example</Button>
			</div>
		</section>

		<section aria-labelledby="review-title" class="min-w-0">
			<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
				<h2 id="review-title" class="font-semibold">2. Review ({rows.length} lines)</h2>
				<Button iconLeft="cart" disabled={valid.length === 0} onclick={addAll}>Add {valid.length} lines to cart · {formatPrice(total)}</Button>
			</div>
			{#if rows.length === 0}
				<Alert tone="info" title="Nothing to review yet">Upload a file or paste lines to see them checked here.</Alert>
			{:else}
				<!-- svelte-ignore a11y_no_noninteractive_tabindex (scrollable region must be keyboard-focusable) -->
				<div class="overflow-x-auto rounded-card border border-border bg-surface" tabindex="0" role="region" aria-label="Bulk order lines">
					<table class="w-full min-w-[40rem] text-sm">
						<caption class="sr-only">Parsed bulk order lines</caption>
						<thead class="bg-muted text-left text-xs tracking-wide text-muted-foreground uppercase">
							<tr><th scope="col" class="px-4 py-2.5">Line</th><th scope="col" class="px-4 py-2.5">SKU / product</th><th scope="col" class="px-4 py-2.5 text-right">Qty</th><th scope="col" class="px-4 py-2.5">Status</th><th scope="col" class="px-4 py-2.5 text-right">Line total</th></tr>
						</thead>
						<tbody class="divide-y divide-border">
							{#each rows as r (r.line)}
								<tr>
									<td class="px-4 py-2.5 text-muted-foreground tabular-nums">{r.line}</td>
									<th scope="row" class="px-4 py-2.5 text-left font-normal"><span class="font-mono text-xs">{r.sku || '—'}</span>{#if r.product}<span class="block font-medium">{r.product.name}</span>{/if}</th>
									<td class="px-4 py-2.5 text-right tabular-nums">{r.quantity || r.requested || '—'}{#if r.status === 'raised-to-moq'}<span class="block text-xs text-muted-foreground">asked {r.requested}</span>{/if}</td>
									<td class="px-4 py-2.5"><StatusBadge status={tone[r.status]} label={r.message} size="sm" /></td>
									<td class="px-4 py-2.5 text-right font-semibold tabular-nums">{r.product && r.quantity ? formatPrice(lineTotal(r.product, r.quantity)) : '—'}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</section>
	</div>
</Container>
