<script lang="ts" module>
	export interface FieldControlProps {
		id: string;
		'aria-describedby'?: string;
		'aria-invalid'?: 'true';
		required?: boolean;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../ui/Icon.svelte';
	import { cn } from '$lib/utils/cn';

	/**
	 * Label + control + hint + error. Wires `aria-describedby` / `aria-invalid` so every
	 * form control announces its hint and error. Controls receive their props through
	 * the `children` snippet.
	 */
	interface Props {
		label: string;
		hint?: string;
		error?: string;
		required?: boolean;
		hideLabel?: boolean;
		id?: string;
		class?: string;
		children: Snippet<[FieldControlProps]>;
	}

	let { label, hint, error, required = false, hideLabel = false, id: providedId, class: className, children }: Props = $props();

	const uid = $props.id();
	const id = $derived(providedId ?? `field-${uid}`);
	const hintId = $derived(`${id}-hint`);
	const errorId = $derived(`${id}-error`);
	const describedBy = $derived([hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined);
</script>

<div class={cn('flex flex-col gap-1.5', className)}>
	<label for={id} class={cn('text-sm font-medium text-foreground', hideLabel && 'sr-only')}>
		{label}{#if required}<span class="text-primary-text" aria-hidden="true"> *</span><span class="sr-only"> (required)</span>{/if}
	</label>
	{@render children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? 'true' : undefined, required })}
	{#if hint}<p id={hintId} class="text-xs text-muted-foreground">{hint}</p>{/if}
	{#if error}
		<p id={errorId} class="flex items-center gap-1.5 text-xs font-medium text-danger-strong">
			<Icon name="alert-circle" class="size-3.5" />{error}
		</p>
	{/if}
</div>
