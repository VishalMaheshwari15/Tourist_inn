// src/pages/TouristInnGallery.jsx — Tourist Inn (with Map + Facts + Policies)
// Gallery reads from src/assets/TouristInn/*

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ------------ tiny utils ------------ */
const safeCtx = (make) => { try { return make(); } catch { return null; } };
const importAll = (ctx) =>
  ctx?.keys?.().map((k) => {
    const mod = ctx(k);
    return { key: k.replace("./", ""), src: typeof mod === "string" ? mod : mod.default };
  }) || [];
const cx = (...xs) => xs.filter(Boolean).join(" ");

/* ------------ explicit Room 3 image ------------ */
import room3Img from "../assets/TouristInn/Room3image.png";

/* ------------ images ------------ */
const GALLERY_CTX = safeCtx(() =>
  require.context("../assets/TouristInn", false, /\.(png|jpe?g|webp)$/i)
);

function useBaseImages() {
  return useMemo(() => {
    const list = importAll(GALLERY_CTX);
    return list.sort((a, b) =>
      a.key.localeCompare(b.key, undefined, { numeric: true, sensitivity: "base" })
    );
  }, []);
}

/* ------------ page ------------ */
export default function TouristInnGallery() {
  useEffect(() => { document.title = "Tourist Inn — Malé"; }, []);

  // Take scanned images, then ensure Room3image.png is present and is the LAST image.
  const baseImages = useBaseImages();
  const images = useMemo(() => {
    let arr = [...baseImages];

    // If the explicit Room3 image isn't in the scanned list, add it
    const hasRoom3 = arr.some((x) => x.src === room3Img || /Room3image\.png$/i.test(x.key));
    if (!hasRoom3) {
      arr.push({ key: "Room3image.png", src: room3Img });
    }

    // Move Room3image.png to the end (ensure it's last)
    arr = [
      ...arr.filter((x) => !(x.src === room3Img || /Room3image\.png$/i.test(x.key))),
      { key: "Room3image.png", src: room3Img },
    ];
    return arr;
  }, [baseImages]);

  const hero = images[0]?.src;

  // lightbox
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const dialogRef = useRef(null);
  const touch = useRef({ x: 0 });
  const openAt = (i) => { setIdx(i); setOpen(true); };
  const close = () => setOpen(false);
  const prev  = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next  = () => setIdx((i) => (i + 1) % images.length);

  // sticky subnav
  const [active, setActive] = useState("rooms");
  const goto = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  useEffect(() => {
    const ids = ["rooms", "gallery", "facts", "location", "policies"];
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
        if (vis?.target?.id) setActive(vis.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.6, 1] }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(252,249,253)] text-slate-800">
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-slate-900" />
        {hero ? (
          <>
            <img src={hero} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_50%_-10%,#1b1133,#3b1752)]" />
        )}

        <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-14 md:py-20 text-white">
          <p className="text-[10px] tracking-[0.24em] uppercase text-white/85">Tourist Inn</p>
          <h1 className="mt-2 text-[28px] leading-[1.15] sm:text-[36px] md:text-6xl font-semibold">
            Your City Address in Malé
          </h1>
          <p className="mt-3 max-w-[44ch] text-white/90 text-sm sm:text-base">
            Quiet, clean & central — explore rooms and the full gallery.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {/* BOOK NOW REMOVED */}
            <button
              onClick={() => goto("gallery")}
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100 bg-white"
            >
              View Gallery
            </button>

            {/* SHARE — added */}
            <button
              onClick={(e) => {
                e.preventDefault();
                const url = window.location.href;
                if (navigator.share) {
                  navigator.share({ title: "Tourist Inn", url }).catch(() => {});
                } else {
                  navigator.clipboard?.writeText(url);
                  alert("Link copied!");
                }
              }}
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold text-slate-900 ring-1 ring-slate-300 bg-white hover:bg-slate-100"
            >
              Share
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]/90 opacity-60" />
      </section>

      {/* STICKY SUBNAV */}
      <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur ring-1 ring-slate-200">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <nav className="flex gap-1 overflow-x-auto no-scrollbar">
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
                  "relative px-4 py-3 text-sm font-semibold rounded-md transition whitespace-nowrap",
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
      <section id="rooms" className="py-12 md:py-16">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-8 md:mb-12">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">Rooms &amp; Suites</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">Choose your stay</h2>
          </header>

          <div className="grid gap-8 md:gap-10 md:grid-cols-2">
            {[0,1,2].map((i) => {
              // Force Room 3 image
              const forcedRoom3 = i === 2 ? room3Img : null;
              const displaySrc = forcedRoom3 || images[i]?.src || null;

              return (
                <article key={i} className="overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm">
                  <div className="relative aspect-[16/10] w-full bg-slate-100">
                    {displaySrc ? (
                      <img
                        src={displaySrc}
                        alt={`Room ${i+1}`}
                        className="h-full w-full object-cover"
                        loading={i<2?"eager":"lazy"}
                        decoding="async"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />
                    )}
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="text-xl font-semibold text-slate-900">Room {i+1}</h3>
                    <p className="mt-2 text-slate-600">Comfortable room with modern amenities.</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() =>
                          openAt(
                            // open the forced Room3 slide if i===2, which is the LAST image (we ensured)
                            i === 2 ? images.length - 1 : Math.min(i, Math.max(0, images.length - 1))
                          )
                        }
                        className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100"
                      >
                        View Photos
                      </button>
                      {/* info-only wording */}
                      <a
                        href={`/booking?hotel=tourist-inn&room=${i+1}`}
                        className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="pb-14 sm:pb-16 md:pb-24">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-7 sm:mb-10 md:mb-12">
            <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500">Photo Gallery</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">A look inside Tourist Inn</h2>
            {images.length > 0 && <p className="mt-1 text-sm text-slate-500">{images.length} photos</p>}
          </header>

          {images.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              Add JPG/PNG/WEBP to <code>src>assets>TouristInn</code> to see the gallery.
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
              {images.map((img, i) => (
                <button
                  key={`${img.key}-${i}`}
                  onClick={() => openAt(i)}
                  className="group mb-4 block w-full overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm hover:shadow-md transition break-inside-avoid"
                >
                  <img
                    src={img.src}
                    alt={`Tourist Inn photo ${i + 1}`}
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
      <section id="facts" className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-7 sm:mb-8">
            <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-slate-500">At a glance</p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">Quick Facts</h2>
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
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-7 sm:mb-8">
            <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-slate-500">Find Us</p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">Location & Contact</h2>
          </header>
          <div className="grid gap-5 sm:gap-6 md:grid-cols-[1.25fr_.75fr]">
            <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white">
              <iframe
                title="Map"
                src="https://www.google.com/maps?q=Ma.+Leaves,+Maaveyo+Goalhi,+Malé,+Maldives&output=embed"
                className="w-full h-[260px] sm:h-[320px] md:h-[360px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="rounded-3xl ring-1 ring-slate-200 bg-white p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">Tourist Inn</h3>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                Ma. Leaves, Maaveyo Goalhi, Malé, Maldives
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {/* BOOK NOW REMOVED */}
                <a
                  href="tel:+9607860882"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100"
                >
                  +960 786 0882
                </a>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText("Ma. Leaves, Maaveyo Goalhi, Malé, Maldives");
                      alert("Address copied");
                    } catch {}
                  }}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100"
                >
                  Copy Address
                </button>
                {/* Explore Properties REMOVED */}
                {/* Share button here too (optional) */}
                <button
                  onClick={() => {
                    const url = window.location.href + "#location";
                    if (navigator.share) {
                      navigator.share({ title: "Tourist Inn — Location", url }).catch(() => {});
                    } else {
                      navigator.clipboard?.writeText(url);
                      alert("Link copied!");
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POLICIES / FAQ */}
      <section id="policies" className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6">
          <header className="text-center mb-7 sm:mb-8">
            <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-slate-500">Good to know</p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">Policies & FAQ</h2>
          </header>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {[
              ["Check-in / Check-out", "Check-in 2:00 PM • Check-out 12:00 PM. Early/Late on availability."],
              ["Airport Transfers", "We can arrange airport pickup. Share flight details after booking."],
              ["House Rules", "No smoking inside rooms. Quiet hours 10 PM – 7 AM. Visitors must register."],
              ["Payments", "Major cards accepted. Best rates on direct bookings."],
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

      {/* LIGHTBOX */}
      {open && images.length > 0 && (
        <>
          <div className="fixed inset-0 z-[95] bg-black/70 backdrop-blur-[2px]" onClick={close} aria-hidden />
          <div
            ref={dialogRef}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-3"
            role="dialog" aria-modal="true" aria-label="Tourist Inn photo viewer"
          >
            <div className="relative max-w-[96vw] sm:max-w-[92vw] max-h-[86vh]">
              <img
                src={images[idx].src}
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
            <div className="mt-2 text-center text-white/85 text-xs sm:text-sm">
              {idx + 1} / {images.length}
            </div>
          </div>
        </>
      )}

      {/* back to home */}
      <div className="h-px w-full bg-gradient-to-r from-[#FF2EA8] via-[#B86DFF] to-[#6A00FF] opacity-40" />
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-8 sm:py-10 text-center text-xs sm:text-sm text-slate-500">
        <Link to="/" className="rounded-full ring-1 ring-slate-300 px-3.5 sm:px-4 py-2 hover:bg-slate-100">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
