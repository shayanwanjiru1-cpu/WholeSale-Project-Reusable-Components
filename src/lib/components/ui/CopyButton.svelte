<script lang="ts">
	import Icon from './Icon.svelte';
	import { copyToClipboard } from '$lib/utils/clipboard';
	import { cn } from '$lib/utils/cn';

	/** Icon button that copies `value` and announces the result to screen readers. */
	interface Props {
		value: string;
		label?: string;
		size?: 'sm' | 'md';
		showText?: boolean;
		class?: string;
	}

	let { value, label = 'Copy', size = 'sm', showText = false, class: className }: Props = $props();

	let status = $state<'idle' | 'copied' | 'error'>('idle');
	let timer: ReturnType<typeof setTimeout>;

	async function copy() {
		status = (await copyToClipboard(value)) ? 'copied' : 'error';
		clearTimeout(timer);
		timer = setTimeout(() => (status = 'idle'), 2000);
	}

	const message = $derived(status === 'copied' ? 'Copied' : status === 'error' ? 'Copy failed' : label);
</script>

<button
	type="button"
	class={cn(
		'focus-ring inline-flex items-center justify-center gap-1.5 rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
		showText ? 'h-8 px-2 text-xs font-medium' : size === 'sm' ? 'size-8' : 'size-10',
		status === 'copied' && 'text-success hover:text-success',
		className
	)}
	aria-label={showText ? undefined : label}
	onclick={copy}
>
	<Icon name={status === 'copied' ? 'check' : 'copy'} class="size-4" />
	{#if showText}<span>{message}</span>{/if}
</button>
<span class="sr-only" role="status" aria-live="polite">{status === 'idle' ? '' : message}</span>
