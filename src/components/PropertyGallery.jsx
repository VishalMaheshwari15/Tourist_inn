// src/components/PropertyGallery.jsx — Premium Pro Layout
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BedDouble,
  Wifi,
  Tv,
  Coffee,
  Snowflake,
  Shield,
  KeyRound,
  Bath,
  Users,
  MapPin,
  Phone,
  Share2,
  Images as ImagesIcon,
  ArrowLeft,
  ArrowRight,
  X as XIcon,
  Star,
  Copy,
  Check,
} from "lucide-react";

/* -------------------------------------------------------
   Small utilities
------------------------------------------------------- */
const safeCtx = (make) => {
  try { return make(); } catch { return null; }
};

/** importAll: works for both Webpack (require.context) and Vite (import.meta.glob) */
const importAll = (ctxOrGlob /* function or object */) => {
  if (!ctxOrGlob) return [];
  // Webpack path
  if (typeof ctxOrGlob === "function" && ctxOrGlob.keys) {
    return ctxOrGlob.keys().map((k) => {
      const mod = ctxOrGlob(k);
      return { key: k.replace("./", ""), src: typeof mod === "string" ? mod : mod.default };
    });
  }
  // Vite path (import.meta.glob)
  if (typeof ctxOrGlob === "object") {
    return Object.keys(ctxOrGlob).map((k) => {
      const mod = ctxOrGlob[k];
      const src = mod?.default || mod;
      return { key: k.split("/").pop(), src };
    });
  }
  return [];
};

const cx = (...xs) => xs.filter(Boolean).join(" ");

const BrandBtn = ({ children, href, onClick, className = "", variant = "primary" }) => (
  <a
    href={href}
    onClick={onClick}
    className={cx(
      "relative inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold overflow-hidden ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      variant === "primary"
        ? "text-white ring-black/5"
        : "text-slate-900 ring-slate-200 hover:bg-slate-50",
      className
    )}
  >
    {variant === "primary" && <span className="absolute inset-0 bg-gradient-to-r from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]" />}
    <span className={cx("relative flex items-center gap-2", variant !== "primary" && "text-sm")}>{children}</span>
  </a>
);

/* -------------------------------------------------------
   “DB”: start with Tourist Inn only
------------------------------------------------------- */
const HOTELS = {
  "tourist-inn": {
    title: "Tourist Inn",
    eyebrow: "Rooms & Suites",
    rating: 4.6,
    reviews: 218,
    intro: "Your city address in Malé — quiet, clean and central. Explore rooms and the full gallery.",
    // Webpack require.context; Vite fallback below
    ctx: safeCtx(() =>
      // If using Webpack
      require.context("../assets/TouristInn", false, /\.(png|jpe?g|webp)$/i)
    ),
    // If using Vite, comment the require.context above and uncomment below:
    // ctx: import.meta.glob("../assets/TouristInn/*.{png,jpg,jpeg,webp}", { eager: true }),
    facts: [
      { k: "Occupancy", v: "1–3 Guests" },
      { k: "Wi‑Fi", v: "High‑Speed" },
      { k: "Location", v: "Central Malé" },
    ],
    location: {
      lines: ["Ma. Leaves, Maaveyo Goalhi", "Malé, Maldives"],
      maps:
        "https://www.google.com/maps/search/?api=1&query=Ma.+Leaves,+Maaveyo+Goalhi,+Male,+Maldives",
      phone: "+9607860882",
    },
  },
};

/* -------------------------------------------------------
   Skeletons & helpers
------------------------------------------------------- */
const Shimmer = ({ className = "h-40 w-full" }) => (
  <div className={cx(
    "relative overflow-hidden rounded-2xl bg-slate-200/70",
    className
  )}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent)]" />
  </div>
);

