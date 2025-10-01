// src/pages/TourInnGallery.jsx — Booking.com Edition (Primary CTAs → Booking.com, WA as secondary)
// Sticky subnav, availability bar (syncs dates into booking.com URL), lightbox, WA quick actions.

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ---------------- config ---------------- */
const BOOKING_URL_BASE =
  "https://www.booking.com/hotel/mv/tour-inn.html";
const BOOKING_URL_FULL =
  "https://www.booking.com/hotel/mv/tour-inn.html?aid=304142&label=gen173nr-10CAEoggI46AdIM1gEaJ4BiAEBmAEzuAEXyAEM2AED6AEB-AEBiAIBqAIBuAKl2eXFBsACAdICJDlhNDQzNDJlLTAwZTctNGFhOS05MGUzLWNlNGM0YTY1MWE3ZNgCAeACAQ&sid=c0b4300d46a5c3a9ac85d3fb622ae994&age=11&age=13&all_sr_blocks=860042801_353838770_2_0_0%2C860042801_353838770_2_0_0&checkin=2025-10-26&checkout=2025-10-27&dest_id=8600428&dest_type=hotel&dist=0&group_adults=2&group_children=2&hapos=1&highlighted_blocks=860042801_353838770_2_0_0%2C860042801_353838770_2_0_0&hpos=1&matching_block_id=860042801_353838770_2_0_0&no_rooms=1&req_adults=2&req_age=11&req_age=13&req_children=2&room1=A%2CA%2C11%2C13&sb_price_type=total&sr_order=popularity&sr_pri_blocks=860042801_353838770_2_0_0__7900%2C860042801_353838770_2_0_0__7900&srepoch=1756982464&srpvid=a87e4b1edb6100c0&type=total&ucfs=1&chal_t=1759311338729&force_referer=";

