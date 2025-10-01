// src/components/SignatureShowcase.jsx
import React from "react";

// use your real photos here
import roomImg from "../assets/TouristInn.jpg";
import diningImg from "../assets/TourInn.png";

// brand gradient based on your logo
const BRAND_GRAD = "from-[#6A00FF] via-[#8a2bff] to-[#FF2EA8]";

function StarRow({ reviews = "3,674 reviews" }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 text-amber-400" fill="currentColor">
            <path d="m12 17.3-6 3.3 1.2-6.8L2 8.9l6.9-1L12 1.7l3.1 6.2 6.9 1-5 4.9 1.2 6.8-6.2-3.3Z" />
          </svg>
        ))}
      </div>
      <span className="text-slate-500">{reviews}</span>
    </div>
  );
}

export default function SignatureShowcase() {
  return (
    <section className="relative">
      {/* subtle brand tint behind */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] bg-gradient-to-b from-fuchsia-200 to-indigo-200" />

      {/* ====== Featured Room (Beehive-like) ====== */}
      <div className="mx-auto w-full max-w-[1180px] px-4 md:px-6 py-14 md:py-20">
        <div className="grid md:grid-cols-12 items-start gap-8">
          {/* image left */}
          <div className="md:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(15,23,42,0.18)] ring-1 ring-black/5">
              <img
                src={roomImg}
                alt="Featured Room"
                className="w-full h-[280px] md:h-[420px] object-cover"
                loading="lazy"
                decoding="async"
              />
              {/* top hairline */}
              <span className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${BRAND_GRAD}`} />
            </div>
          </div>

          {/* text card right */}
          <div className="md:col-span-6">
            <article className="relative rounded-3xl bg-white/90 backdrop-blur border border-slate-200 shadow-sm p-6 md:p-8">
              <StarRow />
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                Business Deluxe
              </h3>
              <p className="mt-1 text-sm text-slate-500">by Tourist Inn, Malé</p>

              <p className="mt-4 text-slate-700 leading-relaxed">
                Our Business Deluxe represents the ultimate in city accommodation for travelers — king bed,
                separate seating, modern styling & luxury amenities. Ideal for business, locals and expats
                seeking a calm, central address in Malé.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="/booking?room=business-deluxe"
                  className={`relative inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white overflow-hidden ring-1 ring-white/20`}
                >
                  <span className={`absolute inset-0 bg-gradient-to-r ${BRAND_GRAD}`} />
                  <span className="relative">View & Book</span>
                </a>
                <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Instant Availability
                </span>
              </div>

              <div className="mt-4">
                <a href="/rooms" className="text-sm font-medium text-violet-700 hover:text-violet-900">
                  » See more rooms
                </a>
              </div>

              {/* bottom accent */}
              <span className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r ${BRAND_GRAD} opacity-60`} />
            </article>
          </div>
        </div>
      </div>

      {/* ====== Food & Beverage (dark premium panel + overlapping photo) ====== */}
      <div className="relative">
        {/* dark panel */}
        <div className="bg-[linear-gradient(180deg,#110927, #0b051a)] text-[#EDEAFF]">
          <div className="mx-auto w-full max-w-[1180px] px-4 md:px-6">
            <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-center">
              {/* text block */}
              <div className="md:col-span-6 py-12 md:py-20">
                <p className="text-[11px] tracking-[0.25em] uppercase text-violet-200">Food & Beverage</p>
                <h3 className="mt-2 text-3xl md:text-4xl font-semibold leading-tight">
                  Why wouldn’t you <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 to-indigo-300">dine in?</span>
                </h3>
                <p className="mt-4 text-violet-100/90 leading-relaxed">
                  In-house café serves international & local favourites. Contemporary setting, relaxed vibe,
                  and barista coffee — ideal for casual or business dining.
                </p>

                <a
                  href="/dining"
                  className="mt-6 inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/5"
                >
                  See Restaurants & Bars
                </a>
              </div>

              {/* photo (overlapping) */}
              <div className="md:col-span-6 relative">
                {/* make the image bleed outside for overlap feel */}
                <div className="md:translate-x-8 md:-translate-y-10">
                  <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
                    <img
                      src={diningImg}
                      alt="Dining at Tourist Inn"
                      className="w-full h-[260px] md:h-[420px] object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${BRAND_GRAD}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* bottom divider to mimic reference */}
          <div className="mt-10 h-px w-full bg-white/10" />
        </div>
      </div>
    </section>
  );
}
