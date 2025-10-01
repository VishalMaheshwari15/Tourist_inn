// src/pages/TourInnGallery.jsx — Pro Max Upgrade (Book Now -> WhatsApp)

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/* ---------------- utils ---------------- */
const safeCtx = (make) => { try { return make(); } catch { return null; } };
const importAll = (ctx) =>
  ctx?.keys?.().map((k) => {
    const mod = ctx(k);
    return {
      key: k.replace("./", ""),
      src: typeof mod === "string" ? mod : mod.default,
      thumb: tryThumb(k.replace("./", "")),
      tag: tagFromName(k),
    };
  }) || [];

const tryThumb = (name) => {
  try {
    const base = name.replace(/\.(jpe?g|png|webp)$/i, "");
    const ext = name.match(/\.(jpe?g|png|webp)$/i)?.[0] || "";
    const t1 = require(`../assets/TourInn/thumbs/${base}${ext}`);
    return typeof t1 === "string" ? t1 : t1.default;
  } catch { return null; }
};
const tagFromName = (k) => {
  const n = k.toLowerCase();
  if (n.includes("room") || n.includes("bed")) return "Rooms";
  if (n.includes("lobby") || n.includes("reception")) return "Lobby";
  if (n.includes("bath") || n.includes("wash") || n.includes("toilet")) return "Bath";
  if (n.includes("city") || n.includes("male")) return "City";
  if (n.includes("food") || n.includes("breakfast")) return "Dining";
  if (n.includes("hall") || n.includes("corridor")) return "Interiors";
  return "Misc";
};

/* pull ALL photos from src/assets/TourInn */
const GALLERY_CTX = safeCtx(() =>
  require.context("../assets/TourInn", false, /\.(png|jpe?g|webp)$/i)
);

function useImages() {
  return useMemo(() => {
    const list = importAll(GALLERY_CTX);
    return list.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
  }, []);
}

const cx = (...xs) => xs.filter(Boolean).join(" ");

/* ---------------- blur-up image w/ skeleton ---------------- */
function SmoothImg({ src, alt = "", thumb, className = "", imgClass = "", onLoad }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cx("relative overflow-hidden", className)}>
      <div aria-hidden className={cx("absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 to-slate-200", loaded && "opacity-0 transition-opacity duration-300")} />
      {thumb && (
        <img src={thumb} alt="" aria-hidden className={cx("absolute inset-0 h-full w-full object-cover blur-xl scale-105", loaded && "opacity-0 transition-opacity duration-300")} />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => { setLoaded(true); onLoad?.(); }}
        className={cx("h-full w-full object-cover will-change-transform", !loaded && "opacity-0", loaded && "opacity-100 transition-opacity duration-300", imgClass)}
      />
    </div>
  );
}

/* ---------------- URL helpers ---------------- */
function useQueryState() {
  const nav = useNavigate();
  const loc = useLocation();
  const set = (obj, replace=false) => {
    const url = new URL(window.location.href);
    Object.entries(obj).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") url.searchParams.delete(k);
      else url.searchParams.set(k, String(v));
    });
    replace ? nav(url.pathname + url.search, { replace: true }) : nav(url.pathname + url.search, { replace: false });
  };
  const get = (k, d="") => new URLSearchParams(loc.search).get(k) ?? d;
  return { get, set };
}

