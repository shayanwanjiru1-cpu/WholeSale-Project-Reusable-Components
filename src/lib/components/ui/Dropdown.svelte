<script lang="ts" module>
	import type { DropdownItem } from '$lib/types';
	export type DropdownTriggerProps = {
		id: string;
		'aria-haspopup': 'menu' | 'true';
		'aria-expanded': boolean;
		'aria-controls': string;
		'data-dropdown-trigger': '';
		disabled: boolean;
		onclick: (event: MouseEvent) => void;
		onkeydown: (event: KeyboardEvent) => void;
	};
	export type { DropdownItem };
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tick, onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import Button, { type ButtonSize, type ButtonVariant } from './Button.svelte';
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';
	import { clickOutside, moveFocus } from '$lib/utils/actions';
	import { Disclosure, type TriggerMode } from '$lib/utils/disclosure.svelte';
	import { floatingClasses, type Align } from '$lib/utils/position';
	import { cn } from '$lib/utils/cn';

	interface Props {
		/** Menu items. Omit and use `children` for custom panel content. */
		items?: DropdownItem[];
		/** How the menu opens. Keyboard (Enter/Space/Arrow keys) always works. */
		trigger?: TriggerMode;
		align?: Align;
		placement?: 'bottom' | 'top';
		open?: boolean;
		disabled?: boolean;
		/** Text for the default trigger button (also its aria-label when `iconOnly`). */
		label?: string;
		triggerIcon?: IconName;
		iconOnly?: boolean;
		showChevron?: boolean;
		triggerVariant?: ButtonVariant;
		triggerSize?: ButtonSize;
		/** Fully custom trigger: spread the given props onto your own <button>. */
		triggerContent?: Snippet<[DropdownTriggerProps]>;
		/** Custom panel content (rendered instead of `items`). Receives a close function. */
		children?: Snippet<[() => void]>;
		animated?: boolean;
		openDelay?: number;
		closeDelay?: number;
		onselect?: (item: DropdownItem) => void;
		class?: string;
		menuClass?: string;
	}

	let {
		items,
		trigger = 'click',
		align = 'left',
		placement = 'bottom',
		open = $bindable(false),
		disabled = false,
		label = 'Options',
		triggerIcon,
		iconOnly = false,
		showChevron = true,
		triggerVariant = 'outline',
		triggerSize,
		triggerContent,
		children,
		animated = true,
		openDelay,
		closeDelay,
		onselect,
		class: className,
		menuClass
	}: Props = $props();

	const uid = $props.id();
	const triggerId = `dropdown-trigger-${uid}`;
	const menuId = `dropdown-menu-${uid}`;
	let wrapper: HTMLDivElement;
	let menu: HTMLDivElement | undefined = $state();
	let pendingFocus: 'first' | 'last' | null = null;

	const disclosure = new Disclosure({
		getOpen: () => open,
		setOpen: (v) => (open = v),
		mode: () => trigger,
		openDelay: () => openDelay,
		closeDelay: () => closeDelay,
		disabled: () => disabled
	});
	onDestroy(() => disclosure.destroy());

	const isMenu = $derived(Boolean(items));
	const duration = $derived(animated && !prefersReducedMotion.current ? 120 : 0);

	function menuItems(): HTMLElement[] {
		return menu
			? Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'))
			: [];
	}

	function triggerEl(): HTMLElement | null {
		return wrapper?.querySelector<HTMLElement>('[data-dropdown-trigger]') ?? null;
	}

	function close(returnFocus = true) {
		disclosure.hide();
		if (returnFocus) triggerEl()?.focus();
	}

	// Move focus into the menu when it was opened from the keyboard.
	$effect(() => {
		if (!open || !isMenu) return;
		const target = pendingFocus ?? (disclosure.openedBy === 'keyboard' ? 'first' : null);
		pendingFocus = null;
		if (!target) return;
		tick().then(() => {
			const list = menuItems();
			(target === 'first' ? list[0] : list[list.length - 1])?.focus();
		});
	});

	function onTriggerKeydown(event: KeyboardEvent) {
		if (disabled) return;
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			pendingFocus = event.key === 'ArrowDown' ? 'first' : 'last';
			if (open) {
				const list = menuItems();
				(pendingFocus === 'first' ? list[0] : list[list.length - 1])?.focus();
				pendingFocus = null;
			} else disclosure.show('keyboard');
		} else if (event.key === 'Escape' && open) {
			event.preventDefault();
			close();
		}
	}

	function onMenuKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			event.stopPropagation();
			close();
		} else if (event.key === 'Tab') {
			close(false);
		} else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
			event.preventDefault();
			moveFocus(menuItems(), document.activeElement, event.key);
		} else if (event.key.length === 1 && /\S/.test(event.key)) {
			// Type-ahead: jump to the next item starting with the typed character.
			const list = menuItems();
			const start = list.indexOf(document.activeElement as HTMLElement);
			const ordered = [...list.slice(start + 1), ...list.slice(0, start + 1)];
			ordered.find((el) => el.textContent?.trim().toLowerCase().startsWith(event.key.toLowerCase()))?.focus();
		}
	}

	function selectItem(item: DropdownItem) {
		if (item.type === 'divider' || item.type === 'label' || item.disabled) return;
		item.onSelect?.();
		onselect?.(item);
		close(!item.href);
	}

	const triggerProps: DropdownTriggerProps = $derived({
		id: triggerId,
		'aria-haspopup': isMenu ? 'menu' : 'true',
		'aria-expanded': open,
		'aria-controls': menuId,
		'data-dropdown-trigger': '',
		disabled,
		onclick: disclosure.triggerClick,
		onkeydown: onTriggerKeydown
	});