const WA_NUMBER = "9607860882";
const waLink = (t = "Hi Tour Inn, please assist with booking & rates.") =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t)}`;

/* ---------------- utils ---------------- */
const safeCtx = (make) => { try { return make(); } catch { return null; } };
const importAll = (ctx) =>
  ctx?.keys?.().map((k) => {
    const mod = ctx(k);
    return { key: k.replace("./", ""), src: typeof mod === "string" ? mod : mod.default };
  }) || [];

const cx = (...xs) => xs.filter(Boolean).join(" ");

/* Append or replace query params into a URL string */
function withParams(url, params) {
  try {
    const u = new URL(url);
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      // booking.com allows multiple "age" — if array, set all
      if (Array.isArray(v)) {
        u.searchParams.delete(k);
        v.forEach((val) => u.searchParams.append(k, String(val)));
      } else {
        u.searchParams.set(k, String(v));
      }
    });
    return u.toString();
  } catch {
    return url;
  }
}

/* ---------------- data ---------------- */
const GALLERY_CTX = safeCtx(() =>
  require.context("../assets/TourInn", false, /\.(png|jpe?g|webp)$/i)
);

function useImages() {
  return useMemo(() => {
    const list = importAll(GALLERY_CTX);
    return list.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
  }, []);
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
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

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

/* ---------------- UI bits ---------------- */
const BrandBtn = ({ href, children, onClick, className = "", variant = "primary", target = "_blank" }) => (
  <a
    href={href}
    onClick={onClick}
    target={target}
    rel="noreferrer"
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

function CopyButton({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => { try { await navigator.clipboard.writeText(text); setOk(true); setTimeout(()=>setOk(false), 1400); } catch {} }}
      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100"
    >
      {ok ? "✅ Copied" : "📋 Copy Address"}
    </button>
  );
}

/* Sticky WhatsApp helper bar (secondary option) */
function WhatsAppBar() {
  const msg = "Hi Tour Inn, I need assistance with booking / invoice.";
  return (
    <div className="sticky top-[64px] z-30 bg-white/90 backdrop-blur ring-1 ring-slate-200">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-3 flex flex-wrap items-center gap-3">
        <div className="text-sm font-semibold text-slate-900">Need any help?</div>
        <div className="text-sm text-slate-600">Message us on WhatsApp.</div>
        <div className="ml-auto flex items-center gap-3">
          <BrandBtn href={waLink(msg)} className="px-4 py-2 text-xs">WhatsApp Us</BrandBtn>
        </div>
      </div>
    </div>
  );
}

/* Availability bar → builds a Booking.com URL with chosen dates & guest count */
function AvailabilityBar() {
  const todayISO = new Date().toISOString().slice(0,10);
  const [inD, setIn] = useState(todayISO);
  const [outD, setOut] = useState(todayISO);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const buildBookingUrl = () => {
    // Keep your long URL as base, but override key params from user input
    return withParams(BOOKING_URL_FULL, {
      checkin: inD,
      checkout: outD,
      group_adults: adults,
      group_children: children,
      no_rooms: 1,
      // optional: provide children ages (defaults to 11,13 in your link). Adjust if you expose UI for ages.
      // age: children ? [11, 13].slice(0, children) : undefined,
    });
  };

  return (
    <div className="sticky top-[108px] z-30 bg-white/90 backdrop-blur ring-1 ring-slate-200">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-3 flex flex-wrap items-center gap-3">
        <div className="text-sm font-semibold text-slate-900">Check availability</div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">Check-in</span>
          <input type="date" min={todayISO} value={inD} onChange={(e)=>setIn(e.target.value)} className="rounded-md border border-slate-300 px-2 py-1" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">Check-out</span>
          <input type="date" min={inD} value={outD} onChange={(e)=>setOut(e.target.value)} className="rounded-md border border-slate-300 px-2 py-1" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">Adults</span>
          <input type="number" min={1} max={8} value={adults} onChange={(e)=>setAdults(+e.target.value)} className="w-16 rounded-md border border-slate-300 px-2 py-1" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">Children</span>
          <input type="number" min={0} max={6} value={children} onChange={(e)=>setChildren(+e.target.value)} className="w-16 rounded-md border border-slate-300 px-2 py-1" />
        </label>
        <div className="ml-auto flex items-center gap-3">
          <a href={buildBookingUrl()} target="_blank" rel="noreferrer" className="relative inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold text-white overflow-hidden ring-1 ring-black/5">
            <span className="absolute inset-0 bg-gradient-to-r from-[#6A00FF] to-[#FF2EA8]" />
            <span className="relative">Check Rates (Booking.com)</span>
          </a>
          <a href={waLink("I have a question about availability/pricing.")} target="_blank" rel="noreferrer" className="rounded-full px-4 py-2 text-xs font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100">
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */
export default function TourInnGallery() {
  const all = useImages();
  const hero = all[0]?.src || "";
  const { open, idx, setIdx, openAt, close, prev, next, dialogRef, touch } = useLightbox(all.length);

  /* sticky mobile CTA visibility */
  const [showCta, setShowCta] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowCta(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* sticky subnav active section */
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

  /* room cards map to first images as fallback */
  const roomCards = [
    {
      name: "Superior Room",
      copy: "Elegant interiors with queen/twin layout — perfect for short city stays.",
      img: all[0]?.src, price: "Best price on Booking.com",
      href: BOOKING_URL_FULL,
      icons: ["🛏️ Queen/Twin", "📶 High-Speed Wi-Fi", "📺 Smart TV", "☕ Tea/Coffee"]
    },
    {
      name: "Deluxe Room",
      copy: "More space, lounge seating & warm lighting for comfy longer stays.",
      img: all[1]?.src, price: "Best price on Booking.com",
      href: BOOKING_URL_FULL,
      icons: ["🛏️ King/Queen", "❄️ Air-Conditioning", "📺 Smart TV", "🔐 Safe"]
    },
    {
      name: "Business Deluxe",
      copy: "Work-friendly layout; select rooms with balcony & city views.",
      img: all[2]?.src, price: "Best price on Booking.com",
      href: BOOKING_URL_FULL,
      icons: ["🛏️ King Bed", "🧑‍💻 Desk", "📶 Fast Wi-Fi", "☕ Coffee/Tea"]
    },
  ];

  return (
    <div className="min-h-screen bg-[rgb(252,249,253)] text-slate-800">
      {/* ========== HERO ========== */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-slate-900" />
        {hero ? (
          <>
            <img src={hero} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-black/35" />
          </>
        ) : null}
        <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-20 md:py-28 text-white">
          <p className="text-[11px] tracking-[0.28em] uppercase text-white/85">Urban Comfort in Malé</p>
          <h1 className="mt-2 text-4xl md:text-6xl font-semibold">Tour Inn</h1>
          <p className="mt-4 max-w-2xl text-white/90">
            Quiet stays • modern amenities • city convenience. Explore rooms, gallery & location.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BrandBtn href={BOOKING_URL_FULL}>Book Now (Booking.com)</BrandBtn>
            <BrandBtn href={waLink("Hi, I need help with booking.")} variant="ghost">
              WhatsApp
            </BrandBtn>
            <button
              onClick={(e) => { e.preventDefault(); goto("gallery"); }}
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100"
            >
              View Gallery
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Central Malé", "Best Rate", "24×7 Support"].map((t) => (
              <span key={t} className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-xs ring-1 ring-white/20">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]/90 opacity-60" />
      </section>

      {/* ========== STICKY SUBNAV ========== */}
      <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur ring-1 ring-slate-200">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <nav className="flex gap-1">
            {[{ id: "rooms", label: "Rooms" }, { id: "gallery", label: "Gallery" }, { id: "facts", label: "Quick Facts" }, { id: "location", label: "Location" }, { id: "policies", label: "Policies / FAQ" }].map((t) => (
              <button key={t.id} onClick={() => goto(t.id)} className={cx("relative px-4 py-3 text-sm font-semibold rounded-md transition", active === t.id ? "text-slate-900" : "text-slate-600 hover:text-slate-800")}>
                {t.label}
                <span className={cx("pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] origin-left bg-gradient-to-r from-[#6A00FF] to-[#FF2EA8] transition-transform", active === t.id ? "scale-x-100" : "scale-x-0")} />
              </button>
            ))}
            <div className="ml-auto py-2">
              <BrandBtn href={BOOKING_URL_FULL} className="px-4 py-2 text-xs">Book Tour Inn</BrandBtn>
            </div>
          </nav>
        </div>
      </div>

      {/* NEW: Availability quick bar → Booking.com */}
      <AvailabilityBar />

      {/* ========== ROOMS ========== */}
      <section id="rooms" className="py-12 md:py-16">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-8 md:mb-12">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">Rooms &amp; Suites</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">Choose your stay</h2>
          </header>

          <div className="grid gap-8 md:gap-10 md:grid-cols-2">
            {roomCards.map((r, i) => (
              <article key={r.name} className="overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white/95 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
                <div className="relative aspect-[16/10] w-full">
                  {r.img ? (
                    <img src={r.img} alt={r.name} className="h-full w-full object-cover" loading={i<2?"eager":"lazy"} decoding="async" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />
                  )}
                  {r.price && (
                    <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold ring-1 ring-slate-200">
                      {r.price}
                    </span>
                  )}
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="text-xl font-semibold text-slate-900">{r.name}</h3>
                  <p className="mt-2 text-slate-600">{r.copy}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-slate-600 text-sm">
                    {r.icons.map((t, j) => <span key={j} className="inline-flex items-center">{t}</span>)}
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <button
                      onClick={(e)=>openAt(Math.min(i, Math.max(0, all.length-1)), e.currentTarget)}
                      className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100"
                    >
                      View Photos
                    </button>
                    <BrandBtn href={r.href}>View &amp; Book</BrandBtn>
                  </div>
                </div>
              </article>
            ))}

            {/* wide card */}
            <article className="md:col-span-2 overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white/95 shadow-sm">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[16/10] md:h-full">
                  {all[3]?.src ? (
                    <img src={all[3].src} alt="Family / Long stay" className="h-full w-full object-cover" />
                  ) : <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />}
                </div>
                <div className="p-5 md:p-6 flex flex-col">
                  <h3 className="text-xl font-semibold text-slate-900">Family / Long Stay</h3>
                  <p className="mt-2 text-slate-600">Spacious layouts for families & extended stays with refined amenities.</p>
                  <div className="mt-4 text-slate-600 text-sm">🛏️ Up to 4 • 📶 Fast Wi-Fi • ☕ Coffee/Tea • ❄️ AC • 🛁 Ensuite</div>
                  <div className="mt-auto pt-4 flex items-center gap-3">
                    <button onClick={(e)=>openAt(3, e.currentTarget)} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100">View Photos</button>
                    <BrandBtn href={BOOKING_URL_FULL}>View &amp; Book</BrandBtn>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ========== GALLERY ========== */}
      <section id="gallery" className="pb-16 md:pb-24">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-8 md:mb-12">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">Photo Gallery</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">A look inside Tour Inn</h2>
            {all.length > 0 && <p className="mt-1 text-sm text-slate-500">{all.length} photos</p>}
          </header>

          {all.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              Add JPG/PNG/WEBP to <code>src/assets/TourInn</code> to see the gallery.
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
              {all.map((img, i) => (
                <button
                  key={img.key}
                  onClick={(e)=>{e.currentTarget.blur(); openAt(i, e.currentTarget);}}
                  className="group mb-4 block w-full overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm hover:shadow-md transition will-change-transform break-inside-avoid"
                >
                  <img src={img.src} alt={`Tour Inn photo ${i + 1}`} loading="lazy" decoding="async" className="w-full h-auto group-hover:scale-[1.01] transition" />
                  <span className="pointer-events-none absolute m-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white opacity-0 ring-1 ring-white/10 backdrop-blur group-hover:opacity-100">
                    🔍 View
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== QUICK FACTS ========== */}
      <section id="facts" className="pb-16">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-8">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">At a glance</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">Quick Facts</h2>
          </header>
          <div className="grid gap-4 sm:grid-cols-3">
            {[{ k: "Wi-Fi", v: "High-Speed throughout" }, { k: "Location", v: "Central Malé" }, { k: "Check-in", v: "2:00 PM (Early on request)" }, { k: "Airport Transfer", v: "On request" }, { k: "Housekeeping", v: "Daily" }, { k: "Security", v: "Secure Entry" }].map((f) => (
              <div key={f.k} className="rounded-2xl bg-white ring-1 ring-slate-200 p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">{f.k}</div>
                <div className="mt-1 text-sm text-slate-600">{f.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== LOCATION ========== */}
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
              <h3 className="text-lg font-semibold text-slate-900">Tour Inn</h3>
              <p className="mt-2 text-slate-600">Ma. Leaves, Maaveyo Goalhi, Malé, Maldives</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <BrandBtn href={BOOKING_URL_FULL}>Book Now (Booking.com)</BrandBtn>
                <a href={waLink("Share location pin & help with booking.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100">
                  🟢 WhatsApp
                </a>
                <CopyButton text="Ma. Leaves, Maaveyo Goalhi, Malé, Maldives" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== POLICIES / FAQ ========== */}
      <section id="policies" className="pb-20">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-8">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">Good to know</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">Policies & FAQ</h2>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Check-in / Check-out","Check-in 2:00 PM • Check-out 12:00 PM. Early check-in / late check-out subject to availability."],
              ["Airport Transfers","We can arrange airport pickup on request. Share your flight details after booking."],
              ["House Rules","No smoking inside rooms. Quiet hours 10 PM – 7 AM. Visitors to register at reception."],
              ["Payments","Major cards accepted. Best rates on direct bookings."]
            ].map(([q,a]) => (
              <details key={q} className="group rounded-2xl bg-white ring-1 ring-slate-200 p-5">
                <summary className="cursor-pointer select-none font-semibold text-slate-900">{q}</summary>
                <p className="mt-2 text-slate-600 text-sm">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ========== LIGHTBOX ========== */}
      {open && all.length > 0 && (
        <>
          <div className="fixed inset-0 z-[95] bg-black/70 backdrop-blur-[2px]" onClick={close} aria-hidden />
          <div
            ref={dialogRef}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Tour Inn photo viewer"
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

      {/* footer hairline + back */}
      <div className="h-px w-full bg-gradient-to-r from-[#FF2EA8] via-[#B86DFF] to-[#6A00FF] opacity-40" />
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-10 text-center text-sm text-slate-500">
        <Link to="/" className="rounded-full ring-1 ring-slate-300 px-4 py-2 hover:bg-slate-100">← Back to Home</Link>
      </div>

      {/* sticky mobile CTA */}
      <div className={cx(
        "fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[1180px] px-4 md:px-6 pb-4 transition",
        showCta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        <div className="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-slate-200 shadow-lg p-3 flex items-center justify-between">
          <div className="text-sm leading-tight">
            <div className="font-semibold text-slate-900">Ready to book Tour Inn?</div>
            <div className="text-slate-500">Best rate on Booking.com</div>
          </div>
          <BrandBtn href={BOOKING_URL_FULL} className="px-4 py-2 text-xs">Book Now</BrandBtn>
        </div>
      </div>

      {/* helper bars */}
      <WhatsAppBar />
    </div>
  );
}
