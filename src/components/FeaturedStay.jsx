// src/components/FeaturedStay.jsx — Diplomatic/Business Trio + WhatsApp CTAs
import { Link } from "react-router-dom";
import touristInn from "../assets/TouristInn.jpg";
import tourInn from "../assets/TourInn.png";
import grand from "../assets/TouristInnGrand.png";

const BRAND = "from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]";
const WA_NUMBER = "9607860882";
const wa = (t) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t)}`;

export default function FeaturedStay() {
  const cards = [
    {
      name: "Tourist Inn",
      img: touristInn,
      href: "/tourist-inn",
      copy:
        "Reliable, central and quiet—perfect for official missions and short corporate trips.",
      bullets: ["City-centre", "Secure entry", "Fast Wi-Fi"],
      waText: "Booking inquiry — Tourist Inn (dates/guests):",
    },
    {
      name: "Tour Inn",
      img: tourInn,
      href: "/tour-inn",
      copy:
        "Clean, modern rooms with efficient service and flexible billing for companies.",
      bullets: ["Quiet floors", "Smart TV", "Daily housekeeping"],
      waText: "Booking inquiry — Tour Inn (dates/guests):",
    },
    {
      name: "Tourist Inn Grand",
      img: grand,
      href: "/tourist-inn-grand",
      copy:
        "Premium finish and business-friendly layout. Ideal for VIP & diplomatic stays.",
      bullets: ["Work desk", "High-speed Wi-Fi", "Concierge on WA"],
      waText: "Booking inquiry — Tourist Inn Grand (dates/guests):",
    },
  ];

  return (
    <section className="relative py-14 md:py-20">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] uppercase tracking-[0.18em] text-slate-700">
            <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${BRAND}`} />
            Featured for Diplomatic & Business Travel
          </div>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-slate-900">
            Three city-centre stays, one WhatsApp concierge
          </h2>
          <p className="mt-2 text-slate-600">
            Pick the address that fits your itinerary. Message us on WhatsApp for
            instant availability, rates, airport pickup and billing.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <article
              key={c.name}
              className="relative overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,.08)] hover:shadow-[0_16px_60px_rgba(15,23,42,.14)] transition"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={c.img}
                  alt={`${c.name} — Malé`}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <span className="pointer-events-none absolute -z-10 -top-6 -left-6 h-40 w-40 rounded-full bg-gradient-to-br from-[#6A00FF]/20 to-[#FF2EA8]/20 blur-2xl" />
              </div>

              <div className="p-5 md:p-6">
                <h3 className="text-xl font-semibold text-slate-900">{c.name}</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">{c.copy}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {c.bullets.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center rounded-full px-3 py-1 text-[12px] ring-1 ring-slate-300 text-slate-700"
                    >
                      ✓ {b}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3">
                  {/* WhatsApp primary */}
                  <a
                    href={wa(c.waText)}
                    target="_blank"
                    rel="noreferrer"
                    className="relative inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold text-white overflow-hidden ring-1 ring-black/5"
                  >
                    <span className={`absolute inset-0 bg-gradient-to-r ${BRAND}`} />
                    <span className="relative">WhatsApp to Book</span>
                  </a>

                  {/* View details (SPA) */}
                  <Link
                    to={c.href}
                    className="inline-flex items-center rounded-full px-5 py-2.5 ring-1 ring-slate-300 text-slate-800 hover:bg-slate-50"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Foot note bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
          <a
            href={wa("Hello, please assist with dates, rates and airport pickup.")}
            target="_blank"
            rel="noreferrer"
            className="relative inline-flex items-center justify-center rounded-full px-4 py-2 font-semibold text-white overflow-hidden ring-1 ring-black/5"
          >
            <span className={`absolute inset-0 bg-gradient-to-r ${BRAND}`} />
            <span className="relative">WhatsApp Concierge (24×7)</span>
          </a>
          <span className="text-slate-500">•</span>
          <Link
            to="/#properties"
            className="rounded-full px-4 py-2 ring-1 ring-slate-300 text-slate-800 hover:bg-slate-50"
          >
            Explore all properties
          </Link>
        </div>
      </div>
    </section>
  );
}
