// src/components/OffersStrip.jsx
import bg from "../assets/TouristInn.jpg";

export default function OffersStrip() {
  return (
    <section className="relative overflow-hidden">
      {/* Use inline style to resolve asset from src/ folder */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,.5),rgba(0,0,0,.2))]" />
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-16 md:py-20 text-white">
        <p className="text-[11px] tracking-[0.2em] uppercase text-white/80">Special Offers</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Save on your next city stay</h2>
        <p className="mt-2 max-w-2xl text-white/90">Seasonal rates for business travelers, long stays, and locals.</p>
        <a href="/offers" className="mt-6 inline-flex items-center rounded-full bg-white text-slate-900 font-semibold px-5 py-2.5">See Offers</a>
      </div>
    </section>
  );
}
