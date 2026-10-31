<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import Icon from '../ui/Icon.svelte';
	import MegaMenu from './MegaMenu.svelte';
	import type { NavItem } from '$lib/types';
	import { Disclosure, type TriggerMode } from '$lib/utils/disclosure.svelte';
	import { clickOutside, moveFocus } from '$lib/utils/actions';
	import { cn } from '$lib/utils/cn';

	/** One top-level entry of NavigationMenu: a link, a dropdown, or a mega menu. */
	interface Props {
		item: NavItem;
		activeHref?: string;
		trigger: TriggerMode;
		open: boolean;
	}

	let { item, activeHref, trigger, open = $bindable(false) }: Props = $props();

	const uid = $props.id();
	const panelId = `nav-panel-${uid}`;
	let wrapper = $state<HTMLLIElement>();
	let button: HTMLButtonElement | undefined = $state();

	const disclosure = new Disclosure({ getOpen: () => open, setOpen: (v) => (open = v), mode: () => trigger });
	onDestroy(() => disclosure.destroy());

	const isActive = (i: NavItem): boolean =>
		i.href === activeHref || (i.children ?? []).some(isActive) || (i.mega?.groups ?? []).some((g) => g.links.some((l) => l.href === activeHref));

	const links = () => Array.from(wrapper!.querySelectorAll<HTMLElement>(`#${panelId} a`));

	function close(returnFocus: boolean) {
		disclosure.hide();
		if (returnFocus) button?.focus();
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			e.preventDefault();
			close(true);
		} else if (e.key === 'ArrowDown' && e.target === button) {
			e.preventDefault();
			if (!open) disclosure.show('keyboard');
			tick().then(() => links()[0]?.focus());
		} else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && e.target !== button) {
			e.preventDefault();
			moveFocus(links(), document.activeElement, e.key);
		}
	}

	const linkClass = (active: boolean) =>
		cn(
			'focus-ring inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors motion-reduce:transition-none',
			active ? 'text-primary-text' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
		);
	const duration = $derived(prefersReducedMotion.current ? 0 : 120);
</script>

{#if !item.children && !item.mega}
	<li>
		<a
			href={item.href}
			class={linkClass(item.href === activeHref)}
			aria-current={item.href === activeHref ? 'page' : undefined}
			target={item.external ? '_blank' : undefined}
			rel={item.external ? 'noopener noreferrer' : undefined}
		>
			{#if item.icon}<Icon name={item.icon} class="size-4" />{/if}{item.label}
		</a>
	</li>
{:else}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<!-- Mega menu items are `static` so the panel positions against the Navbar container (full width). -->
	<li
		bind:this={wrapper}
		class={item.mega ? 'static' : 'relative'}
		onpointerenter={disclosure.pointerEnter}
		onpointerleave={disclosure.pointerLeave}
		onfocusout={(e) => open && e.relatedTarget && !wrapper?.contains(e.relatedTarget as Node) && disclosure.hide()}
		{onkeydown}
		use:clickOutside={() => open && close(false)}
	>
		<button
			bind:this={button}
			type="button"
			class={linkClass(isActive(item))}
			aria-expanded={open}
			aria-controls={panelId}
			disabled={item.disabled}
			onclick={disclosure.triggerClick}
		>
			{#if item.icon}<Icon name={item.icon} class="size-4" />{/if}
			{item.label}
			<Icon name="chevron-down" class={cn('size-4 transition-transform motion-reduce:transition-none', open && 'rotate-180')} />
		</button>
		{#if open}
			<div
				id={panelId}
				class={cn('absolute z-50 pt-2', item.mega ? 'inset-x-4 top-full sm:inset-x-6 lg:inset-x-8' : 'top-full left-0 w-72')}
				transition:fly={{ y: -4, duration }}
			>
				{#if item.mega}
					<MegaMenu content={item.mega} onnavigate={() => close(false)} />
				{:else}
					<ul class="flex flex-col gap-0.5 rounded-lg border border-border bg-surface p-1.5 shadow-raised">
						{#each item.children ?? [] as child, ci (ci)}
							<li>
								<a
									href={child.href}
									class="focus-ring flex gap-3 rounded-md px-3 py-2 hover:bg-muted"
									aria-current={child.href === activeHref ? 'page' : undefined}
									onclick={() => close(false)}
								>
									{#if child.icon}<Icon name={child.icon} class="mt-0.5 size-4 text-muted-foreground" />{/if}
									<span class="flex flex-col">
										<span class={cn('text-sm font-medium', child.href === activeHref ? 'text-primary-text' : 'text-foreground')}>{child.label}</span>
										{#if child.description}<span class="text-xs text-muted-foreground">{child.description}</span>{/if}
									</span>
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	</li>
{/if}
