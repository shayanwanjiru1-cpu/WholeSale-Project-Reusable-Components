<script lang="ts">
	import Button from '../../ui/Button.svelte';
	import Icon from '../../ui/Icon.svelte';
	import { cn } from '$lib/utils/cn';

	/** Page navigation with range summary. Usable with DataTable or any paged list. */
	interface Props {
		page?: number;
		pageSize?: number;
		total: number;
		pageSizeOptions?: number[];
		/** Max numbered buttons shown on larger screens. */
		siblings?: number;
		label?: string;
		class?: string;
	}

	let { page = $bindable(1), pageSize = $bindable(10), total, pageSizeOptions, siblings = 1, label = 'Pagination', class: className }: Props = $props();

	const uid = $props.id();
	const pageCount = $derived(Math.max(1, Math.ceil(total / pageSize)));
	const from = $derived(total === 0 ? 0 : (page - 1) * pageSize + 1);
	const to = $derived(Math.min(page * pageSize, total));

	const pages = $derived.by(() => {
		const out: (number | '…')[] = [];
		const start = Math.max(2, page - siblings);
		const end = Math.min(pageCount - 1, page + siblings);
		out.push(1);
		if (start > 2) out.push('…');
		for (let p = start; p <= end; p++) out.push(p);
		if (end < pageCount - 1) out.push('…');
		if (pageCount > 1) out.push(pageCount);
		return out;
	});

	function go(p: number) {
		page = Math.min(Math.max(1, p), pageCount);
	}
</script>

<div class={cn('flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between', className)}>
	<div class="flex flex-wrap items-center gap-4 text-muted-foreground">
		<p aria-live="polite">Showing <span class="font-medium text-foreground">{from}–{to}</span> of <span class="font-medium text-foreground">{total}</span></p>
		{#if pageSizeOptions?.length}
			<label class="flex items-center gap-2" for="page-size-{uid}">
				Rows per page
				<select id="page-size-{uid}" class="focus-ring h-8 rounded-md border border-border-strong bg-surface px-2 text-foreground" bind:value={pageSize} onchange={() => (page = 1)}>
					{#each pageSizeOptions as opt (opt)}<option value={opt}>{opt}</option>{/each}
				</select>
			</label>
		{/if}
	</div>
	<nav aria-label={label} class="flex items-center gap-1">
		<Button variant="outline" size="icon-sm" aria-label="Previous page" disabled={page <= 1} onclick={() => go(page - 1)}>
			<Icon name="chevron-left" class="size-4" />
		</Button>
		<span class="px-2 text-muted-foreground sm:hidden">Page {page} of {pageCount}</span>
		<ul class="hidden items-center gap-1 sm:flex">
			{#each pages as p, i (i)}
				<li>
					{#if p === '…'}
						<span class="grid size-8 place-items-center text-muted-foreground" aria-hidden="true">…</span>
					{:else}
						<button
							type="button"
							class={cn('focus-ring size-8 rounded-md text-sm font-medium tabular-nums', p === page ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted')}
							aria-current={p === page ? 'page' : undefined}
							aria-label="Page {p}"
							onclick={() => go(p)}
						>{p}</button>
					{/if}
				</li>
			{/each}
		</ul>
		<Button variant="outline" size="icon-sm" aria-label="Next page" disabled={page >= pageCount} onclick={() => go(page + 1)}>
			<Icon name="chevron-right" class="size-4" />
		</Button>
	</nav>
</div>
