// src/components/About.jsx — Diplomatic Edition (big badge, premium layout, WA CTAs)
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../seo/SEO";

// images (replace if you have better hero thumbs)
import touristInn from "../assets/TouristInn.jpg";
import tourInn from "../assets/TourInn.png";
import grand from "../assets/TouristInnGrand.png";

/* tiny inline icons */
const I = {
  star: (p) => (
    <svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9 6.8 19l1-5.8-4.2-4.1 5.8-.8L12 3z"/></svg>
  ),
  map: (p) => (
    <svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="m9 4 6 2 6-2v14l-6 2-6-2-6 2V6l6-2Zm0 2.2-4 .9v10.7l4-.9V6.2Zm2 .2v10.7l4 1.3V7.7l-4-1.3Zm10-.9-4 1.3v10.7l4-1.3V5.5Z"/></svg>
  ),
  shield: (p) => (
    <svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M12 2 5 5v6c0 4.8 3.4 9.2 7 11 3.6-1.8 7-6.2 7-11V5l-7-3Z"/></svg>
  ),
  clock: (p) => (
    <svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2Zm1 5h-2v6l5 3 1-1.7-4-2.3V7Z"/></svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M9.2 16.2 4.8 11.8l1.9-1.9 2.5 2.5L17.3 4.3l1.9 1.9-10 10Z"/></svg>
  ),
};

