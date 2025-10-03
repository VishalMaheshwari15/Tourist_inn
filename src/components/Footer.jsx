// src/components/Footer.jsx — ultra clean footer (Developer credit removed)
import { useRef, useState } from "react";
import logo from "../assets/logo.png";
import {
  MapPin, Phone, Mail, ArrowUp,
  ShieldCheck, Wifi, Coffee, ConciergeBell,
  Copy as CopyIcon, Globe,
  Facebook, Instagram, MessageCircle
} from "lucide-react";

/* WhatsApp helper */
const WA = (t = "Hello! I'd like to book. Please share availability & rates.") =>
  `https://wa.me/9607860882?text=${encodeURIComponent(t)}`;

/* Social links (edit if you add more) */
const SOCIAL = [
  { name: "Facebook", href: "https://www.facebook.com/touristinnmv", icon: Facebook,  className: "text-[#1877F2]" },
  { name: "Instagram", href: "https://www.instagram.com/touristinnmv", icon: Instagram, className: "text-[#E4405F]" },
  { name: "WhatsApp", href: WA("Hi! I found you via your website."), icon: MessageCircle, className: "text-[#25D366]" },
];

/* Nav links */
const NAV_PRIMARY = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Properties", href: "/#properties" },
  { name: "Services", href: "/services" },
  { name: "Gallery", href: "/property/tourist-inn" },
];
const NAV_LEGAL = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Cancellations & Refunds", href: "/refunds" },
  { name: "Terms of Use", href: "/terms" },
];

