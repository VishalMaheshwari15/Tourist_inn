// src/pages/TourInnGallery.jsx — RESPONSIVE ULTRA build (mobile → 4K), smooth & stable

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/* ---------------- tiny utils ---------------- */
const cx = (...xs) => xs.filter(Boolean).join(" ");

const tagFromName = (k) => {
  const n = k.toLowerCase();
  if (n.includes("delux") || n.includes("room") || n.includes("bed")) return "Rooms";
  if (n.includes("lobby") || n.includes("reception") || n.includes("checkin")) return "Lobby";
  if (n.includes("bath") || n.includes("wash") || n.includes("toilet")) return "Bath";
  if (n.includes("kitchen") || n.includes("breakfast") || n.includes("food")) return "Dining";
  if (n.includes("outside") || n.includes("gallery")) return "Exteriors";
  if (n.includes("hall") || n.includes("corridor")) return "Interiors";
  if (n.includes("male") || n.includes("city")) return "City";
  return "Misc";
};

/* ---------------- image loader (Vite + CRA compatible) ---------------- */
function viteLoadAll() {
  try {
    const files = import.meta.glob("../assets/TourInn/*.{png,jpg,jpeg,webp}", { eager: true });
    const thumbs = import.meta.glob("../assets/TourInn/thumbs/*.{png,jpg,jpeg,webp}", { eager: true });
    return Object.keys(files).map((path) => {
      const mod = files[path];
      const key = path.split("/").pop();
      const src = (mod && (mod.default || mod)) || "";
      const tKey = "../assets/TourInn/thumbs/" + key;
      const tMod = thumbs[tKey];
      const thumb = tMod ? (tMod.default || tMod) : null;
      return { key, src, thumb, tag: tagFromName(key) };
    });
  } catch { return null; }
}

function craLoadAll() {
  try {
    const ctx = require.context("../assets/TourInn", false, /\.(png|jpe?g|webp)$/i);
    const tctx = (() => { try { return require.context("../assets/TourInn/thumbs", false, /\.(png|jpe?g|webp)$/i); } catch { return null; } })();
    return ctx.keys().map((k) => {
      const mod = ctx(k);
      const key = k.replace("./", "");
      const src = typeof mod === "string" ? mod : mod.default;
      let thumb = null;
      if (tctx) {
        try { const t = tctx("./" + key); thumb = typeof t === "string" ? t : t.default; } catch {}
      }
      return { key, src, thumb, tag: tagFromName(key) };
    });
  } catch { return []; }
}

function useImages() {
  return useMemo(() => {
    const vite = viteLoadAll();
    const list = (vite ?? craLoadAll()) ?? [];
    return list.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
  }, []);
}

/* ---------------- blur-up image ---------------- */
function SmoothImg({ src, alt = "", thumb, className = "", imgClass = "" }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cx("relative overflow-hidden", className)}>
      {/* skeleton */}
      <div
        aria-hidden
        className={cx(
          "absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 to-slate-200",
          loaded && "opacity-0 transition-opacity duration-300"
        )}
      />
      {/* blurred tiny preview */}
      {thumb && (
        <img
          src={thumb}
          alt=""
          aria-hidden
          className={cx(
            "absolute inset-0 h-full w-full object-cover blur-xl scale-105",
            loaded && "opacity-0 transition-opacity duration-300"
          )}
        />
      )}
      {/* main */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        /* responsive hint: card widths ~ 100% of column; heights vary */
        sizes="(max-width: 640px) 100vw,
               (max-width: 1024px) 50vw,
               33vw"
        className={cx(
          "h-full w-full object-cover",
          loaded ? "opacity-100 transition-opacity duration-300" : "opacity-0",
          imgClass
        )}
      />
    </div>
  );
}

/* ---------------- URL state ---------------- */
function useQueryState() {
  const nav = useNavigate();
  const loc = useLocation();
  const set = (obj, replace=false) => {
    const url = new URL(window.location.href);
    Object.entries(obj).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") url.searchParams.delete(k);
      else url.searchParams.set(k, String(v));
    });
    nav(url.pathname + url.search, { replace });
  };
  const get = (k, d="") => new URLSearchParams(loc.search).get(k) ?? d;
  return { get, set };
}

