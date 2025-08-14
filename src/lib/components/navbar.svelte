<script lang="ts">
    import gsap from "gsap";
    import { onMount } from "svelte";

    import VolumeControl from "./volume-control.svelte";

    import Instagram from "$lib/assets/social-media/instagram.svelte";
    import Spotify from "$lib/assets/social-media/spotify.svelte";



    onMount (() => {
        gsap.from(".gsap-navlink", {
            opacity: 0,
            y: "-=20",
            ease: "power1.inOut",
            duration: 0.4,
            stagger: 0.2,
        });

        gsap.from(".gsap-nav-social", {
            opacity: 0,
            x: "+=20",
            ease: "power1.inOut",
            duration: 0.4,
            stagger: 0.2,
            delay: 0.2,
        });

        gsap.from(".gsap-nav-volume", {
            opacity: 0,
            x: "-=20",
            ease: "power1.inOut",
            duration: 0.4,
            stagger: 0.2,
            delay: 0.5,
        });
    });
</script>

<nav class="flex items-center justify-between *:w-[1/3] relative mb-24 px-12 pt-8">
    <VolumeControl styles="gsap-nav-volume" />
    <div class="hidden items-center gap-16 *:text-lg *:leading-5 md:flex">
        <a href="#about" class="gsap-navlink"><span>About</span><br><span class="text-neutral-700">Me</span></a>
        <a href="#new-music" class="gsap-navlink"><span class="text-neutral-700">New</span><br><span>Music</span></a>
        <a href="#wip" class="gsap-navlink"><span class="text-neutral-700">What</span><br><span>I'm up to</span></a>
        <a href="#releases" class="gsap-navlink"><span>Discography</span><br><span class="text-neutral-700">&#40;releases&#41;</span></a>
    </div>
    <div class="flex items-center gap-0.5 *:hover:bg-neutral-100 *:hover:text-neutral-900 *:transition-colors *:px-1 *:py-4 *:rounded-lg">
        <a href="https://www.instagram.com/jingbymusic/" target="_blank" class="gsap-nav-social">
            <Instagram />
        </a>
        <a href="https://open.spotify.com/artist/3TDfWLdQuUNkwquqtfZ3E5?si=YkGHTciUScOiDoBWTtHNAg" target="_blank" class="gsap-nav-social">
            <Spotify />
        </a>
    </div>
</nav>
