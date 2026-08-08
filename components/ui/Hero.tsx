"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

const ScrollScene = dynamic(() => import("@/components/three/ScrollScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <span className="animate-pulse-glow font-mono text-xs uppercase tracking-[0.3em] text-spring">
        Waking the rex…
      </span>
    </div>
  ),
});

const BEAT_IDS = ["01", "02", "03", "04"];

/* Which beat owns each slice of the 0→1 hero scroll. */
function beatFor(p: number) {
  if (p < 0.24) return 0;
  if (p < 0.52) return 1;
  if (p < 0.78) return 2;
  return 3;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/*
 * Scroll-story hero: a 400vh strip with a pinned viewport. Scrolling flies
 * the camera around the rex (see ScrollScene) while four copy beats hand
 * over to each other. Exactly one beat is visible at a time — inactive
 * beats animate out and end at visibility:hidden so they can never sit on
 * top of the active copy.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [beat, setBeat] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setBeat(beatFor(v));
  });

  const rail = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  const show = (active: boolean, hidden: Record<string, number>) => ({
    initial: false as const,
    animate: active
      ? { opacity: 1, x: 0, y: 0, visibility: "visible" as const }
      : {
          opacity: 0,
          ...hidden,
          transitionEnd: { visibility: "hidden" as const },
        },
    transition: { duration: 0.55, ease: EASE },
  });

  return (
    <section id="top" ref={ref} className="relative h-[400vh]">
      <div className="sticky top-0 h-svh min-h-[640px] w-full overflow-hidden">
        {/* 3D layer — scroll drives the camera */}
        <div className="absolute inset-0">
          <ScrollScene progress={scrollYProgress} />
        </div>

        {/* readability gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-abyss/80 to-transparent" />

        {/* progress rail — left edge */}
        <div className="pointer-events-none absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-4 md:flex md:left-8">
          <div className="relative h-44 w-px bg-mist/20">
            <motion.div
              style={{ height: rail }}
              className="absolute left-0 top-0 w-px bg-gradient-to-b from-lime to-teal"
            />
          </div>
          <div className="flex h-44 flex-col justify-between">
            {BEAT_IDS.map((id, i) => (
              <p
                key={id}
                className={`font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                  beat === i ? "text-spring" : "text-mist/50"
                }`}
              >
                {id}
              </p>
            ))}
          </div>
        </div>

        {/* beat 1 — headline */}
        <motion.div
          data-beat="1"
          {...show(beat === 0, { y: -50 })}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        >
          <div className="mx-auto max-w-7xl px-5 pb-28 md:px-8">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.34em] text-spring">
              Creative production studio — Dubai
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl lg:text-8xl">
              WE MAKE <br />
              <span className="gradient-text">BRANDS ROAR</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-mist md:text-lg">
              3D animation, CGI, games and immersive experiences — engineered
              by a pack of creators who leave footprints impossible to ignore.
            </p>
          </div>
        </motion.div>

        {/* beat 2 — animation & CGI */}
        <motion.div
          data-beat="2"
          {...show(beat === 1, { x: -50 })}
          className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center"
        >
          <div className="max-w-md px-5 md:px-14 lg:px-24">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-spring">
              01 / Animation & CGI
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Cinematic worlds, <span className="gradient-text">frame by frame</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-mist md:text-base">
              Storyboards, character animation and full CGI production for
              film, advertising and events.
            </p>
          </div>
        </motion.div>

        {/* beat 3 — games & immersive */}
        <motion.div
          data-beat="3"
          {...show(beat === 2, { x: 50 })}
          className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center"
        >
          <div className="max-w-md px-5 text-right md:px-14 lg:px-24">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-spring">
              02 / Games & immersive
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Technology <span className="gradient-text">people can touch</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-mist md:text-base">
              Branded games, AR activations, robotic shows and interactive
              installations built in-house.
            </p>
          </div>
        </motion.div>

        {/* beat 4 — finale CTA */}
        <motion.div
          data-beat="4"
          {...show(beat === 3, { y: 40 })}
          className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center ${
            beat === 3 ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.34em] text-spring">
            The pack is ready
          </p>
          <h2 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
            READY TO <span className="gradient-text glow-drop">ROAR?</span>
          </h2>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#work"
              className="rounded-full bg-gradient-to-r from-lime via-spring to-teal px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.2em] text-abyss shadow-[0_0_28px_rgba(69,231,143,0.35)] transition-all hover:shadow-[0_0_44px_rgba(107,253,92,0.5)]"
            >
              See our work
            </a>
            <a
              href="#contact"
              className="px-2 py-3.5 font-mono text-sm uppercase tracking-[0.2em] text-mist transition-colors hover:text-frost"
            >
              Start a project →
            </a>
          </div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={false}
          animate={
            beat === 0
              ? { opacity: 1, visibility: "visible" as const }
              : { opacity: 0, transitionEnd: { visibility: "hidden" as const } }
          }
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-mist/60">
            Scroll to explore
          </span>
          <div className="h-9 w-5 rounded-full border border-spring/50 p-1">
            <div className="mx-auto h-2 w-1 animate-bounce rounded-full bg-spring" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