/* ---------------- lightbox (simple/stable) ---------------- */
function useLightbox(total, qsync) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const dialogRef = useRef(null);
  const touch = useRef({ x: 0 });

  const openAt = (i) => { setIdx(i); setOpen(true); qsync.set({ lightbox: i }, true); };
  const close = () => { setOpen(false); qsync.set({ lightbox: null }, true); };
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
    return () => window.removeEventListener("keydown", onKey);
  }, [open]); // functions are stable within this hook

  return { open, idx, setIdx, openAt, close, prev, next, dialogRef, touch };
}

/* ---------------- button ---------------- */
const BrandBtn = ({ href, children, className = "", variant = "primary", external = true }) => (
  <a
    href={href}
    target={external ? "_blank" : undefined}
    rel={external ? "noreferrer" : undefined}
    className={cx(
      "relative inline-flex items-center justify-center rounded-full font-semibold overflow-hidden ring-1 transition",
      "px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base",
      variant === "primary" ? "text-white ring-black/5" : "text-slate-900 ring-slate-300 hover:bg-slate-100",
      className
    )}
  >
    {variant === "primary" && <span className="absolute inset-0 bg-gradient-to-r from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]" />}
    <span className="relative">{children}</span>
  </a>
);

/* ===================================================================== */
/*                                  PAGE                                 */
/* ===================================================================== */
export default function TourInnGallery() {
  const all = useImages();
  const qsync = useQueryState();
  const location = useLocation(); // for safe query parsing

  const WA_BOOK = `https://wa.me/9607860882?text=${encodeURIComponent(
    "Hi Tour Inn, I'd like to book a room.\nDates: __ to __\nGuests: __\nRoom type: __\nPlease share the best direct rate. Thanks!"
  )}`;

  // Banner preference: TourInnBanner.png -> else first image
  const heroBanner = useMemo(() => {
    const b = all.find(x => /tourinnbanner\.(png|jpe?g|webp)$/i.test(x.key));
    return b?.src || all[0]?.src || "";
  }, [all]);

  // filters
  const [q, setQ] = useState(qsync.get("q", ""));
  const [tag, setTag] = useState(qsync.get("tag", "All"));
  useEffect(() => { qsync.set({ q, tag }, true); }, [q, tag]);

  const { open, idx, setIdx, openAt, close, prev, next, dialogRef, touch } = useLightbox(all.length, qsync);

  // open lightbox via ?lightbox=N
  const lightboxParam = useMemo(() => new URLSearchParams(location.search).get("lightbox") ?? "", [location.search]);
  useEffect(() => {
    if (!all.length || lightboxParam === "") return;
    const i = Math.max(0, Math.min(all.length - 1, Number(lightboxParam)));
    if (!isNaN(i) && all[i]) openAt(i);
  }, [all.length, lightboxParam]);

  // subnav active
  const [active, setActive] = useState("rooms");
  useEffect(() => {
    const ids = ["rooms", "gallery", "facts", "location", "policies"];
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver((entries) => {
      const vis = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (vis?.target?.id) setActive(vis.target.id);
    }, { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.6, 1] });
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);
  const goto = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const pick = (part) => all.find(x => x.key.toLowerCase().includes(part.toLowerCase()));

  const roomCards = [
    { name: "Superior Room", copy: "Elegant interiors with queen/twin layout — perfect for short city stays.",
      ...( (() => { const i = pick("Room.jpg") || all[0]; return { img: i?.src, thumb: i?.thumb }; })() ),
      href: WA_BOOK, icons: ["🛏️ Queen/Twin","📶 Wi-Fi","📺 Smart TV","☕ Tea/Coffee"],
    },
    { name: "Deluxe Room", copy: "More space, lounge seating & warm lighting for comfy longer stays.",
      ...( (() => { const i = pick("SideAngleofDeluxRoom") || pick("PersonalRoom") || all[1]; return { img: i?.src, thumb: i?.thumb }; })() ),
      href: WA_BOOK, icons: ["🛏️ King/Queen","❄️ AC","📺 Smart TV","🔐 Safe"],
    },
    { name: "Business Deluxe", copy: "Work-friendly layout; select rooms with city views.",
      ...( (() => { const i = pick("PersonalRoomMirrorArea") || pick("PersonalRoom (2)") || all[2]; return { img: i?.src, thumb: i?.thumb }; })() ),
      href: WA_BOOK, icons: ["🧑‍💻 Desk","📶 Fast Wi-Fi","☕ Coffee/Tea","🛁 Ensuite"],
    },
  ];

  const tags = useMemo(() => ["All", ...Array.from(new Set(all.map(x => x.tag)))], [all]);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return all.filter(x => (tag === "All" || x.tag === tag) && (!term || x.key.toLowerCase().includes(term) || x.tag.toLowerCase().includes(term)));
  }, [all, q, tag]);

  return (
    <div className="min-h-screen bg-[rgb(252,249,253)] text-slate-800">
      {/* ========== HERO (banner FIRST) ========== */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-slate-900" />
        {heroBanner ? (
          <>
            <img
              src={heroBanner}
              alt=""
              className="absolute inset-0 -z-10 h-full w-full object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 -z-10 bg-black/35" />
          </>
        ) : null}
        <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-16 sm:py-20 md:py-28 text-white">
          <p className="text-[10px] sm:text-[11px] tracking-[0.24em] sm:tracking-[0.28em] uppercase text-white/85">Urban Comfort in Malé</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-6xl font-semibold">Tour Inn</h1>
          <p className="mt-3 sm:mt-4 max-w-2xl text-white/90 text-sm sm:text-base md:text-lg">
            Quiet stays • modern amenities • city convenience. Explore rooms, gallery & location.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
            <BrandBtn href={WA_BOOK}>Book on WhatsApp</BrandBtn>
            <a
              href="#gallery"
              onClick={(e) => { e.preventDefault(); goto("gallery"); }}
              className="relative inline-flex items-center justify-center rounded-full px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100"
            >
              View Gallery
            </a>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]/90 opacity-60" />
      </section>

      {/* ========== STICKY SUBNAV (no CTA) ========== */}
      <div className="sticky top-[64px] sm:top-[68px] z-40 bg-white/80 backdrop-blur ring-1 ring-slate-200">
        <div className="mx-auto max-w-[1180px] px-2 sm:px-4 md:px-6">
          <nav className="flex flex-wrap gap-1 sm:gap-1.5">
            {[{ id: "rooms", label: "Rooms" }, { id: "gallery", label: "Gallery" }, { id: "facts", label: "Quick Facts" }, { id: "location", label: "Location" }, { id: "policies", label: "Policies / FAQ" }].map((t) => (
              <button
                key={t.id}
                onClick={() => goto(t.id)}
                className={cx(
                  "relative px-3 py-2 sm:px-4 sm:py-3 text-[13px] sm:text-sm font-semibold rounded-md transition",
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

      {/* ========== ROOMS ========== */}
      <section id="rooms" className="py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-6 sm:mb-8 md:mb-12">
            <p className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.22em] uppercase text-slate-500">Rooms &amp; Suites</p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">Choose your stay</h2>
          </header>

          <div className="grid gap-6 sm:gap-8 md:gap-10 sm:grid-cols-2">
            {roomCards.map((r, i) => (
              <article
                key={r.name}
                className="overflow-hidden rounded-2xl sm:rounded-3xl ring-1 ring-slate-200 bg-white/95 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                <div className="relative aspect-[16/10] w-full">
                  {r.img ? (
                    <SmoothImg
                      src={r.img}
                      thumb={r.thumb}
                      alt={r.name}
                      /* guard giant portrait pics from creating tall columns */
                      imgClass="max-h-[44vh] sm:max-h-[42vh] md:max-h-[40vh] lg:max-h-[36vh] xl:max-h-[34vh]"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />
                  )}
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{r.name}</h3>
                  <p className="mt-2 text-sm sm:text-base text-slate-600">{r.copy}</p>
                  <div className="mt-3 sm:mt-4 flex flex-wrap gap-2.5 sm:gap-3 text-slate-600 text-[13px] sm:text-sm">
                    {r.icons.map((t, j) => <span key={j} className="inline-flex items-center">{t}</span>)}
                  </div>
                  <div className="mt-4 sm:mt-5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openAt(Math.min(i, Math.max(0, all.length-1)))}
                      className="rounded-full px-3.5 py-2 text-[13px] sm:px-4 sm:py-2.5 sm:text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100"
                    >
                      View Photos
                    </button>
                    <BrandBtn href={r.href} className="whitespace-nowrap">WhatsApp</BrandBtn>
                  </div>
                </div>
              </article>
            ))}

            {/* wide card */}
            <article className="sm:col-span-2 overflow-hidden rounded-2xl sm:rounded-3xl ring-1 ring-slate-200 bg-white/95 shadow-sm">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[16/10] md:h-full">
                  {(pick("OutsideViewOfKithenandroom") || all[3])?.src ? (
                    <SmoothImg
                      src={(pick("OutsideViewOfKithenandroom") || all[3]).src}
                      thumb={(pick("OutsideViewOfKithenandroom") || all[3]).thumb}
                      alt="Family / Long stay"
                      imgClass="max-h-[46vh] md:max-h-none"
                    />
                  ) : (<div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />)}
                </div>
                <div className="p-4 sm:p-5 md:p-6 flex flex-col">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Family / Long Stay</h3>
                  <p className="mt-2 text-sm sm:text-base text-slate-600">Spacious layouts for families & extended stays with refined amenities.</p>
                  <div className="mt-3 sm:mt-4 text-slate-600 text-[13px] sm:text-sm">🛏️ Up to 4 • 📶 Fast Wi-Fi • ☕ Coffee/Tea • ❄️ AC • 🛁 Ensuite</div>
                  <div className="mt-3 sm:mt-auto pt-3 sm:pt-4 flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => openAt(3)}
                      className="rounded-full px-3.5 py-2 text-[13px] sm:px-4 sm:py-2.5 sm:text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100"
                    >
                      View Photos
                    </button>
                    <BrandBtn href={WA_BOOK}>WhatsApp</BrandBtn>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ========== GALLERY ========== */}
      <section id="gallery" className="pb-14 sm:pb-16 md:pb-24">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-5 sm:mb-6 md:mb-8">
            <p className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.22em] uppercase text-slate-500">Photo Gallery</p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">A look inside Tour Inn</h2>
            {all.length > 0 && <p className="mt-1 text-xs sm:text-sm text-slate-500">{filtered.length} / {all.length} photos</p>}
          </header>

          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={cx(
                    "rounded-full px-3 py-1.5 text-[12.5px] sm:text-sm ring-1 transition",
                    t === tag ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-100"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="Search photos…"
                className="w-full sm:w-56 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
              {q && (
                <button
                  onClick={()=>setQ("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
                  aria-label="Clear"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {all.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center text-sm sm:text-base">
              Add JPG/PNG/WEBP to <code>src/assets/TourInn</code> to see the gallery.
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center text-slate-600">
              No photos match your search.
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 [column-fill:_balance]">
              {filtered.map((img) => {
                const realIndex = all.findIndex(x => x.key === img.key);
                return (
                  <button
                    key={img.key}
                    onClick={()=>openAt(realIndex)}
                    className="group mb-3 sm:mb-4 block w-full overflow-hidden rounded-xl sm:rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm hover:shadow-md transition break-inside-avoid"
                  >
                    <SmoothImg
                      src={img.src}
                      thumb={img.thumb}
                      alt={`Tour Inn photo ${realIndex + 1}`}
                      imgClass="group-hover:scale-[1.01] transition-transform duration-300"
                    />
                    <span className="pointer-events-none absolute m-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white opacity-0 ring-1 ring-white/10 backdrop-blur group-hover:opacity-100">
                      🔍 View
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========== QUICK FACTS ========== */}
      <section id="facts" className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-6 sm:mb-8">
            <p className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.22em] uppercase text-slate-500">At a glance</p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">Quick Facts</h2>
          </header>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
            {[{ k: "Wi-Fi", v: "High-Speed throughout" }, { k: "Location", v: "Central Malé" }, { k: "Check-in", v: "2:00 PM (Early on request)" }, { k: "Airport Transfer", v: "On request" }, { k: "Housekeeping", v: "Daily" }, { k: "Security", v: "Secure Entry" }].map((f) => (
              <div key={f.k} className="rounded-xl sm:rounded-2xl bg-white ring-1 ring-slate-200 p-4 sm:p-5 shadow-sm">
                <div className="text-sm sm:text-base font-semibold text-slate-900">{f.k}</div>
                <div className="mt-1 text-xs sm:text-sm text-slate-600">{f.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== LOCATION ========== */}
      <section id="location" className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-6 sm:mb-8">
            <p className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.22em] uppercase text-slate-500">Find Us</p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">Location & Contact</h2>
          </header>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-[1.25fr_.75fr]">
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl ring-1 ring-slate-200 bg-white">
              <iframe
                title="Map"
                src="https://www.google.com/maps?q=Male+Maldives&output=embed"
                className="w-full h-[280px] sm:h-[340px] md:h-[360px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="rounded-2xl sm:rounded-3xl ring-1 ring-slate-200 bg-white p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">Tour Inn</h3>
              <p className="mt-2 text-sm text-slate-600">Ma. Leaves, Maaveyo Goalhi, Malé, Maldives</p>
              <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                <BrandBtn href={WA_BOOK}>Book on WhatsApp</BrandBtn>
                <a
                  href="tel:+9607860882"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100"
                >
                  📞 +960 786 0882
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== POLICIES / FAQ ========== */}
      <section id="policies" className="pb-16 md:pb-20">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-6 sm:mb-8">
            <p className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.22em] uppercase text-slate-500">Good to know</p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">Policies & FAQ</h2>
          </header>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {[
              ["Check-in / Check-out","Check-in 2:00 PM • Check-out 12:00 PM. Early check-in / late check-out subject to availability."],
              ["Airport Transfers","We can arrange airport pickup on request. Share your flight details after booking."],
              ["House Rules","No smoking inside rooms. Quiet hours 10 PM – 7 AM. Visitors to register at reception."],
              ["Payments","Major cards accepted. Best rates on direct bookings."],
            ].map(([q,a]) => (
              <details key={q} className="group rounded-2xl bg-white ring-1 ring-slate-200 p-4 sm:p-5">
                <summary className="cursor-pointer select-none font-semibold text-slate-900 text-sm sm:text-base">{q}</summary>
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
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-3 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Tour Inn photo viewer"
          >
            <div className="relative max-w-[96vw] sm:max-w-[92vw] max-h-[80vh] sm:max-h-[86vh]">
              <img
                src={all[idx].src}
                alt=""
                className="max-h-[80vh] sm:max-h-[86vh] w-auto rounded-xl sm:rounded-2xl shadow-2xl"
                onTouchStart={(e) => { touch.current.x = e.touches[0].clientX; }}
                onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - touch.current.x; if (Math.abs(dx) > 40) (dx > 0 ? prev() : next()); }}
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
                className="hidden sm:inline-flex absolute left-0 top-1/2 -translate-x-14 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow ring-1 ring-slate-200"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="hidden sm:inline-flex absolute right-0 top-1/2 translate-x-14 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow ring-1 ring-slate-200"
                aria-label="Next"
              >
                ›
              </button>
            </div>

            {/* index + thumbs (scrollable on mobile) */}
            <div className="mt-3 sm:mt-5 text-center text-white/85 text-xs sm:text-sm">{idx + 1} / {all.length}</div>
            <div className="mt-2 sm:mt-3 max-w-[96vw] sm:max-w-[92vw] overflow-x-auto">
              <div className="flex gap-2 sm:gap-2.5 px-1">
                {all.map((t, ti) => (
                  <button
                    key={t.key}
                    onClick={() => setIdx(ti)}
                    className={cx(
                      "h-14 w-20 sm:h-16 sm:w-24 overflow-hidden rounded-md sm:rounded-lg ring-2 transition shrink-0",
                      ti === idx ? "ring-white" : "ring-white/30 hover:ring-white/60"
                    )}
                    aria-label={`Go to photo ${ti + 1}`}
                  >
                    <img src={t.src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* footer */}
      <div className="h-px w-full bg-gradient-to-r from-[#FF2EA8] via-[#B86DFF] to-[#6A00FF] opacity-40" />
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-8 sm:py-10 text-center text-xs sm:text-sm text-slate-500">
        <Link to="/" className="rounded-full ring-1 ring-slate-300 px-3.5 py-2 sm:px-4 sm:py-2 hover:bg-slate-100">← Back to Home</Link>
      </div>
    </div>
  );
}
