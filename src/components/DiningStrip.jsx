// src/components/DiningStrip.jsx
import cafeImg from "../assets/TourInn.png";

export default function DiningStrip() {
  return (
    <section className="relative">
      <div className="bg-[#2b1f1a] text-white">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/70">
              Food &amp; Beverage
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold">
              Why wouldn’t you dine in?
            </h2>
            <p className="mt-3 text-white/80">
              Our cafés serve comforting international &amp; local favourites.
              Relaxed interiors, friendly teams, and an easy walk from your
              room.
            </p>
            <a
              href="/dining"
              className="mt-6 inline-flex items-center rounded-full bg-white text-slate-900 font-semibold px-5 py-2.5"
            >
              See Restaurants &amp; Bars
            </a>
          </div>

          <div className="relative md:translate-y-10">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-xl">
              <img
                src={cafeImg}
                alt="Café"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
