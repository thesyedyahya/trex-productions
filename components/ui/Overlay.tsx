"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { CONTACT, NAV_LINKS } from "@/lib/data";
import { sound } from "@/lib/audio";

/* ─── Brand mark — the original T-Rex Productions logo ───────────── */

export function BrandMark() {
  return (
    <a
      href="#top"
      className="fixed left-5 top-5 z-[70] block md:left-8 md:top-6"
      onMouseEnter={() => sound.blip(1200)}
    >
      <Image
        src="/brand/logo.png"
        alt="T-Rex Productions"
        width={327}
        height={106}
        priority
        className="h-10 w-auto drop-shadow-[0_0_18px_rgba(21,203,208,0.35)] transition-transform duration-300 hover:scale-105 md:h-12"
      />
    </a>
  );
}

/* ─── Menu orb + fullscreen immersive menu ───────────────────────── */

export function MenuSystem() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const toggle = () => {
    sound.whoosh();
    setOpen((o) => !o);
  };

  return (
    <>
      {/* orb */}
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={toggle}
        onMouseEnter={() => sound.blip()}
        className="group fixed right-5 top-5 z-[75] grid h-12 w-12 place-items-center md:right-8 md:top-6"
      >
        <span className="absolute inset-0 rounded-full border border-teal/40 bg-abyss/60 backdrop-blur-md transition-all duration-300 group-hover:shadow-[0_0_28px_rgba(69,231,143,0.35)]" />
        <span className="absolute inset-0 animate-pulse-glow rounded-full border border-teal/25" />
        <span className="relative flex h-3.5 w-5 flex-col justify-between">
          <span
            className={`h-px w-full bg-spring transition-all duration-300 ${
              open ? "translate-y-[6.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-full bg-spring transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-px w-full bg-spring transition-all duration-300 ${
              open ? "-translate-y-[6.5px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {/* fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="scanlines fixed inset-0 z-[72] bg-deep/95 backdrop-blur-2xl"
          >
            <div className="section-grid flex h-full flex-col justify-between px-6 pb-10 pt-28 md:px-16">
              <nav className="flex flex-col gap-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.25 + i * 0.08, duration: 0.5 },
                    }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => sound.blip(1400 + i * 180)}
                    className="group flex items-baseline gap-5 py-2"
                  >
                    <span className="font-mono text-xs text-spring/60">
                      0{i + 1}
                    </span>
                    <span className="font-display text-5xl font-bold tracking-tight text-frost/80 transition-all duration-200 group-hover:translate-x-3 group-hover:text-spring md:text-7xl">
                      {link.label.toUpperCase()}
                    </span>
                    <span className="h-px flex-1 origin-left scale-x-0 bg-spring/40 transition-transform duration-300 group-hover:scale-x-100" />
                  </motion.a>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.55 } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="flex flex-wrap items-end justify-between gap-6 border-t border-teal/20 pt-6"
              >
                <div>
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-mist/60">
                    Transmission
                  </p>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="font-mono text-sm text-spring hover:text-frost"
                    onMouseEnter={() => sound.blip()}
                  >
                    {CONTACT.email}
                  </a>
                </div>
                <div className="flex gap-5">
                  {CONTACT.socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => sound.blip()}
                      className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist/70 transition-colors hover:text-spring"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Section HUD dots (right edge) ──────────────────────────────── */

const SECTIONS = [
  { id: "top", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "studio", label: "Studio" },
  { id: "contact", label: "Contact" },
];

export function SectionDots() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { threshold: 0.35 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed right-6 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={label}
          onMouseEnter={() => sound.blip(2000)}
          className="group relative flex items-center"
        >
          <span className="absolute right-6 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-spring opacity-0 transition-opacity group-hover:opacity-100">
            {label}
          </span>
          <span
            className={`block rotate-45 border transition-all duration-300 ${
              active === id
                ? "h-2.5 w-2.5 border-spring bg-spring/40 shadow-[0_0_12px_rgba(69,231,143,0.7)]"
                : "h-2 w-2 border-mist/40 group-hover:border-spring/70"
            }`}
          />
        </a>
      ))}
    </div>
  );
}

/* ─── Sound toggle (bottom left) ─────────────────────────────────── */

export function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const sync = () => setOn(sound.enabled);
    window.addEventListener("trex-sound-change", sync);
    return () => window.removeEventListener("trex-sound-change", sync);
  }, []);

  const toggle = () => {
    sound.init();
    sound.setEnabled(!sound.enabled);
    setOn(sound.enabled);
    if (sound.enabled) sound.blip(900);
  };

  return (
    <button
      onClick={toggle}
      aria-label={on ? "Mute sound" : "Enable sound"}
      className="fixed bottom-6 left-5 z-[70] flex items-center gap-3 rounded-full border border-teal/30 bg-abyss/60 px-4 py-2.5 shadow-[0_8px_24px_rgba(2,6,26,0.5)] backdrop-blur-md transition-colors hover:border-teal/70 md:left-8"
    >
      <span className="flex h-3.5 items-end gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[2px] bg-spring transition-all duration-300 ${
              on ? "animate-eq" : "h-[3px] opacity-40"
            }`}
            style={on ? { animationDelay: `${i * 0.13}s` } : undefined}
          />
        ))}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist">
        {on ? "Sound on" : "Sound off"}
      </span>
    </button>
  );
}
