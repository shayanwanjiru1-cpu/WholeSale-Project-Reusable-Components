<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	/** Checkbox with label, optional description and trailing meta (e.g. a facet count). */
	interface Props extends Omit<HTMLInputAttributes, 'type' | 'checked' | 'class'> {
		label: string;
		checked?: boolean;
		description?: string;
		/** Right-aligned extra, e.g. result count. */
		meta?: string | number;
		children?: Snippet;
		class?: string;
	}

	let { label, checked = $bindable(false), description, meta, children, class: className, ...rest }: Props = $props();
	const uid = $props.id();
</script>

<label class={cn('group flex cursor-pointer items-start gap-2.5 rounded-md py-1.5 text-sm has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50', className)}>
	<input
		{...rest}
		type="checkbox"
		bind:checked
		aria-describedby={description ? `cb-desc-${uid}` : undefined}
		class="focus-ring mt-0.5 size-4 shrink-0 rounded border-border-strong accent-[var(--color-primary)]"
	/>
	<span class="flex min-w-0 flex-1 flex-col">
		<span class="flex items-center justify-between gap-2">
			<span class="text-foreground">{label}{@render children?.()}</span>
			{#if meta !== undefined}<span class="text-xs text-muted-foreground tabular-nums">{meta}</span>{/if}
		</span>
		{#if description}<span id="cb-desc-{uid}" class="text-xs text-muted-foreground">{description}</span>{/if}
	</span>
</label>
