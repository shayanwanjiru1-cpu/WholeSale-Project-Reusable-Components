<script lang="ts">
	import Dropdown from '../../ui/Dropdown.svelte';
	import type { DropdownItem } from '$lib/types';

	/** "⋯" per-row action menu. `rowLabel` makes each trigger's accessible name unique. */
	interface Props {
		items: DropdownItem[];
		rowLabel: string;
	}
	let { items, rowLabel }: Props = $props();
</script>

<Dropdown {items} iconOnly triggerIcon="more-horizontal" triggerVariant="ghost" triggerSize="icon-sm" label="Actions for {rowLabel}" align="right" />
