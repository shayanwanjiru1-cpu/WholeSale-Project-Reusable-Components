<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../ui/Icon.svelte';
	import type { TabItem } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	/**
	 * WAI-ARIA tabs. Arrow keys / Home / End move between tabs; with
	 * `activation="automatic"` focus also selects. The list scrolls horizontally
	 * when tabs overflow on small screens.
	 */
	interface Props {
		tabs: TabItem[];
		value?: string;
		variant?: 'default' | 'underline' | 'pills' | 'boxed';
		size?: 'sm' | 'md';
		fullWidth?: boolean;
		activation?: 'automatic' | 'manual';
		label?: string;
		/** Panel content; called for each tab. */
		panel: Snippet<[TabItem]>;
		onchange?: (value: string) => void;
		class?: string;
		panelClass?: string;
	}

	let {
		tabs,
		value = $bindable(tabs.find((t) => !t.disabled)?.id ?? ''),
		variant = 'default',
		size = 'md',
		fullWidth = false,
		activation = 'automatic',
		label,
		panel,
		onchange,
		class: className,
		panelClass
	}: Props = $props();

	const uid = $props.id();
	let list: HTMLDivElement;

	function select(id: string) {
		if (value === id) return;
		value = id;
		onchange?.(id);
	}

	function onkeydown(e: KeyboardEvent) {
		const enabled = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'));
		const idx = enabled.indexOf(document.activeElement as HTMLButtonElement);
		let next: HTMLButtonElement | undefined;
		if (e.key === 'ArrowRight') next = enabled[(idx + 1) % enabled.length];
		else if (e.key === 'ArrowLeft') next = enabled[(idx - 1 + enabled.length) % enabled.length];
		else if (e.key === 'Home') next = enabled[0];
		else if (e.key === 'End') next = enabled[enabled.length - 1];
		if (!next) return;
		e.preventDefault();
		next.focus();
		next.scrollIntoView({ block: 'nearest', inline: 'nearest' });
		if (activation === 'automatic') select(next.dataset.tabId!);
	}

	const listStyles = {
		default: 'gap-1 border-b border-border',
		underline: 'gap-6 border-b border-border',
		pills: 'gap-1',
		boxed: 'gap-1 rounded-lg bg-muted p-1'
	};
	const tabStyles = (selected: boolean) =>
		({
			default: cn('-mb-px rounded-t-md border border-b-0 px-4', selected ? 'border-border bg-surface text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'),
			underline: cn('-mb-px border-b-2 px-0.5', selected ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:border-border-strong hover:text-foreground'),
			pills: cn('rounded-full px-4', selected ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'),
			boxed: cn('rounded-md px-4', selected ? 'bg-surface text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground')
		})[variant];
</script>

<div class={className}>
	<div class="-mx-1 overflow-x-auto px-1 [scrollbar-width:thin]">
		<div
			bind:this={list}
			role="tablist"
			aria-label={label}
			tabindex="-1"
			class={cn('flex min-w-max', listStyles[variant], fullWidth && 'min-w-full [&>*]:flex-1')}
			{onkeydown}
		>
			{#each tabs as tab (tab.id)}
				{@const selected = tab.id === value}
				<button
					type="button"
					role="tab"
					id="tab-{uid}-{tab.id}"
					data-tab-id={tab.id}
					aria-selected={selected}
					aria-controls="panel-{uid}-{tab.id}"
					tabindex={selected ? 0 : -1}
					disabled={tab.disabled}
					class={cn(
						'focus-ring inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50',
						size === 'sm' ? 'h-9 text-sm' : 'h-11 text-sm',
						tabStyles(selected)
					)}
					onclick={() => select(tab.id)}
				>
					{#if tab.icon}<Icon name={tab.icon} class="size-4" />{/if}
					{tab.label}
					{#if tab.badge !== undefined}
						<span class={cn('rounded-full px-1.5 text-xs', selected && variant === 'pills' ? 'bg-white/20' : 'bg-muted text-muted-foreground')}>{tab.badge}</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>
	{#each tabs as tab (tab.id)}
		<div
			role="tabpanel"
			id="panel-{uid}-{tab.id}"
			aria-labelledby="tab-{uid}-{tab.id}"
			hidden={tab.id !== value}
			tabindex="0"
			class={cn('focus-ring rounded-md pt-4', panelClass)}
		>
			{#if tab.id === value}{@render panel(tab)}{/if}
		</div>
	{/each}
</div>
