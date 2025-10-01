// src/components/ReviewsStrip.jsx — Client Reviews (Premium, smooth, ESLint-safe)
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Premium testimonials carousel with crossfade, autoplay, keyboard + swipe.
 * Usage: <ReviewsStrip reviews={optionalReviews}/>
 * Each review: { name, rating (1-5), source, stay?, quote, img? }
 */
export default function ReviewsStrip({ reviews: external }) {
  const reviews = useMemo(() => external || DEFAULTS, [external]);
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const timer = useRef(null);
  const DUR = 6000;

  const next = () => setI((v) => (v + 1) % reviews.length);
  const prev = () => setI((v) => (v - 1 + reviews.length) % reviews.length);
  const go = (idx) =>
    setI(Math.max(0, Math.min(idx, Math.max(0, reviews.length - 1))));

  // autoplay (pause on hover / hidden tab)
  useEffect(() => {
    if (!reviews.length) return;
    clearInterval(timer.current);
    if (!hover && !document.hidden) timer.current = setInterval(next, DUR);
    const vis = () => {
      clearInterval(timer.current);
      if (!hover && !document.hidden) timer.current = setInterval(next, DUR);
    };
    document.addEventListener("visibilitychange", vis);
    return () => {
      clearInterval(timer.current);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [hover, reviews.length]);

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // swipe
  const touch = useRef({ x: 0, t: 0, dragging: false });
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, t: Date.now(), dragging: true };
  };
  const onTouchMove = (e) => {
    if (!touch.current.dragging) return;
    const t = e.touches[0];
    if (Math.abs(t.clientX - touch.current.x) > 10) e.preventDefault();
  };
  const onTouchEnd = (e) => {
    const d = touch.current;
    if (!d.dragging) return;
    const dx = e.changedTouches[0].clientX - d.x;
    const dt = Date.now() - d.t;
    const fast = dt < 400 && Math.abs(dx) > 30;
    const far = Math.abs(dx) > 70;
    if (fast || far) (dx < 0 ? next : prev)();
    d.dragging = false;
  };

  if (!reviews.length) return null;

  return (
    <div
      className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Guest reviews"
    >
      <div className="px-4 md:px-6 py-10 md:py-12">
        <header className="text-center">
          <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">
            What Guests Say
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">
            Real Reviews, Happy Stays
          </h2>
        </header>

        {/* Card */}
        <div className="mx-auto mt-8 max-w-3xl">
          <AnimatePresence initial={false} mode="wait">
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl bg-[radial-gradient(120%_120%_at_50%_-10%,#ffffff,#faf7ff)] ring-1 ring-slate-200/80 p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <Avatar name={reviews[i].name} img={reviews[i].img} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base md:text-lg font-semibold text-slate-900">
                      {reviews[i].name}
                    </h3>
                    <span className="text-xs text-slate-500">
                      · {reviews[i].source}
                    </span>
                  </div>
                  <Stars n={reviews[i].rating} />
                  <p className="mt-3 text-slate-700 leading-relaxed">
                    {reviews[i].quote}
                  </p>
                  {reviews[i].stay && (
                    <p className="mt-2 text-sm text-slate-500">
                      Stayed in{" "}
                      <span className="font-medium text-slate-700">
                        {reviews[i].stay}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </motion.article>
          </AnimatePresence>

          {/* Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => go(idx)}
                aria-label={`Go to review ${idx + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  idx === i
                    ? "bg-violet-600"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* subtle border accents */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-200/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-200/80 to-transparent" />
    </div>
  );
}

/* ----------------- helpers ----------------- */
function Stars({ n = 5 }) {
  return (
    <div className="mt-2 inline-flex items-center gap-1" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${i < n ? "text-amber-400" : "text-slate-300"}`}
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.168L12 18.896l-7.336 3.868 1.402-8.168L.132 9.21l8.2-1.192z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name, img }) {
  const initials = (name || "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 bg-slate-100 text-slate-600 flex items-center justify-center font-semibold">
      {img ? (
        <img
          src={img}
          alt={name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

/* ------------- demo defaults ------------- */
const DEFAULTS = [
  {
    name: "Aisha Rahman",
    rating: 5,
    source: "Google Reviews",
    stay: "Business Deluxe",
    quote:
      "Spotless rooms, fast Wi-Fi and the location is perfect. The staff went out of their way for an early check-in.",
  },
  {
    name: "Vikram Iyer",
    rating: 5,
    source: "Booking.com",
    stay: "Deluxe Room",
    quote:
      "Calm interiors and surprisingly quiet for being central. Airport pickup and breakfast made it super easy.",
  },
  {
    name: "Shreya N.",
    rating: 4,
    source: "Tripadvisor",
    stay: "Superior Room",
    quote:
      "Great value. Loved the cozy lighting and coffee setup. Will stay again on my next Malé visit!",
  },
];
