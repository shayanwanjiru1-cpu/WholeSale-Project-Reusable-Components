export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
	return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export function formatNumber(value: number, locale = 'en-US', options?: Intl.NumberFormatOptions): string {
	return new Intl.NumberFormat(locale, options).format(value);
}

export function formatBytes(bytes: number, decimals = 1): string {
	if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
	return `${parseFloat((bytes / 1024 ** i).toFixed(decimals))} ${units[i]}`;
}

/** Up to two initials from a display name. */
export function initials(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return '?';
	const first = parts[0][0] ?? '';
	const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
	return (first + last).toUpperCase();
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function fileExtension(name: string): string {
	const idx = name.lastIndexOf('.');
	return idx > 0 ? name.slice(idx + 1).toLowerCase() : '';
}
