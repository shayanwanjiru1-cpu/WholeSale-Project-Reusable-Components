<script lang="ts">
	import Dropdown from './Dropdown.svelte';
	import Button from './Button.svelte';
	import type { ButtonVariant } from './Button.svelte';
	import { theme, type ThemePreference } from '$lib/stores/theme.svelte';

	/**
	 * Theme switcher.
	 *  - `menu`: Light / Dark / System dropdown (persists the choice)
	 *  - `toggle`: single button flipping light ↔ dark
	 */
	interface Props {
		variant?: 'menu' | 'toggle';
		buttonVariant?: ButtonVariant;
		class?: string;
	}

	let { variant = 'menu', buttonVariant = 'ghost', class: className }: Props = $props();

	const labels: Record<ThemePreference, string> = { light: 'Light', dark: 'Dark', system: 'System' };
	const icon = $derived(theme.resolved === 'dark' ? 'moon' : 'sun');
	const items = $derived(
		(['light', 'dark', 'system'] as ThemePreference[]).map((p) => ({
			label: `${labels[p]}${theme.preference === p ? ' (current)' : ''}`,
			icon: theme.preference === p ? ('check' as const) : p === 'light' ? ('sun' as const) : p === 'dark' ? ('moon' as const) : ('monitor' as const),
			onSelect: () => theme.set(p)
		}))
	);
</script>

{#if variant === 'toggle'}
	<Button
		variant={buttonVariant}
		size="icon"
		iconLeft={icon}
		aria-label={theme.resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
		aria-pressed={theme.resolved === 'dark'}
		class={className}
		onclick={() => theme.toggle()}
	/>
{:else}
	<Dropdown
		{items}
		trigger="click"
		align="right"
		iconOnly
		triggerIcon={icon}
		triggerVariant={buttonVariant}
		label="Theme: {labels[theme.preference]}"
		class={className}
	/>
{/if}
