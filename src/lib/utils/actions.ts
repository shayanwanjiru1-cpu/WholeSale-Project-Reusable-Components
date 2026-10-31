import type { Action } from 'svelte/action';

/** Calls `handler` when a pointerdown happens outside the node. */
export const clickOutside: Action<HTMLElement, (event: PointerEvent) => void> = (node, handler) => {
	let current = handler;
	const onPointerDown = (event: PointerEvent) => {
		if (!node.contains(event.target as Node)) current(event);
	};
	document.addEventListener('pointerdown', onPointerDown, true);
	return {
		update(next) {
			current = next;
		},
		destroy() {
			document.removeEventListener('pointerdown', onPointerDown, true);
		}
	};
};

/** Prevents the page behind an open overlay from scrolling. Pass `true` to lock. */
export const lockScroll: Action<HTMLElement, boolean> = (_node, locked) => {
	const root = document.documentElement;
	let previous = '';
	let active = false;
	const apply = (on: boolean) => {
		if (on && !active) {
			previous = root.style.overflow;
			root.style.overflow = 'hidden';
			active = true;
		} else if (!on && active) {
			root.style.overflow = previous;
			active = false;
		}
	};
	apply(Boolean(locked));
	return {
		update: (next) => apply(Boolean(next)),
		destroy: () => apply(false)
	};
};

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function focusableWithin(node: HTMLElement): HTMLElement[] {
	return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
		(el) => !el.hasAttribute('inert') && el.offsetParent !== null
	);
}

/** Roving focus helper for menus / tab lists / accordion headers. */
export function moveFocus(
	items: HTMLElement[],
	current: Element | null,
	key: string,
	orientation: 'vertical' | 'horizontal' = 'vertical'
): HTMLElement | undefined {
	if (items.length === 0) return;
	const next = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
	const prev = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
	const idx = items.indexOf(current as HTMLElement);
	let target: HTMLElement | undefined;
	if (key === next) target = items[(idx + 1) % items.length];
	else if (key === prev) target = items[(idx - 1 + items.length) % items.length];
	else if (key === 'Home') target = items[0];
	else if (key === 'End') target = items[items.length - 1];
	target?.focus();
	return target;
}
