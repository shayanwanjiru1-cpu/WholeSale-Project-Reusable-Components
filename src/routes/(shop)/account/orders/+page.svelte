<script lang="ts">
	import { Container, DataTable, PageHeader, QuickReorder, RowActionMenu, SearchInput, Select, StatisticCard, StatusBadge } from '$lib';
	import { account, frequentlyOrdered, ORDER_STATUS, orders, PAYMENT_TERMS } from '$lib/data/account';
	import { cart } from '$lib/stores/cart.svelte';
	import { toasts } from '$lib/stores/toast.svelte';
	import { formatPrice } from '$lib/catalog/pricing';
	import { site } from '$lib/data/site';
	import type { Order, TableColumn } from '$lib/types';

	let search = $state('');
	let status = $state('all');

	const rows = $derived(
		orders.filter((o) => {
			const q = search.trim().toLowerCase();
			const matchesQ = !q || [o.id, o.poNumber ?? '', o.placedBy, ...o.lines.map((l) => `${l.name} ${l.sku}`)].join(' ').toLowerCase().includes(q);
			return matchesQ && (status === 'all' || o.status === status);
		})
	);

	const dateFmt = new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

	const columns: TableColumn<Order>[] = [
		{ key: 'id', header: 'Order', sortable: true, primary: true },
		{ key: 'placedAt', header: 'Date', sortable: true, format: (v) => dateFmt.format(new Date(String(v))) },
		{ key: 'placedBy', header: 'Placed by', hideBelow: 'lg' },
		{ key: 'poNumber', header: 'PO', format: (v) => (v ? String(v) : '—'), hideBelow: 'md' },
		{ key: 'terms', header: 'Terms', format: (v) => PAYMENT_TERMS.find((t) => t.value === v)?.label ?? String(v), hideBelow: 'lg' },
		{ key: 'status', header: 'Status', cell: statusCell, sortable: true },
		{ key: 'total', header: 'Total', align: 'right', sortable: true, format: (v) => formatPrice(Number(v)) }
	];

	function reorder(o: Order) {
		cart.addMany(o.lines.map((l) => ({ sku: l.sku, quantity: l.quantity })));
		toasts.show({ title: `Reordered ${o.id}`, description: `${o.lines.length} products added to your cart.`, action: { label: 'View cart', href: '/cart' } });
	}

	const monthSpend = orders.filter((o) => o.placedAt.startsWith('2026-10') && o.status !== 'cancelled').reduce((n, o) => n + o.total, 0);
	const awaiting = orders.filter((o) => o.status === 'pending-approval').length;
</script>

{#snippet statusCell(o: Order)}
	<StatusBadge status={ORDER_STATUS[o.status].tone} label={ORDER_STATUS[o.status].label} size="sm" />
{/snippet}

<svelte:head>
	<title>Order History | {site.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Container size="wide" class="pb-16">
	<PageHeader
		title="Order history"
		description="{account.company} · {account.accountNumber}. Demo data."
		breadcrumbs={[{ label: 'Home', href: '/', icon: 'home' }, { label: 'Account', href: '/account' }, { label: 'Orders' }]}
	/>

	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		<StatisticCard label="Orders (last 60 days)" value={orders.length} icon="clipboard" />
		<StatisticCard label="Spend this month" value={formatPrice(monthSpend)} icon="wallet" trend={{ value: '12%', direction: 'up', label: 'vs September' }} />
		<StatisticCard label="Awaiting approval" value={awaiting} icon="users" tone="warning" description="Over the {formatPrice(account.approvalLimit)} buyer limit" />
		<StatisticCard label="Available credit" value={formatPrice(account.creditLimit - account.creditUsed)} icon="credit-card" description="Net-30 account" />
	</div>

	<div class="mt-10">
		<QuickReorder items={frequentlyOrdered(6)} />
	</div>

	<section class="mt-10" aria-labelledby="orders-title">
		<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<h2 id="orders-title" class="text-h3">All orders</h2>
			<div class="flex flex-col gap-2 sm:flex-row sm:items-end">
				<SearchInput bind:value={search} label="Search orders" placeholder="Order, PO, product or SKU" class="sm:w-72" />
				<Select label="Status" hideLabel bind:value={status} options={[{ value: 'all', label: 'All statuses' }, ...Object.entries(ORDER_STATUS).map(([value, s]) => ({ value, label: s.label }))]} class="sm:w-48" />
			</div>
		</div>
		<DataTable
			{columns}
			{rows}
			rowKey={(o) => o.id}
			rowLabel={(o) => `order ${o.id}`}
			caption="Order history for {account.company}"
			responsive="stack"
			sort={{ key: 'placedAt', direction: 'desc' }}
			emptyTitle="No orders match"
			emptyDescription="Try another search or status."
			pageSize={5}
		>
			{#snippet expanded(o)}
				<ul class="flex flex-col gap-1.5 text-sm">
					{#each o.lines as l (l.sku)}
						<li class="flex justify-between gap-4"><span><span class="font-mono text-xs text-muted-foreground">{l.sku}</span> {l.name} × {l.quantity}</span><span class="tabular-nums">{formatPrice(l.unitPrice * l.quantity)}</span></li>
					{/each}
				</ul>
			{/snippet}
			{#snippet rowActions(o)}
				<RowActionMenu
					rowLabel="order {o.id}"
					items={[
						{ label: 'Reorder all items', icon: 'repeat', onSelect: () => reorder(o), disabled: o.status === 'cancelled' },
						{ label: 'Download invoice (demo)', icon: 'download', disabled: true },
						{ type: 'divider' },
						{ label: o.status === 'pending-approval' ? 'Cancel request' : 'Report a problem', icon: 'alert-circle', destructive: o.status === 'pending-approval', disabled: true }
					]}
				/>
			{/snippet}
		</DataTable>
	</section>
</Container>
