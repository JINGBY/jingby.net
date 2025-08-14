<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let progress = $state(0);
    let { triggerEl }: { triggerEl: HTMLElement } = $props();

    let st: any = null;
    let gsap: any = null;
    let ScrollTrigger: any = null;

    onMount(async () => {
        // only run GSAP ScrollTrigger code in the browser
        if (typeof window !== "undefined") {
            try {
                // dynamic imports so this never runs during SSR
                const gsapModule = await import("gsap");
                const stModule = await import("gsap/ScrollTrigger");

                gsap = gsapModule.default ?? gsapModule;
                ScrollTrigger = stModule.default ?? stModule;

                // register plugin (client only)
                if (typeof gsap.registerPlugin === "function") {
                    gsap.registerPlugin(ScrollTrigger);
                } else {
                    // safety fallback — should not normally happen when imported client-side
                    console.warn("gsap.registerPlugin not available");
                }
            } catch (err) {
                // if dynamic import failed, fall back to page-scroll handler below
                console.error("Failed to load GSAP/ScrollTrigger:", err);
                gsap = null;
                ScrollTrigger = null;
            }
        }

        if (gsap && ScrollTrigger && triggerEl) {
            // create ScrollTrigger for the provided element
            st = ScrollTrigger.create({
                trigger: triggerEl,
                start: "top center",
                end: "bottom top",
                onUpdate: (self: any) => {
                    progress = Math.round(self.progress * 100);
                },
            });
            return;
        }

        // fallback: whole-page progress (or if gsap import failed)
        let rafId = 0;
        const updatePageProgress = () => {
            const scrollY = window.scrollY || window.pageYOffset;
            const docHeight = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
            );
            const winH = window.innerHeight;
            const maxScroll = Math.max(1, docHeight - winH);
            let t = scrollY / maxScroll;
            if (t < 0) t = 0;
            if (t > 1) t = 1;
            progress = Math.round(t * 100);
            rafId = 0;
        };

        const onScroll = () => {
            if (!rafId) rafId = requestAnimationFrame(updatePageProgress);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        // initial
        onScroll();

        onDestroy(() => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (rafId) cancelAnimationFrame(rafId);
        });
    });

    onDestroy(() => {
        if (st && typeof st.kill === "function") {
            st.kill();
            st = null;
        }
    });

    onMount(() => {
        if (!triggerEl) return;

        // example start / end (you can use any ScrollTrigger syntax)
        st = ScrollTrigger.create({
            trigger: triggerEl,
            start: "top center",
            end: "bottom top",
            onUpdate: (self: any) => {
                // self.progress is 0..1
                progress = Math.round(self.progress * 100);
            },
            markers: true,
        });
    });

    onDestroy(() => {
        if (st) st.kill();
    });
</script>

<article class="fixed bottom-12 lg:top-[calc(50%-100px)] right-12 w-14 h-28 bg-neutral-100 text-neutral-900
                rounded-full flex items-center justify-center z-10 pointer-events-none">
    <p class="font-mono">{progress}%</p>
</article>
