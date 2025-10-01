// src/pages/TouristInnGrand.jsx — Tourist Inn GRAND (All CTAs → WhatsApp, smart + DISTINCT room images)
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ---------------- config ---------------- */
const WA_NUMBER = "9607860882";
const waLink = (
  t = "Hello Tourist Inn Grand, I'd like to book. Please share availability & rates."
) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t)}`;

/* ---------------- filename helpers (avoid toilets, prefer bedrooms) ---------------- */
const NEG = /(bath|toilet|wc|wash|sink|shower)/i;                // 🚫 exclude
const BED = /(bed(room)?|king|queen|deluxe|superior|suite)/i;     // ✅ bedroom-ish
const LOBBY_EXT = /(reception|lobby|entrance|exterior|front|facade|corridor)/i;
const NICE_HERO = /(city|view|wide|main|grand|hero)/i;

const scoreHero = (name) => {
  const n = name.toLowerCase();
  let s = 0;
  if (NEG.test(n)) s -= 10;
  if (BED.test(n)) s += 4;
  if (LOBBY_EXT.test(n)) s += 5;
  if (NICE_HERO.test(n)) s += 2;
  return s;
};
const scoreRoom = (name, roomWord) => {
  const n = name.toLowerCase();
  let s = 0;
  if (NEG.test(n)) s -= 10;
  if (BED.test(n)) s += 5;
  if (roomWord && n.includes(roomWord)) s += 4; // e.g. "superior", "deluxe"
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

const GALLERY_CTX = safeCtx(() =>
  // point to your TouristInnGrand folder
  require.context("../assets/TouristInnGrand", false, /\.(png|jpe?g|webp)$/i)
);

function useImages() {
  return useMemo(() => {
    const list = importAll(GALLERY_CTX);
    return list.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true, sensitivity: "base" }));
  }, []);
}

/* pickers */
const pickBestHero = (list) =>
  list
    .filter((x) => !NEG.test(x.key))
    .sort((a, b) => scoreHero(b.key) - scoreHero(a.key))[0] || list[0];

// NEW: pick three DISTINCT room images (superior, deluxe, suite)
function pickDistinctRooms(list) {
  const pool = list.filter((x) => !NEG.test(x.key));
  // sort once by how bedroom-like the image is (generic score)
  const genericSorted = [...pool].sort(
    (a, b) => (BED.test(b.key) ? 1 : 0) - (BED.test(a.key) ? 1 : 0)
  );

  const takeOne = (word, usedKeys) => {
    // 1) prefer by room word + bedroom
    const withWord = pool
      .filter((x) => !usedKeys.has(x.key))
      .sort((a, b) => scoreRoom(b.key, word) - scoreRoom(a.key, word));
    let pick = withWord[0];
    if (!pick || scoreRoom(pick.key, word) < -5) {
      // 2) fallback: next best generic bedroom-like, distinct
      pick = genericSorted.find((x) => !usedKeys.has(x.key));
    }
    // 3) last resort: anything distinct
    if (!pick) pick = list.find((x) => !usedKeys.has(x.key));
    return pick || list[0];
  };

  const used = new Set();
  const sup = takeOne("superior", used); used.add(sup.key);
  const del = takeOne("deluxe",   used); used.add(del.key);
  const sui = takeOne("suite",    used); used.add(sui.key);

  // return with lightbox index for buttons
  const idx = (k) => list.findIndex((x) => x.key === k);
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
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const touch = useRef({ x: 0 });

  const openAt = (i, btn) => { setIdx(i); setOpen(true); triggerRef.current = btn || null; };
  const close = () => { setOpen(false); triggerRef.current?.focus?.(); };
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

  return { open, idx, setIdx, openAt, close, prev, next, dialogRef, touch };
}

/* ---------------- small UI helpers ---------------- */
const BrandBtn = ({ href, children, onClick, className = "", variant = "primary" }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    onClick={onClick}
    className={cx(
      "relative inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold overflow-hidden ring-1 transition",
      variant === "primary" ? "text-white ring-black/5" : "text-slate-900 ring-slate-300 hover:bg-slate-100",
      className
    )}
  >
    {variant === "primary" && (
      <span className="absolute inset-0 bg-gradient-to-r from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]" />
    )}
    <span className="relative">{children}</span>
  </a>
);

function WhatsAppBar() {
  return (
    <div className="sticky top-[64px] z-40 bg-white/90 backdrop-blur ring-1 ring-slate-200">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-3 flex flex-wrap items-center gap-3">
        <div className="text-sm font-semibold text-slate-900">Questions or booking?</div>
        <div className="text-sm text-slate-600">Message us on WhatsApp.</div>
        <div className="ml-auto">
          <BrandBtn href={waLink("Hi, I want to check dates & rates at Tourist Inn Grand.")} className="px-4 py-2 text-xs">WhatsApp Us</BrandBtn>
        </div>
      </div>
    </div>
  );
}
function ConciergeFAB() {
  return (
    <a
      href={waLink("Hello Tourist Inn Grand, please assist with booking & airport pickup.")}
      target="_blank" rel="noreferrer"
      className="fixed right-4 bottom-8 z-[46] inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-4 text-white shadow-lg hover:brightness-95"
    >
      <span>🟢</span>
      <span className="font-semibold">WhatsApp</span>
    </a>
  );
}

/* ---------------- page ---------------- */
export default function TouristInnGrand() {
  const all = useImages();

  // HERO
  const heroPick = all.length ? pickBestHero(all) : null;
  const hero = heroPick?.src || "";

  // DISTINCT images for rooms
  const [supPic, delPic, suiPic] = pickDistinctRooms(all);

  const { open, idx, openAt, close, prev, next, dialogRef, touch } = useLightbox(all.length);

  // sticky mobile CTA reveal
  const [showCta, setShowCta] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowCta(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [active, setActive] = useState("rooms");
  useEffect(() => {
    const ids = ["rooms", "gallery", "facts", "location", "policies"];
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (vis?.target?.id) setActive(vis.target.id);
    }, { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.6, 1] });
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);
  const goto = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const roomCards = [
    {
      name: "Superior Room",
      copy: "Modern, quiet & comfortable — great for short city stays.",
      img: supPic.src,
      imgIndex: supPic.index,
      href: waLink("Booking inquiry — Tourist Inn Grand — Superior Room"),
      icons: ["🛏️ Queen/Twin", "📶 High-Speed Wi-Fi", "📺 Smart TV", "☕ Tea/Coffee"],
    },
    {
      name: "Deluxe Room",
      copy: "Extra space with lounge seating — ideal for longer trips.",
      img: delPic.src,
      imgIndex: delPic.index,
      href: waLink("Booking inquiry — Tourist Inn Grand — Deluxe Room"),
      icons: ["🛏️ King/Queen", "❄️ Air-Conditioning", "🔐 Safe", "🧺 Laundry on request"],
    },
    {
      name: "Grand Suite",
      copy: "Work-friendly layout; some with city views.",
      img: suiPic.src,
      imgIndex: suiPic.index,
      href: waLink("Booking inquiry — Tourist Inn Grand — Grand Suite"),
      icons: ["🛏️ King", "🧑‍💻 Desk", "📶 Fast Wi-Fi", "☕ Coffee/Tea"],
    },
  ];

  return (
    <div className="min-h-screen bg-[rgb(252,249,253)] text-slate-800">
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-slate-900" />
        {hero && (
          <>
            <img src={hero} alt="Tourist Inn Grand — hero" className="absolute inset-0 -z-10 h-full w-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-black/35" />
          </>
        )}
        <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-20 md:py-28 text-white">
          <p className="text-[11px] tracking-[0.28em] uppercase text-white/85">Tourist Inn Grand</p>
          <h1 className="mt-2 text-4xl md:text-6xl font-semibold">Comfort in Central Malé</h1>
          <p className="mt-4 max-w-2xl text-white/90">Quiet rooms • modern amenities • WhatsApp support for instant booking.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BrandBtn href={waLink("Booking — Tourist Inn Grand (dates/guests):")}>Book Now (WhatsApp)</BrandBtn>
            <button
              onClick={() => goto("gallery")}
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100"
            >
              View Gallery
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]/90 opacity-60" />
      </section>

      {/* SUBNAV */}
      <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur ring-1 ring-slate-200">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <nav className="flex gap-1">
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
                  "relative px-4 py-3 text-sm font-semibold rounded-md transition",
                  active === t.id ? "text-slate-900" : "text-slate-600 hover:text-slate-800"
                )}
              >
                {t.label}
                <span className={cx(
                  "pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] origin-left bg-gradient-to-r from-[#6A00FF] to-[#FF2EA8] transition-transform",
                  active === t.id ? "scale-x-100" : "scale-x-0"
                )}/>
              </button>
            ))}
            <div className="ml-auto py-2">
              <BrandBtn href={waLink("I want to book a room at Tourist Inn Grand.")} className="px-4 py-2 text-xs">
                Book Grand (WA)
              </BrandBtn>
            </div>
          </nav>
        </div>
      </div>

      {/* WHATSAPP BAR */}
      <WhatsAppBar />

      {/* ROOMS */}
      <section id="rooms" className="py-12 md:py-16">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-8 md:mb-12">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">Rooms &amp; Suites</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">Choose your stay</h2>
          </header>

          <div className="grid gap-8 md:gap-10 md:grid-cols-2">
            {roomCards.map((r, i) => (
              <article key={r.name} className="overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
                <div className="relative aspect-[16/10] w-full bg-slate-100">
                  {r.img ? (
                    <img src={r.img} alt={r.name} className="h-full w-full object-cover" loading={i<2?"eager":"lazy"} decoding="async" />
                  ) : <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />}
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="text-xl font-semibold text-slate-900">{r.name}</h3>
                  <p className="mt-2 text-slate-600">{r.copy}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-slate-600 text-sm">
                    {r.icons.map((t, j) => <span key={j} className="inline-flex items-center">{t}</span>)}
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <button
                      onClick={(e)=>openAt(r.imgIndex ?? Math.min(i, Math.max(0, all.length-1)), e.currentTarget)}
                      className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100"
                    >
                      View Photos
                    </button>
                    <BrandBtn href={r.href}>View &amp; Book (WA)</BrandBtn>
                  </div>
                </div>
              </article>
            ))}

            {/* wide card */}
            <article className="md:col-span-2 overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[16/10] md:h-full bg-slate-100">
                  {all[3]?.src ? (
                    <img src={all[3].src} alt="Family / Long stay" className="h-full w-full object-cover" />
                  ) : <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />}
                </div>
                <div className="p-5 md:p-6 flex flex-col">
                  <h3 className="text-xl font-semibold text-slate-900">Family / Long Stay</h3>
                  <p className="mt-2 text-slate-600">Spacious layouts for families & extended stays with refined amenities.</p>
                  <div className="mt-4 text-slate-600 text-sm">🛏️ Up to 4 • 📶 Fast Wi-Fi • ☕ Coffee/Tea • ❄️ AC • 🧺 Laundry</div>
                  <div className="mt-auto pt-4 flex items-center gap-3">
                    <button onClick={(e)=>openAt(3, e.currentTarget)} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100">View Photos</button>
                    <BrandBtn href={waLink("Booking inquiry — Tourist Inn Grand — Family / Long Stay")}>View &amp; Book (WA)</BrandBtn>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="pb-16 md:pb-24">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-8 md:mb-12">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">Photo Gallery</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">Tourist Inn Grand — Gallery</h2>
            {all.length > 0 && <p className="mt-1 text-sm text-slate-500">{all.length} photos</p>}
          </header>

          {all.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              Add JPG/PNG/WEBP to <code>src/assets/TouristInn/TouristInnGrand</code> to see the gallery.
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
              {all.map((img, i) => (
                <button
                  key={img.key}
                  onClick={(e)=>{e.currentTarget.blur(); openAt(i, e.currentTarget);}}
                  className="group mb-4 block w-full overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm hover:shadow-md transition will-change-transform break-inside-avoid"
                  aria-label={`Open photo ${i+1}`}
                >
                  <img
                    src={img.src}
                    alt={img.key}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto group-hover:scale-[1.01] transition"
                  />
                  <span className="pointer-events-none absolute m-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white opacity-0 ring-1 ring-white/10 backdrop-blur group-hover:opacity-100">
                    🔍 View
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* QUICK FACTS */}
      <section id="facts" className="pb-16">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-8">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">At a glance</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">Quick Facts</h2>
          </header>
          <div className="grid gap-4 sm:grid-cols-3">
            {[{ k: "Wi-Fi", v: "High-Speed throughout" }, { k: "Location", v: "Central Malé" }, { k: "Housekeeping", v: "Daily" }, { k: "Airport Transfer", v: "On request" }, { k: "Security", v: "Secure Entry" }, { k: "Support", v: "24×7 WhatsApp" }].map((f) => (
              <div key={f.k} className="rounded-2xl bg-white ring-1 ring-slate-200 p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">{f.k}</div>
                <div className="mt-1 text-sm text-slate-600">{f.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="pb-16">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-8">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">Find Us</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">Location & Contact</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-[1.25fr_.75fr]">
            <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white">
              <iframe
                title="Map"
                src="https://www.google.com/maps?q=Male+Maldives&output=embed"
                className="w-full h-[360px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="rounded-3xl ring-1 ring-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">Tourist Inn Grand</h3>
              <p className="mt-2 text-slate-600">Ma. Leaves, Maaveyo Goalhi, Malé, Maldives</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <BrandBtn href={waLink("Please share location pin & help with booking — Tourist Inn Grand.")}>WhatsApp to Book</BrandBtn>
                <a href={waLink("Hi, need help with directions to Tourist Inn Grand.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100">
                  🟢 WhatsApp Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POLICIES */}
      <section id="policies" className="pb-20">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-8">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">Good to know</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">Policies & FAQ</h2>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Check-in / Check-out","Check-in 2:00 PM • Check-out 12:00 PM. Early check-in / late check-out subject to availability."],
              ["Airport Transfers","We can arrange airport pickup on request. Share flight details on WhatsApp."],
              ["House Rules","No smoking inside rooms. Quiet hours 10 PM – 7 AM. Visitors to register at reception."],
              ["Payments","Major cards accepted. Best rates on direct WhatsApp bookings."],
            ].map(([q,a]) => (
              <details key={q} className="group rounded-2xl bg-white ring-1 ring-slate-200 p-5">
                <summary className="cursor-pointer select-none font-semibold text-slate-900">{q}</summary>
                <p className="mt-2 text-slate-600 text-sm">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {open && all.length > 0 && (
        <>
          <div className="fixed inset-0 z-[95] bg-black/70 backdrop-blur-[2px]" onClick={close} aria-hidden />
          <div
            ref={dialogRef}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Grand photo viewer"
          >
            <div className="relative max-w-[92vw] max-h-[86vh]">
              <img
                src={all[idx].src}
                alt=""
                className="max-h-[86vh] w-auto rounded-2xl shadow-2xl"
                onTouchStart={(e) => { touch.current.x = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                  const dx = e.changedTouches[0].clientX - touch.current.x;
                  if (Math.abs(dx) > 40) (dx > 0 ? prev() : next());
                }}
              />
              <button onClick={close} className="absolute -top-3 -right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow ring-1 ring-slate-200" aria-label="Close">✕</button>
              <button onClick={prev}  className="hidden sm:inline-flex absolute left-0 top-1/2 -translate-x-16 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow ring-1 ring-slate-200" aria-label="Previous">‹</button>
              <button onClick={next}  className="hidden sm:inline-flex absolute right-0 top-1/2 translate-x-16 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow ring-1 ring-slate-200" aria-label="Next">›</button>
            </div>
            <div className="mt-3 text-center text-white/85">{idx + 1} / {all.length}</div>
          </div>
        </>
      )}

      {/* footer + sticky mobile CTA */}
      <div className="h-px w-full bg-gradient-to-r from-[#FF2EA8] via-[#B86DFF] to-[#6A00FF] opacity-40" />
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-10 text-center text-sm text-slate-500">
        <Link to="/" className="rounded-full ring-1 ring-slate-300 px-4 py-2 hover:bg-slate-100">← Back to Home</Link>
      </div>

      <div className={cx(
        "fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[1180px] px-4 md:px-6 pb-4 transition",
        showCta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        <div className="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-slate-200 shadow-lg p-3 flex items-center justify-between">
          <div className="text-sm leading-tight">
            <div className="font-semibold text-slate-900">Ready to book Tourist Inn Grand?</div>
            <div className="text-slate-500">Best rate on direct WhatsApp</div>
          </div>
          <BrandBtn href={waLink("Booking — Tourist Inn Grand (dates/guests):")} className="px-4 py-2 text-xs">Book Now (WA)</BrandBtn>
        </div>
      </div>

      <ConciergeFAB />
    </div>
  );
}
