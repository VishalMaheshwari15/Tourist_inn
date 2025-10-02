// src/pages/Services.jsx
import { useEffect } from "react";

const BRAND = "from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]";
const WA = (t="Hello, please help me customise my stay.") =>
  `https://wa.me/9607860882?text=${encodeURIComponent(t)}`;

const Chip = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 mr-2 mb-2">
    {children}
  </span>
);

export default function Services() {
  useEffect(() => { document.title = "Services & Amenities — Tourist Inn Group"; }, []);

  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 -z-10 bg-gradient-to-r ${BRAND} opacity-90`} />
        <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-14 text-white">
          <p className="text-[11px] tracking-[0.22em] uppercase text-white/85">Guest Experience</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold">Services & Amenities</h1>
          <p className="mt-2 max-w-2xl text-white/90">
            Thoughtful essentials for diplomats, executives, families and city travellers.
          </p>
          <div className="mt-4">
            <a href={WA()} target="_blank" rel="noreferrer"
               className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900">
              WhatsApp Concierge
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-[980px] px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Tour Inn */}
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Tour Inn</h2>
              <p className="mt-1 text-sm text-slate-700">Business-friendly rooms in central Malé.</p>
              <div className="mt-3">
                <Chip>High-speed Wi-Fi</Chip>
                <Chip>Smart TV</Chip>
                <Chip>Tea/Coffee</Chip>
                <Chip>Daily Housekeeping</Chip>
                <Chip>Secure Entry</Chip>
                <Chip>Airport Pickup (req.)</Chip>
              </div>
              <div className="mt-4 flex gap-2">
                <a href="/tour-inn" className="rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100">Explore</a>
                <a href={WA("Tour Inn booking assistance")} target="_blank" rel="noreferrer" className="rounded-full bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white">Book (WA)</a>
              </div>
            </div>

            {/* Tourist Inn */}
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Tourist Inn</h2>
              <p className="mt-1 text-sm text-slate-700">Clean, quiet and convenient city address.</p>
              <div className="mt-3">
                <Chip>Wi-Fi</Chip>
                <Chip>AC Rooms</Chip>
                <Chip>Tea/Coffee</Chip>
                <Chip>Smart TV</Chip>
                <Chip>Laundry (req.)</Chip>
                <Chip>WhatsApp 24×7</Chip>
              </div>
              <div className="mt-4 flex gap-2">
                <a href="/tourist-inn" className="rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100">Explore</a>
                <a href={WA("Tourist Inn booking assistance")} target="_blank" rel="noreferrer" className="rounded-full bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white">Book (WA)</a>
              </div>
            </div>

            {/* Tourist Inn Grand */}
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Tourist Inn Grand</h2>
              <p className="mt-1 text-sm text-slate-700">Spacious layouts, suites, and longer stays.</p>
              <div className="mt-3">
                <Chip>Large Rooms</Chip>
                <Chip>Work Desk</Chip>
                <Chip>Wi-Fi</Chip>
                <Chip>City Views (sel.)</Chip>
                <Chip>Airport Pickup (req.)</Chip>
                <Chip>Long-stay Rates</Chip>
              </div>
              <div className="mt-4 flex gap-2">
                <a href="/tourist-inn-grand" className="rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100">Explore</a>
                <a href={WA("Tourist Inn Grand booking assistance")} target="_blank" rel="noreferrer" className="rounded-full bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white">Book (WA)</a>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-8 rounded-2xl bg-white ring-1 ring-slate-200 p-5 text-sm text-slate-700">
            <p><strong>Notes:</strong> Early check-in / late check-out subject to availability. Specific amenities may vary by room type. For guaranteed inclusions, please confirm on WhatsApp before booking.</p>
          </div>

          <p className="mt-4 text-xs text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>
    </main>
  );
}
