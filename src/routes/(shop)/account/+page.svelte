<script lang="ts">
	import { Avatar, Badge, Button, Card, CardBody, CardHeader, Container, DescriptionList, PageHeader, ProgressBar, StatusBadge } from '$lib';
	import { account, PAYMENT_TERMS } from '$lib/data/account';
	import { formatPrice } from '$lib/catalog/pricing';
	import { site } from '$lib/data/site';
</script>

<svelte:head>
	<title>Account | {site.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Container size="wide" class="pb-16">
	<PageHeader title="Business account" description="Signed in as {account.buyer.name} (demo account — no authentication)." breadcrumbs={[{ label: 'Home', href: '/', icon: 'home' }, { label: 'Account' }]}>
		{#snippet actions()}
			<Button href="/account/orders" iconLeft="clipboard">Order history</Button>
			<Button href="/bulk-order" variant="outline" iconLeft="upload">Bulk order</Button>
		{/snippet}
	</PageHeader>

	<div class="grid gap-6 lg:grid-cols-3">
		<Card>
			<CardHeader title="Company" />
			<CardBody>
				<DescriptionList items={[{ key: 'Business', value: account.company }, { key: 'Account no.', value: account.accountNumber }, { key: 'Buyer limit', value: formatPrice(account.approvalLimit) }, { key: 'Approver', value: account.approver.name }]} />
			</CardBody>
		</Card>
		<Card>
			<CardHeader title="Credit & terms" />
			<CardBody>
				<ProgressBar value={account.creditUsed} max={account.creditLimit} label="Credit used" showLabel showValue />
				<p class="mt-2 text-sm text-muted-foreground">{formatPrice(account.creditUsed)} of {formatPrice(account.creditLimit)} used</p>
				<ul class="mt-4 flex flex-col gap-2">
					{#each PAYMENT_TERMS as t (t.value)}
						<li class="flex items-center justify-between gap-2 text-sm">
							<span>{t.label}</span>
							{#if account.approvedTerms.includes(t.value)}<StatusBadge status="success" label="Approved" size="sm" />{:else}<StatusBadge status="neutral" label="Not approved" size="sm" />{/if}
						</li>
					{/each}
				</ul>
			</CardBody>
		</Card>
		<Card>
			<CardHeader title="Buyers" />
			<CardBody>
				<ul class="flex flex-col gap-3">
					{#each account.buyers as b (b.name)}
						<li class="flex items-center gap-3">
							<Avatar name={b.name} size="sm" labelled={false} />
							<span class="flex-1 text-sm"><span class="block font-medium">{b.name}</span><span class="text-muted-foreground">{b.role}</span></span>
							<Badge variant={b.status === 'Active' ? 'success' : 'warning'} size="sm">{b.status}</Badge>
						</li>
					{/each}
				</ul>
			</CardBody>
		</Card>
	</div>
</Container>
