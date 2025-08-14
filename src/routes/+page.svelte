<script lang="ts">
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { SplitText } from "gsap/SplitText";
    import { animate } from "$lib/actions/animate";
    import { onMount } from "svelte";

    // data
    import { discography } from "$lib/store.svelte";


    // media
    import beigeProfile from "$lib/assets/beige-profile.jpg";
    import light from "$lib/assets/light.svg";
    import fallCover from "$lib/assets/covers/fall.png";
    import logoBg from "$lib/assets/logo-bg.svg";
    import Initials from "$lib/assets/initials.svg";
    import returnReel from "$lib/assets/videos/return-atmos-reel.mp4";
    import returnPreview from "$lib/assets/audio/return-preview.mp3";
    import chasingPreview from "$lib/assets/audio/chasing-preview.mp3";


    // icons
    import { ArrowDownRight } from "@lucide/svelte";


    // components
    import HLine from "$lib/components/h-line.svelte";
    import Button from "$lib/components/button.svelte";
    import ProgressMeter from "$lib/components/progress-meter.svelte";
    import AudioPlayer from "$lib/components/audio-player.svelte";
    import SongCard from "$lib/components/song-card.svelte";
    import Navbar from "$lib/components/navbar.svelte";
    import Grain from "$lib/components/grain.svelte";
    import Cursor from "$lib/components/cursor.svelte";



    // wrapper for scroll progress
    let mainEl = $state<HTMLElement>();



    let numShowReleases = $state(2);

    function showMoreReleases() {
        numShowReleases += 4;

        if (numShowReleases > discography.music.length) {
            numShowReleases = discography.music.length;
        }
    }



    let socialLinks: HTMLDivElement;
    let arrowPosition: number = $state(0);

    function moveLinkArrow(position: number) {
        arrowPosition = position;

        gsap.to("#link-arrow", {
            top: position * (socialLinks.clientHeight / socialLinks.childElementCount) + (window.innerWidth < 1300 ? 4 : 16),
            rotate: -90,
            opacity: 1,
            duration: 0.1,
            ease: "power1.out",
            overwrite: "auto"
        });
    }

    function resetLinkArrow() {
        gsap.to("#link-arrow", {
            rotate: 0,
            opacity: 0.2,
            duration: 0.3,
            ease: "power1.out",
            overwrite: "auto"
        });
    }



    onMount(() => {
        // register SplitText
        try {
            gsap.registerPlugin(SplitText);
        } catch (e) {}

        // bundled/stagger animations, the rest use the use:animate action
        gsap.from(".gsap-audio-player", {
            opacity: 0,
            y: "-=20",
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".gsap-wip-trigger",
                start: "top bottom",
                end: "-=600 top",
                scrub: true,
            },
        })

        gsap.from(".gsap-song-card", {
            opacity: 0,
            y: "-=50",
            ease: "power1.inOut",
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".gsap-releases-trigger",
                start: "top bottom",
                end: "-=600 top",
                scrub: true,
            },
        })

        gsap.from(".gsap-social-link", {
            opacity: 0,
            x: "-=100",
            ease: "power1.inOut",
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".gsap-social-link",
                start: "+=100 bottom",
                end: "-=400 top",
                scrub: true,
            },
        })

        document.fonts.ready.then(() => {
             // text animations
            SplitText.create(".gsap-about-text", {
                type: "words",
                smartWrap: true,
                onSplit: (self: any) => {
                    gsap.from(self.words, {
                        opacity: 0,
                        y: "+=20",
                        ease: "power1.inOut",
                        stagger: {
                            amount: 0.5,
                        }
                    })
                }
            })
        });




        const baseY = 300;
        const minY = baseY - 360;
        const maxY = baseY + 40;

        const clamp = (v: number, a: number, b: number) =>
        Math.max(a, Math.min(b, v));

        const handleMouseMove = (e: MouseEvent) => {
            const raw = e.clientY - 500;
            const targetY = clamp(raw, minY, maxY);

            if (window.innerWidth > 868) {
                gsap.to("#hero-img", {
                    top: targetY,
                    duration: 0.8,
                    ease: "power1.out",
                    overwrite: "auto"
                });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);



        let ticking = false;

        function onResize() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                if (window.innerWidth > 1000) {
                    gsap.set("#hero-img", {
                    top: -30,
                    duration: 0.8,
                    ease: "power1.out",
                    overwrite: "auto",
                    });
                }
                ticking = false;
                });
                ticking = true;
            }
        }

        // initial check
        if (window.innerWidth > 1000) {
            gsap.set("#hero-img", { top: -30, duration: 0.8, ease: "power1.out" });
        }

        // simple debounce
        const debounce = (fn: (...a: any[]) => void, wait = 150) => {
            let t: number | undefined;
            return (...args: any[]) => {
            if (t) window.clearTimeout(t);
            t = window.setTimeout(() => fn(...args), wait);
            };
        };

        const refreshST = () => {
            // only refresh ScrollTrigger cached sizes/positions
            ScrollTrigger.refresh();
        };

        const onResizeRefresh = debounce(refreshST, 120);

        window.addEventListener("resize", onResize);
        window.addEventListener("resize", onResizeRefresh);



        ScrollTrigger.refresh();



        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", onResize);

            // clear any running tween and reset transform
            gsap.killTweensOf("#hero-img");
            gsap.set("#hero-img", { y: 0 });
        };
    });
