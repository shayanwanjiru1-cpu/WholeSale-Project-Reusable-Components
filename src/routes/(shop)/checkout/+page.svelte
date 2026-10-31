<script lang="ts">
	import { tick } from 'svelte';
	import {
		Alert,
		Button,
		CartLineItem,
		Checkbox,
		Container,
		EmptyState,
		Input,
		OrderSummary,
		PageHeader,
		RadioGroup,
		Select,
		SuccessState,
		Textarea
	} from '$lib';
	import { cart } from '$lib/stores/cart.svelte';
	import { account, PAYMENT_TERMS } from '$lib/data/account';
	import { site } from '$lib/data/site';
	import { formatPrice } from '$lib/catalog/pricing';
	import type { PaymentTerms } from '$lib/types';

	/**
	 * Checkout UI. Submitting is mocked (no payment backend): the form validates,
	 * routes large orders to the account approver, and shows a confirmation.
	 */
	let form = $state({
		company: account.company,
		taxPin: 'P051234567X',
		contact: account.buyer.name,
		email: account.buyer.email,
		phone: '+254 711 000 000',
		address: '',
		town: 'Nairobi',
		county: 'Nairobi',
		deliveryWindow: 'any',
		instructions: '',
		billingSame: true,
		billingAddress: '',
		terms: 'net-30' as PaymentTerms,
		method: 'mpesa',
		po: '',
		notes: ''
	});
	let errors = $state<Record<string, string>>({});
	let submitting = $state(false);
	let placed = $state<{ id: string; total: number; needsApproval: boolean; terms: PaymentTerms } | null>(null);
	let summaryEl = $state<HTMLDivElement>();

	const needsApproval = $derived(cart.totals.total > account.approvalLimit);
	const termOptions = $derived(
		PAYMENT_TERMS.map((t) => ({
			...t,
			disabled: !account.approvedTerms.includes(t.value),
			badge: account.approvedTerms.includes(t.value) ? undefined : 'Requires credit approval'
		}))
	);

	function validate() {
		const e: Record<string, string> = {};
		if (!form.company.trim()) e.company = 'Enter the business name.';
		if (!form.contact.trim()) e.contact = 'Enter a contact name.';
		if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address, like name@company.com.';
		if (form.phone.replace(/\D/g, '').length < 9) e.phone = 'Enter a phone number with at least 9 digits.';
		if (!form.address.trim()) e.address = 'Enter the delivery street address or building.';
		if (!form.town.trim()) e.town = 'Enter the town or city.';
		if (!form.billingSame && !form.billingAddress.trim()) e.billingAddress = 'Enter the billing address, or tick “same as delivery”.';
		if (form.terms !== 'prepaid' && !form.po.trim()) e.po = 'A purchase order number is required for orders on account terms.';
		return e;
	}

	const labels: Record<string, string> = {
		company: 'Business name',
		contact: 'Contact name',
		email: 'Email',
		phone: 'Phone',
		address: 'Delivery address',
		town: 'Town / city',
		billingAddress: 'Billing address',
		po: 'Purchase order number'
	};

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		errors = validate();
		if (Object.keys(errors).length) {
			await tick();
			summaryEl?.focus();
			return;
		}
		submitting = true;
		await new Promise((r) => setTimeout(r, 700)); // mock request
		placed = { id: `SO-${10483 + Math.floor(Math.random() * 400)}`, total: cart.totals.total, needsApproval, terms: form.terms };
		cart.clear();
		submitting = false;
		window.scrollTo({ top: 0 });
	}

	const fieldset = 'rounded-card border border-border bg-surface p-5 sm:p-6';
	const legend = 'text-lg font-semibold';
</script>

