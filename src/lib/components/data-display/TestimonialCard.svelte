<script lang="ts">
	import Card from './Card.svelte';
	import Avatar from '../ui/Avatar.svelte';
	import Icon from '../ui/Icon.svelte';
	import RatingDisplay from './RatingDisplay.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		quote: string;
		author: { name: string; role?: string; company?: string; avatar?: string };
		rating?: number;
		variant?: 'default' | 'featured';
		class?: string;
	}

	let { quote, author, rating, variant = 'default', class: className }: Props = $props();
	const featured = $derived(variant === 'featured');
	const subtitle = $derived([author.role, author.company].filter(Boolean).join(', '));
</script>

<Card variant={featured ? 'elevated' : 'default'} class={cn(featured && 'bg-accent', className)}>
	<figure class="flex h-full flex-col gap-4 p-6">
		<div class="flex items-center justify-between">
			<Icon name="quote" class="size-8 text-primary-text/30" filled strokeWidth={0} />
			{#if rating !== undefined}<RatingDisplay value={rating} size="sm" />{/if}
		</div>
		<blockquote class={cn('flex-1 text-pretty text-foreground', featured ? 'text-lg font-medium' : 'text-base')}>
			<p>“{quote}”</p>
		</blockquote>
		<figcaption class="flex items-center gap-3">
			<Avatar name={author.name} src={author.avatar} size="md" labelled={false} />
			<div>
				<div class="text-sm font-semibold text-foreground">{author.name}</div>
				{#if subtitle}<div class="text-sm text-muted-foreground">{subtitle}</div>{/if}
			</div>
		</figcaption>
	</figure>
</Card>
