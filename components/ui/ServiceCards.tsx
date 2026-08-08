"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue } from "motion/react";
import { SERVICES } from "@/lib/data";
import { withBase } from "@/lib/paths";
import { sound } from "@/lib/audio";
import { SectionHeading } from "./Sections";

const GAP = 24;

/* Line icons drawn with the logo's lime→teal gradient stroke. */
function ServiceIcon({ id }: { id: string }) {
  const grad = `svc-grad-${id}`;
  const paths: Record<string, React.ReactNode> = {
    animation: (
      <>
        <path d="M6 18h36v22H6z" />
        <path d="M7.5 18 9 8l33 4-.6 6" />
        <path d="m15 9.2 5 8M25 10.4l5 7.6M35 11.6l4.6 6.4" />
      </>
    ),
    games: (
      <>
        <rect x="4" y="14" width="40" height="20" rx="10" />
        <path d="M14 20v8M10 24h8" />
        <circle cx="32.5" cy="21.5" r="2" />
        <circle cx="37.5" cy="26.5" r="2" />
      </>
    ),
    immersive: (
      <>
        <path d="M24 6 38 14v16L24 38 10 30V14L24 6Z" />
        <path d="M24 22 38 14M24 22 10 14M24 22v16" />
      </>
    ),
    branding: (
      <>
        <path d="M24 6 34 26 24 42 14 26 24 6Z" />
        <circle cx="24" cy="26" r="3" />
        <path d="M24 6v17" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14" aria-hidden>
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6bfd5c" />
          <stop offset="0.5" stopColor="#45e78f" />
          <stop offset="1" stopColor="#15cbd0" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${grad})`} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        {paths[id]}
      </g>
    </svg>
  );
}

/* One card of the deck: hover to flip on desktop, tap on touch. */
function FlipCard({
  service,
  index,
}: {
  service: (typeof SERVICES)[number];
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const canHover = useRef(false);

  useEffect(() => {
    canHover.current = window.matchMedia("(hover: hover)").matches;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => {
        if (!canHover.current) return;
        setFlipped(true);
        sound.blip(1500 + index * 120);
      }}
      onHoverEnd={() => {
        if (canHover.current) setFlipped(false);
      }}
      onTap={() => {
        if (!canHover.current) setFlipped((f) => !f);
      }}
      className="h-[440px] w-[min(340px,82vw)] shrink-0 cursor-pointer md:w-[400px] [perspective:1400px]"
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.32, 0.72, 0.35, 1] }}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        {/* front */}
        <div className="holo-panel absolute inset-0 flex flex-col overflow-hidden rounded-3xl p-8 [backface-visibility:hidden]">
          <div className="flex items-start justify-between">
            <span className="font-mono text-sm text-spring">0{index + 1}</span>
            <Image
              src={withBase("/brand/footprint.png")}
              alt=""
              width={86}
              height={108}
              className="h-9 w-auto opacity-80"
            />
          </div>

          <div className="mt-auto">
            <ServiceIcon id={service.id} />
            <h3 className="mt-6 font-display text-3xl font-bold leading-tight text-frost">
              {service.title}
            </h3>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-mist/70">
              {service.tagline}
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-lime to-teal" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist/60">
              Flip for details
            </span>
          </div>

          {/* oversized watermark */}
          <Image
            src={withBase("/brand/footprint.png")}
            alt=""
            width={86}
            height={108}
            className="pointer-events-none absolute -bottom-10 -right-8 h-56 w-auto opacity-[0.05]"
          />
        </div>

        {/* back */}
        <div className="gradient-border absolute inset-0 flex flex-col overflow-hidden !rounded-3xl p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-spring">
            // {service.tagline}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-mist">
            {service.description}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {service.items.map((item) => (
              <li
                key={item}
                className="rounded-full border border-spring/25 bg-spring/5 px-3.5 py-1 font-mono text-[11px] uppercase tracking-wider text-frost/80"
              >
                {item}
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="gradient-text mt-auto inline-block font-mono text-sm font-bold uppercase tracking-[0.2em]"
          >
            Start a project →
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* Draggable deck of flip cards with arrows + page dots. */
export function Services() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [page, setPage] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const [step, setStep] = useState(424);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const first = track.children[0] as HTMLElement | undefined;
    if (first) setStep(first.offsetWidth + GAP);
    setMaxOffset(Math.max(0, track.scrollWidth - viewport.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const maxPage = step > 0 ? Math.ceil(maxOffset / step) : 0;

  const goTo = useCallback(
    (target: number) => {
      const clamped = Math.min(0, Math.max(-maxOffset, -target * step));
      const landed =
        clamped <= -maxOffset + 1 ? maxPage : Math.round(-clamped / step);
      setPage(landed);
      sound.blip(1100 + landed * 140);
      animate(x, clamped, { type: "spring", stiffness: 240, damping: 32 });
    },
    [maxOffset, maxPage, step, x]
  );

  return (
    <section id="services" className="section-grid relative overflow-hidden py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Capabilities" title="Four disciplines. One bite." />

          <div className="flex items-center gap-3">
            <span className="mr-2 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-mist/50 md:block">
              Drag the deck · flip a card
            </span>
            <button
              aria-label="Previous services"
              onClick={() => goTo(page - 1)}
              disabled={page <= 0}
              className="gradient-border gradient-border-pill grid h-11 w-11 place-items-center text-spring transition-all enabled:hover:shadow-[0_0_24px_rgba(69,231,143,0.3)] disabled:opacity-30"
            >
              ←
            </button>
            <button
              aria-label="Next services"
              onClick={() => goTo(page + 1)}
              disabled={page >= maxPage}
              className="gradient-border gradient-border-pill grid h-11 w-11 place-items-center text-spring transition-all enabled:hover:shadow-[0_0_24px_rgba(69,231,143,0.3)] disabled:opacity-30"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* deck viewport bleeds to the screen edge on the right */}
      <div ref={viewportRef} className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -maxOffset, right: 0 }}
          dragElastic={0.06}
          style={{ x }}
          onDragEnd={(_, info) => {
            const predicted = x.get() + info.velocity.x * 0.18;
            goTo(Math.round(-predicted / step));
          }}
          className="flex gap-6"
        >
          {SERVICES.map((service, i) => (
            <FlipCard key={service.id} service={service} index={i} />
          ))}
        </motion.div>
      </div>

      {/* page dots */}
      {maxPage > 0 && (
        <div className="mt-10 flex justify-center gap-2.5">
          {Array.from({ length: maxPage + 1 }, (_, i) => (
            <button
              key={i}
              aria-label={`Go to page ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                page === i
                  ? "w-8 bg-gradient-to-r from-lime to-teal"
                  : "w-3 bg-mist/25 hover:bg-mist/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