/* ---------------- lightbox (autoplay, preload, URL sync) ---------------- */
function useLightbox(total, qsync) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(false);
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const touch = useRef({ x: 0 });
  const timer = useRef(null);

  const openAt = (i, btn) => { setIdx(i); setOpen(true); triggerRef.current = btn || null; qsync.set({ lightbox: i }); };
  const close = () => { setOpen(false); triggerRef.current?.focus?.(); qsync.set({ lightbox: null }); setAuto(false); };
  const prev = () => setIdx((i) => { const ni = (i - 1 + total) % total; qsync.set({ lightbox: ni }, true); return ni; });
  const next = () => setIdx((i) => { const ni = (i + 1) % total; qsync.set({ lightbox: ni }, true); return ni; });

  // keyboard + trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key.toLowerCase() === "a") setAuto((v)=>!v);
      if (e.key === "Tab") {
        const f = dialogRef.current?.querySelectorAll("button,[href],[tabindex]:not([tabindex='-1'])");
        if (!f?.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    setTimeout(() => dialogRef.current?.querySelector("button")?.focus(), 0);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, total]);

  // autoplay
  useEffect(() => {
    if (!open || !auto) { clearInterval(timer.current); return; }
    timer.current = setInterval(next, 3500);
    return () => clearInterval(timer.current);
  }, [open, auto]);

  // preload neighbors
  useEffect(() => {
    if (!open || total < 2) return;
    const preload = (i) => { const img = new Image(); img.src = qsync.images?.[i]?.src; };
    preload((idx + 1) % total);
    preload((idx - 1 + total) % total);
  }, [idx, open, total]);

  return { open, idx, setIdx, openAt, close, prev, next, dialogRef, touch, auto, setAuto };
}

/* ---------------- UI bits ---------------- */
const BrandBtn = ({ href, children, onClick, className = "", variant = "primary", external = false }) => (
  <a
    href={href}
    onClick={onClick}
    target={external ? "_blank" : undefined}
    rel={external ? "noreferrer" : undefined}
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

function ShareButton({ title = "Tour Inn", text = "Book your stay at Tour Inn, Malé", url = typeof window !== "undefined" ? window.location.href : "" }) {
  const canShare = typeof navigator !== "undefined" && !!navigator.share;
  if (!canShare) return null;
  return (
    <button onClick={() => navigator.share({ title, text, url }).catch(()=>{})} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100">🔗 Share</button>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={cx("fixed right-4 bottom-24 z-[45] h-11 w-11 rounded-full bg-white ring-1 ring-slate-200 shadow-md hover:shadow transition", show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none")}>↑</button>
  );
}

/* Simple reviews carousel (no deps) */
function Reviews() {
  const items = [
    { n: "Aisha", t: "Rooms are clean and modern. Quick check-in.", r: 5 },
    { n: "Rohit", t: "Great location in Malé. Good Wi-Fi for work.", r: 4 },
    { n: "Fatima", t: "Friendly staff and comfy beds.", r: 5 },
  ];
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(()=>setI(v => (v+1)%items.length), 3800); return ()=>clearInterval(id); }, []);
  const it = items[i];
  return (
    <div className="rounded-3xl ring-1 ring-slate-200 bg-white/95 p-6 text-center">
      <div className="text-amber-500 text-lg">{"★".repeat(it.r)}<span className="text-slate-300">{"★".repeat(5-it.r)}</span></div>
      <p className="mt-2 text-slate-700">“{it.t}”</p>
      <div className="mt-2 text-sm text-slate-500">— {it.n}</div>
      <div className="mt-4 flex justify-center gap-2">
        {items.map((_, idx)=>(<span key={idx} className={cx("h-1.5 w-1.5 rounded-full", idx===i?"bg-slate-900":"bg-slate-300")} />))}
      </div>
    </div>
  );
}

/* WhatsApp floating action */
function WhatsAppFAB() {
  return (
    <a
      href={`https://wa.me/9607860882?text=${encodeURIComponent("Hi Tour Inn, I'd like to check availability and rates.")}`}
      target="_blank"
      rel="noreferrer"
      className="fixed right-4 bottom-8 z-[46] inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-4 text-white shadow-lg hover:brightness-95"
    >
      <span className="text-xl">🟢</span>
      <span className="font-semibold">WhatsApp</span>
    </a>
  );
}

