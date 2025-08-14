<script lang="ts">
    import { VolumeX, Volume, Volume1, Volume2 } from "@lucide/svelte";

    import { store } from "$lib/store.svelte";

    let { styles } = $props();
    let thumbWidth = $derived(store.globalVolume * 1.44); // scales from 20px to 144px
</script>

<div class={`relative w-36 h-8 rounded-full overflow-clip ${styles}`}>
    <!-- <label for="volume-control" class="block mb-1">{volume}%</label> -->

    <input
        type="range"
        id="volume-control"
        min="0"
        max="100"
        bind:value={store.globalVolume}
        class="w-full h-8 appearance-none bg-neutral-100 cursor-pointer"
    />

    <div
        class="absolute top-0 left-0 h-8 bg-neutral-400 pointer-events-none rounded-full"
        style="width: {thumbWidth}px"
    ></div>

    <div class="*:absolute *:top-[3px] *:right-3 *:w-5 *:text-neutral-700 *:pointer-events-none">
        {#if store.globalVolume == 0}
            <VolumeX strokeWidth=2 />
        {:else if store.globalVolume < 33}
            <Volume strokeWidth=2 />
        {:else if store.globalVolume < 66}
            <Volume1 strokeWidth=2 />
        {:else}
            <Volume2 strokeWidth=2 />
        {/if}
    </div>
</div>

<style>
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 0px;
        height: 0px;
        background: transparent;
        border: none;
        box-shadow: none;
    }

    input[type="range"]::-moz-range-thumb {
        width: 0px;
        height: 0px;
        background: transparent;
        border: none;
    }

    input[type="range"] {
        outline: none;
    }
</style>

