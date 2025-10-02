// src/pages/LegalHub.jsx
import { Link } from "react-router-dom";

const WA = (t = "Hello! Please share the policy details.") =>
  `https://wa.me/9607860882?text=${encodeURIComponent(t)}`;

const BRAND = "from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]";
const EFFECTIVE = "1 Oct 2025"; // 🔁 Update when needed

// 🔗 Update these Booking.com links if you have exact policy anchors:
const HOTEL_LINKS = {
  tourInn: {
    name: "Tour Inn",
    booking:
      "https://www.booking.com/hotel/mv/tour-inn.html",
  },
  touristInn: {
    name: "Tourist Inn",
    booking: "https://www.booking.com/hotel/mv/tourist-inn.html",
  },
  grand: {
    name: "Tourist Inn Grand",
    booking: "https://www.booking.com/hotel/mv/tourist-inn-grand.html",
  },
};

function PageShell({ eyebrow = "Legal", title, subtitle, children }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-14 md:py-20">
        <header className="text-center mb-8 md:mb-12">
          <p className="text-[12px] tracking-[0.22em] uppercase text-slate-500">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
          <div className={`mx-auto mt-4 h-px max-w-[520px] bg-gradient-to-r ${BRAND} opacity-60`} />
          <p className="mt-4 text-xs text-slate-500">Effective date: {EFFECTIVE}</p>
        </header>
        <div className="prose prose-slate max-w-none">
          {children}
        </div>
      </div>
    </section>
  );
}

