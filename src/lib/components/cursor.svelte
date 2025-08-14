<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let cursor: HTMLDivElement | null = null;

  let mouseX = 0,
    mouseY = 0;
  let cursorX = 0,
    cursorY = 0;

  // Keep last client coordinates so we can recalc page coords on scroll
  let lastClientX = 0,
    lastClientY = 0;

  let rafId: number | null = null;
  let clickAnimation: Animation | null = null;

  function animateLoop() {
    const speed = 0.1;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;

    if (cursor) {
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }

    rafId = requestAnimationFrame(animateLoop);
  }

  onMount(() => {
    function onMouseMove(e: MouseEvent) {
      lastClientX = e.clientX;
      lastClientY = e.clientY;

      // pageX/pageY already include scroll offset
      mouseX = e.pageX;
      mouseY = e.pageY - 12;
      if (cursor) cursor.style.display = "inline-block";
    }

    function onScroll() {
      // If we don't have a recorded client position yet, nothing to update
      if (typeof lastClientX !== "number") return;

      // Recompute page-based mouse position using client coords + scroll
      mouseX = lastClientX + window.scrollX;
      mouseY = lastClientY + window.scrollY - 12;
    }

    function onClick() {
      if (!cursor) return;

      // Stop the CSS idle animation so it doesn't conflict
      const prevAnimation = cursor.style.animation;
      cursor.style.animation = "none";

      // Swap border to the less-contrast color for the duration.
      const prevBorder = cursor.style.border;
      cursor.style.border = "2px solid var(--color-neutral-700)";

      // Cancel any existing click animation
      if (clickAnimation) {
        clickAnimation.cancel();
        clickAnimation = null;
      }

      // Use Web Animations API to guarantee the animation runs each click.
      clickAnimation = cursor.animate(
        [
          { transform: "translate(-50%) scale(1)", opacity: 1 },
          {
            transform: "translate(-50%) scale(2)",
            opacity: 1,
            offset: 0.5,
          },
          {
            transform: "translate(-50%) scale(1)",
            opacity: 0,
            offset: 1,
          },
        ],
        {
          duration: 500,
          easing: "ease",
          // no fill so element returns to normal
        }
      );

      clickAnimation.onfinish = () => {
        if (!cursor) {
          clickAnimation = null;
          return;
        }
        cursor.style.opacity = "";
        cursor.style.animation = prevAnimation || "";
        cursor.style.border = prevBorder || "2px solid var(--color-neutral-900)";
        clickAnimation = null;
      };

      clickAnimation.oncancel = () => {
        if (!cursor) {
          clickAnimation = null;
          return;
        }
        cursor.style.opacity = "";
        cursor.style.animation = prevAnimation || "";
        cursor.style.border = prevBorder || "2px solid var(--color-neutral-900)";
        clickAnimation = null;
      };
    }

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    // Listen to scroll on window — use passive true for performance
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousedown", onClick);

    rafId = requestAnimationFrame(animateLoop);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClick);
      if (rafId) cancelAnimationFrame(rafId);
      if (clickAnimation) clickAnimation.cancel();
    };
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
    if (clickAnimation) clickAnimation.cancel();
  });
</script>

<div class="cursor !hidden sm:!block" bind:this={cursor}></div>

<style>
  .cursor {
    display: none;
    width: 24px;
    height: 24px;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%);
    border-radius: 50%;
    background: transparent;
    pointer-events: none;
    z-index: 100;
    border: 2px solid var(--color-neutral-900);
    mix-blend-mode: difference;
    animation: expand1 500ms infinite alternate;
    transition: top 100ms ease-out, left 100ms ease-out;
  }

  @keyframes expand1 {
    from {
      transform: translate(-50%) scale(1);
    }
    to {
      transform: translate(-50%) scale(0.8);
    }
  }

  @keyframes expand2 {
    0% {
      transform: translate(-50%) scale(1);
      opacity: 1;
    }
    50% {
      transform: translate(-50%) scale(2);
      opacity: 1;
    }
    100% {
      transform: translate(-50%) scale(1);
      opacity: 0;
    }
  }
</style>
