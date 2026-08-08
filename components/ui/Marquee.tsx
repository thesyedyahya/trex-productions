const WORDS = [
  "3D ANIMATION",
  "CGI",
  "GAMES",
  "IMMERSIVE TECH",
  "BRANDING",
  "ROBOTICS",
  "AR / VR",
  "CHARACTER DESIGN",
];

export function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="relative overflow-hidden border-y border-teal/15 bg-deep/60 py-5">
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
        {row.map((word, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-mist/70">
              {word}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-spring/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
