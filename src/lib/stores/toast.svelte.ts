import type { Tone } from '$lib/types';

export interface Toast {
	id: number;
	title: string;
	description?: string;
	tone: Tone;
	action?: { label: string; href: string };
}

/** Transient notifications, announced politely by <Toaster />. */
class ToastStore {
	items = $state<Toast[]>([]);
	#id = 0;

	show(toast: Omit<Toast, 'id' | 'tone'> & { tone?: Tone }, duration = 4500) {
		const id = ++this.#id;
		this.items = [...this.items.slice(-2), { tone: 'success', ...toast, id }];
		if (duration > 0) setTimeout(() => this.dismiss(id), duration);
		return id;
	}

	dismiss(id: number) {
		this.items = this.items.filter((t) => t.id !== id);
	}
}

export const toasts = new ToastStore();
