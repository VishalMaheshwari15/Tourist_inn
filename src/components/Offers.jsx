import SectionHeading from "./SectionHeading";
const brandHair = "from-[#6A00FF] via-[#9B52FF] to-[#FF2EA8]";

const OFFERS = [
  { tag: "Limited", title: "Direct Booking Perk", copy: "Book direct and enjoy early check-in (subject to availability).", href: "/offers#direct" },
  { tag: "Saver", title: "Long-Stay", copy: "7+ nights? Ask us for a weekly rate that fits your plan.", href: "/offers#longstay" },
  { tag: "Early", title: "Advance Purchase", copy: "Reserve 14+ days earlier and save on your city stay.", href: "/offers#advance" },
];

function OfferCard({ o }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      <span className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${brandHair}`} />
      <div className="p-5 md:p-6">
        <div className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white">{o.tag}</div>
        <h3 className="mt-3 text-xl font-semibold text-slate-900">{o.title}</h3>
        <p className="mt-1 text-slate-600">{o.copy}</p>
        <div className="mt-4">
          <a href={o.href} className="text-sm font-semibold text-violet-700 hover:text-violet-900">View details →</a>
        </div>
      </div>
    </article>
  );
}

export default function Offers() {
  return (
    <section id="offers" className="relative bg-white">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-14 md:py-20">
        <SectionHeading eyebrow="Special Offers" title="Don’t miss out on great savings" sub="Simple, transparent deals when you book direct with Tourist Inn Group." />
        <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {OFFERS.map((o) => <OfferCard key={o.title} o={o} />)}
        </div>
      </div>
    </section>
  );
}
