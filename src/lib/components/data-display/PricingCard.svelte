<script lang="ts">
	import Card from './Card.svelte';
	import Heading from '../layout/Heading.svelte';
	import Badge from '../ui/Badge.svelte';
	import Button from '../ui/Button.svelte';
	import Icon from '../ui/Icon.svelte';
	import type { Action, HeadingLevel, PricingFeature } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	interface Props {
		name: string;
		price: string;
		period?: string;
		description?: string;
		features?: PricingFeature[];
		cta?: Action;
		highlighted?: boolean;
		badge?: string;
		headingLevel?: HeadingLevel;
		class?: string;
	}

	let { name, price, period, description, features = [], cta, highlighted = false, badge, headingLevel = 3, class: className }: Props = $props();
</script>

<Card variant={highlighted ? 'elevated' : 'default'} class={cn(highlighted && 'ring-2 ring-primary', className)}>
	<div class="flex h-full flex-col gap-6 p-6 sm:p-8">
		<div>
			<div class="flex items-center justify-between gap-2">
				<Heading level={headingLevel} class="text-lg font-semibold text-foreground">{name}</Heading>
				{#if badge}<Badge variant="primary">{badge}</Badge>{/if}
			</div>
			{#if description}<p class="mt-2 text-sm text-muted-foreground">{description}</p>{/if}
			<p class="mt-4 flex items-baseline gap-1">
				<span class="text-4xl font-bold tracking-tight text-foreground">{price}</span>
				{#if period}<span class="text-sm text-muted-foreground">/{period}</span>{/if}
			</p>
		</div>
		{#if features.length}
			<ul class="flex flex-1 flex-col gap-3 text-sm">
				{#each features as f (f.label)}
					{@const included = f.included !== false}
					<li class={cn('flex gap-2.5', !included && 'text-muted-foreground')}>
						<Icon name={included ? 'check' : 'x'} class={cn('mt-0.5 size-4', included ? 'text-success' : 'opacity-60')} />
						<span>{#if !included}<span class="sr-only">Not included: </span>{/if}{f.label}</span>
					</li>
				{/each}
			</ul>
		{/if}
		{#if cta}
			<Button variant={highlighted ? 'primary' : 'outline'} fullWidth href={cta.href} onclick={cta.onclick} size="lg">{cta.label}</Button>
		{/if}
	</div>
</Card>
