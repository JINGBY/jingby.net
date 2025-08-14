<script lang="ts">
	import "../app.css";
    import { onMount, onDestroy } from 'svelte';
    import { initLenis, destroyLenis, scrollToLenis } from '$lib/utils/lenis';

    import Loading from "$lib/components/loading.svelte";

	let { children } = $props();

    let loading = $state(true);

    onMount(() => {
        initLenis();
        scrollToLenis(0);

        loading = false;
    });

    onDestroy(() => {
        destroyLenis();
    });
</script>

<svelte:head>
    <title>JINGBY — Music</title>
</svelte:head>

{#if loading}
    <Loading />
{/if}

{@render children?.()}
