// src/pages/TouristInnGrand.jsx — Tourist Inn GRAND (Responsive Pro)
// HERO uses src/assets/TouristInnGrand.png (static import)
// All extra WhatsApp / booking.com CTAs removed; only banner "Book Now" -> WhatsApp

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/TouristInnGrand.png"; // <- EXACT PATH (A capital)

/* ---------------- config ---------------- */
const WA_NUMBER = "9607860882";
const waLink = (t = "Hello Tourist Inn Grand, I'd like to book. Please share availability & rates.") =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t)}`;

/* ---------------- filename helpers ---------------- */
const NEG = /(bath|toilet|wc|wash|sink|shower)/i;
const BED = /(bed(room)?|king|queen|deluxe|superior|suite)/i;
const scoreRoom = (name, roomWord) => {
  const n = name.toLowerCase();
  let s = 0;
  if (NEG.test(n)) s -= 10;
  if (BED.test(n)) s += 5;
  if (roomWord && n.includes(roomWord)) s += 4;
  return s;
};

/* ---------------- utils ---------------- */
const safeCtx = (make) => { try { return make(); } catch { return null; } };
const importAll = (ctx) =>
  ctx?.keys?.().map((k) => {
    const mod = ctx(k);
    return { key: k.replace("./", ""), src: typeof mod === "string" ? mod : mod.default };
  }) || [];
const cx = (...xs) => xs.filter(Boolean).join(" ");

/* Gallery source folder (keep your photos here): src/assets/TouristInnGrand */
const GALLERY_CTX = safeCtx(() =>
  require.context("../assets/TouristInnGrand", false, /\.(png|jpe?g|webp)$/i)
);

function useImages() {
  return useMemo(() => {
    const list = importAll(GALLERY_CTX);
    return list.sort((a, b) =>
      a.key.localeCompare(b.key, undefined, { numeric: true, sensitivity: "base" })
    );
  }, []);
}

/* pick three distinct room photos (defensive for short lists) */
function pickDistinctRooms(list) {
  if (!list.length) {
    const ph = { key: "ph", src: "", index: 0 };
    return [ph, ph, ph];
  }
  const pool = list.filter((x) => !NEG.test(x.key));
  const genericSorted = [...pool].sort(
    (a, b) => (BED.test(b.key) ? 1 : 0) - (BED.test(a.key) ? 1 : 0)
  );
  const takeOne = (word, used) => {
    const withWord = pool
      .filter((x) => !used.has(x.key))
      .sort((a, b) => scoreRoom(b.key, word) - scoreRoom(a.key, word));
    let pick = withWord[0];
    if (!pick) pick = genericSorted.find((x) => !used.has(x.key));
    if (!pick) pick = list.find((x) => !used.has(x.key)) || list[0];
    return pick;
  };
  const used = new Set();
  const sup = takeOne("superior", used); used.add(sup.key);
  const del = takeOne("deluxe", used);   used.add(del.key);
  const sui = takeOne("suite", used);    used.add(sui.key);
  const idx = (k) => Math.max(0, list.findIndex((x) => x.key === k));
  return [
    { key: sup.key, src: sup.src, index: idx(sup.key) },
    { key: del.key, src: del.src, index: idx(del.key) },
    { key: sui.key, src: sui.src, index: idx(sui.key) },
  ];
}

/* ---------------- lightbox ---------------- */
function useLightbox(total) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const dialogRef = useRef(null);
  const touch = useRef({ x: 0 });

  const openAt = (i) => { setIdx(i); setOpen(true); };
  const close = () => setOpen(false);
  const prev  = () => setIdx((i) => (i - 1 + total) % total);
  const next  = () => setIdx((i) => (i + 1) % total);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    setTimeout(() => dialogRef.current?.querySelector("button")?.focus(), 0);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, total]);

  return { open, idx, openAt, close, prev, next, dialogRef, touch };
}

/* ---------------- page ---------------- */
export default function TouristInnGrand() {
  useEffect(() => { document.title = "Tourist Inn Grand — Malé"; }, []);

  const all = useImages();
  const [supPic, delPic, suiPic] = pickDistinctRooms(all);
  const { open, idx, openAt, close, prev, next, dialogRef, touch } = useLightbox(all.length);

  const [active, setActive] = useState("rooms");
  const goto = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  /* observe sections for subnav highlight (robust thresholds for mobile) */
  useEffect(() => {
    const ids = ["rooms", "gallery", "facts", "location", "policies"];
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis?.target?.id) setActive(vis.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.15, 0.4, 0.7, 1] }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  const roomCards = [
    {
      name: "Superior Room",
      copy: "Modern, quiet & comfortable — great for short city stays.",
      img: supPic.src, imgIndex: supPic.index,
      icons: ["🛏️ Queen/Twin", "📶 High-Speed Wi-Fi", "📺 Smart TV", "☕ Tea/Coffee"],
    },
    {
      name: "Deluxe Room",
      copy: "Extra space with lounge seating — ideal for longer trips.",
      img: delPic.src, imgIndex: delPic.index,
      icons: ["🛏️ King/Queen", "❄️ Air-Conditioning", "🔐 Safe", "🧺 Laundry (req.)"],
    },
    {
      name: "Grand Suite",
      copy: "Work-friendly layout; some with city views.",
      img: suiPic.src, imgIndex: suiPic.index,
      icons: ["🛏️ King", "🧑‍💻 Desk", "📶 Fast Wi-Fi", "☕ Coffee/Tea"],
    },
  ];

  return (
    <div className="min-h-screen bg-[rgb(252,249,253)] text-slate-800 [scrollbar-gutter:stable_both-edges]">
      {/* HERO — single WhatsApp CTA; mobile-safe paddings */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-slate-900" />
        <img
          src={heroImg}
          alt="Tourist Inn Grand — hero"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 -z-10 bg-black/35" />
        <div className="mx-auto max-w-[1180px] px-4 sm:px-5 md:px-6 py-16 sm:py-20 md:py-28 text-white">
          <p className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-white/85">
            Tourist Inn Grand
          </p>
          <h1 className="mt-2 text-[28px] leading-[1.15] sm:text-[36px] md:text-6xl font-semibold">
            Comfort in Central Malé
          </h1>
          <p className="mt-3 sm:mt-4 max-w-[44ch] text-white/90 text-sm sm:text-base">
            Quiet rooms • modern amenities • instant WhatsApp booking.
          </p>
          <div className="mt-5 sm:mt-6 flex flex-wrap gap-3">
            <a
              href={waLink("Booking — Tourist Inn Grand (dates/guests):")}
              target="_blank" rel="noreferrer"
              className="relative inline-flex items-center justify-center rounded-full px-4 sm:px-5 py-2.5 font-semibold overflow-hidden ring-1 ring-black/5 text-white"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]" />
              <span className="relative">Book Now (WhatsApp)</span>
            </a>
            <button
              onClick={() => goto("gallery")}
              className="inline-flex items-center justify-center rounded-full px-4 sm:px-5 py-2.5 font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100 bg-white/95"
            >
              View Gallery
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]/90 opacity-60" />
      </section>

      {/* SUBNAV — sticky, safe on all screens (no magic header offset) */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 ring-1 ring-slate-200">
        <div className="mx-auto max-w-[1180px] px-2 sm:px-4 md:px-6">
          <nav className="flex flex-wrap gap-1 py-1 sm:py-0.5">
            {[
              { id: "rooms", label: "Rooms" },
              { id: "gallery", label: "Gallery" },
              { id: "facts", label: "Quick Facts" },
              { id: "location", label: "Location" },
              { id: "policies", label: "Policies / FAQ" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => goto(t.id)}
                className={cx(
                  "relative px-3 sm:px-4 py-2 text-[13px] sm:text-sm font-semibold rounded-md transition",
                  active === t.id ? "text-slate-900" : "text-slate-600 hover:text-slate-800"
                )}
              >
                {t.label}
                <span
                  className={cx(
                    "pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] origin-left bg-gradient-to-r from-[#6A00FF] to-[#FF2EA8] transition-transform",
                    active === t.id ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ROOMS */}
      <section id="rooms" className="pt-10 pb-12 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-5 md:px-6">
          <header className="text-center mb-7 sm:mb-10 md:mb-12">
            <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-slate-500">
              Rooms &amp; Suites
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">
              Choose your stay
            </h2>
          </header>

          <div className="grid gap-6 sm:gap-8 md:gap-10 sm:grid-cols-2">
            {roomCards.map((r, i) => (
              <article
                key={r.name}
                className="overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                <div className="relative aspect-[16/10] w-full bg-slate-100">
                  {r.img ? (
                    <img
                      src={r.img}
                      alt={r.name}
                      className="h-full w-full object-cover"
                      loading={i < 2 ? "eager" : "lazy"}
                      decoding="async"
                      sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 560px"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />
                  )}
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{r.name}</h3>
                  <p className="mt-2 text-slate-600 text-sm sm:text-base">{r.copy}</p>
                  <div className="mt-4 flex flex-wrap gap-2.5 sm:gap-3 text-slate-600 text-[13px] sm:text-sm">
                    {r.icons.map((t, j) => (
                      <span key={j} className="inline-flex items-center">{t}</span>
                    ))}
                  </div>
                  <div className="mt-5">
                    <button
                      onClick={() =>
                        openAt(r.imgIndex ?? Math.min(i, Math.max(0, all.length - 1)))
                      }
                      className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100"
                    >
                      View Photos
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* wide card */}
            <article className="sm:col-span-2 overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[16/10] md:h-full bg-slate-100">
                  {all[3]?.src ? (
                    <img
                      src={all[3].src}
                      alt="Family / Long stay"
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />
                  )}
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                    Family / Long Stay
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm sm:text-base">
                    Spacious layouts for families & extended stays with refined amenities.
                  </p>
                  <div className="mt-3 sm:mt-4 text-slate-600 text-[13px] sm:text-sm">
                    🛏️ Up to 4 • 📶 Fast Wi-Fi • ☕ Coffee/Tea • ❄️ AC • 🧺 Laundry
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => openAt(Math.min(3, all.length - 1))}
                      className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100"
                    >
                      View Photos
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* GALLERY — responsive masonry, safe gaps */}
      <section id="gallery" className="pb-14 sm:pb-16 md:pb-24">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-5 md:px-6">
          <header className="text-center mb-7 sm:mb-10 md:mb-12">
            <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-slate-500">
              Photo Gallery
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">
              Tourist Inn Grand — Gallery
            </h2>
            {all.length > 0 && (
              <p className="mt-1 text-xs sm:text-sm text-slate-500">{all.length} photos</p>
            )}
          </header>

          {all.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center text-sm sm:text-base">
              Add JPG/PNG/WEBP to <code>src/assets/TouristInnGrand</code> to see the gallery.
            </div>
          ) : (
            <div className="columns-1 xs:columns-2 lg:columns-3 gap-3 sm:gap-4 [column-fill:_balance]">
              {all.map((img, i) => (
                <button
                  key={img.key}
                  onClick={() => openAt(i)}
                  className="group relative mb-3 sm:mb-4 block w-full overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm hover:shadow-md transition break-inside-avoid"
                  aria-label={`Open photo ${i + 1}`}
                >
                  <img
                    src={img.src}
                    alt={img.key}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto group-hover:scale-[1.01] transition"
                    sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className="pointer-events-none absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white opacity-0 ring-1 ring-white/10 backdrop-blur group-hover:opacity-100">
                    🔍 View
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* QUICK FACTS */}
      <section id="facts" className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-5 md:px-6">
          <header className="text-center mb-7 sm:mb-8">
            <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-slate-500">
              At a glance
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">
              Quick Facts
            </h2>
          </header>
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3">
            {[
              { k: "Wi-Fi", v: "High-Speed throughout" },
              { k: "Location", v: "Central Malé" },
              { k: "Housekeeping", v: "Daily" },
              { k: "Airport Transfer", v: "On request" },
              { k: "Security", v: "Secure Entry" },
              { k: "Support", v: "24×7" },
            ].map((f) => (
              <div key={f.k} className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 sm:p-5 shadow-sm">
                <div className="text-sm sm:text-[15px] font-semibold text-slate-900">{f.k}</div>
                <div className="mt-1 text-xs sm:text-sm text-slate-600">{f.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-5 md:px-6">
          <header className="text-center mb-7 sm:mb-8">
            <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-slate-500">
              Find Us
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">
              Location & Contact
            </h2>
          </header>
          <div className="grid gap-5 sm:gap-6 md:grid-cols-[1.25fr_.75fr]">
            <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white">
              <iframe
                title="Map"
                src="https://www.google.com/maps?q=Male+Maldives&output=embed"
                className="w-full h-[260px] sm:h-[320px] md:h-[360px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="rounded-3xl ring-1 ring-slate-200 bg-white p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">Tourist Inn Grand</h3>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                Ma. Leaves, Maaveyo Goalhi, Malé, Maldives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POLICIES */}
      <section id="policies" className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-5 md:px-6">
          <header className="text-center mb-7 sm:mb-8">
            <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-slate-500">
              Good to know
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">
              Policies & FAQ
            </h2>
          </header>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {[
              ["Check-in / Check-out","Check-in 2:00 PM • Check-out 12:00 PM. Early/Late on availability."],
              ["Airport Transfers","We can arrange airport pickup. Share flight details after booking."],
              ["House Rules","No smoking inside rooms. Quiet hours 10 PM – 7 AM. Visitors must register."],
              ["Payments","Major cards accepted. Best rates on direct bookings."],
            ].map(([q,a]) => (
              <details key={q} className="group rounded-2xl bg-white ring-1 ring-slate-200 p-4 sm:p-5">
                <summary className="cursor-pointer select-none font-semibold text-slate-900 text-sm sm:text-base">
                  {q}
                </summary>
                <p className="mt-2 text-slate-600 text-xs sm:text-sm">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX — mobile friendly (swipe), arrows on sm+ */}
      {open && all.length > 0 && (
        <>
          <div className="fixed inset-0 z-[95] bg-black/70 backdrop-blur-[2px]" onClick={close} aria-hidden />
          <div
            ref={dialogRef}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-3 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Grand photo viewer"
          >
            <div className="relative max-w-[96vw] sm:max-w-[92vw] max-h-[86vh]">
              <img
                src={all[idx].src}
                alt=""
                className="max-h-[80vh] sm:max-h-[86vh] w-auto max-w-[96vw] sm:max-w-[92vw] rounded-2xl shadow-2xl"
                onTouchStart={(e) => { touch.current.x = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                  const dx = e.changedTouches[0].clientX - touch.current.x;
                  if (Math.abs(dx) > 40) (dx > 0 ? prev() : next());
                }}
                loading="eager"
                decoding="async"
              />
              <button
                onClick={close}
                className="absolute -top-3 -right-3 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow ring-1 ring-slate-200"
                aria-label="Close"
              >
                ✕
              </button>
              <button
                onClick={prev}
                className="hidden sm:inline-flex absolute left-0 top-1/2 -translate-x-16 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow ring-1 ring-slate-200"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="hidden sm:inline-flex absolute right-0 top-1/2 translate-x-16 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow ring-1 ring-slate-200"
                aria-label="Next"
              >
                ›
              </button>
            </div>
            <div className="mt-2 sm:mt-3 text-center text-white/85 text-xs sm:text-sm">
              {idx + 1} / {all.length}
            </div>
          </div>
        </>
      )}

      {/* footer */}
      <div className="h-px w-full bg-gradient-to-r from-[#FF2EA8] via-[#B86DFF] to-[#6A00FF] opacity-40" />
      <div className="mx-auto max-w-[1180px] px-4 sm:px-5 md:px-6 py-8 sm:py-10 text-center text-xs sm:text-sm text-slate-500">
        <Link to="/" className="rounded-full ring-1 ring-slate-300 px-3.5 sm:px-4 py-2 hover:bg-slate-100">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
