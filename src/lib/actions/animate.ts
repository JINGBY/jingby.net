import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

// register only on client (no-op if already registered)
if (typeof window !== "undefined") {
  try {
    gsap.registerPlugin(ScrollTrigger);
  } catch (e) {
    // registerPlugin may throw if already registered in some envs — ignore safely
  }
}

type AnimationType = keyof typeof gsap;

interface AnimationOptions extends GSAPTweenVars {
    type: AnimationType;
    scrollTrigger?: ScrollTrigger.Vars;
}

export function animate(
    node: HTMLElement,
    { type, scrollTrigger, ...args }: AnimationOptions
): { destroy?: () => void } {
    const method = gsap[type] as
        | ((target: gsap.TweenTarget, vars: GSAPTweenVars) => GSAPTween)
        | undefined;

    if (!method) {
        console.warn(`GSAP method "${type}" does not exist.`);
        return {};
    }

    // Create the animation with ScrollTrigger if provided
    const tween = method(node, {
        ...args,
        scrollTrigger: scrollTrigger
            ? {
                    ...scrollTrigger,
                    trigger: scrollTrigger.trigger || node
                }
            : undefined
    });

    return {
        destroy() {
            // Kill the animation when the element is removed
            tween.kill();

            // If using ScrollTrigger, make sure to kill that instance too
            if (scrollTrigger && tween.scrollTrigger) {
                tween.scrollTrigger.kill();
            }
        }
    };
}
