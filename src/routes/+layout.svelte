<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { Toaster } from '$lib';
	import { theme } from '$lib/stores/theme.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { quote } from '$lib/stores/quote.svelte';

	let { children } = $props();

	// Client-only state is restored after hydration so server and client markup match.
	onMount(() => {
		theme.init();
		cart.load();
		quote.load();
	});
</script>

{@render children()}
<Toaster />
