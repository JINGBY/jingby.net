<script lang="ts">
    import type { Music } from "$lib/store.svelte";

    let {
        title,
        cover,
        year,
        url,
        artists = [],
        label = "",
        id,
    } : Music = $props();
</script>

<a href={url} target="_blank" class="gsap-song-card" id={`song-card-${id}`}>
    <article class="flex flex-col gap-12 px-10 py-10 rounded-4xl shadow-sm bg-neutral-750 relative -z-10">
        <img src={cover} alt="" class="w-full h-[200px] md:h-[400px] rounded-4xl shadow-xl object-cover object-top" />
        <div class="flex flex-col justify-between px-2 gap-6">
            <div class="flex justify-between">
                <p class="text-xl sm:text-[64px] sm:leading-14 text-neutral-700">{title}</p>
                <p class="font-mono text-sm pt-1 sm:text-base sm:pt-0">{year}</p>
            </div>
            <div class="flex justify-between pb-4">
                <p class="text-lg">
                    {#if artists.length > 0}
                        <span>With {artists.join(", ")}</span>
                    {:else}
                        <span>Solo</span>
                    {/if}
                </p>
                <p class="text-lg">
                    {#if label != ""}
                        <span class="text-neutral-700">{label}</span>
                    {:else}
                        <span class="text-neutral-700">Independent release</span>
                    {/if}
                </p>
            </div>
        </div>
    </article>
</a>
