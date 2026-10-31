<script lang="ts">
	import type { ComponentProps, Snippet } from 'svelte';
	import StateMessage from './StateMessage.svelte';
	import Button from '../ui/Button.svelte';

	/** Something failed to load. Announced via role="alert". Supply `onretry` to show a retry button. */
	type Props = Omit<ComponentProps<typeof StateMessage>, 'tone' | 'role' | 'actions' | 'title'> & {
		title?: string;
		onretry?: () => void;
		retrying?: boolean;
		retryLabel?: string;
		/** Additional actions (e.g. "Contact support") shown after Retry. */
		secondaryAction?: Snippet;
	};
	let {
		icon = 'alert-triangle',
		title = 'Something went wrong',
		onretry,
		retrying = false,
		retryLabel = 'Try again',
		secondaryAction,
		...rest
	}: Props = $props();
</script>

<StateMessage {icon} {title} tone="error" role="alert" {...rest}>
	{#snippet actions()}
		{#if onretry}<Button iconLeft="refresh" loading={retrying} onclick={onretry}>{retryLabel}</Button>{/if}
		{@render secondaryAction?.()}
	{/snippet}
</StateMessage>
