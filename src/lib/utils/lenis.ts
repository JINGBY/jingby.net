import Lenis from 'lenis';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';



let lenis: InstanceType<typeof Lenis> | null = null;
let rafId: number | null = null;
let onScrollHandler: (() => void) | null = null;



/** Initialize Lenis and wire it to GSAP ScrollTrigger using ScrollTrigger.scrollerProxy */
export function initLenis() {
    if (typeof window === 'undefined') return null;
    if (lenis) return lenis;

    try {
        gsap.registerPlugin(ScrollTrigger);
    } catch (e) {}

    lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const scrollerEl = (document.scrollingElement || document.documentElement) as HTMLElement;

    ScrollTrigger.scrollerProxy(scrollerEl, {
        scrollTop(value?: number) {
            if (!lenis) return 0;
            if (arguments.length) {
                lenis.scrollTo(value as number, { immediate: true });
            }
            return (lenis as any).scroll?.y ?? scrollerEl.scrollTop;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: 'transform'
    });

    // drive Lenis and update ScrollTrigger every frame
    const raf = (time: number) => {
        if (!lenis) return;
        lenis.raf(time);
        ScrollTrigger.update();
        rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    (lenis as any).on?.("scroll", () => ScrollTrigger.update());

    // update ScrollTrigger on Lenis scroll events (if available)
    onScrollHandler = () => ScrollTrigger.update();

    // refresh triggers after proxy is set up
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return lenis;
}



/** Destroy Lenis and cleanup related ScrollTrigger state */
export function destroyLenis() {
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    if (lenis) {
        (lenis as any).off?.('scroll', onScrollHandler ?? (() => { }));
        lenis.destroy();
        lenis = null;
    }
    onScrollHandler = null;
    // optionally remove all ScrollTriggers (depends on your lifecycle needs)
    ScrollTrigger.getAll().forEach((st) => st.kill());
}



/** Scroll to a specific y position on the page */
export function scrollToLenis(y: number) {
    if (!lenis) return;
    lenis.scrollTo(y, { immediate: true });
}
