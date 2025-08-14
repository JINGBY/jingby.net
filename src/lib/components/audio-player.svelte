<script lang="ts">
    import PlayIcon from '$lib/assets/play.svelte';
    import PauseIcon from '$lib/assets/pause.svelte';
    import { onMount, onDestroy } from 'svelte';
    import { store } from "$lib/store.svelte";

    let { source, white = true } = $props();

    let audioEl: HTMLAudioElement | null = null;
    let progressEl: HTMLDivElement | null = null;

    let timeLeft = $state(0); // seconds (number)
    let playing = $state(false);
    let playProgress = $state(0); // 0..1

    let isDragging = false;

    let volume = $derived(store.globalVolume / 100)

    function play() {
        if (!audioEl) return;
        playing = true;
        audioEl.play();
    }

    function pause() {
        if (!audioEl) return;
        playing = false;
        audioEl.pause();
    }

    function formatTime(totalSeconds: number): string {
        const s = Math.max(0, Math.round(totalSeconds));
        const minutes = Math.floor(s / 60);
        const seconds = s % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateFromAudio() {
        if (!audioEl) return;
        const duration = audioEl.duration || 0;
        const current = audioEl.currentTime || 0;

        // time left in seconds
        timeLeft = Math.max(0, Math.round(duration - current));

        // progress 0..1
        playProgress = duration > 0 ? current / duration : 0;
    }

    function clientXToProgress(clientX: number): number {
        if (!progressEl) return 0;
        const rect = progressEl.getBoundingClientRect();
        const x = clientX - rect.left;
        const frac = x / rect.width;
        return Math.max(0, Math.min(1, frac));
    }

    function seekToFraction(fraction: number) {
        if (!audioEl) return;
        const duration = audioEl.duration || 0;
        const time = duration * fraction;
        audioEl.currentTime = time;
        // optimistic UI update
        playProgress = fraction;
        timeLeft = Math.max(0, Math.round(duration - time));
    }

    // duck-typed checks to avoid ReferenceError in environments without
    // TouchEvent/PointerEvent constructors
    function isTouchLike(ev: any): ev is TouchEvent {
        return ev && typeof ev === 'object' && 'touches' in ev;
    }

    function isClientXLike(ev: any): ev is PointerEvent | MouseEvent {
        return ev && typeof ev === 'object' && 'clientX' in ev;
    }

    function handlePointerStart(ev: PointerEvent | TouchEvent | MouseEvent) {
        let clientX: number | null = null;

        if (isTouchLike(ev)) {
        if (ev.touches.length === 0) return;
        // we attached touchstart with passive: false so preventDefault here
        ev.preventDefault();
        clientX = ev.touches[0].clientX;
        } else if (isClientXLike(ev)) {
        clientX = (ev as PointerEvent | MouseEvent).clientX;
        }

        if (clientX == null) return;

        isDragging = true;
        const frac = clientXToProgress(clientX);
        seekToFraction(frac);

        document.body.style.userSelect = 'none';

        // attach move/end on document-level
        window.addEventListener('pointermove', handlePointerMove as EventListener);
        window.addEventListener('pointerup', handlePointerEnd as EventListener);
        window.addEventListener('mousemove', handlePointerMove as EventListener);
        window.addEventListener('mouseup', handlePointerEnd as EventListener);
        window.addEventListener('touchmove', handlePointerMove as EventListener, {
        passive: false
        });
        window.addEventListener('touchend', handlePointerEnd as EventListener);
    }

    function handlePointerMove(ev: PointerEvent | TouchEvent | MouseEvent) {
        if (!isDragging) return;

        let clientX: number | null = null;

        if (isTouchLike(ev)) {
        if (ev.touches.length === 0) return;
        ev.preventDefault(); // prevent scrolling while dragging
        clientX = ev.touches[0].clientX;
        } else if (isClientXLike(ev)) {
        clientX = (ev as PointerEvent | MouseEvent).clientX;
        }

        if (clientX == null) return;

        const frac = clientXToProgress(clientX);
        seekToFraction(frac);
    }

    function handlePointerEnd(_ev: Event) {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = '';

        window.removeEventListener('pointermove', handlePointerMove as EventListener);
        window.removeEventListener('pointerup', handlePointerEnd as EventListener);
        window.removeEventListener('mousemove', handlePointerMove as EventListener);
        window.removeEventListener('mouseup', handlePointerEnd as EventListener);
        window.removeEventListener('touchmove', handlePointerMove as EventListener);
        window.removeEventListener('touchend', handlePointerEnd as EventListener);

        // sync UI with audio after finishing drag
        updateFromAudio();
    }

    $effect(() => {
        // set volume
        if (!audioEl) return;
        audioEl.volume = volume;
    });

    onMount(() => {
        // audio listeners
        if (audioEl) {
            updateFromAudio();

            const onTime = () => updateFromAudio();
            const onDuration = () => updateFromAudio();
            const onEnded = () => {
                playing = false;
                updateFromAudio();
            };

            audioEl.addEventListener('timeupdate', onTime);
            audioEl.addEventListener('durationchange', onDuration);
            audioEl.addEventListener('loadedmetadata', onDuration);
            audioEl.addEventListener('ended', onEnded);

            onDestroy(() => {
                audioEl?.removeEventListener('timeupdate', onTime);
                audioEl?.removeEventListener('durationchange', onDuration);
                audioEl?.removeEventListener('loadedmetadata', onDuration);
                audioEl?.removeEventListener('ended', onEnded);
            });
        }

        // progress element listeners (imperative, Svelte 5 friendly)
        if (progressEl) {
            progressEl.addEventListener('pointerdown', handlePointerStart);
            progressEl.addEventListener('mousedown', handlePointerStart);
            // touchstart must be passive: false to allow preventDefault in handler
            progressEl.addEventListener('touchstart', handlePointerStart, { passive: false });

            onDestroy(() => {
                progressEl?.removeEventListener('pointerdown', handlePointerStart);
                progressEl?.removeEventListener('mousedown', handlePointerStart);
                progressEl?.removeEventListener('touchstart', handlePointerStart);

                // ensure any document/global listeners are removed if component unmounts while dragging
                window.removeEventListener('pointermove', handlePointerMove as EventListener);
                window.removeEventListener('pointerup', handlePointerEnd as EventListener);
                window.removeEventListener('mousemove', handlePointerMove as EventListener);
                window.removeEventListener('mouseup', handlePointerEnd as EventListener);
                window.removeEventListener('touchmove', handlePointerMove as EventListener);
                window.removeEventListener('touchend', handlePointerEnd as EventListener);
                document.body.style.userSelect = '';
            });
        }
    });
</script>

<article>
    <audio src={source} bind:this={audioEl}></audio>

    <div
        class={`w-full h-[72px] ${white ? 'bg-neutral-750 text-neutral-100' : 'bg-neutral-100 text-neutral-900'} rounded-full px-10 py-4 shadow-sm`}>
        <div class={`${white ? 'text-neutral-700' : 'text-neutral-900'} flex items-center justify-between mb-1.5 mt-0.5 px-2`}>
            <button onclick={() => (playing ? pause() : play())} class="cursor-pointer">
                {#if playing}
                    <PauseIcon />
                {:else}
                    <PlayIcon />
                {/if}
            </button>
            <p class={`${white ? 'text-neutral-100' : 'text-neutral-900'} select-none`}>- {formatTime(timeLeft)}</p>
        </div>

        <div class="relative">
            <!-- clickable/draggable full track -->
            <div bind:this={progressEl} class={`absolute h-1 w-full ${white ? 'bg-neutral-700' : 'bg-neutral-400'} rounded-full cursor-pointer`}></div>

            <!-- filled progress -->
            <div class={`absolute h-1 ${white ? 'bg-neutral-900' : 'bg-neutral-700'} rounded-full pointer-events-none`} style={`width: ${playProgress * 100}%`}></div>
        </div>
    </div>
</article>
