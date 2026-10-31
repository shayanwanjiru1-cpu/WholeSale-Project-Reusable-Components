<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import type { MegaMenuContent } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/**
	 * Data-driven mega menu panel: grouped link columns plus optional featured card.
	 * NavigationMenu renders it for items with `mega`; it can also be used standalone.
	 */
	interface Props {
		content: MegaMenuContent;
		onnavigate?: () => void;
		class?: string;
	}

	let { content, onnavigate, class: className }: Props = $props();
	const uid = $props.id();
	const cols = ['sm:grid-cols-1', 'sm:grid-cols-2', 'sm:grid-cols-2 lg:grid-cols-3', 'sm:grid-cols-2 lg:grid-cols-4'];
</script>

<div class={cn('grid gap-8 rounded-card border border-border bg-surface p-6 shadow-raised', content.featured && 'lg:grid-cols-[1fr_18rem]', className)}>
	<div class={cn('grid gap-8', cols[Math.min(content.groups.length, 4) - 1])}>
		{#each content.groups as group, gi (group.heading)}
			<div>
				<p id="mega-{uid}-{gi}" class="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{group.heading}</p>
				<ul aria-labelledby="mega-{uid}-{gi}" class="flex flex-col gap-1">
					{#each group.links as link (link.href + link.label)}
						<li>
							<a href={link.href} onclick={onnavigate} class="focus-ring group -mx-2 flex gap-3 rounded-md p-2 hover:bg-muted">
								{#if link.icon}
									<span class="grid size-9 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
										<Icon name={link.icon} class="size-4" />
									</span>
								{/if}
								<span class="flex flex-col">
									<span class="text-sm font-medium text-foreground">{link.label}</span>
									{#if link.description}<span class="text-xs text-muted-foreground">{link.description}</span>{/if}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
	{#if content.featured}
		{@const f = content.featured}
		<a href={f.href} onclick={onnavigate} class="focus-ring group flex flex-col overflow-hidden rounded-lg bg-muted">
			{#if f.image}
				<img src={f.image} alt={f.imageAlt ?? ''} class="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" loading="lazy" />
			{/if}
			<span class="flex flex-1 flex-col gap-1 p-4">
				<span class="text-sm font-semibold text-foreground">{f.title}</span>
				{#if f.description}<span class="text-xs text-muted-foreground">{f.description}</span>{/if}
				<span class="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary-text">
					{f.cta ?? 'Learn more'}<Icon name="arrow-right" class="size-4 transition-transform group-hover:translate-x-0.5" />
				</span>
			</span>
		</a>
	{/if}
</div>