/* WhatsApp sticky bar (sticky under subnav) */
function WhatsAppBar() {
  const msg = encodeURIComponent("Hello Tour Inn, I'd like to check dates and rates for a booking.");
  return (
    <div className="sticky top-[108px] z-30 bg-white/90 backdrop-blur ring-1 ring-slate-200">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-3 flex flex-wrap items-center gap-3">
        <div className="text-sm font-semibold text-slate-900">Questions or booking?</div>
        <div className="text-sm text-slate-600">Message us on WhatsApp.</div>
        <div className="ml-auto flex items-center gap-3">
          <a
            href={`https://wa.me/9607860882?text=${msg}`}
            target="_blank"
            rel="noreferrer"
            className="relative inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold overflow-hidden ring-1 ring-black/5 text-white"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]" />
            <span className="relative">WhatsApp Us</span>
          </a>
          <a href="tel:+9607860882" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100">📞 +960 786 0882</a>
        </div>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */
export default function TourInnGallery() {
  const all = useImages();
  const hero = all[0]?.src || "";
  const qsync = useQueryState();
  qsync.images = all; // supply for preload helper

  // ======= WHATSAPP BOOK NOW LINK (centralized) =======
  const WA_BOOK = `https://wa.me/9607860882?text=${encodeURIComponent(
    "Hi Tour Inn, I'd like to book a room.\nDates: __ to __\nGuests: __\nRoom type: __\nPlease share the best direct rate. Thanks!"
  )}`;

  // filters from URL
  const initialTag = qsync.get("tag", "All");
  const initialQ = qsync.get("q", "");
  const [q, setQ] = useState(initialQ);
  const [tag, setTag] = useState(initialTag);
  useEffect(()=>{ qsync.set({ q, tag }, true); }, [q, tag]);

  const { open, idx, setIdx, openAt, close, prev, next, dialogRef, touch, auto, setAuto } = useLightbox(all.length, qsync);

  // open lightbox from URL (?lightbox=5)
  useEffect(() => {
    const li = qsync.get("lightbox");
    if (li !== null && li !== undefined && li !== "") {
      const i = Math.max(0, Math.min(all.length-1, Number(li)));
      if (!isNaN(i) && all[i]) setTimeout(()=>openAt(i, null), 0);
    }
  }, [all.length]);

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
    { name: "Superior Room", copy: "Elegant interiors with queen/twin layout — perfect for short city stays.", img: all[0]?.src, thumb: all[0]?.thumb, price: "From $69", href: WA_BOOK, icons: ["🛏️ Queen/Twin", "📶 High-Speed Wi-Fi", "📺 Smart TV", "☕ Tea/Coffee"] },
    { name: "Deluxe Room", copy: "More space, lounge seating & warm lighting for comfy longer stays.", img: all[1]?.src, thumb: all[1]?.thumb, price: "From $89", href: WA_BOOK, icons: ["🛏️ King/Queen", "❄️ Air-Conditioning", "📺 Smart TV", "🔐 Safe"] },
    { name: "Business Deluxe", copy: "Work-friendly layout; select rooms with balcony & city views.", img: all[2]?.src, thumb: all[2]?.thumb, price: "From $105", href: WA_BOOK, icons: ["🛏️ King Bed", "🧑‍💻 Desk", "📶 Fast Wi-Fi", "☕ Coffee/Tea"] },
  ];

  /* gallery search / tag filter */
  const tags = useMemo(() => ["All", ...Array.from(new Set(all.map(x => x.tag)))], [all]);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return all.filter(x => (tag === "All" || x.tag === tag) && (!term || x.key.toLowerCase().includes(term) || x.tag.toLowerCase().includes(term)));
  }, [all, q, tag]);

  return (
    <div className="min-h-screen bg-[rgb(252,249,253)] text-slate-800">
      {/* ========== HERO ========== */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-slate-900" />
        {hero ? (<>
          <img src={hero} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-black/35" />
        </>) : null}
        <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-20 md:py-28 text-white">
          <p className="text-[11px] tracking-[0.28em] uppercase text-white/85">Urban Comfort in Malé</p>
          <h1 className="mt-2 text-4xl md:text-6xl font-semibold">Tour Inn</h1>
          <p className="mt-4 max-w-2xl text-white/90">Quiet stays • modern amenities • city convenience. Explore rooms, gallery & location.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {/* Book Now -> WhatsApp */}
            <BrandBtn href={WA_BOOK} external>Book Now</BrandBtn>
            <BrandBtn href="#gallery" variant="ghost" onClick={(e) => { e.preventDefault(); goto("gallery"); }}>View Gallery</BrandBtn>
            <ShareButton />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Central Malé", "Best Rate", "24×7 Support"].map((t) => (
              <span key={t} className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-xs ring-1 ring-white/20">{t}</span>
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
              <button key={t.id} onClick={() => goto(t.id)} className={cx("relative px-4 py-3 text-sm font-semibold rounded-md transition", active === t.id ? "text-slate-900" : "text-slate-600 hover:text-slate-800")}>{t.label}
                <span className={cx("pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] origin-left bg-gradient-to-r from-[#6A00FF] to-[#FF2EA8] transition-transform", active === t.id ? "scale-x-100" : "scale-x-0")} />
              </button>
            ))}
            <div className="ml-auto py-2">
              {/* Subnav CTA -> WhatsApp */}
              <BrandBtn href={WA_BOOK} external className="px-4 py-2 text-xs">Book Tour Inn</BrandBtn>
            </div>
          </nav>
        </div>
      </div>

      {/* NEW: WhatsApp quick bar */}
      <WhatsAppBar />

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
                  {r.img ? (<SmoothImg src={r.img} thumb={r.thumb} alt={r.name} />) : (<div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />)}
                  {r.price && (<span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold ring-1 ring-slate-200">{r.price}</span>)}
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="text-xl font-semibold text-slate-900">{r.name}</h3>
                  <p className="mt-2 text-slate-600">{r.copy}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-slate-600 text-sm">
                    {r.icons.map((t, j) => <span key={j} className="inline-flex items-center">{t}</span>)}
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <button onClick={(e)=>openAt(Math.min(i, Math.max(0, all.length-1)), e.currentTarget)} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100">View Photos</button>
                    {/* Room CTA -> WhatsApp */}
                    <BrandBtn href={r.href} external>WhatsApp to Book</BrandBtn>
                  </div>
                </div>
              </article>
            ))}

            {/* wide card */}
            <article className="md:col-span-2 overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white/95 shadow-sm">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[16/10] md:h-full">
                  {all[3]?.src ? (<SmoothImg src={all[3].src} thumb={all[3].thumb} alt="Family / Long stay" />) : (<div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />)}
                </div>
                <div className="p-5 md:p-6 flex flex-col">
                  <h3 className="text-xl font-semibold text-slate-900">Family / Long Stay</h3>
                  <p className="mt-2 text-slate-600">Spacious layouts for families & extended stays with refined amenities.</p>
                  <div className="mt-4 text-slate-600 text-sm">🛏️ Up to 4 • 📶 Fast Wi-Fi • ☕ Coffee/Tea • ❄️ AC • 🛁 Ensuite</div>
                  <div className="mt-auto pt-4 flex items-center gap-3">
                    <button onClick={(e)=>openAt(3, e.currentTarget)} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100">View Photos</button>
                    {/* Wide card CTA -> WhatsApp */}
                    <BrandBtn href={WA_BOOK} external>WhatsApp to Book</BrandBtn>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Reviews row */}
          <div className="mt-10">
            <Reviews />
          </div>
        </div>
      </section>

      {/* ========== GALLERY (filters + masonry) ========== */}
      <section id="gallery" className="pb-16 md:pb-24">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-6 md:mb-8">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">Photo Gallery</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">A look inside Tour Inn</h2>
            {all.length > 0 && <p className="mt-1 text-sm text-slate-500">{filtered.length} / {all.length} photos</p>}
          </header>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {["All", ...Array.from(new Set(all.map(x => x.tag)))].map((t) => (
                <button key={t} onClick={() => setTag(t)} className={cx("rounded-full px-3 py-1.5 text-sm ring-1 transition", tag === t ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-100")}>{t}</button>
              ))}
            </div>
            <div className="relative">
              <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search photos…" className="w-56 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" />
              {q && (<button onClick={()=>setQ("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" aria-label="Clear">✕</button>)}
            </div>
          </div>

          {all.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">Add JPG/PNG/WEBP to <code>src/assets/TourInn</code> to see the gallery.</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">No photos match your search.</div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
              {filtered.map((img) => {
                const realIndex = all.findIndex(x => x.key === img.key);
                return (
                  <button key={img.key} onClick={(e)=>{e.currentTarget.blur(); openAt(realIndex, e.currentTarget);}} className="group mb-4 block w-full overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm hover:shadow-md transition will-change-transform break-inside-avoid">
                    <SmoothImg src={img.src} thumb={img.thumb} alt={`Tour Inn photo ${realIndex + 1}`} imgClass="group-hover:scale-[1.01] transition-transform duration-300" />
                    <span className="pointer-events-none absolute m-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white opacity-0 ring-1 ring-white/10 backdrop-blur group-hover:opacity-100">🔍 View</span>
                  </button>
                );
              })}
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
              <iframe title="Map" src="https://www.google.com/maps?q=Male+Maldives&output=embed" className="w-full h-[360px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <div className="rounded-3xl ring-1 ring-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">Tour Inn</h3>
              <p className="mt-2 text-slate-600">Ma. Leaves, Maaveyo Goalhi, Malé, Maldives</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {/* Location card CTA -> WhatsApp */}
                <BrandBtn href={WA_BOOK} external>Book Now</BrandBtn>
                <a href="tel:+9607860882" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100">📞 +960 786 0882</a>
                <CopyButton text="Ma. Leaves, Maaveyo Goalhi, Malé, Maldives" />
                <ShareButton title="Tour Inn — Malé" text="Location & booking for Tour Inn" />
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
              ["Payments","Major cards accepted. Best rates on direct bookings."],
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
          <div ref={dialogRef} className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Tour Inn photo viewer">
            <div className="relative max-w-[92vw] max-h-[86vh]">
              <img
                src={all[idx].src}
                alt=""
                className="max-h-[86vh] w-auto rounded-2xl shadow-2xl"
                onTouchStart={(e) => { touch.current.x = e.touches[0].clientX; }}
                onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - touch.current.x; if (Math.abs(dx) > 40) (dx > 0 ? prev() : next()); }}
              />
              <button onClick={close} className="absolute -top-3 -right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow ring-1 ring-slate-200" aria-label="Close">✕</button>
              <button onClick={prev} className="hidden sm:inline-flex absolute left-0 top-1/2 -translate-x-16 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow ring-1 ring-slate-200" aria-label="Previous">‹</button>
              <button onClick={next} className="hidden sm:inline-flex absolute right-0 top-1/2 translate-x-16 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow ring-1 ring-slate-200" aria-label="Next">›</button>
              <button onClick={()=>setAuto(v=>!v)} className="absolute left-1/2 -translate-x-1/2 -bottom-12 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-1.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 shadow">{auto?"⏸ Pause":"▶️ Auto-play"}</button>
            </div>
            <div className="mt-5 text-center text-white/85">{idx + 1} / {all.length}</div>
            <div className="mt-3 max-w-[92vw] overflow-x-auto">
              <div className="flex gap-2">
                {all.map((t, ti) => (
                  <button key={t.key} onClick={() => setIdx(ti)} className={cx("h-16 w-24 overflow-hidden rounded-lg ring-2 transition", ti === idx ? "ring-white" : "ring-white/30 hover:ring-white/60")} aria-label={`Go to photo ${ti + 1}`}>
                    <img src={t.src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* footer hairline + back */}
      <div className="h-px w-full bg-gradient-to-r from-[#FF2EA8] via-[#B86DFF] to-[#6A00FF] opacity-40" />
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-10 text-center text-sm text-slate-500">
        <Link to="/" className="rounded-full ring-1 ring-slate-300 px-4 py-2 hover:bg-slate-100">← Back to Home</Link>
      </div>

      {/* sticky mobile CTA -> WhatsApp */}
      <div className={cx("fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[1180px] px-4 md:px-6 pb-4 transition", showCta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none")}> 
        <div className="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-slate-200 shadow-lg p-3 flex items-center justify-between">
          <div className="text-sm leading-tight">
            <div className="font-semibold text-slate-900">Ready to book Tour Inn?</div>
            <div className="text-slate-500">Best rate on direct bookings</div>
          </div>
          <BrandBtn href={WA_BOOK} external className="px-4 py-2 text-xs">WhatsApp Now</BrandBtn>
        </div>
      </div>

      <BackToTop />
      <WhatsAppFAB />
    </div>
  );
}
