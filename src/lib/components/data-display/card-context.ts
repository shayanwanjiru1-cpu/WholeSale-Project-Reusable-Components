import { getContext, setContext } from 'svelte';

export type CardSize = 'compact' | 'default' | 'spacious';
const KEY = Symbol('card');

export function setCardContext(ctx: { readonly size: CardSize }) {
	setContext(KEY, ctx);
}

export function getCardSize(): CardSize {
	return getContext<{ size: CardSize } | undefined>(KEY)?.size ?? 'default';
}

export const cardPadding: Record<CardSize, string> = {
	compact: 'p-4',
	default: 'p-5 sm:p-6',
	spacious: 'p-6 sm:p-8'
};
