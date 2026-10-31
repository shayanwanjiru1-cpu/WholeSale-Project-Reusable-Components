<script lang="ts">
	import { icons, type IconName } from './icons';
	import { cn } from '$lib/utils/cn';

	interface Props {
		name: IconName;
		/** Tailwind size class, e.g. "size-4". */
		class?: string;
		/** Provide a label only when the icon conveys meaning on its own. */
		label?: string;
		filled?: boolean;
		strokeWidth?: number;
	}

	let { name, class: className = 'size-5', label, filled = false, strokeWidth = 2 }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	fill={filled ? 'currentColor' : 'none'}
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	class={cn('shrink-0', className)}
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
	focusable="false"
>
	{#each icons[name] as d (d)}
		<path {d} />
	{/each}
</svg>