const BRAND = "from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]";
const WA_NUMBER = "9607860882";
const wa = (t) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t)}`;

/* SmartLink: internal paths => <Link>, otherwise <a> */
function SmartLink({ href, className = "", children, ...rest }) {
  if (typeof href === "string" && href.startsWith("/")) {
    return <Link to={href} className={className} {...rest}>{children}</Link>;
  }
  return <a href={href} className={className} {...rest}>{children}</a>;
}

export default function About() {
  useEffect(() => {
    SEO({
      title: "About — Tourist Inn Group, Malé",
      description:
        "Diplomatic & business-friendly guesthouses in central Malé: Tour Inn, Tourist Inn, and Tourist Inn Grand. Clean rooms, privacy-first service, and WhatsApp concierge.",
      canonical: typeof window !== "undefined" ? window.location.href : undefined,
    });
  }, []);

  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-16 md:py-24">
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="text-center">
          {/* BIG “ABOUT US” badge */}
          <div className="inline-flex items-center gap-3 rounded-full px-4 py-1.5 text-[13px] md:text-[14px] font-bold tracking-[0.16em] uppercase ring-2 ring-slate-200 bg-white shadow-sm">
            <span className={`inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-r ${BRAND}`} />
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[12px] md:text-[13px]">
              About Us
            </span>
            <span className="text-slate-700 tracking-normal font-semibold">
              Diplomatic & Business Stays
            </span>
          </div>

          <h2 className="mt-4 text-[42px] md:text-[56px] lg:text-[64px] leading-[1.08] font-extrabold text-slate-900">
            Professional hospitality. Urban convenience.{" "}
            <span className="whitespace-nowrap">Maldivian warmth.</span>
          </h2>

          <p className="mt-4 mx-auto max-w-3xl text-[17px] md:text-[19px] text-slate-600">
            Three city-centre guesthouses designed for government, embassy and corporate travellers:
            quiet floors, privacy-first service, flexible billing and{" "}
            <span className="font-semibold">WhatsApp concierge</span> for instant help.
          </p>

          {/* trust chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-700">
              <I.map className="h-4 w-4 text-slate-900" /> City-centre access
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-700">
              <I.shield className="h-4 w-4 text-slate-900" /> Secure entry
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-700">
              <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M13 2 3 14h7l-1 8 11-14h-7Z"/></svg>
              Fast Wi-Fi
            </span>
          </div>

          {/* stats row */}
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
              <div className={`bg-clip-text text-transparent bg-gradient-to-r ${BRAND} text-2xl font-semibold`}>3</div>
              <p className="text-[11px] text-slate-600">Properties</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 text-slate-900">
                <I.star className="h-5 w-5 text-amber-500" />
                <span className="text-lg font-semibold">4.7+</span>
              </div>
              <p className="text-[11px] text-slate-600">Avg. Guest Rating</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 text-slate-900">
                <I.clock className="h-5 w-5" />
                <span className="text-lg font-semibold">24×7</span>
              </div>
              <p className="text-[11px] text-slate-600">Support</p>
            </div>
          </div>
        </div>

        {/* ── Cards: equal priority for all three hotels ───────── */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Tourist Inn",
              href: "/tourist-inn",
              img: touristInn,
              sub: "Modern guesthouse • central Malé",
              wa: wa("Booking inquiry — Tourist Inn (Malé)")
            },
            {
              name: "Tour Inn",
              href: "/tour-inn",
              img: tourInn,
              sub: "Quiet rooms • urban convenience",
              wa: wa("Booking inquiry — Tour Inn (Malé)")
            },
            {
              name: "Tourist Inn Grand",
              href: "/tourist-inn-grand",
              img: grand,
              sub: "Business-friendly • premium finish",
              wa: wa("Booking inquiry — Tourist Inn Grand (Malé)")
            },
          ].map((p) => (
            <div
              key={p.name}
              className="group overflow-hidden rounded-[24px] bg-white ring-1 ring-slate-200 shadow-[0_20px_60px_rgba(15,23,42,.08)] hover:shadow-[0_24px_80px_rgba(15,23,42,.14)] transition"
            >
              <SmartLink to={p.href} href={p.href} className="block">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={p.img}
                    alt={`${p.name} — Malé`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
                  <div className="absolute left-5 bottom-5 right-5 text-white drop-shadow">
                    <div className="text-2xl font-semibold">{p.name}</div>
                    <div className="text-sm text-white/90">{p.sub}</div>
                  </div>
                </div>
              </SmartLink>

              <div className="p-4 flex items-center gap-3">
                <SmartLink
                  href={p.href}
                  className="flex-1 inline-flex items-center justify-center rounded-full px-4 py-2 font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50 transition"
                >
                  View Details
                </SmartLink>
                <a
                  href={p.wa}
                  target="_blank"
                  rel="noreferrer"
                  className="relative inline-flex items-center justify-center rounded-full px-4 py-2 font-semibold text-white overflow-hidden ring-1 ring-black/5"
                >
                  <span className={`absolute inset-0 bg-gradient-to-r ${BRAND}`} />
                  <span className="relative">WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ── Diplomat-oriented bullets + WA CTA ──────────────── */}
        <div className="mt-12 grid gap-8 md:grid-cols-12 items-start">
          <div className="md:col-span-7">
            <ul className="space-y-3 text-slate-700">
              {[
                "Dedicated support for official delegations & corporate travellers",
                "Quiet floors and privacy-first service policies",
                "Flexible billing (company / mission) & receipts on request",
                "Airport transfers on request • early/late check options (subject to availability)",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-[3px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900">
                    <I.check className="h-3.5 w-3.5 text-white" />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Need help right now?</div>
              <p className="mt-1 text-sm text-slate-600">
                Our concierge replies on WhatsApp within minutes for dates, rates and logistics.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={wa("Hello, I have a diplomatic/corporate booking request.")}
                  target="_blank"
                  rel="noreferrer"
                  className="relative inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold text-white overflow-hidden ring-1 ring-black/5"
                >
                  <span className={`absolute inset-0 bg-gradient-to-r ${BRAND}`} />
                  <span className="relative">WhatsApp Concierge</span>
                </a>
                <SmartLink
                  href="/#properties"
                  className="inline-flex items-center rounded-full px-5 py-2.5 ring-1 ring-slate-300 text-slate-800 hover:bg-slate-50"
                >
                  Explore Properties
                </SmartLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
