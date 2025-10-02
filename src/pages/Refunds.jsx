// src/pages/Refunds.jsx
import { useEffect } from "react";

const BRAND = "from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]";

const Card = ({ children }) => (
  <div className="rounded-xl bg-white ring-1 ring-slate-200 p-4 shadow-sm">{children}</div>
);

export default function Refunds() {
  useEffect(() => {
    document.title = "Cancellations & Refunds — Tourist Inn Group";
  }, []);

  return (
    <main className="bg-white text-slate-800">
      {/* Compact hero (reduced height) */}
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 -z-10 bg-gradient-to-r ${BRAND} opacity-90`} />
        <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-4 md:py-6 text-white">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/85">Legal</p>
          <h1 className="mt-0 text-2xl md:text-3xl font-semibold leading-tight">Cancellations & Refunds</h1>
          <p className="mt-1 max-w-2xl text-white/90 text-sm">
            Simple, property-wise policies for Tour Inn, Tourist Inn, and Tourist Inn Grand.
          </p>
        </div>
      </section>

      {/* Compact content */}
      <section className="py-6 md:py-8">
        <div className="mx-auto max-w-[980px] px-4 md:px-6 space-y-4">
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 leading-snug">General Rules (Direct Bookings)</h2>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>
                <strong>Free cancellation</strong> up to 72 hours before check-in (local time), unless a special
                non-refundable rate was chosen.
              </li>
              <li>
                Within 72 hours, one night’s charge may apply. <em>No-shows</em> may be fully charged for the first night.
              </li>
              <li>Refunds (if any) are processed to the original payment method within 7–10 business days.</li>
              <li>For partner channels (e.g., Booking.com), the channel’s policy applies.</li>
            </ul>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <h3 className="text-base font-semibold">Tour Inn</h3>
              <p className="mt-1 text-sm text-slate-700">
                Standard: Free cancellation up to 72 hours. Peak dates or promo rates may be non-refundable. For prepaids,
                refund timelines follow your bank/card rules.
              </p>
            </Card>

            <Card>
              <h3 className="text-base font-semibold">Tourist Inn</h3>
              <p className="mt-1 text-sm text-slate-700">
                Flexible: Free cancellation up to 72 hours, otherwise one-night charge. Non-refundable deals are clearly
                marked at booking time.
              </p>
            </Card>

            <Card>
              <h3 className="text-base font-semibold">Tourist Inn Grand</h3>
              <p className="mt-1 text-sm text-slate-700">
                Suites & long-stay: Free cancellation up to 5 days for long-stays; otherwise 50% of the first 3 nights.
                Standard stays follow the 72-hour rule.
              </p>
            </Card>
          </div>

          <Card>
            <h3 className="text-base font-semibold">How to request a refund</h3>
            <ol className="mt-1 list-decimal pl-5 text-sm text-slate-700 space-y-1">
              <li>Share your booking name and dates via your booking channel.</li>
              <li>We’ll verify eligibility per the selected rate plan and dates.</li>
              <li>Eligible refunds are initiated immediately; banks may take 7–10 business days.</li>
            </ol>
          </Card>

          <p className="text-[11px] text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>
    </main>
  );
}
