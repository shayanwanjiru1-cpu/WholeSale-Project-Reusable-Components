<script lang="ts">
	import Badge from './Badge.svelte';
	import { toneIcon, type Tone } from '$lib/utils/tones';

	/**
	 * A Badge specialised for state. Always pairs colour with an icon and a text label,
	 * so status is never conveyed by colour alone.
	 */
	interface Props {
		status: Tone;
		label: string;
		size?: 'sm' | 'md' | 'lg';
		/** Use a small dot instead of an icon for dense layouts. */
		indicator?: 'icon' | 'dot';
		class?: string;
	}

	let { status, label, size = 'md', indicator = 'icon', class: className }: Props = $props();
</script>

<Badge
	variant={status}
	{size}
	icon={indicator === 'icon' ? toneIcon[status] : undefined}
	dot={indicator === 'dot'}
	class={className}
>
	{label}
</Badge>
