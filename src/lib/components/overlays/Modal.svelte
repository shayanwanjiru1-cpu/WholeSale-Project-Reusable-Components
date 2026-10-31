<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Sheet from '../layout/Sheet.svelte';

	/**
	 * Centered dialog. A semantic wrapper over Sheet (side="center"), so modals and
	 * drawers share one accessible <dialog> implementation: focus containment, Escape,
	 * backdrop click, scroll lock and focus return.
	 */
	type Props = Omit<ComponentProps<typeof Sheet>, 'side'>;
	let { open = $bindable(false), size = 'md', ...rest }: Props = $props();
</script>

<Sheet bind:open side="center" {size} {...rest} />