<svelte:head>
	<title>Checkout | {site.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Container size="wide" class="pb-16">
	<PageHeader title={placed ? 'Order placed' : 'Checkout'} breadcrumbs={[{ label: 'Home', href: '/', icon: 'home' }, { label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

	{#if placed}
		<SuccessState
			size="lg"
			appearance="card"
			title={placed.needsApproval ? `Order ${placed.id} sent for approval` : `Order ${placed.id} confirmed`}
			description={placed.needsApproval
				? `This order (${formatPrice(placed.total)}) is above your ${formatPrice(account.approvalLimit)} buyer limit, so it has been sent to ${account.approver.name} (${account.approver.role}) for approval.`
				: `Thanks — we’ve received your order for ${formatPrice(placed.total)} on ${PAYMENT_TERMS.find((t) => t.value === placed?.terms)?.label} terms. A confirmation has been emailed to ${form.email} (demo — no email is sent).`}
		>
			{#snippet actions()}
				<Button href="/account/orders" iconLeft="clipboard">View order history</Button>
				<Button href="/shop" variant="outline">Continue shopping</Button>
			{/snippet}
		</SuccessState>
	{:else if cart.loaded && cart.count === 0}
		<EmptyState icon="cart" title="Nothing to check out" description="Your cart is empty." size="lg">
			{#snippet actions()}<Button href="/shop">Browse products</Button>{/snippet}
		</EmptyState>
	{:else}
		<form class="grid items-start gap-8 lg:grid-cols-[1fr_24rem]" novalidate onsubmit={submit}>
			<div class="flex flex-col gap-6">
				{#if Object.keys(errors).length}
					<div bind:this={summaryEl} tabindex="-1" class="outline-none">
						<Alert tone="error" role="alert" title="Please fix {Object.keys(errors).length} {Object.keys(errors).length === 1 ? 'problem' : 'problems'} before placing the order">
							<ul class="mt-1 list-disc pl-5">
								{#each Object.entries(errors) as [key, msg] (key)}
									<li><a href="#co-{key}" class="underline">{labels[key]}: {msg}</a></li>
								{/each}
							</ul>
						</Alert>
					</div>
				{/if}

				<section class={fieldset} aria-labelledby="acct-title">
					<h2 id="acct-title" class={legend}>Customer account</h2>
					<p class="mt-2 text-sm text-muted-foreground">Ordering as <strong class="text-foreground">{account.buyer.name}</strong> ({account.buyer.role}) for <strong class="text-foreground">{account.company}</strong> · {account.accountNumber}</p>
					{#if needsApproval}
						<Alert tone="warning" icon="users" title="Approval required" class="mt-4">
							This order is above your {formatPrice(account.approvalLimit)} limit. It will be sent to {account.approver.name} for approval before dispatch.
						</Alert>
					{/if}
				</section>

				<fieldset class={fieldset}>
					<legend class="{legend} float-left mb-4 w-full">Business information</legend>
					<div class="grid gap-4 sm:grid-cols-2">
						<Input id="co-company" label="Business name" required bind:value={form.company} error={errors.company} autocomplete="organization" />
						<Input id="co-taxPin" label="Tax PIN" hint="Shown on your VAT invoice." bind:value={form.taxPin} />
						<Input id="co-contact" label="Contact name" required bind:value={form.contact} error={errors.contact} autocomplete="name" />
						<Input id="co-email" label="Email" type="email" required bind:value={form.email} error={errors.email} autocomplete="email" />
						<Input id="co-phone" label="Phone" type="tel" required bind:value={form.phone} error={errors.phone} autocomplete="tel" />
					</div>
				</fieldset>

				<fieldset class={fieldset}>
					<legend class="{legend} float-left mb-4 w-full">Delivery address</legend>
					<div class="grid gap-4 sm:grid-cols-2">
						<Input id="co-address" label="Street address / building" required bind:value={form.address} error={errors.address} autocomplete="street-address" class="sm:col-span-2" />
						<Input id="co-town" label="Town / city" required bind:value={form.town} error={errors.town} autocomplete="address-level2" />
						<Input id="co-county" label="County" bind:value={form.county} autocomplete="address-level1" />
						<Select
							label="Delivery window"
							bind:value={form.deliveryWindow}
							options={[{ value: 'any', label: 'Any time (8:00–17:00)' }, { value: 'am', label: 'Morning (8:00–12:00)' }, { value: 'pm', label: 'Afternoon (12:00–17:00)' }]}
						/>
						<Input label="Delivery instructions" hint="Loading bay, gate code, contact on site." bind:value={form.instructions} />
					</div>
				</fieldset>

				<fieldset class={fieldset}>
					<legend class="{legend} float-left mb-4 w-full">Billing</legend>
					<Checkbox label="Billing address is the same as delivery" bind:checked={form.billingSame} />
					{#if !form.billingSame}
						<Textarea id="co-billingAddress" label="Billing address" required rows={3} bind:value={form.billingAddress} error={errors.billingAddress} class="mt-3" />
					{/if}
				</fieldset>

				<section class={fieldset} aria-labelledby="pay-title">
					<h2 id="pay-title" class="{legend} mb-4">Payment</h2>
					<RadioGroup legend="Payment terms" name="terms" bind:value={form.terms} options={termOptions} variant="cards" columns={3} />
					{#if form.terms === 'prepaid'}
						<RadioGroup
							legend="Payment method"
							name="method"
							bind:value={form.method}
							class="mt-6"
							options={[
								{ value: 'mpesa', label: 'M-Pesa', description: 'Pay to the business till after placing the order.' },
								{ value: 'bank', label: 'Bank transfer', description: 'Proforma invoice emailed with bank details.' },
								{ value: 'card', label: 'Card', description: 'Pay by card on delivery (demo).' }
							]}
						/>
					{:else}
						<p class="mt-4 text-sm text-muted-foreground">Invoice due {form.terms === 'net-30' ? '30' : '60'} days after delivery. Available credit: {formatPrice(account.creditLimit - account.creditUsed)}.</p>
					{/if}
					<div class="mt-6 grid gap-4 sm:grid-cols-2">
						<Input id="co-po" label="Purchase order (PO) number" required={form.terms !== 'prepaid'} bind:value={form.po} error={errors.po} hint="Printed on the invoice." />
						<Textarea label="Order notes" rows={2} bind:value={form.notes} />
					</div>
				</section>
			</div>

			<OrderSummary totals={cart.totals} itemCount={cart.count} class="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
				<ul class="mt-2 max-h-72 divide-y divide-border overflow-y-auto">
					{#each cart.items as item (item.product.sku)}
						<CartLineItem {item} compact onquantity={() => {}} onremove={() => {}} class="grid-cols-[3rem_1fr_auto]! py-3 [&_h3]:text-sm" />
					{/each}
				</ul>
				{#snippet actions()}
					<Button type="submit" size="lg" fullWidth loading={submitting} loadingLabel="Placing order" disabled={cart.hasIssues || cart.totals.belowMinimum}>
						{needsApproval ? 'Submit for approval' : 'Place order'}
					</Button>
					<Button href="/cart" variant="ghost" iconLeft="arrow-left" fullWidth>Back to cart</Button>
				{/snippet}
			</OrderSummary>
		</form>
	{/if}
</Container>
