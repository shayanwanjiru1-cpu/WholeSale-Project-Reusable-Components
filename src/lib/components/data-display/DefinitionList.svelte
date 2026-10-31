<script lang="ts">
	import { cn } from '$lib/utils/cn';

	/**
	 * Glossary-style definitions: a term with one or more definitions, each term
	 * linkable by id. Distinct from DescriptionList, which is for attribute data.
	 */
	interface Props {
		terms: { term: string; definitions: string[]; id?: string }[];
		class?: string;
	}

	let { terms, class: className }: Props = $props();
</script>

<dl class={cn('flex flex-col gap-5 text-sm', className)}>
	{#each terms as t (t.term)}
		<div class="border-l-2 border-primary/40 pl-4">
			<dt id={t.id} class="scroll-mt-24 text-base font-semibold text-foreground">{t.term}</dt>
			{#each t.definitions as d, i (i)}
				<dd class={cn('text-muted-foreground', i === 0 ? 'mt-1' : 'mt-2')}>
					{#if t.definitions.length > 1}<span class="mr-1 font-medium text-foreground">{i + 1}.</span>{/if}{d}
				</dd>
			{/each}
		</div>
	{/each}
</dl>
