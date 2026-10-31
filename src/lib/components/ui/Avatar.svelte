<script lang="ts" module>
	export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
</script>

<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { initials } from '$lib/utils/format';

	interface Props {
		name: string;
		src?: string;
		size?: AvatarSize;
		shape?: 'circle' | 'square';
		status?: 'online' | 'away' | 'busy' | 'offline';
		/** Set false when the name is already visible next to the avatar. */
		labelled?: boolean;
		class?: string;
	}

	let { name, src, size = 'md', shape = 'circle', status, labelled = true, class: className }: Props = $props();

	let failed = $state(false);
	$effect(() => {
		// Reset the fallback when the image source changes.
		void src;
		failed = false;
	});

	const sizes: Record<AvatarSize, string> = {
		xs: 'size-6 text-[0.625rem]',
		sm: 'size-8 text-xs',
		md: 'size-10 text-sm',
		lg: 'size-14 text-lg',
		xl: 'size-20 text-2xl'
	};
	const statusColor = { online: 'bg-success', away: 'bg-warning', busy: 'bg-danger', offline: 'bg-muted-foreground' };
	const label = $derived(status ? `${name} (${status})` : name);
</script>

<span
	class={cn('relative inline-flex shrink-0', sizes[size], className)}
	role={labelled ? 'img' : undefined}
	aria-label={labelled ? label : undefined}
	aria-hidden={labelled ? undefined : 'true'}
>
	{#if src && !failed}
		<img
			{src}
			alt=""
			class={cn('size-full object-cover', shape === 'circle' ? 'rounded-full' : 'rounded-lg')}
			onerror={() => (failed = true)}
		/>
	{:else}
		<span
			class={cn(
				'grid size-full place-items-center bg-accent font-semibold text-accent-foreground select-none',
				shape === 'circle' ? 'rounded-full' : 'rounded-lg'
			)}
		>
			{initials(name)}
		</span>
	{/if}
	{#if status}
		<span
			class={cn(
				'absolute right-0 bottom-0 block rounded-full ring-2 ring-surface',
				size === 'xs' || size === 'sm' ? 'size-2' : 'size-3',
				statusColor[status]
			)}
		></span>
	{/if}
</span>
