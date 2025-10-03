// src/components/HeroPro.jsx — Ultra Premier Slider (single CTA only)
// Book/WhatsApp CTAs are auto-removed. Order is controlled by the slides you pass in.

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/* SmartLink */
function SmartLink({ href, className = "", children, ...rest }) {
  const smooth = (e) => {
    e.stopPropagation();
    if (typeof href === "string" && href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (typeof href === "string" && href.startsWith("/")) {
    return (
      <Link
        to={href}
        className={className}
        data-stop-banner
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        {children}
      </Link>
    );
  }
  if (typeof href === "string" && href.startsWith("#")) {
    return (
      <a href={href} className={className} data-stop-banner onClick={smooth} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a
      href={href}
      className={className}
      data-stop-banner
      onClick={(e) => e.stopPropagation()}
      {...rest}
    >
      {children}
    </a>
  );
}

/* Remove any Book/WA CTAs regardless of what slides pass */
function sanitizeCTAs(ctaList = []) {
  const BAD = /(book\s*now?|reserve|whats\s*app|whatsapp|wa\.me)/i;
  return ctaList.filter(
    (c) =>
      c &&
      typeof c.label === "string" &&
      !BAD.test(c.label) &&
      (typeof c.href !== "string" || !BAD.test(c.href))
  );
}

/**
 * Props
 * - slides: Array<{ src?, video?, alt?, eyebrow?, title?, subtitle?,
 *                   cta1?, cta2?, cta3?, clickHref? }>
 * - height: Tailwind class (default: h-[92vh])
 * - fit: 'cover' | 'contain' (default: 'cover')
 * - autoPlay: boolean (default: true)
 * - duration: number ms per slide (default: 6000)
 * - transitionMs: number crossfade (default: 900)
 * - showDots/arrows/progress: booleans
 * - bannerHref: string | null (default: null)
 * - ignoreReducedMotion: boolean (default: true)
 * - singleCTA: {label, href, target?, rel?} | null  // optional global override for the one button
 */
export default function HeroPro({
  slides: extSlides,
  height = "h-[92vh]",
  fit = "cover",
  autoPlay = true,
  duration = 6000,
  transitionMs = 900,
  showDots = true,
  showArrows = true,
  showProgress = true,
  bannerHref = null,
  ignoreReducedMotion = true,
  singleCTA = null, // <— NEW
}) {
  const slides = useMemo(() => extSlides || [], [extSlides]);
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const loaded = useRef(new Set());
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const prefersReduced = usePrefersReducedMotion();
  const navigate = useNavigate();

  const active = slides.length ? i % slides.length : 0;
  const next = () => setI((v) => (v + 1) % slides.length);
  const prev = () => setI((v) => (v - 1 + slides.length) % slides.length);
  const go = (idx) => setI(clamp(idx, 0, slides.length - 1));

  // AUTOPLAY
  useEffect(() => {
    const reduceBlock = prefersReduced && !ignoreReducedMotion;
    const shouldRun =
      slides.length > 1 && autoPlay && !reduceBlock && !hover && !focusWithin && !document.hidden;

    const clearTimers = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      intervalRef.current = null;
      timeoutRef.current = null;
    };

    clearTimers();
    if (shouldRun) {
      intervalRef.current = setInterval(next, duration);
      timeoutRef.current = setTimeout(next, duration + 250);
    }

    const onVis = () => {
      clearTimers();
      if (!document.hidden && shouldRun) {
        intervalRef.current = setInterval(next, duration);
        timeoutRef.current = setTimeout(next, duration + 250);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      clearTimers();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [slides.length, autoPlay, prefersReduced, ignoreReducedMotion, hover, focusWithin, duration]);

  // keyboard arrows
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
    if (fast || far) (dx < 0 ? next() : prev());
    touch.current.dragging = false;
  };

  if (!slides.length) return null;

  // Preload next image
  const nextIdx = (active + 1) % slides.length;
  const preloadSrc = slides[nextIdx]?.src;

  // Whole banner click -> route (per-slide overrides global)
  const onBannerClick = (e) => {
    const s = slides[active];
    const clickHref = s?.clickHref ?? bannerHref;
    if (!clickHref) return;
    if (e.target.closest("[data-stop-banner],a,button,[role='button']")) return;
    if (clickHref.startsWith("/")) navigate(clickHref);
    else window.location.href = clickHref;
  };

  // Collect sanitized CTAs and keep ONLY ONE
  const slideCTAs = sanitizeCTAs(
    [slides[active]?.cta1, slides[active]?.cta2, slides[active]?.cta3].filter(Boolean)
  );

  // 1) global override if provided; else 2) first sanitized slide CTA; else 3) fallback
  const chosenCTA =
    singleCTA ??
    slideCTAs[0] ?? {
      label: "Explore Rooms",
      href: "#rooms",
    };

  return (
    <section
      className="relative isolate overflow-hidden w-screen cursor-pointer bg-black"
      onClick={onBannerClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={() => setFocusWithin(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Hero image carousel"
      style={{ contain: "paint", backfaceVisibility: "hidden" }}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes ken { from { transform: scale(1.035) } to { transform: scale(1.095) } }
        }
      `}</style>

      <div className={`relative ${height}`}>
        {/* Slides */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={active}
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: transitionMs / 1000, ease: "easeOut" }}
            aria-hidden={false}
            style={{ willChange: "opacity" }}
          >
            {/* Base layer stays black even if image not painted yet */}
            <div className="absolute inset-0 bg-black" />

            {fit === "contain" && <div className="absolute inset-0 bg-black" />}

            {slides[active]?.video ? (
              <video
                src={slides[active].video}
                className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} object-center`}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                style={{ willChange: "transform", backfaceVisibility: "hidden" }}
              />
            ) : (
              <motion.img
                src={slides[active]?.src}
                alt={slides[active]?.alt || ""}
                onLoad={() => loaded.current.add(active)}
                className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} object-center`}
                style={{
                  animation: fit === "cover" ? "ken 9.5s linear forwards" : undefined,
                  backgroundColor: "#000",
                  willChange: "transform, opacity",
                  transform: "translateZ(0)",
                }}
                loading={active === 0 ? "eager" : "lazy"}
                fetchpriority={active === 0 ? "high" : "auto"}
                decoding="async"
              />
            )}

            {/* Tint overlay */}
            <div className="absolute inset-0 bg-black/25 md:bg-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* Preload next */}
        {preloadSrc && <link rel="preload" as="image" href={preloadSrc} />}

        {/* Overlay content */}
        <div className="relative z-10 h-full" data-stop-banner>
          <div className="mx-auto flex h-full max-w-[1180px] flex-col items-center justify-center px-4 text-center text-white md:px-6">
            <motion.div
              key={`t-${active}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full"
              style={{ willChange: "transform, opacity" }}
            >
              {slides[active]?.eyebrow && (
                <div className="text-sm md:text-base tracking-wide text-white/90">
                  {slides[active].eyebrow}
                </div>
              )}
              {slides[active]?.title && (
                <h1 className="mt-2 text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight drop-shadow">
                  {slides[active].title}
                </h1>
              )}
              {slides[active]?.subtitle && (
                <p className="mt-4 mx-auto max-w-3xl text-base md:text-xl text-white/90">
                  {slides[active].subtitle}
                </p>
              )}

              {/* SINGLE CTA ONLY */}
              <div className="mt-8 flex items-center justify-center">
                <SmartLink
                  href={chosenCTA.href}
                  target={chosenCTA.target}
                  rel={chosenCTA.rel}
                  className="relative inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold text-white ring-1 ring-white/70 backdrop-blur hover:bg-white/10 transition"
                >
                  {chosenCTA.label}
                </SmartLink>
              </div>

              {/* progress bars */}
              {showProgress && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {slides.map((_, idx) => (
                    <span key={idx} className="relative h-1 w-16 overflow-hidden rounded-full bg-white/30">
                      <span
                        className={`absolute left-0 top-0 h-full bg-white ${idx === active ? "w-full" : "w-0"}`}
                        style={idx === active ? { transition: `width ${duration}ms linear` } : undefined}
                      />
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* arrows */}
        {showArrows && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous slide"
              className="group absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/70 p-3 text-slate-900 shadow backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              data-stop-banner
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next slide"
              className="group absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/70 p-3 text-slate-900 shadow backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              data-stop-banner
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </>
        )}

        {/* dots */}
        {showDots && (
          <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-2" data-stop-banner>
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); go(idx); }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${idx === active ? "bg-white shadow ring-1 ring-white/60" : "bg-white/60 hover:bg-white/80"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ----------------------------- hooks ----------------------------- */
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setPrefers(mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return prefers;
}
