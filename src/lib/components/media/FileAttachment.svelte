<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import Button from '../ui/Button.svelte';
	import ProgressBar from '../feedback/ProgressBar.svelte';
	import type { IconName } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { fileExtension, formatBytes } from '$lib/utils/format';

	/** A file row: type icon, name, size and download/remove actions, with upload states. */
	interface Props {
		name: string;
		/** Size in bytes. */
		size?: number;
		/** MIME type; falls back to the file extension. */
		type?: string;
		href?: string;
		status?: 'complete' | 'uploading' | 'error';
		/** 0–100 when uploading. Omit for indeterminate. */
		progress?: number;
		error?: string;
		onremove?: () => void;
		onretry?: () => void;
		class?: string;
	}

	let { name, size, type, href, status = 'complete', progress, error, onremove, onretry, class: className }: Props = $props();

	const ext = $derived(fileExtension(name));
	const icon = $derived.by((): IconName => {
		const t = type ?? '';
		if (t.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
		if (t.startsWith('video/') || ['mp4', 'mov', 'webm'].includes(ext)) return 'video';
		if (t.startsWith('audio/') || ['mp3', 'wav', 'ogg'].includes(ext)) return 'music';
		if (['pdf', 'doc', 'docx', 'txt', 'csv', 'xls', 'xlsx'].includes(ext)) return 'file-text';
		return 'file';
	});
	const meta = $derived([ext.toUpperCase(), size !== undefined && formatBytes(size)].filter(Boolean).join(' · '));
</script>

<div class={cn('flex items-center gap-3 rounded-lg border bg-surface p-3', status === 'error' ? 'border-danger/50' : 'border-border', className)}>
	<span class={cn('grid size-10 shrink-0 place-items-center rounded-md', status === 'error' ? 'bg-danger-soft text-danger' : 'bg-muted text-muted-foreground')}>
		<Icon name={status === 'error' ? 'alert-circle' : icon} class="size-5" />
	</span>
	<div class="min-w-0 flex-1">
		<p class="truncate text-sm font-medium text-foreground" title={name}>{name}</p>
		{#if status === 'uploading'}
			<ProgressBar value={progress} label="Uploading {name}" showLabel={false} size="sm" class="mt-1.5" />
		{:else if status === 'error'}
			<p class="text-xs text-danger" role="alert">{error ?? 'Upload failed'}</p>
		{:else if meta}
			<p class="text-xs text-muted-foreground">{meta}</p>
		{/if}
	</div>
	<div class="flex shrink-0 items-center gap-1">
		{#if status === 'error' && onretry}
			<Button variant="ghost" size="icon-sm" aria-label="Retry upload of {name}" onclick={onretry}><Icon name="refresh" class="size-4" /></Button>
		{/if}
		{#if href && status === 'complete'}
			<Button variant="ghost" size="icon-sm" href={href} download={name} aria-label="Download {name}"><Icon name="download" class="size-4" /></Button>
		{/if}
		{#if onremove}
			<Button variant="ghost" size="icon-sm" aria-label="{status === 'uploading' ? 'Cancel upload of' : 'Remove'} {name}" onclick={onremove}><Icon name="x" class="size-4" /></Button>
		{/if}
	</div>
</div>
