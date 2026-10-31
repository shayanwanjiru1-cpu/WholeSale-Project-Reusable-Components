<script lang="ts">
	import type { Snippet } from 'svelte';
	import Container from './Container.svelte';
	import Icon from '../ui/Icon.svelte';
	import type { FooterColumn, LinkItem, SocialLink } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	interface Props {
		variant?: 'default' | 'muted' | 'dark';
		/** Brand block (usually a <Logo />). */
		brand?: Snippet;
		description?: string;
		columns?: FooterColumn[];
		contact?: { email?: string; phone?: string; address?: string };
		social?: SocialLink[];
		legal?: LinkItem[];
		copyright?: string;
		/** Extra content in the brand column (newsletter form, badges...). */
		extra?: Snippet;
		class?: string;
	}

	let {
		variant = 'default',
		brand,
		description,
		columns = [],
		contact,
		social = [],
		legal = [],
		copyright,
		extra,
		class: className
	}: Props = $props();

	const variants = {
		default: 'bg-surface border-t border-border',
		muted: 'bg-muted',
		dark: 'theme-dark bg-background'
	};
	const colClasses = ['lg:grid-cols-1', 'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4'];
	const link = 'focus-ring rounded text-sm text-muted-foreground transition-colors hover:text-foreground';
</script>

<footer class={cn(variants[variant], className)}>
	<Container class="py-12 lg:py-16">
		<div class="grid gap-10 lg:grid-cols-12 lg:gap-8">
			<div class="flex flex-col gap-4 lg:col-span-4">
				{@render brand?.()}
				{#if description}<p class="max-w-sm text-sm text-muted-foreground">{description}</p>{/if}
				{#if contact}
					<address class="flex flex-col gap-2 text-sm not-italic">
						{#if contact.email}
							<a href="mailto:{contact.email}" class={cn(link, 'inline-flex items-center gap-2')}><Icon name="mail" class="size-4" />{contact.email}</a>
						{/if}
						{#if contact.phone}
							<a href="tel:{contact.phone.replace(/[^+\d]/g, '')}" class={cn(link, 'inline-flex items-center gap-2')}><Icon name="phone" class="size-4" />{contact.phone}</a>
						{/if}
						{#if contact.address}
							<span class="inline-flex items-start gap-2 text-muted-foreground"><Icon name="map-pin" class="mt-0.5 size-4" />{contact.address}</span>
						{/if}
					</address>
				{/if}
				{@render extra?.()}
			</div>

			{#if columns.length}
				<nav aria-label="Footer" class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 {colClasses[Math.min(columns.length, 4) - 1]}">
					{#each columns as column (column.title)}
						<div>
							<h2 class="text-sm font-semibold text-foreground">{column.title}</h2>
							<ul class="mt-4 flex flex-col gap-3">
								{#each column.links as item (item.href + item.label)}
									<li>
										<a href={item.href} class={link} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined}>
											{item.label}{#if item.external}<span class="sr-only"> (opens in new tab)</span>{/if}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</nav>
			{/if}
		</div>

		<div class="mt-12 flex flex-col-reverse gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
				{#if copyright}<p class="text-sm text-muted-foreground">{copyright}</p>{/if}
				{#if legal.length}
					<ul class="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal">
						{#each legal as item (item.href + item.label)}
							<li><a href={item.href} class={link}>{item.label}</a></li>
						{/each}
					</ul>
				{/if}
			</div>
			{#if social.length}
				<ul class="flex gap-1" aria-label="Social media">
					{#each social as item (item.href + item.label)}
						<li>
							<a href={item.href} class="focus-ring grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={item.label} target="_blank" rel="noopener noreferrer">
								<Icon name={item.icon} class="size-5" />
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</Container>
</footer>
