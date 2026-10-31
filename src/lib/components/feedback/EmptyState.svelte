<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import StateMessage from './StateMessage.svelte';

	/** Nothing exists yet ("No orders yet", "No products in this category"). */
	type Props = Omit<ComponentProps<typeof StateMessage>, 'tone' | 'role'>;
	let { icon = 'inbox', appearance = 'dashed', ...rest }: Props = $props();
</script>

<StateMessage {icon} {appearance} tone="neutral" {...rest} />
