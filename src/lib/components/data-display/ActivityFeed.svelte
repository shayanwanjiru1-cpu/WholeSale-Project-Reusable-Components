<script lang="ts">
	import Avatar from '../ui/Avatar.svelte';
	import type { ActivityItem } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { toneDot } from '$lib/utils/tones';

	/** "Who did what, when" stream. */
	interface Props {
		items: ActivityItem[];
		label?: string;
		compact?: boolean;
		class?: string;
	}

	let { items, label = 'Recent activity', compact = false, class: className }: Props = $props();
</script>

<ul class={cn('flex flex-col', compact ? 'gap-3' : 'gap-5', className)} aria-label={label}>
	{#each items as item (item.id)}
		<li class="flex gap-3">
			<span class="relative shrink-0">
				<Avatar name={item.actor.name} src={item.actor.avatar} size={compact ? 'sm' : 'md'} labelled={false} />
				{#if item.tone}
					<span class={cn('absolute -right-0.5 -bottom-0.5 size-3 rounded-full ring-2 ring-surface', toneDot[item.tone])} aria-hidden="true"></span>
				{/if}
			</span>
			<div class="min-w-0 flex-1">
				<p class="text-sm text-muted-foreground">
					<span class="font-semibold text-foreground">{item.actor.name}</span>
					{item.action}
					{#if item.target}
						{#if item.href}
							<a href={item.href} class="focus-ring rounded font-medium text-primary-text hover:underline">{item.target}</a>
						{:else}
							<span class="font-medium text-foreground">{item.target}</span>
						{/if}
					{/if}
				</p>
				<time datetime={item.dateTime} class="text-xs text-muted-foreground">{item.timestamp}</time>
				{#if item.description && !compact}
					<p class="mt-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground">{item.description}</p>
				{/if}
			</div>
		</li>
	{/each}
</ul>
