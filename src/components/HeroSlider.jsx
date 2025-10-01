import { useEffect, useMemo, useRef, useState } from "react";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function HeroSlider({ slides: externalSlides, height = "h-[78vh] md:h-[90vh]" }) {
  const slides = useMemo(() => externalSlides || [], [externalSlides]);

  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const timer = useRef(null);
  const DUR = 6000;

  const next = () => setI((v) => (v + 1) % slides.length);
  const prev = () => setI((v) => (v - 1 + slides.length) % slides.length);
  const go = (idx) => setI(clamp(idx, 0, slides.length - 1));

  // autoplay (pause on hover or when tab hidden)
  useEffect(() => {
    if (!slides.length) return;
    const start = () => {
      clearInterval(timer.current);
      if (!hover && !document.hidden) timer.current = setInterval(next, DUR);
    };
    start();
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(timer.current);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [i, hover, slides.length]); // ✅ proper deps (no eslint comments)

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // touch swipe
  const touch = useRef({ x: 0, y: 0, t: 0, dragging: false });
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, t: Date.now(), dragging: true };
  };
  const onTouchMove = (e) => {
    if (!touch.current.dragging) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - touch.current.x);
    const dy = Math.abs(t.clientY - touch.current.y);
    if (dx > dy && dx > 10) e.preventDefault();
  };
  const onTouchEnd = (e) => {
    const d = touch.current;
    if (!d.dragging) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - d.x;
    const dt = Date.now() - d.t;
    const fast = dt < 400 && Math.abs(dx) > 30;
    const far = Math.abs(dx) > 70;
    if (fast || far) (dx < 0 ? next : prev)();
    touch.current.dragging = false;
  };

  if (!slides.length) return null;

  return (
    <section
      className="relative isolate overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes ken { from { transform: scale(1.03) } to { transform: scale(1.09) } }
        }
      `}</style>

      <div className={`relative ${height}`}>
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={[
              "absolute inset-0 will-change-opacity transition-opacity duration-700 ease-out",
              idx === i ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-hidden={idx !== i}
          >
            {s.src ? (
              <img
                src={s.src}
                alt={s.alt || ""}
                className="h-full w-full object-cover"
                loading={idx === 0 ? "eager" : "lazy"}
                fetchpriority={idx === 0 ? "high" : undefined}
                decoding="async"
                style={idx === i ? { animation: "ken 9s linear forwards" } : undefined}
              />
            ) : (
              <div className="h-full w-full bg-[linear-gradient(135deg,#0f172a,#312e81)]" />
            )}
            <div className="absolute inset-0 bg-black/40 md:bg-black/30" />
            <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(110%_85%_at_50%_15%,black,transparent)]">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/25" />
            </div>
          </div>
        ))}

        <div className="relative z-10 h-full">
          <div className="mx-auto flex h-full max-w-[1180px] flex-col items-center justify-center px-4 text-center text-white md:px-6">
            {slides[i].eyebrow && (
              <div className="text-sm/6 md:text-base/7 tracking-wide text-white/85">{slides[i].eyebrow}</div>
            )}
            {slides[i].title && (
              <h1 className="mt-2 text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight drop-shadow-sm">
                {slides[i].title}
              </h1>
            )}
            {slides[i].subtitle && (
              <p className="mt-4 max-w-3xl text-base md:text-xl text-white/90">{slides[i].subtitle}</p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {slides[i].cta1 && (
                <a
                  href={slides[i].cta1.href}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-sm ring-1 ring-white/60 transition hover:bg-white/95"
                >
                  {slides[i].cta1.label}
                </a>
              )}
              {slides[i].cta2 && (
                <a
                  href={slides[i].cta2.href}
                  className="relative inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold text-white ring-1 ring-white/70 backdrop-blur hover:bg-white/10 transition"
                >
                  {slides[i].cta2.label}
                  <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/15" />
                </a>
              )}
            </div>

            <div className="mt-8 flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => go(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={[
                    "h-2.5 w-2.5 rounded-full transition",
                    idx === i ? "bg-white shadow ring-1 ring-white/60" : "bg-white/60 hover:bg-white/80",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={prev}
          aria-label="Previous"
          className="group absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/70 p-3 text-slate-900 shadow backdrop-blur transition hover:bg-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="group absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/70 p-3 text-slate-900 shadow backdrop-blur transition hover:bg-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
