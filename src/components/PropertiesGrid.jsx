// src/components/PropertiesGrid.jsx — Inclusive Grid, no WhatsApp CTA (ORDER ENFORCED)
import { Link } from "react-router-dom";
import imgTourInn from "../assets/TourInn.png";
import imgTouristInn from "../assets/TouristInn.jpg";
import imgGrand from "../assets/TouristInnGrand.png";

const BRAND = "from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]";

/* ORDER: Tourist Inn → Tour Inn → Tourist Inn Grand */
const cards = [
  {
    name: "Tourist Inn",
    desc: "Calm, tidy spaces with easy access to ferries, markets and offices — great for short stays.",
    href: "/tourist-inn",
    img: imgTouristInn,
    chips: ["Secure entry", "Daily housekeeping", "Smart TV"],
  },
  {
    name: "Tour Inn",
    desc: "Quiet, efficient rooms in central Malé — clean, comfortable and well-connected.",
    href: "/tour-inn",
    img: imgTourInn,
    chips: ["City-centre", "Flexible billing", "Fast Wi-Fi"],
  },
  {
    name: "Tourist Inn Grand",
    desc: "More space and work desks — ideal for longer stays, families and teams.",
    href: "/tourist-inn-grand",
    img: imgGrand,
    chips: ["Work desk", "Concierge on WA", "Airport transfer"],
  },
];

export default function PropertiesGrid() {
  return (
    <section className="relative py-16 md:py-24">
      {/* faint brand glow */}
      <span className="pointer-events-none absolute -z-10 inset-x-0 top-0 h-40 bg-gradient-to-b from-[#6A00FF]/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-[1180px] px-4 md:px-6">
        {/* header */}
        <header className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] uppercase tracking-[0.18em] text-slate-700">
            <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${BRAND}`} />
            City Portfolio — Stays in Central Malé
          </div>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-slate-900">
            Three comfortable guesthouses in Malé
          </h2>
          <p className="mt-2 text-slate-600">
            Central addresses with reliable service, secure entry and 24×7 WhatsApp concierge.
          </p>
        </header>

        {/* responsive advanced layout: 12-col grid; equal priority */}
        <div className="grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-5 md:gap-6">
          {cards.map((c) => (
            <article
              key={c.name}
              className={[
                "relative group overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white shadow-[0_10px_36px_rgba(15,23,42,.08)] hover:shadow-[0_16px_60px_rgba(15,23,42,.14)] transition",
                "sm:col-span-6",
                "lg:col-span-4",
              ].join(" ")}
            >
              {/* image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={c.img}
                  alt={`${c.name} — Malé`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />
                <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/10" />
                <span className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-[#6A00FF]/20 to-[#FF2EA8]/20 blur-2xl" />
              </div>

              {/* body */}
              <div className="p-5 md:p-6">
                <h3 className="text-xl font-semibold text-slate-900">{c.name}</h3>
                <p className="mt-2 text-slate-600">{c.desc}</p>

                {/* chips */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.chips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center rounded-full px-3 py-1 text-[12px] ring-1 ring-slate-300 text-slate-700"
                    >
                      ✓ {chip}
                    </span>
                  ))}
                </div>

                {/* CTAs (WhatsApp removed) */}
                <div className="mt-5">
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

        {/* KPI strip */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
            <div className={`bg-clip-text text-transparent bg-gradient-to-r ${BRAND} text-2xl font-semibold`}>3</div>
            <p className="text-[11px] text-slate-600">Properties</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
            <div className="text-slate-900 text-lg font-semibold">4.7+</div>
            <p className="text-[11px] text-slate-600">Avg. Guest Rating</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
            <div className="text-slate-900 text-lg font-semibold">24×7</div>
            <p className="text-[11px] text-slate-600">WhatsApp Concierge</p>
          </div>
        </div>
      </div>
    </section>
  );
}
