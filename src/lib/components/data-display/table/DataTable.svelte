<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import type { Action } from 'svelte/action';
	import Icon from '../../ui/Icon.svelte';
	import Skeleton from '../../feedback/Skeleton.svelte';
	import EmptyState from '../../feedback/EmptyState.svelte';
	import TablePagination from './TablePagination.svelte';
	import type { SortState, TableColumn } from '$lib/types';
	import { getCellValue, nextSort, paginate, sortRows } from '$lib/utils/table';
	import { cn } from '$lib/utils/cn';

	/**
	 * Data table with sorting, selection, expandable rows, row actions, loading/empty
	 * states, optional pagination and two responsive strategies:
	 *  - `scroll`: horizontal scroll + per-column `hideBelow`
	 *  - `stack`: real table on md+, card list on small screens
	 */
	interface Props {
		columns: TableColumn<T>[];
		rows: T[];
		rowKey: (row: T) => string | number;
		/** Accessible table caption (visually hidden unless `showCaption`). */
		caption: string;
		showCaption?: boolean;
		sort?: SortState | null;
		/** `manual`: emit sort changes only; the parent sorts (e.g. server-side). */
		sortMode?: 'internal' | 'manual';
		onsortchange?: (sort: SortState | null) => void;
		selectable?: boolean;
		selected?: (string | number)[];
		/** Label used for the row's checkbox / action menu, e.g. the product name. */
		rowLabel?: (row: T) => string;
		expanded?: Snippet<[T]>;
		expandedKeys?: (string | number)[];
		rowActions?: Snippet<[T]>;
		loading?: boolean;
		loadingRows?: number;
		empty?: Snippet;
		emptyTitle?: string;
		emptyDescription?: string;
		responsive?: 'scroll' | 'stack';
		density?: 'compact' | 'default';
		striped?: boolean;
		stickyHeader?: boolean;
		pageSize?: number;
		page?: number;
		pageSizeOptions?: number[];
		class?: string;
	}

	let {
		columns,
		rows,
		rowKey,
		caption,
		showCaption = false,
		sort = $bindable(null),
		sortMode = 'internal',
		onsortchange,
		selectable = false,
		selected = $bindable([]),
		rowLabel,
		expanded,
		expandedKeys = $bindable([]),
		rowActions,
		loading = false,
		loadingRows = 5,
		empty,
		emptyTitle = 'No data',
		emptyDescription,
		responsive = 'scroll',
		density = 'default',
		striped = false,
		stickyHeader = false,
		pageSize = $bindable(),
		page = $bindable(1),
		pageSizeOptions,
		class: className
	}: Props = $props();

	const uid = $props.id();

	const sorted = $derived(sortMode === 'internal' ? sortRows(rows, columns, sort) : rows);
	const visible = $derived(pageSize ? paginate(sorted, page, pageSize) : sorted);
	const visibleKeys = $derived(visible.map(rowKey));
	const allSelected = $derived(visibleKeys.length > 0 && visibleKeys.every((k) => selected.includes(k)));
	const someSelected = $derived(!allSelected && visibleKeys.some((k) => selected.includes(k)));
	const colCount = $derived(columns.length + (selectable ? 1 : 0) + (expanded ? 1 : 0) + (rowActions ? 1 : 0));
	const primaryColumn = $derived(columns.find((c) => c.primary) ?? columns[0]);

	// Keep the page in range when data shrinks (e.g. after filtering).
	$effect(() => {
		if (!pageSize) return;
		const count = Math.max(1, Math.ceil(sorted.length / pageSize));
		if (page > count) page = count;
	});

	const indeterminate: Action<HTMLInputElement, boolean> = (node, value) => {
		node.indeterminate = Boolean(value);
		return { update: (v) => (node.indeterminate = Boolean(v)) };
	};

	function toggleSort(key: string) {
		sort = nextSort(sort, key);
		onsortchange?.(sort);
	}
	function toggleAll() {
		selected = allSelected ? selected.filter((k) => !visibleKeys.includes(k)) : [...new Set([...selected, ...visibleKeys])];
	}
	function toggleRow(key: string | number) {
		selected = selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key];
	}
	function toggleExpanded(key: string | number) {
		expandedKeys = expandedKeys.includes(key) ? expandedKeys.filter((k) => k !== key) : [...expandedKeys, key];
	}

	const labelOf = (row: T) => rowLabel?.(row) ?? String(getCellValue(row, primaryColumn) ?? rowKey(row));
	const hide = { sm: 'hidden sm:table-cell', md: 'hidden md:table-cell', lg: 'hidden lg:table-cell' };
	const align = { left: 'text-left', center: 'text-center', right: 'text-right' };
	const cellPad = $derived(density === 'compact' ? 'px-3 py-2' : 'px-4 py-3');
	const ariaSort = (key: string) => (sort?.key === key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none');
	const checkbox = 'focus-ring size-4 rounded border-border-strong accent-primary';
</script>

{#snippet cellContent(row: T, column: TableColumn<T>)}
	{#if column.cell}
		{@render column.cell(row)}
	{:else}
		{@const v = getCellValue(row, column)}
		{column.format ? column.format(v, row) : (v ?? '—')}
	{/if}
{/snippet}

{#snippet expandButton(row: T, key: string | number)}
	{@const isOpen = expandedKeys.includes(key)}
	<button
		type="button"
		class="focus-ring grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
		aria-expanded={isOpen}
		aria-controls="row-detail-{uid}-{key}"
		aria-label="{isOpen ? 'Hide' : 'Show'} details for {labelOf(row)}"
		onclick={() => toggleExpanded(key)}
	>
		<Icon name="chevron-right" class={cn('size-4 transition-transform motion-reduce:transition-none', isOpen && 'rotate-90')} />
	</button>
{/snippet}

<div class={cn('flex flex-col gap-4', className)}>
	<!-- Table (always on md+, on all sizes in scroll mode) -->
	<div class={cn('overflow-hidden rounded-card border border-border bg-surface', responsive === 'stack' && 'hidden md:block')}>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div class={cn('focus-ring overflow-x-auto', stickyHeader && 'max-h-[32rem] overflow-y-auto')} tabindex="0" role="region" aria-label={caption}>
			<table class="w-full border-collapse text-sm" aria-busy={loading}>
				<caption class={showCaption ? 'px-4 pt-4 text-left text-base font-semibold text-foreground' : 'sr-only'}>{caption}</caption>
				<thead class={cn('bg-muted text-xs font-semibold tracking-wide text-muted-foreground uppercase', stickyHeader && 'sticky top-0 z-10')}>
					<tr>
						{#if expanded}<th scope="col" class="w-12 px-2"><span class="sr-only">Expand</span></th>{/if}
						{#if selectable}
							<th scope="col" class="w-12 px-4">
								<input type="checkbox" class={checkbox} checked={allSelected} use:indeterminate={someSelected} aria-label="Select all rows on this page" onchange={toggleAll} disabled={loading || visible.length === 0} />
							</th>
						{/if}
						{#each columns as column (column.key)}
							<th
								scope="col"
								class={cn(cellPad, 'whitespace-nowrap', align[column.align ?? 'left'], column.hideBelow && hide[column.hideBelow], column.class)}
								aria-sort={column.sortable ? ariaSort(column.key) : undefined}
							>
								{#if column.sortable}
									<!-- SortableColumnHeader -->
									<button
										type="button"
										class={cn('focus-ring -mx-1 inline-flex items-center gap-1 rounded px-1 uppercase hover:text-foreground', sort?.key === column.key && 'text-foreground', column.align === 'right' && 'flex-row-reverse')}
										onclick={() => toggleSort(column.key)}
									>
										{column.header}
										<Icon name={sort?.key === column.key ? (sort.direction === 'asc' ? 'arrow-up' : 'arrow-down') : 'arrow-up-down'} class={cn('size-3.5', sort?.key !== column.key && 'opacity-50')} />
									</button>
								{:else}
									{column.header}
								{/if}
							</th>
						{/each}
						{#if rowActions}<th scope="col" class="w-14 px-4"><span class="sr-only">Actions</span></th>{/if}
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#if loading}
						{#each Array.from({ length: loadingRows }, (_, i) => i) as i (i)}
							<tr>
								{#each Array.from({ length: colCount }, (_, j) => j) as j (j)}
									<td class={cellPad}><Skeleton class="max-w-40" /></td>
								{/each}
							</tr>
						{/each}
					{:else if visible.length === 0}
						<tr>
							<td colspan={colCount} class="p-0">
								{#if empty}{@render empty()}{:else}<EmptyState title={emptyTitle} description={emptyDescription} appearance="plain" size="sm" />{/if}
							</td>
						</tr>
					{:else}
						{#each visible as row, ri (rowKey(row))}
							{@const key = rowKey(row)}
							{@const isSelected = selected.includes(key)}
							<tr class={cn('transition-colors hover:bg-muted/60 motion-reduce:transition-none', isSelected && 'bg-accent/60 hover:bg-accent', striped && ri % 2 === 1 && !isSelected && 'bg-muted/40')} aria-selected={selectable ? isSelected : undefined}>
								{#if expanded}<td class="px-2 py-1">{@render expandButton(row, key)}</td>{/if}
								{#if selectable}
									<td class="px-4"><input type="checkbox" class={checkbox} checked={isSelected} aria-label="Select {labelOf(row)}" onchange={() => toggleRow(key)} /></td>
								{/if}
								{#each columns as column (column.key)}
									{#if column === primaryColumn}
										<th scope="row" class={cn(cellPad, 'font-medium text-foreground', align[column.align ?? 'left'], column.hideBelow && hide[column.hideBelow], column.class)}>
											{@render cellContent(row, column)}
										</th>
									{:else}
										<td class={cn(cellPad, 'text-foreground', align[column.align ?? 'left'], column.align === 'right' && 'tabular-nums', column.hideBelow && hide[column.hideBelow], column.class)}>
											{@render cellContent(row, column)}
										</td>
									{/if}
								{/each}
								{#if rowActions}<td class="px-4 py-1 text-right">{@render rowActions(row)}</td>{/if}
							</tr>
							{#if expanded && expandedKeys.includes(key)}
								<!-- ExpandableRow -->
								<tr id="row-detail-{uid}-{key}" class="bg-muted/40">
									<td colspan={colCount} class="px-4 py-4 sm:px-6">{@render expanded(row)}</td>
								</tr>
							{/if}
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Stacked card layout for small screens -->
	{#if responsive === 'stack'}
		<div class="md:hidden" aria-busy={loading}>
			<p class={showCaption ? 'mb-3 text-base font-semibold' : 'sr-only'}>{caption}</p>
			{#if loading}
				<div class="flex flex-col gap-3">
					{#each Array.from({ length: Math.min(loadingRows, 3) }, (_, i) => i) as i (i)}<Skeleton shape="rect" class="h-28 rounded-card" />{/each}
				</div>
			{:else if visible.length === 0}
				{#if empty}{@render empty()}{:else}<EmptyState title={emptyTitle} description={emptyDescription} size="sm" />{/if}
			{:else}
				{#if selectable}
					<label class="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
						<input type="checkbox" class={checkbox} checked={allSelected} use:indeterminate={someSelected} onchange={toggleAll} /> Select all
					</label>
				{/if}
				<ul class="flex flex-col gap-3">
					{#each visible as row (rowKey(row))}
						{@const key = rowKey(row)}
						{@const isSelected = selected.includes(key)}
						<li class={cn('rounded-card border bg-surface p-4', isSelected ? 'border-primary' : 'border-border')}>
							<div class="flex items-start gap-3">
								{#if selectable}<input type="checkbox" class={cn(checkbox, 'mt-0.5')} checked={isSelected} aria-label="Select {labelOf(row)}" onchange={() => toggleRow(key)} />{/if}
								<div class="min-w-0 flex-1 text-sm font-semibold text-foreground">{@render cellContent(row, primaryColumn)}</div>
								{#if rowActions}{@render rowActions(row)}{/if}
							</div>
							<dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
								{#each columns.filter((c) => c !== primaryColumn) as column (column.key)}
									<div class="min-w-0">
										<dt class="text-xs text-muted-foreground">{column.header}</dt>
										<dd class="truncate text-foreground">{@render cellContent(row, column)}</dd>
									</div>
								{/each}
							</dl>
							{#if expanded}
								<div class="mt-3 border-t border-border pt-2">
									<button type="button" class="focus-ring flex w-full items-center gap-2 rounded py-1 text-sm font-medium text-primary-text" aria-expanded={expandedKeys.includes(key)} aria-controls="row-card-{uid}-{key}" onclick={() => toggleExpanded(key)}>
										<Icon name="chevron-right" class={cn('size-4 transition-transform', expandedKeys.includes(key) && 'rotate-90')} />
										{expandedKeys.includes(key) ? 'Hide details' : 'Show details'}
									</button>
									{#if expandedKeys.includes(key)}<div id="row-card-{uid}-{key}" class="pt-2">{@render expanded(row)}</div>{/if}
								</div>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}

	{#if pageSize && !loading && sorted.length > 0}
		<TablePagination bind:page bind:pageSize total={sorted.length} {pageSizeOptions} />
	{/if}
</div>
