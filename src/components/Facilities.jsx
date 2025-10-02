// src/components/Facilities.jsx
import { useMemo, useState, useEffect, useRef } from "react";
import { SEO } from "../seo/SEO";

/* ───────── Inline icons (no deps) ───────── */
const I = {
  wifi:(p)=>(<svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M12 20a1.75 1.75 0 1 0 0-3.5A1.75 1.75 0 0 0 12 20Zm-8.3-7.7a.9.9 0 0 0 1.28.04 12.5 12.5 0 0 1 14.04 0 .9.9 0 1 0 1.1-1.44 14.3 14.3 0 0 0-16.24 0 .9.9 0 0 0-.18 1.4Zm3.2 3.2a.9.9 0 0 0 1.26.06 8.5 8.5 0 0 1 9.68 0 .9.9 0 1 0 1.08-1.44 10.3 10.3 0 0 0-11.84 0 .9.9 0 0 0-.18 1.38Z"/></svg>),
  ac:(p)=>(<svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v2.6a5 5 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 17a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Zm3 4a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z"/></svg>),
  tv:(p)=>(<svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-5v2h3a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h3v-2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v7h14V7H5Z"/></svg>),
  bed:(p)=>(<svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M3 7a2 2 0 0 1 2-2h10a4 4 0 0 1 4 4v8h-2v-3H5v3H3V7Zm2 5h12V9a2 2 0 0 0-2-2H5v5Z"/></svg>),
  coffee:(p)=>(<svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M4 6h11v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V7a1 1 0 0 1 1-1Zm13 2h2a3 3 0 1 1 0 6h-2v-2h2a1 1 0 0 0 0-2h-2V8ZM6 20a1 1 0 1 1 0-2h8a1 1 0 1 1 0 2H6Z"/></svg>),
  car:(p)=>(<svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M4.8 9 6.6 5.7A3 3 0 0 1 9.2 4h5.6a3 3 0 0 1 2.6 1.7L19.2 9H20a2 2 0 0 1 2 2v7h-2v-2H4v2H2v-7a2 2 0 0 1 2-2h.8Zm2.1-2.7L6 9h12l-.9-2.7a1 1 0 0 0-.94-.7H9.2a1 1 0 0 0-.9.7ZM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>),
  clean:(p)=>(<svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M5 15a7 7 0 0 1 14 0v4a1 1 0 1 1-2 0v-4a5 5 0 0 0-10 0v4a1 1 0 1 1-2 0v-4Z"/><path fill="currentColor" d="M11 3a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0V3Z"/></svg>),
  shield:(p)=>(<svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M12 2 4.5 5v6c0 4.7 3.2 9 7.5 11 4.3-2 7.5-6.3 7.5-11V5L12 2Zm0 2.2 5.5 2.2V11c0 3.7-2.5 7.3-5.5 9-3-1.7-5.5-5.3-5.5-9V6.4L12 4.2Z"/></svg>),
  desk:(p)=>(<svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M3 6h18v2H3V6Zm2 4h14a2 2 0 0 1 2 2v6h-2v-4h-5v4H10v-4H5v4H3v-6a2 2 0 0 1 2-2Z"/></svg>),
  shower:(p)=>(<svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M7 4a5 5 0 0 1 10 0v2h1a3 3 0 1 1 0 6h-1v8h-2V12H9v8H7V12H6a3 3 0 0 1 0-6h1V4Zm2 2h6V4a3 3 0 1 0-6 0v2ZM6 8H5a1 1 0 0 0 0 2h1V8Zm12 0v2h1a1 1 0 1 0 0-2h-1Z"/></svg>),
};

/* ───────── Content data ───────── */
const CORE = [
  { k:"wifi",   t:"High-Speed Wi-Fi",        d:"Complimentary fibre internet across all floors.",         tag:"Free",         icon:I.wifi },
  { k:"ac",     t:"Air-Conditioning",        d:"Individually controlled AC in every room.",               tag:"In-room",      icon:I.ac },
  { k:"tv",     t:"Smart TV",                d:"OTT apps & screen-cast ready (on request).",              tag:"Entertainment",icon:I.tv },
  { k:"bed",    t:"En-suite Rooms",          d:"Private bathrooms, premium linens & pillows.",            tag:"Comfort",      icon:I.bed },
  { k:"coffee", t:"Tea & Coffee",            d:"Kettle & amenities; breakfast on request.",               tag:"Refresh",      icon:I.coffee },
  { k:"clean",  t:"Daily Housekeeping",      d:"Fresh towels & room make-up service.",                    tag:"Hygiene",      icon:I.clean },
  { k:"desk",   t:"Work Desks",              d:"Business-friendly workspace in select rooms.",            tag:"Business",     icon:I.desk },
  { k:"shower", t:"Hot & Cold Shower",       d:"Modern fittings, quality toiletries.",                    tag:"Wellness",     icon:I.shower },
  { k:"shield", t:"24×7 Security",           d:"CCTV coverage & secure entry.",                           tag:"Safety",       icon:I.shield },
  { k:"car",    t:"Airport Transfers",       d:"Paid pickup/drop — easy city access.",                    tag:"On request",   icon:I.car },
];
const EXTRA = {
  grand: [{ k:"spacious", t:"Spacious Layouts", d:"Bigger floor plans for families & long stays.", tag:"Grand", icon:I.bed }],
};

/* ───────── Helpers ───────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.setAttribute("data-revealed","true"); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return ref;
}
const BRAND_GRAD = "from-[#6A00FF] via-[#8a2bff] to-[#FF2EA8]";

/* ───────── UI bits ───────── */
function Pill({ active, children, ...rest }) {
  return (
    <button
      {...rest}
      className={[
        "relative rounded-full px-4 py-2 text-sm transition focus:outline-none focus-visible:ring-2",
        active
          ? "bg-slate-900 text-white ring-slate-400"
          : "bg-white/80 ring-1 ring-slate-200 text-slate-700 hover:bg-white"
      ].join(" ")}
    >
      {children}
      {active && (
        <span className={`pointer-events-none absolute left-3 right-3 -bottom-[3px] h-[2px] bg-gradient-to-r ${BRAND_GRAD} rounded`} />
      )}
    </button>
  );
}

function Card({ icon:Icon, t, d, tag }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    const rx = ((r.height/2 - y)/r.height) * 6;
    const ry = ((x - r.width/2)/r.width) * 8;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `-1000px`);
    el.style.setProperty("--my", `-1000px`);
  };

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur
                 shadow-[0_8px_30px_rgba(0,0,0,.06)] transition will-change-transform
                 hover:shadow-[0_16px_50px_rgba(0,0,0,.16)]"
      style={{ transform:"perspective(900px) rotateX(var(--rx,0)) rotateY(var(--ry,0)) translateZ(0)" }}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition"
        style={{ background:"radial-gradient(180px_180px_at_var(--mx)_var(--my),rgba(138,43,255,.14),transparent_60%)" }}
      />
      <span className="pointer-events-none absolute -z-10 inset-0 rounded-[20px] bg-gradient-to-br from-indigo-500/20 via-fuchsia-400/20 to-sky-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition" />
      <span className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${BRAND_GRAD}`} />
      <div className="p-5 md:p-6 flex items-start gap-4">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100 overflow-hidden">
          <Icon className="h-6 w-6 text-indigo-600" />
          <span className="pointer-events-none absolute -inset-4 translate-x-[-120%] rotate-12 bg-white/40 mix-blend-overlay group-hover:translate-x-[120%] transition-transform duration-700" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base md:text-lg font-semibold text-slate-900">{t}</h3>
          <p className="mt-1 text-sm md:text-[15px] text-slate-600" style={{ textAlign:"justify", textJustify:"inter-word" }}>{d}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white">{tag}</span>
            <span className="inline-block h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-[11px] text-slate-500">Tourist Inn Group</span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ───────── Section ───────── */
export default function Facilities() {
  const revealRef = useReveal();
  const [property, setProperty] = useState("tour-inn");

  const facilities = useMemo(
    () => (property === "grand" ? [...CORE, ...EXTRA.grand] : CORE),
    [property]
  );

  const jsonLd = useMemo(() => ({
    "@context":"https://schema.org",
    "@type":"LodgingBusiness",
    name:"Tourist Inn Group Maldives",
    brand:"Tourist Inn",
    address:{ "@type":"PostalAddress", streetAddress:"Ma. Leaves, Maaveyo Goalhi", addressLocality:"Malé", addressCountry:"MV" },
    telephone:"+9607860882",
    email:"info@touristinnmaldives.com",
    image: [], // gallery removed
    amenityFeature: facilities.map(i => ({ "@type":"LocationFeatureSpecification", name:i.t, value:true, description:i.d }))
  }), [facilities]);

  const propHref = property === "grand" ? "/tourist-inn-grand" : property === "tourist-inn" ? "/tourist-inn" : "/tour-inn";

  return (
    <section id="facilities" aria-label="Our Facilities" className="relative scroll-mt-24 bg-white">
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-12 h-80 w-[95vw] -translate-x-1/2 rounded-[100%] bg-indigo-100/45 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-6%] h-64 w-64 rounded-full bg-fuchsia-100/40 blur-2xl" />
        <div className="absolute inset-0 opacity-[0.12] [background:radial-gradient(1100px_420px_at_50%_0%,rgba(99,102,241,.25),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent [mask-image:linear-gradient(90deg,transparent,black,transparent)] animate-[beam_6s_linear_infinite]" />
      </div>

      <SEO jsonLd={jsonLd} />

      <div
        ref={revealRef}
        data-revealed="false"
        className="mx-auto w-full max-w-[1180px] px-4 md:px-6 py-16 md:py-20 opacity-0 translate-y-2 transition-[opacity,transform] duration-700 ease-out"
      >
        {/* Header */}
        <header className="mb-8 md:mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] md:text-[13px] font-semibold tracking-[0.12em] uppercase ring-2 ring-slate-200 bg-white shadow-sm">
            <span className={`inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-r ${BRAND_GRAD}`} />
            <span className="text-slate-700">Guest Comfort &amp; Essentials</span>
          </div>

          <h1 className="mt-3 text-[48px] md:text-[64px] lg:text-[78px] leading-[1.05] font-extrabold tracking-tight text-slate-900 font-serif">
            Our Facilities
          </h1>

          <h2 className="mt-2 text-[20px] md:text-[26px] lg:text-[30px] font-semibold text-slate-800">
            Premium comfort, smart essentials
          </h2>

          <p className="mt-3 max-w-2xl mx-auto text-slate-600" style={{ textAlign:"justify", textJustify:"inter-word" }}>
            Choose a property to see the exact amenities available. Same clean look, no gallery.
          </p>
        </header>

        {/* Property selector */}
        <nav aria-label="Choose property" className="mb-8 flex flex-wrap justify-center gap-2">
          <Pill active={property==="tour-inn"}     onClick={() => setProperty("tour-inn")}>Tour Inn</Pill>
          <Pill active={property==="tourist-inn"}  onClick={() => setProperty("tourist-inn")}>Tourist Inn</Pill>
          <Pill active={property==="grand"}        onClick={() => setProperty("grand")}>Tourist Inn Grand</Pill>
        </nav>

        {/* Facilities only (full width) */}
        <div className="max-w-3xl mx-auto">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
              {(property === "tour-inn" ? "Tour Inn" : property === "tourist-inn" ? "Tourist Inn" : "Tourist Inn Grand")} — Facilities
            </h3>
            <a href={propHref} className="text-sm font-semibold text-violet-700 hover:text-violet-900">
              View property →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {(property === "grand" ? [...CORE, ...EXTRA.grand] : CORE).map(f => (
              <Card key={f.k} icon={f.icon} t={f.t} d={f.d} tag={f.tag} />
            ))}
          </div>

          <div className="mt-8 relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur px-5 py-5 shadow-sm">
            <span className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${BRAND_GRAD}`} />
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
              <p className="text-center md:text-left text-slate-800 text-sm md:text-[15px]" style={{ textAlign:"justify", textJustify:"inter-word" }}>
                Need airport pickup, early check-in or a custom long-stay quote?
              </p>
              <a href="/contact" className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white ring-1 ring-white/20 relative overflow-hidden">
                <span className={`absolute inset-0 bg-gradient-to-r ${BRAND_GRAD}`} />
                <span className="relative">Contact Concierge</span>
              </a>
            </div>
          </div>

          <div className="mt-10 md:mt-12 flex items-center gap-3 text-xs text-slate-500" style={{ textAlign:"justify", textJustify:"inter-word" }}>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            Complimentary items are marked “Free”. Airport transfer & breakfast are on request.
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>
        </div>
      </div>

      <style>{`
        #facilities [data-revealed="true"]{opacity:1;transform:translateY(0)}
        @keyframes beam { 0%{transform:translateX(-30%)} 100%{transform:translateX(30%)} }
      `}</style>
    </section>
  );
}
