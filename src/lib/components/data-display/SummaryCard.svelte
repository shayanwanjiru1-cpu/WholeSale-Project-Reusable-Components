<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from './Card.svelte';
	import CardHeader from './CardHeader.svelte';
	import CardBody from './CardBody.svelte';
	import CardFooter from './CardFooter.svelte';
	import type { HeadingLevel, KeyValueItem } from '$lib/types';

	/** Titled key/value rollup with an emphasised total (order summary, account overview). */
	interface Props {
		title: string;
		description?: string;
		items: KeyValueItem[];
		total?: KeyValueItem;
		headingLevel?: HeadingLevel;
		actions?: Snippet;
		class?: string;
	}

	let { title, description, items, total, headingLevel = 3, actions, class: className }: Props = $props();
</script>

<Card class={className}>
	<CardHeader {title} {description} {headingLevel} />
	<CardBody>
		<dl class="flex flex-col gap-3">
			{#each items as item (item.key)}
				<div class="flex items-baseline justify-between gap-4">
					<dt class="text-muted-foreground">{item.key}</dt>
					<dd class="text-right font-medium text-foreground tabular-nums">{item.value}</dd>
				</div>
			{/each}
			{#if total}
				<div class="mt-1 flex items-baseline justify-between gap-4 border-t border-border pt-3">
					<dt class="font-semibold text-foreground">{total.key}</dt>
					<dd class="text-lg font-bold text-foreground tabular-nums">{total.value}</dd>
				</div>
			{/if}
		</dl>
	</CardBody>
	{#if actions}<CardFooter align="stretch">{@render actions()}</CardFooter>{/if}
</Card>
