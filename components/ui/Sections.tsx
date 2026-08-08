"use client";

import { motion } from "motion/react";
import { CONTACT, PROJECTS, STATS } from "@/lib/data";

const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function SectionHeading({
  eyebrow,
  title,
  className = "",
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.34em] text-spring">
        // {eyebrow}
      </p>
      <h2 className="font-display text-4xl font-bold tracking-tight text-frost md:text-5xl">
        {title}
      </h2>
    </motion.div>
  );
}

/* ─── Work ───────────────────────────────────────────────────────── */

export function Work() {
  return (
    <section id="work" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Selected work" title="Footprints we left behind" />
          <motion.p
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0.15}
            className="max-w-sm text-sm leading-relaxed text-mist"
          >
            A sneak peek from the archive. Request a meeting and we&apos;ll show
            you the rest of the fossil record.
          </motion.p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <motion.a
              key={project.id}
              href="#contact"
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={i * 0.08}
              className="group relative block overflow-hidden rounded-3xl border border-teal/15 shadow-[0_16px_44px_rgba(2,6,26,0.5)] transition-shadow duration-300 hover:shadow-[0_20px_56px_rgba(2,6,26,0.6),0_8px_48px_rgba(69,231,143,0.12)]"
            >
              <div
                className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-105"
                style={{
                  background: `
                    radial-gradient(120% 120% at 20% 10%, ${project.palette[0]}26 0%, transparent 50%),
                    radial-gradient(120% 120% at 85% 90%, ${project.palette[1]}33 0%, transparent 55%),
                    linear-gradient(160deg, #0a1a45 0%, #051239 100%)
                  `,
                }}
              >
                {/* wireframe deco */}
                <svg
                  className="h-full w-full opacity-40 transition-opacity group-hover:opacity-70"
                  viewBox="0 0 400 250"
                  fill="none"
                >
                  <circle cx="330" cy="60" r="90" stroke={project.palette[0]} strokeOpacity="0.35" />
                  <circle cx="330" cy="60" r="60" stroke={project.palette[0]} strokeOpacity="0.25" />
                  <path d="M0 200 L400 140" stroke={project.palette[1]} strokeOpacity="0.4" />
                  <path d="M0 220 L400 175" stroke={project.palette[1]} strokeOpacity="0.25" />
                  <rect x="40" y="40" width="70" height="70" stroke={project.palette[0]} strokeOpacity="0.3" />
                </svg>
              </div>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-abyss via-abyss/70 to-transparent p-6 pt-16">
                <div>
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] text-spring">
                    {project.category}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-frost">
                    {project.title}
                  </h3>
                </div>
                <span className="font-mono text-xs text-mist/60">{project.year}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Studio (about + stats) ─────────────────────────────────────── */

export function Studio() {
  return (
    <section id="studio" className="section-grid relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="The studio" title="Apex creativity, engineered in Dubai" className="mb-8" />
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={0.15}
              className="space-y-5 text-base leading-relaxed text-mist"
            >
              <p>
                We are a pack of artists, animators and engineers with over
                fifteen years of experience turning brilliant ideas into
                reality — with no limits to creativity.
              </p>
              <p>
                Like the giants that ruled before us, we believe in impact.
                Every film, game and installation we build is designed to leave
                a footprint your audience can&apos;t forget.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.08}
                className="holo-panel p-7 text-center"
              >
                <p className="gradient-text glow-drop font-display text-4xl font-bold md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mist">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────────────────── */

export function ContactCTA() {
  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-36">
      {/* glow backdrop */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-spring/10 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-4 font-mono text-xs uppercase tracking-[0.34em] text-spring"
        >
          // Transmission open
        </motion.p>
        <motion.h2
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0.1}
          className="font-display text-5xl font-bold tracking-tight md:text-7xl"
        >
          READY TO <span className="gradient-text glow-drop">ROAR?</span>
        </motion.h2>
        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0.2}
          className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-mist"
        >
          Tell us what you&apos;re building. We&apos;ll bring the teeth.
        </motion.p>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0.3}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={`mailto:${CONTACT.email}`}
            className="rounded-full bg-gradient-to-r from-lime via-spring to-teal px-8 py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-abyss shadow-[0_0_28px_rgba(69,231,143,0.35)] transition-all hover:shadow-[0_0_44px_rgba(107,253,92,0.5)]"
          >
            {CONTACT.email}
          </a>
          <a
            href={CONTACT.phoneHref}
            className="px-3 py-4 font-mono text-sm tracking-[0.12em] text-mist transition-colors hover:text-frost"
          >
            {CONTACT.phone}
          </a>
        </motion.div>

        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0.4}
          className="mt-10 font-mono text-xs leading-relaxed text-mist/60"
        >
          <a
            href={CONTACT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-spring"
          >
            {CONTACT.address}
          </a>
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────── */

export function Footer() {
  return (
    <footer className="border-t border-teal/15 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 md:flex-row md:px-8">
        <p className="font-mono text-xs text-mist/50">
          © {new Date().getFullYear()} T-Rex Productions FZ-LLC · Dubai, UAE
        </p>
        <div className="flex gap-6">
          {CONTACT.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-[0.18em] text-mist/60 transition-colors hover:text-spring"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
