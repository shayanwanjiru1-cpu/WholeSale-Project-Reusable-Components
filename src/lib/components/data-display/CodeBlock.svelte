<script lang="ts">
	import CopyButton from '../ui/CopyButton.svelte';
	import { cn } from '$lib/utils/cn';

	/** Preformatted code with language label, copy button and optional line numbers. No highlighter dependency. */
	interface Props {
		code: string;
		language?: string;
		title?: string;
		lineNumbers?: boolean;
		wrap?: boolean;
		class?: string;
	}

	let { code, language, title, lineNumbers = false, wrap = false, class: className }: Props = $props();
	const lines = $derived(code.replace(/\n$/, '').split('\n'));
</script>

<figure class={cn('theme-dark overflow-hidden rounded-card border border-border bg-background', className)}>
	<figcaption class="flex items-center justify-between gap-2 border-b border-border px-4 py-1.5">
		<span class="text-xs font-medium text-muted-foreground">{title ?? language ?? 'Code'}</span>
		<span class="flex items-center gap-2">
			{#if title && language}<span class="rounded bg-muted px-1.5 py-0.5 text-[0.6875rem] font-medium text-muted-foreground uppercase">{language}</span>{/if}
			<CopyButton value={code} label="Copy code" showText />
		</span>
	</figcaption>
	<!-- tabindex lets keyboard users scroll long lines. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<pre class={cn('focus-ring overflow-x-auto p-4 font-mono text-[0.8125rem] leading-6 text-foreground', wrap && 'break-words whitespace-pre-wrap')} tabindex="0"><code class="block">{#each lines as line, i (i)}<span class="block">{#if lineNumbers}<span class="mr-4 inline-block w-6 text-right text-muted-foreground select-none" aria-hidden="true">{i + 1}</span>{/if}{line || ' '}</span>{/each}</code></pre>
</figure>
