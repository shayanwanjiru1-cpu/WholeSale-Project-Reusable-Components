<script lang="ts">
	import Avatar, { type AvatarSize } from './Avatar.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		people: { name: string; src?: string }[];
		max?: number;
		size?: AvatarSize;
		class?: string;
	}

	let { people, max = 4, size = 'md', class: className }: Props = $props();

	const visible = $derived(people.slice(0, max));
	const overflow = $derived(Math.max(0, people.length - max));
	const overflowSizes: Record<AvatarSize, string> = {
		xs: 'size-6 text-[0.625rem]',
		sm: 'size-8 text-xs',
		md: 'size-10 text-xs',
		lg: 'size-14 text-sm',
		xl: 'size-20 text-lg'
	};
</script>

<ul class={cn('flex items-center -space-x-2', className)} aria-label="{people.length} people">
	{#each visible as person (person.name)}
		<li class="rounded-full ring-2 ring-surface">
			<Avatar name={person.name} src={person.src} {size} />
		</li>
	{/each}
	{#if overflow > 0}
		<li
			class={cn(
				'grid place-items-center rounded-full bg-muted font-medium text-muted-foreground ring-2 ring-surface',
				overflowSizes[size]
			)}
		>
			<span aria-hidden="true">+{overflow}</span>
			<span class="sr-only">and {overflow} more</span>
		</li>
	{/if}
</ul>
