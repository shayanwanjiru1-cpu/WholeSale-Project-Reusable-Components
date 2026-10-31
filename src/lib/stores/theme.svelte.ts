export type ThemePreference = 'light' | 'dark' | 'system';

const KEY = 'ws-theme'; // keep in sync with the inline script in app.html

/**
 * Light / dark / system theme. The inline script in app.html applies the initial
 * class before paint; this store takes over after hydration (toggle, persistence,
 * live system-preference changes).
 */
class ThemeStore {
	preference = $state<ThemePreference>('system');
	systemDark = $state(false);
	resolved = $derived<'light' | 'dark'>(
		this.preference === 'system' ? (this.systemDark ? 'dark' : 'light') : this.preference
	);
	#media: MediaQueryList | undefined;

	init() {
		if (this.#media) return;
		this.#media = window.matchMedia('(prefers-color-scheme: dark)');
		this.systemDark = this.#media.matches;
		this.#media.addEventListener('change', (e) => {
			this.systemDark = e.matches;
			this.#apply();
		});
		try {
			const saved = localStorage.getItem(KEY);
			if (saved === 'light' || saved === 'dark' || saved === 'system') this.preference = saved;
		} catch {
			/* ignore */
		}
		this.#apply();
	}

	set(pref: ThemePreference) {
		this.preference = pref;
		try {
			localStorage.setItem(KEY, pref);
		} catch {
			/* storage unavailable: preference lasts for this session */
		}
		this.#apply();
	}

	toggle() {
		this.set(this.resolved === 'dark' ? 'light' : 'dark');
	}

	#apply() {
		document.documentElement.classList.toggle('theme-dark', this.resolved === 'dark');
	}
}

export const theme = new ThemeStore();