</script>



<Grain />
<Cursor />

<Navbar />
<ProgressMeter triggerEl={mainEl!} />

<main class="relative max-w-[1920px] m-auto" bind:this={mainEl}>
    <section id="about" class="w-full flex flex-col items-center px-12">
        <div class="flex gap-4 md:gap-16 flex-col md:flex-row">
            <div class="relative md:absolute w-full pointer-events-none left-0 top-0 -z-20" id="hero-img">
                <div class="relative w-full">
                    <img src={beigeProfile} alt="profile"
                    use:animate={{
                        type: "to",
                        width: "60%",
                        height: "60%",
                        x: "0",
                        ease: "power2.inOut",
                        scrollTrigger: {
                            trigger: ".gsap-hero-trigger",
                            start: "+=200 center",
                            end: "+=700 top",
                            scrub: true
                        }
                    }}
                    use:animate={{
                        type: "to",
                        top: "-=50%",
                        ease: "power1.inOut",
                        scrollTrigger: {
                            trigger: ".gsap-hero-trigger",
                            start: "+=300 center",
                            end: "+=400 top",
                            scrub: true
                        }
                    }}
                    use:animate={{
                        type: "to",
                        opacity: 0,
                        ease: "power2.inOut",
                        scrollTrigger: {
                            trigger: ".gsap-hero-trigger",
                            start: "+=350 center",
                            end: "+=360 top",
                            scrub: true
                        }
                    }}
                    use:animate={{
                        type: "to",
                        y: "-=100%",
                        ease: "power1.inOut",
                        scrollTrigger: {
                            trigger: ".gsap-hero-trigger",
                            start: "+=400 center",
                            end: "+=500 top",
                            scrub: true
                        }
                    }}
                    class="gsap-hero-trigger md:w-[40%] md:h-[40%] w-[60%] h-[60%] rounded-4xl shadow-xl object-cover relative lg:left-32 md:left-16 left-[calc(50%-30%)]" />
                    <img src={light} alt="" class="absolute opacity-80 -top-64 left-[20%] pointer-events-none overflow-x-clip hidden lg:block" />
                </div>
            </div>

            <div class="lg:size-[540px] md:block hidden"></div>
            <article
            use:animate={{
                type: "to",
                x: (window.innerWidth > 1400 ? "+=40%" : "0%"),
                y: (window.innerWidth > 1400 ? "+=100%" : "0%"),
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: ".gsap-hero-trigger",
                    start: "+=200 center",
                    end: "+=700 top",
                    scrub: true,
                },
            }}
            use:animate={{
                type: "to",
                opacity: 0,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: ".gsap-hero-trigger",
                    start: "+=600 center",
                    end: "+=650 top",
                    scrub: true,
                },
            }}
            class="md:*:max-w-114 relative z-10 max-w-[80%] m-auto left-0 md:left-60 lg:left-0 lg:top-[-64px]">
                <h1 class="gsap-about-text">I'm Hannes, better known as JINGBY. I'm an 18-year-old electronic producer from Sweden.</h1>
                <p class="gsap-about-text">Getting started making music at the young age of 12, I've been independent ever since. Through experimentation
                    during the pandemic early 2019, my style has evolved into something different and fresh. More towards a vibrant
                    and experimental sound drawing inspiration from the likes of Mo Falk, demotapes, 33 Below, NUZB  and more.</p>
            </article>
        </div>
    </section>

    <img src={logoBg} alt=""
    use:animate={{
        type: "to",
        y: "-=300%",
        marginBottom: "-10%",
        ease: "power1.inOut",
        scrollTrigger: {
            trigger: ".gsap-hero-trigger",
            start: "+=400 center",
            end: "+=1000 top",
            scrub: true,
        },
    }}
    class="relative -z-30 px-12 hidden md:block pt-48 lg:pt-0 m-auto"/>

    <section class="flex flex-col items-center md:items-start md:flex-row justify-center gsap-video-trigger my-64 md:my-96 px-12 sm:px-0">
        <video src={returnReel} autoplay muted loop
        use:animate={{
            type: "from",
            opacity: 0,
            y: "-=200",
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".gsap-video-trigger",
                start: "-=800 bottom",
                end: "-=700 top",
                scrub: true,
            },
        }}
        class="relative -z-10 rounded-4xl shadow-xl mx-24 h-[774px] object-cover"><track kind="captions" /></video>
        <h1
        use:animate={{
            type: "from",
            opacity: 0,
            y: "+=20",
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".gsap-video-trigger",
                start: "top bottom",
                end: "+=400",
                scrub: true,
            },
        }}
        class="pt-6 md:pt-36">I try to aim for something different</h1>
    </section>

    <section id="new-music" class="my-64 gsap-new-music-trigger">
        <div
        use:animate={{
            type: "from",
            y: "+=20",
            opacity: 0,
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".gsap-new-music-trigger",
                start: "top bottom",
                end: "-=400 top",
                scrub: true,
            },
        }}
        class="flex items-center gap-6 lg:px-32 px-14 mb-6">
            <p>Latest Release</p>
            <HLine width="w-[72px]" />
        </div>
        <div
        use:animate={{
            type: "from",
            opacity: 0,
            y: "+=200",
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".gsap-new-music-trigger",
                start: "top bottom",
                end: "-=500 top",
                scrub: true,
            },
        }}
        class="relative">
            <a href="https://lnk.dmsmusic.co/variousartists_99" target="_blank">
                <div class="*:text-neutral-900 absolute lg:px-42 px-16 pb-8 flex w-full h-full items-center justify-between">
                    <div>
                        <p class="text-xl font-bold">Fall</p>
                        <p>OUT on Charge Rcrds</p>
                        <!-- <Button text="Listen" onClick={() => {}} white={true} /> -->
                    </div>
                    <p class="font-mono">01</p>
                </div>
                <img src={fallCover} alt="Fall cover" class="lg:w-[calc(100%-120px)] w-[calc(100%-48px)] h-[500px] object-cover object-top shadow-lg m-auto rounded-4xl relative -z-20">
            </a>
        </div>
    </section>

    <section id="wip" class="max-w-256 m-auto my-64 gsap-wip-trigger px-12 lg:px-0">
        <div class="mb-24">
            <div
            use:animate={{
                type: "from",
                opacity: 0,
                y: "-=20",
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: ".gsap-wip-trigger",
                    start: "-top bottom",
                    end: "-=400 top",
                    scrub: true,
                },
            }}
            class="flex justify-between pb-4">
                <h2 class="leading-5"><span>Currently working on...</span><br><span class="text-neutral-700">&#40;wip&#41;</span></h2>
                <p class="text-neutral-700 font-mono text-sm">2025/08/06</p>
            </div>
            <div class="flex w-full gap-6 flex-col lg:flex-row lg:gap-12">
                <div class="flex-3/5 gsap-audio-player">
                    <AudioPlayer source={chasingPreview} />
                </div>
                <div class="flex-2/5 gsap-audio-player">
                    <AudioPlayer source={returnPreview} white={false} />
                </div>
            </div>
        </div>
        <div
        use:animate={{
            type: "from",
            opacity: 0,
            y: "-=20",
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".gsap-wip-trigger",
                start: "top bottom",
                end: "-=400 top",
                scrub: true,
            },
        }}>
            <h2 class="leading-5 pb-4"><span>Favourite inspiration</span><br><span class="text-neutral-700">atm</span></h2>
            <iframe title="spotify" data-testid="embed-iframe" class="rounded-4xl shadow-sm" src="https://open.spotify.com/embed/playlist/0FqUXvZ7M3GVFJKMjLjRYE?utm_source=generator" width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    </section>

    <section id="releases" class="my-64 gsap-releases-trigger">
        <div
        use:animate={{
            type: "from",
            opacity: 0,
            y: "-=20",
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".gsap-releases-trigger",
                start: "-=200 bottom",
                end: "-=800 top",
                scrub: true,
            },
        }}
        class="flex items-center gap-6 lg:px-40 px-14 mb-6">
            <p>Discography</p>
            <HLine width="w-[72px]" />
        </div>
        <div class="flex *:flex-[40%] mb-24 gap-10 lg:px-24 px-12 flex-wrap flex-col lg:flex-row">
            {#each discography.music.slice(0, numShowReleases) as music}
                <SongCard {...music} />
            {/each}
        </div>
        <div class="flex justify-center gap-8 items-center">
            <p class="block text-neutral-700">{`${numShowReleases} of ${discography.music.length}`}</p>
            {#if numShowReleases < discography.music.length}
                <Button text="Show more" onClick={showMoreReleases} />
            {:else}
                <Button text="Show less" onClick={() => {numShowReleases = 2}} />
            {/if}
        </div>
    </section>

    <section id="links" class="max-w-[700px] m-auto my-64">
        <div class="relative">
            <div class="*:transition-colors *:text-[48px] sm:*:text-[64px] *:text-neutral-700 *:select-none *:rounded-full lg:*:px-16 lg:*:py-4 *:px-8 *:py-2 flex flex-col mb-24 lg:*:-my-[16px] *:-my-[8px]" bind:this={socialLinks}>
                <a href="https://www.instagram.com/jingbymusic/" target="_blank" class={`hover:bg-instagram ${arrowPosition === 0 ? "!text-neutral-200" : ""} gsap-social-link`} onmouseenter={() => {moveLinkArrow(0)}} onmouseleave={resetLinkArrow}>Instagram</a>
                <a href="https://open.spotify.com/artist/3TDfWLdQuUNkwquqtfZ3E5" target="_blank" class={`hover:bg-spotify ${arrowPosition === 1 ? "!text-neutral-200" : ""} gsap-social-link`} onmouseenter={() => {moveLinkArrow(1)}} onmouseleave={resetLinkArrow}>Spotify</a>
                <a href="https://www.youtube.com/channel/UCS1FtXKD79gI0gkj_8kj6dg" target="_blank" class={`hover:bg-youtube ${arrowPosition === 2 ? "!text-neutral-200" : ""} gsap-social-link`} onmouseenter={() => {moveLinkArrow(2)}} onmouseleave={resetLinkArrow}>Youtube</a>
                <a href="https://music.apple.com/us/artist/jingby/1584348569" target="_blank" class={`hover:bg-apple-music ${arrowPosition === 3 ? "!text-neutral-200" : ""} gsap-social-link`} onmouseenter={() => {moveLinkArrow(3)}} onmouseleave={resetLinkArrow}>Apple Music</a>
                <a href="https://www.beatport.com/artist/jingby/1066277" target="_blank" class={`hover:bg-beatport ${arrowPosition === 4 ? "!text-neutral-200" : ""} gsap-social-link`} onmouseenter={() => {moveLinkArrow(4)}} onmouseleave={resetLinkArrow}>Beatport</a>
                <a href="https://x.com/jingbymusic" target="_blank" class={`hover:bg-x ${arrowPosition === 5 ? "!text-neutral-200" : ""} gsap-social-link`} onmouseenter={() => {moveLinkArrow(5)}} onmouseleave={resetLinkArrow}>X</a>
            </div>
            <ArrowDownRight class="absolute top-0 right-1 md:right-2 lg:right-4 text-neutral-200 opacity-20 pt-2" size=80 id="link-arrow" />
        </div>
        <div
        use:animate={{
            type: "from",
            opacity: 0,
            y: "+=20",
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".gsap-links-download-trigger",
                start: "top bottom",
                end: "-=600 top",
                scrub: true,
            },
        }}
        class="flex flex-col items-center justify-center gap-8 gsap-links-download-trigger">
            <p>As a thank you, I put together this free mini sample<br>pack for you to experiment with if you want&nbsp;&nbsp;&nbsp;:&#41;</p>
            <Button text="Download" onClick={() => window.location.href = "https://www.dropbox.com/scl/fo/6igzepqkky2e3vgnweck2/ACWKQg9umE8vGV-Q5eB0SWY?rlkey=sdhm0dd8ffadmg61cwqn0q1o6&st=jv4fjpn7&dl=0"} />
        </div>
    </section>

    <img src={Initials} alt="initials, hg" class="m-auto my-48 pointer-events-none">
</main>

<footer class="relative left-0 w-screen h-screen bg-neutral-100 text-neutral-900 px-12 md:px-32 pt-24 *:relative *:z-10 selection:!bg-neutral-900 selection:!text-neutral-200">
    <header class="flex justify-between flex-col lg:flex-row gap-8 lg:gap-0">
        <div class="flex gap-2 md:gap-24 font-bold flex-col md:flex-row">
            <div class="flex items-center gap-6">
                <p>General</p>
                <HLine width="w-[72px]" color="bg-neutral-700" />
                <a href="mailto:info@jingby.net" class="text-primary">info@jingby.net</a>
            </div>
            <div class="text-neutral-900 flex items-center gap-6 font-bold">
                <p>Promo</p>
                <HLine width="w-[72px]" color="bg-neutral-700" />
                <a href="mailto:promo@jingby.net" class="text-primary">promo@jingby.net</a>
            </div>
        </div>
        <p>&copy;&nbsp;{new Date().getFullYear()},&nbsp;&nbsp;JINGBY</p>
    </header>
    <div class="font-bold text-lg text-center max-w-[360px] flex justify-center items-center flex-col h-[80%] m-auto pb-12">
        <p>If you came all the way down here, extra thank you for the support &lt;3<br><br>I hope you had a nice time</p>
        <span class="text-sm">&mdash;&nbsp;&nbsp;&nbsp;Hannes</span>
    </div>
</footer>
