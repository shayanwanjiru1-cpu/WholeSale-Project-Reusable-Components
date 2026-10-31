/**
 * Shared open/close controller for floating UI (Dropdown, NavigationMenu, Popover).
 * Handles click, hover and click-or-hover trigger modes without the two fighting:
 *  - hover only reacts to mouse pointers, so touch devices always fall back to tap
 *  - a click on a hover-opened panel "pins" it open instead of closing it
 *  - leaving the trigger + panel area only closes panels that hover opened
 */
export type TriggerMode = 'click' | 'hover' | 'click-or-hover';
export type OpenSource = 'click' | 'hover' | 'keyboard';

interface DisclosureOptions {
	getOpen: () => boolean;
	setOpen: (open: boolean) => void;
	mode: () => TriggerMode;
	openDelay?: () => number | undefined;
	closeDelay?: () => number | undefined;
	disabled?: () => boolean;
}

export class Disclosure {
	openedBy = $state<OpenSource | null>(null);
	#timer: ReturnType<typeof setTimeout> | undefined;
	#opts: DisclosureOptions;

	constructor(opts: DisclosureOptions) {
		this.#opts = opts;
	}

	get open() {
		return this.#opts.getOpen();
	}

	#clear() {
		if (this.#timer) clearTimeout(this.#timer);
		this.#timer = undefined;
	}

	show(source: OpenSource) {
		if (this.#opts.disabled?.()) return;
		this.#clear();
		this.openedBy = source;
		this.#opts.setOpen(true);
	}

	hide() {
		this.#clear();
		this.openedBy = null;
		this.#opts.setOpen(false);
	}

	/** Wire to the trigger's onclick. `event.detail === 0` means keyboard activation. */
	triggerClick = (event: MouseEvent) => {
		const source: OpenSource = event.detail === 0 ? 'keyboard' : 'click';
		const mode = this.#opts.mode();
		if (this.open && this.openedBy === 'hover' && source === 'click') {
			// Pin a hover-opened panel instead of closing it out from under the pointer.
			if (mode === 'click-or-hover') this.openedBy = 'click';
			return;
		}
		if (this.open) this.hide();
		else this.show(source);
	};

	/** Wire to pointerenter on the wrapper that contains trigger and panel. */
	pointerEnter = (event: PointerEvent) => {
		if (this.#opts.mode() === 'click' || event.pointerType !== 'mouse') return;
		this.#clear();
		if (this.open) return;
		this.#timer = setTimeout(() => this.show('hover'), this.#opts.openDelay?.() ?? 80);
	};

	/** Wire to pointerleave on the same wrapper. */
	pointerLeave = (event: PointerEvent) => {
		if (this.#opts.mode() === 'click' || event.pointerType !== 'mouse') return;
		this.#clear();
		if (!this.open) return;
		const mode = this.#opts.mode();
		const shouldClose =
			this.openedBy === 'hover' || (mode === 'hover' && this.openedBy === 'click');
		if (shouldClose) this.#timer = setTimeout(() => this.hide(), this.#opts.closeDelay?.() ?? 250);
	};

	destroy() {
		this.#clear();
	}
}
