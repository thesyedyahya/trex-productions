"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sound } from "@/lib/audio";

/* ─── Boot sequence overlay with sound-entry choice ──────────────── */

const BOOT_LINES = [
  "T-REX OS v3.0 — DUBAI NODE",
  "> mounting creative engine … OK",
  "> loading production suite … OK",
  "> calibrating roar levels … MAX",
];

export function BootLoader() {
  const [visible, setVisible] = useState(true);
  const [lineCount, setLineCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lineTimer = setInterval(() => {
      setLineCount((n) => {
        if (n >= BOOT_LINES.length) {
          clearInterval(lineTimer);
          return n;
        }
        return n + 1;
      });
    }, 280);

    const progressTimer = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 24;
        if (next >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setReady(true), 250);
          return 100;
        }
        return next;
      });
    }, 160);

    return () => {
      clearInterval(lineTimer);
      clearInterval(progressTimer);
    };
  }, []);

  const enter = (withSound: boolean) => {
    sound.init();
    sound.setEnabled(withSound);
    window.dispatchEvent(new Event("trex-sound-change"));
    if (withSound) sound.whoosh();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.55 } }}
          className="scanlines fixed inset-0 z-[100] grid place-items-center bg-abyss"
        >
          <div className="w-[min(440px,86vw)] font-mono text-xs leading-7">
            {BOOT_LINES.slice(0, lineCount).map((line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={i === 0 ? "text-spring" : "text-mist"}
              >
                {line}
              </motion.p>
            ))}

            <div className="mt-4 h-px w-full bg-teal/20">
              <div
                className="h-px bg-gradient-to-r from-lime to-teal shadow-[0_0_12px_rgba(69,231,143,0.8)] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-right text-spring/70">
              {Math.min(100, Math.round(progress))}%
            </p>

            <AnimatePresence>
              {ready && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex flex-col gap-3 sm:flex-row"
                >
                  <button
                    onClick={() => enter(true)}
                    className="flex-1 rounded-full border border-spring/50 bg-spring/10 px-5 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-spring transition-all hover:bg-spring/20 hover:shadow-[0_0_28px_rgba(69,231,143,0.3)]"
                  >
                    Enter with sound
                  </button>
                  <button
                    onClick={() => enter(false)}
                    className="flex-1 rounded-full border border-mist/20 px-5 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-mist transition-colors hover:border-mist/50 hover:text-frost"
                  >
                    Enter muted
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Film grain overlay ─────────────────────────────────────────── */

export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "256px 256px",
      }}
    />
  );
}