</script>

<div
	bind:this={wrapper}
	class={cn('relative inline-block text-left', className)}
	role="presentation"
	onpointerenter={disclosure.pointerEnter}
	onpointerleave={disclosure.pointerLeave}
	use:clickOutside={() => open && close(false)}
	onfocusout={(e) => {
		if (open && e.relatedTarget && !wrapper.contains(e.relatedTarget as Node)) disclosure.hide();
	}}
>
	{#if triggerContent}
		{@render triggerContent(triggerProps)}
	{:else}
		<Button
			{...triggerProps}
			variant={triggerVariant}
			size={triggerSize ?? (iconOnly ? 'icon' : 'md')}
			aria-label={iconOnly ? label : undefined}
		>
			{#if triggerIcon}<Icon name={triggerIcon} class="size-4" />{/if}
			{#if !iconOnly}{label}{/if}
			{#if showChevron && !iconOnly}
				<Icon
					name="chevron-down"
					class={cn('size-4 transition-transform motion-reduce:transition-none', open && 'rotate-180')}
				/>
			{/if}
		</Button>
	{/if}

	{#if open}
		<div class={cn('absolute z-50', floatingClasses(placement, align))}>
			<div
				bind:this={menu}
				id={menuId}
				role={isMenu ? 'menu' : undefined}
				aria-labelledby={triggerId}
				tabindex="-1"
				class={cn(
					'min-w-48 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-surface p-1 text-sm text-foreground shadow-raised outline-none',
					menuClass
				)}
				onkeydown={isMenu ? onMenuKeydown : (e) => e.key === 'Escape' && close()}
				transition:fly={{ y: placement === 'top' ? 4 : -4, duration }}
			>
				{#if items}
					{#each items as item, i (i)}
						{#if item.type === 'divider'}
							<div role="separator" class="my-1 h-px bg-border"></div>
						{:else if item.type === 'label'}
							<div role="presentation" class="px-2.5 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{item.label}</div>
						{:else}
							{@const itemClass = cn(
								'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left outline-none select-none',
								'hover:bg-muted focus-visible:bg-muted focus-visible:outline-none',
								item.destructive ? 'text-danger' : 'text-foreground',
								item.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
							)}
							{#if item.href && !item.disabled}
								<a role="menuitem" tabindex="-1" href={item.href} class={itemClass} onclick={() => selectItem(item)}>
									{#if item.icon}<Icon name={item.icon} class="size-4 opacity-80" />{/if}
									<span class="flex-1">{item.label}</span>
									{#if item.shortcut}<kbd class="font-sans text-xs text-muted-foreground">{item.shortcut}</kbd>{/if}
								</a>
							{:else}
								<button
									type="button"
									role="menuitem"
									tabindex="-1"
									aria-disabled={item.disabled ? 'true' : undefined}
									class={itemClass}
									onclick={() => selectItem(item)}
								>
									{#if item.icon}<Icon name={item.icon} class="size-4 opacity-80" />{/if}
									<span class="flex-1">{item.label}</span>
									{#if item.shortcut}<kbd class="font-sans text-xs text-muted-foreground">{item.shortcut}</kbd>{/if}
								</button>
							{/if}
						{/if}
					{/each}
				{:else}
					{@render children?.(() => close())}
				{/if}
			</div>
		</div>
	{/if}
</div>