export default function Footer() {
  const [toast, setToast] = useState("");

  const chip = (children) => (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
      {children}
    </span>
  );

  return (
    <footer
      className="relative mt-16 border-t border-slate-200/80 bg-white/95 text-slate-700 supports-[backdrop-filter]:backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Tiny toast */}
      <Toast message={toast} onDone={() => setToast("")} />

      <div className="mx-auto w-full max-w-[1180px] px-4 md:px-6">
        {/* Upper grid */}
        <div className="py-12 grid gap-10 md:grid-cols-12">
          {/* Brand + intro */}
          <div className="md:col-span-5">
            <a href="/" aria-label="Home" className="inline-flex items-center gap-2">
              <img
                src={logo}
                alt="Tourist Inn Group"
                className="h-9 w-auto select-none"
                draggable="false"
                decoding="async"
              />
            </a>

            <p className="mt-4 text-sm leading-6 text-slate-600 max-w-prose">
              Quiet, premium stays near city center — modern comfort, thoughtful amenities,
              and a calm atmosphere. <span className="font-medium text-slate-800">Book direct</span> for the best value.
            </p>

            {/* Feature chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              {chip(<><ConciergeBell className="h-3.5 w-3.5" /> 24×7 Concierge</>)}
              {chip(<><Wifi className="h-3.5 w-3.5" /> Free Wi-Fi</>)}
              {chip(<><Coffee className="h-3.5 w-3.5" /> Breakfast</>)}
              {chip(<><ShieldCheck className="h-3.5 w-3.5" /> Airport Pickup</>)}
            </div>

            {/* Contact (click to copy) */}
            <div className="mt-6 space-y-2 text-sm text-slate-700">
              <ContactLine
                icon={<Phone className="h-4 w-4" />}
                label={<a href="tel:+9607860882" className="hover:underline text-slate-900">+960 786 0882</a>}
                copyValue="+960 786 0882"
                onCopyToast={() => setToast("Phone copied")}
              />
              <ContactLine
                icon={<Mail className="h-4 w-4" />}
                label={<a href="mailto:hello@touristinn.com" className="hover:underline text-slate-900">hello@touristinn.com</a>}
                copyValue="hello@touristinn.com"
                onCopyToast={() => setToast("Email copied")}
              />
              <ContactLine
                icon={<MapPin className="h-4 w-4" />}
                label={<span className="text-slate-900">Ma. Leaves, Maaveyo Goalhi, Malé, Maldives</span>}
                copyValue="Ma. Leaves, Maaveyo Goalhi, Malé, Maldives"
                extra={
                  <a
                    href="https://www.google.com/maps?q=Male+Maldives"
                    className="ml-2 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] hover:bg-slate-50"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Directions
                  </a>
                }
                onCopyToast={() => setToast("Address copied")}
              />
            </div>

            {/* Social media */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Follow us</h4>
              <div className="mt-2 flex flex-wrap items-center gap-2.5">
                {SOCIAL.map(({ name, href, icon: Icon, className }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 h-9 w-9 hover:bg-slate-50 transition"
                  >
                    <Icon className={`h-[18px] w-[18px] ${className}`} />
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-5">
              <a
                href={WA("Booking inquiry — via footer")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                Book on WhatsApp
              </a>
            </div>
          </div>

          {/* Nav clusters */}
          <nav className="md:col-span-7 grid grid-cols-2 gap-10">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Explore</h4>
              <ul className="mt-3 space-y-2 text-sm">
                {NAV_PRIMARY.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 decoration-violet-300/70"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>

              <h4 className="mt-6 text-sm font-semibold text-slate-900">Properties</h4>
              <ul className="mt-3 space-y-2 text-sm">
                {/* Keep order consistent */}
                <li><a href="/tourist-inn" className="text-slate-600 hover:text-slate-900 hover:underline">Tourist Inn</a></li>
                <li><a href="/tour-inn" className="text-slate-600 hover:text-slate-900 hover:underline">Tour Inn</a></li>
                <li><a href="/tourist-inn-grand" className="text-slate-600 hover:text-slate-900 hover:underline">Tourist Inn Grand</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm">
                {NAV_LEGAL.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 decoration-violet-300/70"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200" />

        {/* Bottom bar (Developer credit removed) */}
        <div className="py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <LangPill />
            <a href="/privacy" className="hover:underline">Privacy</a>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <a href="/refunds" className="hover:underline">Refunds</a>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <a href="/services" className="hover:underline">Services</a>
          </div>

          <BackToTop />
        </div>
      </div>

      {/* Bottom subtle accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-200/70 to-transparent" />
    </footer>
  );
}

/* ---------- Tiny Toast ---------- */
function Toast({ message, onDone }) {
  const timer = useRef(null);
  if (!message) return null;
  clearTimeout(timer.current);
  timer.current = setTimeout(onDone, 1500);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed right-4 top-4 z-[60] origin-top-right animate-[fadeIn_.15s_ease-out] rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
    >
      {message}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:scale(.98)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

/* ---------- Language pill ---------- */
function LangPill() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 px-2 py-0.5">
      <Globe className="h-3.5 w-3.5" />
      <select className="bg-transparent text-xs outline-none">
        <option>EN</option>
        <option>HI</option>
      </select>
    </span>
  );
}

/* ---------- Contact line (click to copy) ---------- */
function ContactLine({ icon, label, copyValue, extra, onCopyToast }) {
  const [active, setActive] = useState(false);

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue);
      setActive(true);
      onCopyToast?.();
      setTimeout(() => setActive(false), 900);
    } catch {}
  };

  return (
    <div
      className="group flex items-start gap-2"
      onClick={doCopy}
      onKeyDown={(e) => (e.key === "Enter" ? doCopy() : null)}
      role="button"
      tabIndex={0}
      aria-label="Click to copy"
    >
      <span className="mt-0.5 text-slate-500">{icon}</span>
      <span className="flex-1">
        <span onClick={(e) => e.stopPropagation()}>{label}</span>
      </span>

      <span
        className={`ml-2 inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/70 p-1 text-slate-600 transition
        opacity-0 group-hover:opacity-100 group-focus:opacity-100`}
        title="Copy"
        onClick={(e) => { e.stopPropagation(); doCopy(); }}
      >
        <CopyIcon className={`h-3.5 w-3.5 ${active ? "animate-pulse" : ""}`} />
      </span>

      {extra}
    </div>
  );
}

function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
      aria-label="Back to top"
    >
      <ArrowUp className="h-3.5 w-3.5" /> Top
    </button>
  );
}
