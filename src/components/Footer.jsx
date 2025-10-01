// src/components/Footer.jsx — Luxe Edition (Premium)
import { useMemo, useState } from "react";
import logo from "../assets/logo.png";
import {
  Instagram,
  Facebook,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
  ShieldCheck,
  Wifi,
  Coffee,
  ConciergeBell,
  CreditCard,
  Copy,
  Check,
  Globe,
  IndianRupee,
} from "lucide-react";

export default function Footer() {
  const navPrimary = useMemo(() => ([
    { name: "Rooms", href: "/rooms" },
    { name: "Amenities", href: "/amenities" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ]), []);
  const navLegal = useMemo(() => ([
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Use", href: "/terms" },
    { name: "Refunds", href: "/refunds" },
  ]), []);

  const [ok, setOk] = useState(false);
  const [copyKey, setCopyKey] = useState("");

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
      {/* ambient luxe background */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(120%_100%_at_50%_-10%,black,transparent_70%)]">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-violet-200/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-[1180px] px-4 md:px-6">
        {/* Upper grid */}
        <div className="py-12 grid gap-10 md:grid-cols-12">
          {/* Brand + intro */}
          <div className="md:col-span-5">
            <a href="/" aria-label="Home" className="inline-flex items-center gap-2">
              <img
                src={logo}
                alt="Brand logo"
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
              {chip(<><ConciergeBell className="h-3.5 w-3.5"/> 24×7 Reception</>)}
              {chip(<><Wifi className="h-3.5 w-3.5"/> Free Wi‑Fi</>)}
              {chip(<><Coffee className="h-3.5 w-3.5"/> Breakfast</>)}
              {chip(<><ShieldCheck className="h-3.5 w-3.5"/> Airport Pickup</>)}
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-2 text-sm text-slate-700">
              <ContactLine
                icon={<Phone className="h-4 w-4"/>}
                label={<a href="tel:+919911927509" className="hover:underline text-slate-900">+91 99119 27509</a>}
                copyValue={"+91 99119 27509"}
                onCopied={() => blink(setCopyKey, "phone")}
                active={copyKey === "phone"}
              />
              <ContactLine
                icon={<Mail className="h-4 w-4"/>}
                label={<a href="mailto:hello@touristinn.com" className="hover:underline text-slate-900">hello@touristinn.com</a>}
                copyValue={"hello@touristinn.com"}
                onCopied={() => blink(setCopyKey, "mail")}
                active={copyKey === "mail"}
              />
              <ContactLine
                icon={<MapPin className="h-4 w-4"/>}
                label={<span className="text-slate-900">Near City Center, New Delhi – 110025</span>}
                copyValue={"Near City Center, New Delhi – 110025"}
                onCopied={() => blink(setCopyKey, "addr")}
                active={copyKey === "addr"}
                extra={<a
                  href="https://www.google.com/maps/search/?api=1&query=Near+City+Center,+New+Delhi+110025"
                  className="ml-2 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] hover:bg-slate-50"
                  target="_blank" rel="noreferrer"
                >Directions</a>}
              />
            </div>
          </div>

          {/* Nav clusters */}
          <nav className="md:col-span-4 grid grid-cols-2 gap-10">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Explore</h4>
              <ul className="mt-3 space-y-2 text-sm">
                {navPrimary.map((item) => (
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

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm">
                {navLegal.map((item) => (
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

          {/* Newsletter / Offers */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold text-slate-900">Get updates</h4>
            <p className="mt-3 text-sm text-slate-600">New offers & seasonal discounts — no spam.</p>

            <form
              className="mt-4 flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setOk(true);
                setTimeout(() => setOk(false), 2200);
              }}
            >
              <label htmlFor="email-sub" className="sr-only">Email</label>
              <input
                id="email-sub"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300/60"
              />
              <button
                type="submit"
                className="relative group inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white overflow-hidden"
              >
                <span className="absolute inset-0 bg-slate-900 group-hover:bg-slate-800 transition" />
                <span className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
                <span className="relative z-[1]">Subscribe</span>
              </button>
            </form>

            <div
              role="status"
              aria-live="polite"
              className={`mt-2 text-xs transition ${ok ? "opacity-100" : "opacity-0"}`}
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-200">
                <Check className="h-3.5 w-3.5"/> Subscribed! We'll keep you posted.
              </span>
            </div>

            {/* Social */}
            <div className="mt-5 flex items-center gap-3">
              <Social href="https://instagram.com" label="Instagram">
                <Instagram className="h-5 w-5"/>
              </Social>
              <Social href="https://facebook.com" label="Facebook">
                <Facebook className="h-5 w-5"/>
              </Social>
              <Social href="https://maps.google.com" label="Location">
                <MapPin className="h-5 w-5"/>
              </Social>
            </div>

            {/* Trust & payment */}
            <div className="mt-6 space-y-2">
              <div className="text-xs font-semibold text-slate-500">We accept</div>
              <div className="flex flex-wrap items-center gap-2">
                {chip(<><CreditCard className="h-3.5 w-3.5"/> Visa</>)}
                {chip(<><CreditCard className="h-3.5 w-3.5"/> MasterCard</>)}
                {chip(<><CreditCard className="h-3.5 w-3.5"/> UPI</>)}
                {chip(<><CreditCard className="h-3.5 w-3.5"/> AmEx</>)}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200" />

        {/* Bottom bar */}
        <div className="py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <LangCurrency />
            <span className="hidden sm:inline h-1 w-1 rounded-full bg-slate-300" />
            <a href="/privacy" className="hover:underline">Privacy</a>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <a href="/terms" className="hover:underline">Terms</a>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <a href="/contact" className="hover:underline">Support</a>
          </div>

          <BackToTop />
        </div>
      </div>

      {/* Bottom subtle accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-200/70 to-transparent" />
    </footer>
  );
}

/* -------------------------------------------------------------------------------------
   Subcomponents
------------------------------------------------------------------------------------- */
function Social({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 hover:bg-violet-50 text-slate-800"
    >
      {children}
    </a>
  );
}

function ContactLine({ icon, label, copyValue, extra, onCopied, active }) {
  return (
    <p className="flex items-start gap-2">
      <span className="mt-0.5 text-slate-500">{icon}</span>
      <span className="flex-1">{label}</span>
      <CopyBtn value={copyValue} onCopied={onCopied} active={active} />
      {extra}
    </p>
  );
}

function CopyBtn({ value, onCopied, active }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          setBusy(true);
          await navigator.clipboard.writeText(value);
          onCopied?.();
        } finally {
          setBusy(false);
        }
      }}
      className="ml-2 inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-600 hover:bg-slate-50"
      aria-label="Copy"
    >
      {active ? <Check className="h-3.5 w-3.5"/> : busy ? <Copy className="h-3.5 w-3.5 animate-pulse"/> : <Copy className="h-3.5 w-3.5"/>}
      {active ? "Copied" : "Copy"}
    </button>
  );
}

function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
      aria-label="Back to top"
    >
      <ArrowUp className="h-3.5 w-3.5"/> Top
    </button>
  );
}

function LangCurrency() {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 px-2 py-0.5">
        <Globe className="h-3.5 w-3.5"/>
        <select className="bg-transparent text-xs outline-none">
          <option>EN</option>
          <option>HI</option>
        </select>
      </span>
      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 px-2 py-0.5">
        <IndianRupee className="h-3.5 w-3.5"/>
        <select className="bg-transparent text-xs outline-none">
          <option>INR</option>
          <option>USD</option>
        </select>
      </span>
    </div>
  );
}

/* utils */
function blink(setter, key) {
  setter(key);
  setTimeout(() => setter(""), 1500);
}