function HotelPolicyCard({ h }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm">
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${BRAND}`} />
      <div className="p-5 md:p-6">
        <h3 className="text-lg font-semibold text-slate-900">{h.name}</h3>
        <p className="mt-1 text-sm text-slate-600">
          Official, always-up-to-date details (policies/house rules) are published on Booking.com.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={h.booking}
            target="_blank"
            rel="noreferrer"
            className="relative inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold text-white overflow-hidden ring-1 ring-black/5"
          >
            <span className={`absolute inset-0 bg-gradient-to-r ${BRAND}`} />
            <span className="relative">View on Booking.com</span>
          </a>
          <a
            href={WA(`Hello! Please share ${h.name} policy details / help.`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-50 text-slate-900"
          >
            WhatsApp Help
          </a>
        </div>
      </div>
    </article>
  );
}

function HotelsGrid() {
  const items = [HOTEL_LINKS.tourInn, HOTEL_LINKS.touristInn, HOTEL_LINKS.grand];
  return (
    <section className="mt-12">
      <div className="text-center mb-5">
        <h2 className="text-xl font-semibold text-slate-900">Hotel-specific Policies</h2>
        <p className="text-slate-600 text-sm">Select your hotel for live policy details or contact us on WhatsApp.</p>
      </div>
      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        {items.map((h) => (
          <HotelPolicyCard key={h.name} h={h} />
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   PRIVACY POLICY
---------------------------------------------------------------- */
export function PrivacyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your data at Tour Inn • Tourist Inn • Tourist Inn Grand."
    >
      <h2>1) Who we are</h2>
      <p>
        This Privacy Policy applies to our guesthouses in Malé, Maldives: <strong>Tour Inn</strong>,{" "}
        <strong>Tourist Inn</strong>, and <strong>Tourist Inn Grand</strong> (“we”, “us”, “our”). We operate direct
        communication via WhatsApp and accept bookings via direct channels and third-party OTAs such as Booking.com.
      </p>

      <h2>2) What data we collect</h2>
      <ul>
        <li><strong>Identity &amp; Contact:</strong> name, phone, email, nationality/ID (as required by local law).</li>
        <li><strong>Booking Details:</strong> stay dates, room type, special requests, payment preferences.</li>
        <li><strong>Communications:</strong> WhatsApp/chat/email messages to assist with reservations and support.</li>
        <li><strong>Usage:</strong> basic website analytics (non-sensitive), device/browser info.</li>
      </ul>

      <h2>3) Why we use your data (legal bases)</h2>
      <ul>
        <li><strong>Contract:</strong> to confirm, manage, and fulfil your booking.</li>
        <li><strong>Legitimate Interests:</strong> to improve services, ensure property security, and respond to queries.</li>
        <li><strong>Legal Obligations:</strong> to comply with Maldivian registration/reporting requirements.</li>
        <li><strong>Consent:</strong> for optional marketing or where required (you can withdraw anytime).</li>
      </ul>

      <h2>4) Bookings via Booking.com</h2>
      <p>
        When you book through Booking.com, they act as an independent controller for the data you submit on their platform.
        They share relevant booking details with us to fulfil your stay. Please review their privacy policy for full details.
      </p>

      <h2>5) WhatsApp &amp; direct messages</h2>
      <p>
        If you contact us on WhatsApp (<a href={WA()} target="_blank" rel="noreferrer">+960&nbsp;786&nbsp;0882</a>),
        your messages are processed by WhatsApp under their own terms/privacy. We only use your messages to deliver service and support.
      </p>

      <h2>6) Data sharing &amp; retention</h2>
      <ul>
        <li><strong>Sharing:</strong> payment processors, government authorities (where legally required), and trusted vendors strictly for operations.</li>
        <li><strong>Retention:</strong> booking/guest records are kept for as long as necessary for legal, accounting, or operational purposes, then safely deleted/anonymized.</li>
      </ul>

      <h2>7) Your rights</h2>
      <p>
        Subject to applicable law, you may request access, correction, deletion, or restriction of your data. Contact us on{" "}
        <a href={WA("Data rights request")} target="_blank" rel="noreferrer">WhatsApp</a> to raise a request.
      </p>

      <h2>8) Security</h2>
      <p>
        We implement reasonable technical and organizational measures to protect your information. No method is 100% secure,
        but we regularly review safeguards to reduce risk.
      </p>

      <h2>9) Updates</h2>
      <p>
        We may update this Privacy Policy to reflect changes in law or our practices. The “Effective date” above shows when this version took effect.
      </p>

      <h2>10) Contact</h2>
      <p>
        For privacy questions, message us at{" "}
        <a href={WA("Privacy policy question")} target="_blank" rel="noreferrer">+960&nbsp;786&nbsp;0882 (WhatsApp)</a>.
      </p>

      <HotelsGrid />
    </PageShell>
  );
}

/* ----------------------------------------------------------------
   TERMS OF USE
---------------------------------------------------------------- */
export function TermsPage() {
  return (
    <PageShell
      title="Terms of Use"
      subtitle="Guest terms, house rules, and conditions of stay across our properties in Malé."
    >
      <h2>1) Scope</h2>
      <p>
        These Terms apply to all reservations and stays at Tour Inn, Tourist Inn, and Tourist Inn Grand (“Properties”).
        By making a booking (direct or via OTA) and by staying at our Properties, you agree to these Terms.
      </p>

      <h2>2) Booking &amp; Payment</h2>
      <ul>
        <li>Bookings can be made directly (incl. WhatsApp) or via Booking.com and similar platforms.</li>
        <li>Valid ID/passport is required at check-in as per Maldivian regulations.</li>
        <li>Taxes/fees are as applicable at the time of stay. Payment options vary by property (cards/cash/UPI if available).</li>
      </ul>

      <h2>3) Check-in / Check-out</h2>
      <ul>
        <li>Standard check-in: 2:00 PM • Check-out: 12:00 PM (noon). Early check-in / late check-out subject to availability and may incur charges.</li>
        <li>Unannounced late departures may be charged as per policy.</li>
      </ul>

      <h2>4) House Rules</h2>
      <ul>
        <li>No smoking inside rooms. Designated outdoor areas may be provided where available.</li>
        <li>Quiet hours: 10 PM – 7 AM. Be respectful of other guests and neighbors.</li>
        <li>Visitors must be registered at reception; local regulations apply.</li>
        <li>Damage, missing items, or excessive cleaning may incur charges.</li>
      </ul>

      <h2>5) Safety &amp; Conduct</h2>
      <ul>
        <li>For your safety, comply with staff instructions and property guidelines.</li>
        <li>Illegal activities, harassment, or abusive behavior are not tolerated and may result in immediate removal without refund.</li>
      </ul>

      <h2>6) Liability</h2>
      <p>
        We are not liable for loss of cash, jewelry, or valuables unless placed in designated safes (where provided).
        To the extent permitted by law, we exclude liability for indirect or consequential losses.
      </p>

      <h2>7) Force Majeure</h2>
      <p>
        We are not responsible for delays or cancellations caused by events beyond our reasonable control, such as natural disasters,
        government actions, or utility failures.
      </p>

      <h2>8) Changes to Terms</h2>
      <p>
        We may update these Terms at any time. The version in force at booking/stay time will apply; check Booking.com for OTA bookings.
      </p>

      <h2>9) Governing Law</h2>
      <p>
        These Terms are governed by the laws of the Maldives. Disputes shall be resolved in the competent courts/authorities of the Maldives.
      </p>

      <h2>10) Contact</h2>
      <p>
        For clarifications, contact{" "}
        <a href={WA("Terms of Use question")} target="_blank" rel="noreferrer">WhatsApp +960&nbsp;786&nbsp;0882</a>.
      </p>

      <HotelsGrid />
    </PageShell>
  );
}

/* ----------------------------------------------------------------
   REFUNDS & CANCELLATIONS
---------------------------------------------------------------- */
export function RefundsPage() {
  return (
    <PageShell
      title="Refunds & Cancellations"
      subtitle="Policies may differ by room/rate plan and property; Booking.com shows the live policy for your booking."
    >
      <h2>1) General</h2>
      <p>
        Refund and cancellation terms depend on <strong>your selected rate plan</strong> (e.g., Flexible vs. Non-Refundable)
        and the <strong>hotel</strong> you choose. Always check the policy displayed at the time of booking.
      </p>

      <h2>2) Flexible vs. Non-Refundable</h2>
      <ul>
        <li><strong>Flexible:</strong> Free cancellation/modification up to a cut-off time; late cancellation/no-show may incur charges.</li>
        <li><strong>Non-Refundable:</strong> Prepaid or partially prepaid; cancellations/no-shows generally not refundable.</li>
      </ul>

      <h2>3) Date Changes &amp; Early Departures</h2>
      <ul>
        <li>Date changes are subject to availability and rate differences.</li>
        <li>Early departure may forfeit nights as per rate plan and property rules.</li>
      </ul>

      <h2>4) No-Show</h2>
      <p>
        If you do not arrive and do not inform us, the booking is treated as a no-show and the applicable no-show fee may apply.
      </p>

      <h2>5) Force Majeure</h2>
      <p>
        In extraordinary situations (e.g., government restrictions, natural events), we will follow applicable laws and reasonable
        commercial practices to support date changes or credits where feasible.
      </p>

      <h2>6) How to Request</h2>
      <ul>
        <li>
          <strong>Booked via Booking.com:</strong> Use your Booking.com reservation tools or contact support on your booking page for the quickest action.
        </li>
        <li>
          <strong>Booked direct:</strong> Message us on{" "}
          <a href={WA("Refund/Cancellation assistance for my direct booking")} target="_blank" rel="noreferrer">WhatsApp (+960&nbsp;786&nbsp;0882)</a>{" "}
          with your name, dates, and reason. We’ll guide you.
        </li>
      </ul>

      <h2>7) Refund Timelines</h2>
      <p>
        If approved, card refunds typically reflect within 7–14 working days (bank dependent). UPI/cash/other methods vary by provider and country rules.
      </p>

      <h2>8) Contact</h2>
      <p>
        Need help? Ping us on{" "}
        <a href={WA("Refund policy question")} target="_blank" rel="noreferrer">WhatsApp</a>.
      </p>

      <HotelsGrid />
    </PageShell>
  );
}