/* -------------------------------------------------------
   Component
------------------------------------------------------- */
export default function PropertyGallery() {
  const { slug } = useParams();
  const meta = HOTELS[slug];
  if (!meta) return <Navigate to="/" replace />;

  // images (sorted naturally)
  const images = useMemo(() => {
    const list = importAll(meta.ctx);
    return list.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
  }, [meta.ctx]);

  const hero = images[0]?.src;

  /* ===== sticky subnav (Rooms • Gallery • Location) ===== */
  const [active, setActive] = useState("rooms");
  useEffect(() => {
    const ids = ["rooms", "gallery", "location"];
    const nodes = ids.map((id) => document.getElementById(id));
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis?.target?.id) setActive(vis.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.6, 1] }
    );
    nodes.forEach((n) => n && obs.observe(n));
    return () => obs.disconnect();
  }, []);

  const goto = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ===== lightbox (accessible + swipe) ===== */
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const touchRef = useRef({ x: 0, y: 0, moved: false });
  const openAt = (i, btn) => { setIdx(i); setOpen(true); triggerRef.current = btn || null; };
  const close = () => { setOpen(false); triggerRef.current?.focus?.(); };
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  // focus trap + keys (Esc, ←, →)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    const trap = (e) => {
      const area = dialogRef.current;
      if (!area) return;
      const focusables = area.querySelectorAll(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keydown", trap);
    // set initial focus
    setTimeout(() => dialogRef.current?.querySelector("button")?.focus(), 0);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keydown", trap); };
  }, [open, images.length]);

  /* sticky mobile CTA */
  const [showCta, setShowCta] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowCta(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* room cards */
  const cardImg = (src, alt, eager = false) =>
    src ? (
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    ) : (
      <Shimmer className="h-full w-full" />
    );

  const icon = (Icon, label) => (
    <span className="inline-flex items-center gap-1.5 text-slate-600" title={label}>
      <Icon className="h-4 w-4" aria-hidden /> <span className="text-xs md:text-sm">{label}</span>
    </span>
  );

  const cards = [
    {
      name: "Superior Room",
      copy: "Elegant interiors with queen/twin layout. Ideal for short stays & business.",
      img: images[0]?.src,
      href: `/booking?hotel=${slug}&room=superior`,
      icons: [
        icon(BedDouble, "Queen/Twin"),
        icon(Wifi, "High-Speed Wi‑Fi"),
        icon(Tv, "Smart TV"),
        icon(Coffee, "Tea/Coffee"),
      ],
      eager: true,
      price: "From $69",
    },
    {
      name: "Deluxe Room",
      copy: "More space, lounge seating & warm lighting for comfortable longer stays.",
      img: images[1]?.src,
      href: `/booking?hotel=${slug}&room=deluxe`,
      icons: [
        icon(BedDouble, "King/Queen"),
        icon(Wifi, "High-Speed Wi‑Fi"),
        icon(Tv, "Smart TV"),
        icon(Snowflake, "Air‑Conditioning"),
      ],
      price: "From $89",
    },
    {
      name: "Business Deluxe",
      copy: "King bed + work-friendly setup; select rooms with balcony & city views.",
      img: images[2]?.src,
      href: `/booking?hotel=${slug}&room=business-deluxe`,
      icons: [
        icon(BedDouble, "King Bed"),
        icon(Wifi, "Fast Wi‑Fi"),
        icon(Coffee, "Coffee/Tea"),
        icon(Shield, "In‑Room Safe"),
      ],
      price: "From $105",
    },
  ];

  return (
    <div className="min-h-screen bg-[rgb(252,249,253)] text-slate-800">
      {/* ===== HERO ===== */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-slate-900" />
        {hero ? (
          <>
            <img src={hero} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-black/45" />
          </>
        ) : (
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_50%_-10%,#22173b,#411d59)]" />
        )}

        <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-16 md:py-20 text-white">
          <div className="flex items-center gap-2 text-white/85 text-[11px] uppercase tracking-[0.25em]">
            <span>{meta.eyebrow}</span>
            <span className="h-3 w-px bg-white/40" />
            <span className="inline-flex items-center gap-1 normal-case tracking-normal text-xs">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {meta.rating} ({meta.reviews})
            </span>
          </div>
          <h1 className="mt-2 text-4xl md:text-6xl font-semibold">
            <span className="bg-gradient-to-r from-white to-white/75 bg-clip-text text-transparent">{meta.title}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/90">{meta.intro}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <BrandBtn href={`/booking?hotel=${slug}`}>Book Now</BrandBtn>
            <BrandBtn
              onClick={(e) => { e.preventDefault(); goto("gallery"); }}
              href="#gallery"
              variant="ghost"
            >
              <ImagesIcon className="h-4 w-4" /> View Gallery
            </BrandBtn>
            <BrandBtn
              onClick={(e) => { e.preventDefault(); navigator?.share?.({ title: meta.title, url: window.location.href }).catch(()=>{}); }}
              href="#share"
              variant="ghost"
            >
              <Share2 className="h-4 w-4" /> Share
            </BrandBtn>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {meta.facts.map((f) => (
              <span
                key={f.k}
                className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-xs ring-1 ring-white/20"
              >
                <span className="opacity-90">{f.k}:</span>&nbsp;
                <span className="font-medium">{f.v}</span>
              </span>
            ))}
          </div>
        </div>

        {/* gradient hairline */}
        <div className="h-px w-full bg-gradient-to-r from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]/90 opacity-60" />
      </section>

      {/* ===== STICKY SUBNAV ===== */}
      <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur ring-1 ring-slate-200">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <nav className="flex gap-1">
            {[
              { id: "rooms", label: "Rooms" },
              { id: "gallery", label: "Gallery" },
              { id: "location", label: "Location" },
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
                <span
                  className={cx(
                    "pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] origin-left bg-gradient-to-r from-[#6A00FF] to-[#FF2EA8] transition-transform",
                    active === t.id ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </button>
            ))}
            <div className="ml-auto py-2">
              <BrandBtn href={`/booking?hotel=${slug}`} className="px-4 py-2 text-xs">
                Book {meta.title}
              </BrandBtn>
            </div>
          </nav>
        </div>
      </div>

      {/* ===== ROOMS ===== */}
      <section id="rooms" className="py-12 md:py-16">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-8 md:mb-12">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">Rooms &amp; Suites</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">Choose your stay</h2>
          </header>

          <div className="grid gap-8 md:gap-10 md:grid-cols-2">
            {cards.map((r, i) => (
              <motion.article
                key={r.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white/95 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                <div className="relative aspect-[16/10] w-full bg-slate-100">
                  {cardImg(r.img, r.name, r.eager)}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                  {r.price && (
                    <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold ring-1 ring-slate-200">
                      {r.price}
                    </span>
                  )}
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="text-xl font-semibold text-slate-900">{r.name}</h3>
                  <p className="mt-2 text-slate-600">{r.copy}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-slate-500">
                    {r.icons}
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <button
                      onClick={(e) =>
                        openAt(Math.min(i, Math.max(0, images.length - 1)), e.currentTarget)
                      }
                      className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100"
                    >
                      View Photos
                    </button>
                    <BrandBtn href={r.href}>View &amp; Book</BrandBtn>
                  </div>
                </div>
              </motion.article>
            ))}

            {/* one wide card */}
            <motion.article
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
              className="md:col-span-2 overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white/95 shadow-sm"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[16/10] md:h-full bg-slate-100">
                  {cardImg(images[3]?.src, "Family / Long Stay")}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
                <div className="p-5 md:p-6 flex flex-col">
                  <h3 className="text-xl font-semibold text-slate-900">Family / Long Stay</h3>
                  <p className="mt-2 text-slate-600">
                    Spacious layouts for families & extended stays with refined amenities.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-slate-500">
                    {icon(Users, "Up to 4")}
                    {icon(Wifi, "Fast Wi‑Fi")}
                    {icon(Coffee, "Coffee/Tea")}
                    {icon(Snowflake, "AC")}
                    {icon(Shield, "Safe")}
                    {icon(Bath, "Ensuite Bath")}
                  </div>
                  <div className="mt-auto pt-4 flex items-center gap-3">
                    <button
                      onClick={(e) => openAt(3, e.currentTarget)}
                      className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100"
                    >
                      View Photos
                    </button>
                    <BrandBtn href={`/booking?hotel=${slug}&room=family`}>View &amp; Book</BrandBtn>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* ===== GALLERY (masonry via CSS columns) ===== */}
      <section id="gallery" className="pb-16 md:pb-24">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-8 md:mb-12">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">Photo Gallery</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">
              A look inside {meta.title}
            </h2>
            {images.length > 0 && (
              <p className="mt-1 text-sm text-slate-500">{images.length} photos</p>
            )}
          </header>

          {images.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              Add JPG/PNG/WEBP to <code>src/assets/TouristInn</code> to see the gallery.
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
              {images.map((img, i) => (
                <button
                  key={img.key}
                  onClick={(e) => { e.currentTarget.blur(); openAt(i, e.currentTarget); }}
                  className="group mb-4 block w-full overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm hover:shadow-md transition will-change-transform break-inside-avoid"
                >
                  <img
                    src={img.src}
                    alt={`${meta.title} photo ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto group-hover:scale-[1.01] transition"
                  />
                  <span className="pointer-events-none absolute m-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white opacity-0 ring-1 ring-white/10 backdrop-blur group-hover:opacity-100">
                    <ImagesIcon className="h-3 w-3" /> View
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== LOCATION ===== */}
      <section id="location" className="pb-16">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-8">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">Find Us</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">
              Location & Contact
            </h2>
          </header>
          <div className="grid gap-6 md:grid-cols-[1.25fr_.75fr]">
            <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white">
              {meta.location?.maps ? (
                <iframe
                  title="Map"
                  src={meta.location.maps}
                  className="w-full h-[360px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <Shimmer className="h-[360px]" />
              )}
            </div>
            <div className="rounded-3xl ring-1 ring-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">{meta.title}</h3>
              <p className="mt-2 text-slate-600 flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                <span>{meta.location.lines.join(", ")}</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <BrandBtn href={`/booking?hotel=${slug}`}>Book Now</BrandBtn>
                <a
                  href={`tel:${meta.location.phone}`}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100"
                >
                  <Phone className="h-4 w-4" /> {formatPhone(meta.location.phone)}
                </a>
                <CopyAddressButton lines={meta.location.lines} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LIGHTBOX ===== */}
      {open && images.length > 0 && (
        <>
          <div className="fixed inset-0 z-[95] bg-black/70 backdrop-blur-[2px]" onClick={close} aria-hidden />
          <div
            ref={dialogRef}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`${meta.title} photo viewer`}
            onTouchStart={(e) => { const t = e.touches[0]; touchRef.current = { x: t.clientX, y: t.clientY, moved: false }; }}
            onTouchMove={(e) => { const t = e.touches[0]; const dx = t.clientX - touchRef.current.x; if (Math.abs(dx) > 24) touchRef.current.moved = true; }}
            onTouchEnd={() => { if (touchRef.current.moved) { const dx = touchRef.current.x; /* not used */ }}}
          >
            <div className="relative max-w-[92vw] max-h-[76vh]">
              <img
                src={images[idx].src}
                alt=""
                className="max-h-[76vh] w-auto rounded-2xl shadow-2xl"
                onTouchStart={(e) => { touchRef.current.x = e.touches[0].clientX; touchRef.current.moved = false; }}
                onTouchEnd={(e) => {
                  const endX = e.changedTouches[0].clientX;
                  const delta = endX - touchRef.current.x;
                  if (Math.abs(delta) > 40) {
                    delta > 0 ? prev() : next();
                  }
                }}
              />
              <button
                onClick={close}
                className="absolute -top-3 -right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow ring-1 ring-slate-200"
                aria-label="Close"
                autoFocus
              >
                <XIcon className="h-5 w-5" />
              </button>
              <button
                onClick={prev}
                className="hidden sm:inline-flex absolute left-0 top-1/2 -translate-x-16 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow ring-1 ring-slate-200"
                aria-label="Previous"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="hidden sm:inline-flex absolute right-0 top-1/2 translate-x-16 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow ring-1 ring-slate-200"
                aria-label="Next"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* thumb strip */}
            <div className="mt-4 max-w-[92vw] overflow-x-auto">
              <div className="flex gap-2">
                {images.map((t, ti) => (
                  <button
                    key={t.key}
                    onClick={() => setIdx(ti)}
                    className={cx(
                      "h-16 w-24 overflow-hidden rounded-lg ring-2 transition",
                      ti === idx ? "ring-white" : "ring-white/30 hover:ring-white/60"
                    )}
                    aria-label={`Go to photo ${ti + 1}`}
                  >
                    <img src={t.src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 text-center text-white/85 text-sm">
              {idx + 1} / {images.length}
            </div>
          </div>
        </>
      )}

      {/* back to home */}
      <div className="h-px w-full bg-gradient-to-r from-[#FF2EA8] via-[#B86DFF] to-[#6A00FF] opacity-40" />
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-10 text-center text-sm text-slate-500">
        <Link to="/" className="rounded-full ring-1 ring-slate-300 px-4 py-2 hover:bg-slate-100">
          ← Back to Home
        </Link>
      </div>

      {/* sticky mobile CTA */}
      <div className={cx(
        "fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[1180px] px-4 md:px-6 pb-4 transition",
        showCta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        <div className="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-slate-200 shadow-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-800">
            <KeyRound className="h-5 w-5" />
            <div className="text-sm leading-tight">
              <div className="font-semibold">Ready to book?</div>
              <div className="text-slate-500">Secure your stay at {meta.title}</div>
            </div>
          </div>
          <BrandBtn href={`/booking?hotel=${slug}`} className="px-4 py-2 text-xs">Book Now</BrandBtn>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Small subcomponents
------------------------------------------------------- */
function CopyAddressButton({ lines }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(lines.join(", "));
          setCopied(true); setTimeout(() => setCopied(false), 1400);
        } catch {}
      }}
      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy Address
    </button>
  );
}

function formatPhone(p) {
  // naive formatter for +960 786 0882 style
  if (!p) return "";
  const digits = p.replace(/[^\d+]/g, "");
  if (digits.startsWith("+960") && digits.length >= 8) {
    const tail = digits.replace("+960", "");
    return "+960 " + tail.slice(0,3) + " " + tail.slice(3);
  }
  return digits;
}

/* -------------------------------------------------------
   Tailwind keyframes (add to your global.css if needed):
   @keyframes shimmer { 100% { transform: translateX(100%); } }
------------------------------------------------------- */
