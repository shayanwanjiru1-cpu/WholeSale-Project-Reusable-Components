<script lang="ts">
	/** Visually hidden until focused; lets keyboard users jump past navigation. */
	interface Props {
		href?: string;
		label?: string;
	}
	let { href = '#main-content', label = 'Skip to main content' }: Props = $props();
</script>

<a
	{href}
	class="focus-ring sr-only z-[100] rounded-control bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-raised focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
>
	{label}
</a>
