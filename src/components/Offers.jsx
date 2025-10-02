// src/components/Offers.jsx
import SectionHeading from "./SectionHeading";

const brandHair = "from-[#6A00FF] via-[#9B52FF] to-[#FF2EA8]";
const WA = (t = "Hello! I'd like to know about current offers and availability.") =>
  `https://wa.me/9607860882?text=${encodeURIComponent(t)}`;

// You gave this Booking.com link for Tour Inn:
const BOOKING_TOUR_INN =
  "https://www.booking.com/hotel/mv/tour-inn.html?aid=304142&label=gen173nr-10CAEoggI46AdIM1gEaJ4BiAEBmAEzuAEXyAEM2AED6AEB-AEBiAIBqAIBuAKl2eXFBsACAdICJDlhNDQzNDJlLTAwZTctNGFhOS05MGUzLWNlNGM0YTY1MWE3ZNgCAeACAQ&sid=c0b4300d46a5c3a9ac85d3fb622ae994";

const OFFERS = [
  {
    tag: "Limited",
    title: "Direct Booking Perk",
    copy: "Book direct and enjoy early check-in (subject to availability).",
    href: "/offers#direct",
  },
  {
    tag: "Saver",
    title: "Long-Stay",
    copy: "7+ nights? Ask us for a weekly rate that fits your plan.",
    href: "/offers#longstay",
  },
  {
    tag: "Early",
    title: "Advance Purchase",
    copy: "Reserve 14+ days earlier and save on your city stay.",
    href: "/offers#advance",
  },
];

function OfferCard({ o }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm hover:shadow-md transition">
      <span className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${brandHair}`} />
      <div className="p-5 md:p-6">
        <div className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white">
          {o.tag}
        </div>
        <h3 className="mt-3 text-xl font-semibold text-slate-900">{o.title}</h3>
        <p className="mt-1 text-slate-600">{o.copy}</p>
        <div className="mt-4">
          <a href={o.href} className="text-sm font-semibold text-violet-700 hover:text-violet-900">
            View details →
          </a>
        </div>
      </div>
    </article>
  );
}

function HotelStrip() {
  const hotels = [
    {
      id: "tour-inn",
      name: "Tour Inn",
      sub: "Business-friendly, central Malé",
      whatsapp: WA("Tour Inn — offer + availability for my dates"),
      booking: BOOKING_TOUR_INN, // given URL
    },
    {
      id: "tourist-inn",
      name: "Tourist Inn",
      sub: "Clean, quiet city address",
      whatsapp: WA("Tourist Inn — offer + availability for my dates"),
      booking: null, // use WA as primary; add link later if you have it
    },
    {
      id: "tourist-inn-grand",
      name: "Tourist Inn Grand",
      sub: "Spacious layouts • long stays",
      whatsapp: WA("Tourist Inn Grand — offer + availability for my dates"),
      booking: null,
    },
  ];

  return (
    <div className="mt-10 grid gap-4 md:grid-cols-3">
      {hotels.map((h) => (
        <div
          key={h.id}
          className="rounded-2xl ring-1 ring-slate-200 bg-white p-5 md:p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="text-[12px] tracking-[0.18em] uppercase text-slate-500">Book Direct</div>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{h.name}</h3>
          <p className="text-slate-600 text-sm">{h.sub}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a
              href={h.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="relative inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white overflow-hidden ring-1 ring-black/5"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#6A00FF] to-[#FF2EA8]" />
              <span className="relative">WhatsApp to Book</span>
            </a>

            {h.booking && (
              <a
                href={h.booking}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-slate-300 text-slate-800 hover:bg-slate-100"
              >
                View on Booking.com
              </a>
            )}

            {!h.booking && (
              <a
                href="/#properties"
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-slate-300 text-slate-800 hover:bg-slate-100"
              >
                See Property →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Offers() {
  return (
    <section id="offers" className="relative bg-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_100%_at_50%_-10%,rgba(106,0,255,.06),rgba(255,46,168,.04),transparent)]" />
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-14 md:py-20">
        <SectionHeading
          eyebrow="Special Offers"
          title="Business-friendly rates. Diplomat-ready service."
          sub="Simple, transparent deals when you book direct with Tourist Inn Group."
        />

        {/* Offer tiles */}
        <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {OFFERS.map((o) => (
            <OfferCard key={o.title} o={o} />
          ))}
        </div>

        {/* Hotel-specific direct booking strip */}
        <HotelStrip />
      </div>
    </section>
  );
}
