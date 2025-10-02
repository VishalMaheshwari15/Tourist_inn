// src/components/About.jsx — Inclusive copy, no highlighted pill, broader audience
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../seo/SEO";

/* tiny inline icons */
const I = {
  star: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path fill="currentColor" d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9 6.8 19l1-5.8-4.2-4.1 5.8-.8L12 3z" />
    </svg>
  ),
  map: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path fill="currentColor" d="m9 4 6 2 6-2v14l-6 2-6-2-6 2V6l6-2Zm0 2.2-4 .9v10.7l4-.9V6.2Zm2 .2v10.7l4 1.3V7.7l-4-1.3Zm10-.9-4 1.3v10.7l4-1.3V5.5Z" />
    </svg>
  ),
  shield: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path fill="currentColor" d="M12 2 5 5v6c0 4.8 3.4 9.2 7 11 3.6-1.8 7-6.2 7-11V5l-7-3Z" />
    </svg>
  ),
  clock: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path fill="currentColor" d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2Zm1 5h-2v6l5 3 1-1.7-4-2.3V7Z" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path fill="currentColor" d="M9.2 16.2 4.8 11.8l1.9-1.9 2.5 2.5L17.3 4.3l1.9 1.9-10 10Z" />
    </svg>
  ),
};

const BRAND = "from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]";
const WA_NUMBER = "9607860882";
const wa = (t) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t)}`;

/* SmartLink: internal -> <Link>, external -> <a> */
function SmartLink({ href, className = "", children, ...rest }) {
  if (typeof href === "string" && href.startsWith("/")) {
    return (
      <Link to={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}

export default function About() {
  useEffect(() => {
    SEO({
      title: "About — Tourist Inn Group, Malé",
      description:
        "Quiet, modern guesthouses in central Malé for everyone — families, couples, solo travellers and business teams. Privacy-first service, reliable Wi-Fi and a responsive WhatsApp concierge.",
      canonical: typeof window !== "undefined" ? window.location.href : undefined,
    });
  }, []);

  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-16 md:py-24">
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="text-center">
          {/* removed: highlighted context pill */}

          {/* BIGGEST: About Us */}
          <h1 className="mt-1 text-[56px] md:text-[72px] lg:text-[86px] leading-[1.04] font-extrabold tracking-tight text-slate-900 font-serif">
            About Us
          </h1>

          {/* SMALLER: inclusive tagline (no gradient highlight) */}
          <h2 className="mt-2 text-[20px] md:text-[26px] lg:text-[30px] font-semibold text-slate-800">
            Thoughtful stays in Malé — comfort, convenience and warm island hospitality.
          </h2>

          {/* Justified intro paragraph */}
          <p
            className="mt-4 mx-auto max-w-3xl text-[16px] md:text-[18px] text-slate-600"
            style={{ textAlign: "justify", textJustify: "inter-word" }}
          >
            We’re a Malé-based hospitality group offering quiet, well-kept guesthouses close to the city’s
            essentials. Whether you’re here for a family visit, medical appointment, short transit, a couples’
            getaway or business, our spaces are designed for good rest and easy daily routines — secure entry,
            dependable Wi-Fi, helpful staff and a WhatsApp concierge that actually solves things.
          </p>

          {/* trust chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-700">
              <I.map className="h-4 w-4 text-slate-900" /> City-centre access
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-700">
              <I.shield className="h-4 w-4 text-slate-900" /> Privacy-first policies
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-700">
              <I.star className="h-4 w-4 text-amber-500" /> Consistently rated 4.7+
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
                <I.clock className="h-5 w-5" />
                <span className="text-lg font-semibold">24×7</span>
              </div>
              <p className="text-[11px] text-slate-600">Concierge</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 text-slate-900">
                <I.shield className="h-5 w-5" />
                <span className="text-lg font-semibold">Secure</span>
              </div>
              <p className="text-[11px] text-slate-600">Entry & floors</p>
            </div>
          </div>
        </div>

        {/* ── RICH ABOUT CONTENT (cards removed) ───────────────── */}
        <div className="mt-14 grid gap-10 md:grid-cols-12">
          {/* Left column: narrative */}
          <div className="md:col-span-7 space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Who we host</h2>
            <p
              className="text-slate-700"
              style={{ textAlign: "justify", textJustify: "inter-word" }}
            >
              Our guesthouses are intentionally small, quiet and central — a good fit for families and friends
              visiting Malé, solo travellers, couples on short breaks, medical visitors who need calm, and business
              teams who prefer predictable quality without the noise of large hotels. We help with airport transfers,
              late-night arrivals and last-minute plan changes.
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Why guests choose us</h2>
            <ul
              className="space-y-3 text-slate-700"
              style={{ textAlign: "justify", textJustify: "inter-word" }}
            >
              {[
                "Privacy-first operations with quiet floors and limited footfall.",
                "Responsive housekeeping and reliable, fast Wi-Fi for calls, work and streaming.",
                "Flexible billing — invoice to individual or company with GST-compliant receipts.",
                "WhatsApp concierge for pickups, preferences and on-ground help.",
                "Simple, modern rooms with proper desks, good lighting and comfortable bedding.",
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

          {/* Right column: operations / policy */}
          <div className="md:col-span-5 space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Operations & Assurance</h2>
            <p
              className="text-slate-700"
              style={{ textAlign: "justify", textJustify: "inter-word" }}
            >
              We keep consistent standards across all addresses: verified staff, CCTV in common areas, secure entry and
              fire-safety compliance. Housekeeping is scheduled and discreet; linen is professionally laundered; and
              maintenance requests are tracked until closed.
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Location & Access</h2>
            <p
              className="text-slate-700"
              style={{ textAlign: "justify", textJustify: "inter-word" }}
            >
              All properties are within city limits for easy access to ministries, business districts, ferries and
              hospitals. Airport transfers are available on request; our team shares live driver/boat details and
              coordinates directly over WhatsApp for smooth hand-offs.
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Billing & Documentation</h2>
            <p
              className="text-slate-700"
              style={{ textAlign: "justify", textJustify: "inter-word" }}
            >
              We provide stamped invoices and can arrange consolidated receipts for multi-room bookings. Payment options
              include Visa, MasterCard, AmEx and UPI.
            </p>
          </div>
        </div>

        {/* ── CTA panel ───────────────────────────────────────── */}
        <div className="mt-12 grid gap-8 md:grid-cols-12 items-start">
          <div className="md:col-span-7">
            <p
              className="text-slate-700"
              style={{ textAlign: "justify", textJustify: "inter-word" }}
            >
              Whether you’re planning a single-night transit or a multi-week stay, our team can block rooms, arrange
              early check-ins/late check-outs when possible, and help with local logistics so your schedule stays on track.
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">Need help right now?</h3>
              <p
                className="mt-1 text-sm text-slate-600"
                style={{ textAlign: "justify", textJustify: "inter-word" }}
              >
                Our concierge replies on WhatsApp within minutes for dates, rates and logistics.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={wa("Hello! I’d like to check dates and rates for a stay in Malé.")}
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
