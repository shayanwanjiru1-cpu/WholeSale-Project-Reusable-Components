<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from './Card.svelte';
	import Heading from '../layout/Heading.svelte';
	import Avatar from '../ui/Avatar.svelte';
	import Icon from '../ui/Icon.svelte';
	import type { HeadingLevel } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	interface Props {
		name: string;
		role?: string;
		avatar?: string;
		bio?: string;
		location?: string;
		stats?: { label: string; value: string | number }[];
		layout?: 'vertical' | 'horizontal';
		headingLevel?: HeadingLevel;
		actions?: Snippet;
		class?: string;
	}

	let { name, role, avatar, bio, location, stats = [], layout = 'vertical', headingLevel = 3, actions, class: className }: Props = $props();
	const vertical = $derived(layout === 'vertical');
</script>

<Card as="article" class={className}>
	<div class={cn('flex gap-4 p-6', vertical ? 'flex-col items-center text-center' : 'flex-col sm:flex-row sm:items-start')}>
		<Avatar {name} src={avatar} size={vertical ? 'xl' : 'lg'} labelled={false} />
		<div class="flex min-w-0 flex-1 flex-col gap-1">
			<Heading level={headingLevel} class="text-lg font-semibold text-foreground">{name}</Heading>
			{#if role}<p class="text-sm text-muted-foreground">{role}</p>{/if}
			{#if location}
				<p class={cn('flex items-center gap-1 text-sm text-muted-foreground', vertical && 'justify-center')}><Icon name="map-pin" class="size-4" />{location}</p>
			{/if}
			{#if bio}<p class="mt-2 text-sm text-pretty text-foreground">{bio}</p>{/if}
		</div>
	</div>
	{#if stats.length}
		<dl class="grid border-t border-border" style:grid-template-columns="repeat({stats.length}, minmax(0, 1fr))">
			{#each stats as s, i (s.label)}
				<div class={cn('flex flex-col-reverse items-center gap-0.5 py-4', i > 0 && 'border-l border-border')}>
					<dt class="text-xs text-muted-foreground">{s.label}</dt>
					<dd class="text-lg font-semibold tabular-nums">{s.value}</dd>
				</div>
			{/each}
		</dl>
	{/if}
	{#if actions}<div class="flex gap-2 border-t border-border p-4 [&>*]:flex-1">{@render actions()}</div>{/if}
</Card>
