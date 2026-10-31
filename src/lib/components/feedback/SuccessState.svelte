<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import StateMessage from './StateMessage.svelte';

	/** Confirmation after a completed action ("Order placed", "Quote sent"). */
	type Props = Omit<ComponentProps<typeof StateMessage>, 'tone' | 'role'>;
	let { icon = 'check-circle', ...rest }: Props = $props();
</script>

<StateMessage {icon} tone="success" role="status" {...rest} />
