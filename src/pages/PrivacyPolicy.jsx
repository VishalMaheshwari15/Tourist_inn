// src/pages/PrivacyPolicy.jsx
import { useEffect } from "react";

const BRAND = "from-[#6A00FF] via-[#B86DFF] to-[#FF2EA8]";
const WA = (t="Hello, I have a question about your Privacy Policy.") =>
  `https://wa.me/9607860882?text=${encodeURIComponent(t)}`;

export default function PrivacyPolicy() {
  useEffect(() => { document.title = "Privacy Policy — Tourist Inn Group"; }, []);

  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 -z-10 bg-gradient-to-r ${BRAND} opacity-90`} />
        <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-14 text-white">
          <p className="text-[11px] tracking-[0.22em] uppercase text-white/85">Legal</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold">Privacy Policy</h1>
          <p className="mt-2 max-w-2xl text-white/90">
            We respect your privacy across Tour Inn, Tourist Inn, and Tourist Inn Grand.
          </p>
          <div className="mt-4">
            <a
              href={WA()}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-[980px] px-4 md:px-6 prose prose-slate">
          <h2>1. Scope</h2>
          <p>
            This Privacy Policy applies to bookings and enquiries made directly with Tourist Inn Group
            properties — <strong>Tour Inn</strong>, <strong>Tourist Inn</strong>, and <strong>Tourist Inn Grand</strong> —
            through our website, WhatsApp, phone, email, or partner channels (e.g., Booking.com). It explains
            what data we collect, why we collect it, and how we protect it.
          </p>

          <h2>2. Information we collect</h2>
          <ul>
            <li><strong>Contact details:</strong> name, phone number, email, WhatsApp ID.</li>
            <li><strong>Booking details:</strong> dates, number of guests, room preferences, special requests.</li>
            <li><strong>Payment notes:</strong> payment status and mode (we do not store card PAN/CVV on our servers).</li>
            <li><strong>Identity for check-in:</strong> passport/ID details as required by Maldivian regulations.</li>
            <li><strong>Usage:</strong> basic website analytics (non-identifying) to improve our services.</li>
          </ul>

          <h2>3. How we use your data</h2>
          <ul>
            <li>To manage reservations, check-ins, and guest support.</li>
            <li>To comply with legal and safety obligations (e.g., guest registration).</li>
            <li>To communicate booking updates, invoices, and optional offers.</li>
          </ul>

          <h2>4. Sharing & third-parties</h2>
          <p>
            We may share limited data with payment processors (to collect payments), government authorities (as required),
            and booking platforms (if you booked via them). We do not sell your personal information.
          </p>

          <h2>5. Data retention</h2>
          <p>
            Reservation and invoice records are retained for statutory periods. ID records are retained only as long as necessary to comply with local laws and security requirements.
          </p>

          <h2>6. Security</h2>
          <p>
            We use appropriate technical and organisational safeguards to protect your information. No method of transmission or storage is 100% secure, but we strive to follow best practices.
          </p>

          <h2>7. Your choices</h2>
          <ul>
            <li>Access/correction: request a copy or correction of your data.</li>
            <li>Opt-out: unsubscribe from marketing at any time.</li>
            <li>Deletion: request deletion where legally permissible.</li>
          </ul>

          <h2>8. Hotel-specific contacts</h2>
          <ul>
            <li><strong>Tour Inn:</strong> <a href="https://wa.me/9607860882" target="_blank" rel="noreferrer">WhatsApp</a> / <a href="mailto:hello@touristinn.com">hello@touristinn.com</a></li>
            <li><strong>Tourist Inn:</strong> <a href="https://wa.me/9607860882" target="_blank" rel="noreferrer">WhatsApp</a> / <a href="mailto:hello@touristinn.com">hello@touristinn.com</a></li>
            <li><strong>Tourist Inn Grand:</strong> <a href="https://wa.me/9607860882" target="_blank" rel="noreferrer">WhatsApp</a> / <a href="mailto:hello@touristinn.com">hello@touristinn.com</a></li>
          </ul>

          <h2>9. Updates</h2>
          <p>
            We may update this policy occasionally. The latest version will be available on this page.
          </p>

          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>
    </main>
  );
}
