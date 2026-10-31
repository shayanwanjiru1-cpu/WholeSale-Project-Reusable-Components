import type { SortState, TableColumn } from '$lib/types';

export function getCellValue<T>(row: T, column: TableColumn<T>): unknown {
	if (column.accessor) return column.accessor(row);
	return (row as Record<string, unknown>)[column.key];
}

function compare(a: unknown, b: unknown): number {
	if (a == null && b == null) return 0;
	if (a == null) return 1;
	if (b == null) return -1;
	if (typeof a === 'number' && typeof b === 'number') return a - b;
	if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
	return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function sortRows<T>(rows: T[], columns: TableColumn<T>[], sort: SortState | null): T[] {
	if (!sort) return rows;
	const column = columns.find((c) => c.key === sort.key);
	if (!column) return rows;
	const dir = sort.direction === 'asc' ? 1 : -1;
	return [...rows].sort((a, b) => compare(getCellValue(a, column), getCellValue(b, column)) * dir);
}

/** Case-insensitive search across the given columns (defaults to all). */
export function searchRows<T>(rows: T[], columns: TableColumn<T>[], query: string): T[] {
	const q = query.trim().toLowerCase();
	if (!q) return rows;
	return rows.filter((row) =>
		columns.some((c) => String(getCellValue(row, c) ?? '').toLowerCase().includes(q))
	);
}

export function paginate<T>(rows: T[], page: number, pageSize: number): T[] {
	const start = (page - 1) * pageSize;
	return rows.slice(start, start + pageSize);
}

export function nextSort(current: SortState | null, key: string): SortState | null {
	if (!current || current.key !== key) return { key, direction: 'asc' };
	if (current.direction === 'asc') return { key, direction: 'desc' };
	return null;
}
