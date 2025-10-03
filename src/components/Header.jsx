// src/components/Header.jsx — Fixed header + Mobile menu (Home -> scroll to Hero)
import { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const WA = (t = "Hello! I'd like to book. Please share availability & rates.") =>
  `https://wa.me/9607860882?text=${encodeURIComponent(t)}`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [raised, setRaised] = useState(false);
  const menuId = useId();
  const loc = useLocation();

  // Lock page scroll when mobile menu is open (iOS-friendly)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (open) {
      html.classList.add("overflow-hidden");
      body.classList.add("overflow-hidden");
    } else {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
    }
    return () => {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
    };
  }, [open]);

  // Add subtle elevation on scroll
  useEffect(() => {
    const onScroll = () => setRaised(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brandGrad = "from-[#6A00FF] to-[#FF2EA8]";

  // NOTE: Home points to /#top so we can land on hero
  const nav = [
    { name: "Home", href: "/#top" },
    { name: "About", href: "/#about" },
    { name: "Properties", href: "/#properties" },
    { name: "Reviews", href: "/#reviews" },
  ];

  // MOBILE MENU PROPERTIES ORDER:
  // Tourist Inn → Tour Inn → Tourist Inn Grand
  const properties = [
    { name: "Tourist Inn", href: "/tourist-inn" },
    { name: "Tour Inn", href: "/tour-inn" },
    { name: "Tourist Inn Grand", href: "/tourist-inn-grand" },
  ];

  const linkBase =
    "relative px-3 py-2 text-[15px] rounded-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40";
  const linkColor = "text-slate-700 hover:text-slate-900";

  // Smooth scroll to hero/top when already on Home
  const goHomeSmooth = (e) => {
    // if already on the homepage route
    if (loc.pathname === "/") {
      e.preventDefault();
      // try an element with id="top" (recommended), else scroll to window top
      const el = document.getElementById("top");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      setOpen(false);
    }
    // if not on home, allow navigation to /#top naturally
  };

  return (
    <>
      {/* FIXED header */}
      <header
        className={[
          "fixed top-0 left-0 right-0 z-[70]",
          "bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75",
          "border-b border-slate-200",
          raised ? "shadow-sm" : "shadow-none",
          "transition-shadow",
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-[1180px] px-4 md:px-6">
          <div className="h-16 md:h-[76px] grid grid-cols-[auto_1fr_auto] items-center gap-3">
            {/* logo (acts like Home) */}
            {/* Use a normal <a> so hash works; intercept if already on home */}
            <a
              href="/#top"
              aria-label="Home"
              className="inline-flex items-center shrink-0"
              onClick={goHomeSmooth}
            >
              <img
                src={logo}
                alt="Tourist Inn"
                className="h-10 w-auto select-none"
                draggable="false"
                decoding="async"
              />
            </a>

            {/* center nav (desktop) */}
            <nav className="hidden md:flex justify-center items-center gap-1">
              {nav.map((item) =>
                item.href.startsWith("/#") ? (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={item.name === "Home" ? goHomeSmooth : undefined}
                    className={`${linkBase} ${linkColor} group`}
                  >
                    <span className="relative">
                      {item.name}
                      <span className="absolute -right-2 -top-1 h-1 w-1 rounded-full bg-slate-800/70 opacity-0 group-hover:opacity-100" />
                    </span>
                    <span className="pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] origin-left bg-gradient-to-r from-slate-400 to-slate-800/80 transition-transform duration-200 ease-out group-hover:scale-x-100 scale-x-0" />
                  </a>
                ) : (
                  <Link key={item.name} to={item.href} className={`${linkBase} ${linkColor} group`}>
                    <span className="relative">
                      {item.name}
                      <span className="absolute -right-2 -top-1 h-1 w-1 rounded-full bg-slate-800/70 opacity-0 group-hover:opacity-100" />
                    </span>
                    <span className="pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] origin-left bg-gradient-to-r from-slate-400 to-slate-800/80 transition-transform duration-200 ease-out group-hover:scale-x-100 scale-x-0" />
                  </Link>
                )
              )}
            </nav>

            {/* right side */}
            <div className="flex items-center gap-2 justify-self-end">
              {/* Book Now (desktop → WhatsApp) */}
              <a
                href={WA("Booking inquiry — dates/guests")}
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#6A00FF] to-[#FF2EA8] hover:opacity-95 active:scale-[0.98] shadow-[0_6px_18px_-6px_rgba(106,0,255,.45)] transition"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M20.5 3.5A11 11 0 0 0 3.2 17.9L2 22l4.2-1.1A11 11 0 1 0 20.5 3.5Zm-8.3 2.6a7.1 7.1 0 0 1 7 7.1 7.1 7.1 0 0 1-10.6 6l-.3-.2-2.5.7.7-2.4-.2-.3a7.1 7.1 0 0 1 5.9-10.9Zm3.6 3.5c-.1-.2-.3-.2-.5-.2h-.4c-.1 0-.4.1-.6.4-.2.3-.8 1-.8 2.4 0 1.4 1 2.7 1.1 2.9.1.2 2 3.2 4.9 4.4.4.2.8.3 1 .2.3-.1 1-.4 1.1-.8.1-.4.1-.8.1-.8s0-.3-.2-.4-.5-.2-1-.4c-.6-.2-1.8-.6-2.1-.7-.3-.1-.5 0-.7.2-.2.3-.8.8-.9 1-.1.2-.3.2-.5.1-.2-.1-.8-.3-1.5-.9-.6-.5-1-1.1-1.1-1.3-.1-.2 0-.3.1-.5.2-.2.3-.4.4-.6.1-.2.1-.4 0-.6-.1-.2-.6-1.5-.8-2.1Z" />
                </svg>
                Book Now
              </a>

              {/* Mobile menu button */}
              <button
                type="button"
                aria-controls={menuId}
                aria-expanded={open}
                onClick={() => setOpen(true)}
                className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition"
              >
                <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
                  <path d="M1 1h20M1 8h20M1 15h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span className="sr-only">Open menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* spacer so content doesn't hide under fixed header */}
      <div className="h-16 md:h-[76px]" aria-hidden />

      {/* Mobile Overlay menu */}
      {open && (
        <>
          {/* dark veil */}
          <div
            className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          {/* panel */}
          <div
            id={menuId}
            className="fixed inset-0 z-[1000] flex flex-col md:hidden"
            role="dialog"
            aria-label="Main menu"
          >
            <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_-10%,rgba(14,9,25,.97),rgba(14,9,25,.94))]" />
            <div className={`absolute inset-0 opacity-[.18] bg-gradient-to-b ${brandGrad}`} />

            <div className="relative mx-auto w-full max-w-[1180px] px-4 md:px-6 pt-6 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 text-white/90 hover:bg-white/10"
                aria-label="Close menu"
                autoFocus
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center px-6">
              <nav className="w-full max-w-[880px] text-center">
                <ul className="space-y-4 md:space-y-5">
                  {nav.map((l) => (
                    <li key={l.name}>
                      <a
                        href={l.href}
                        onClick={(e) => {
                          if (l.name === "Home") goHomeSmooth(e);
                          else setOpen(false);
                        }}
                        className="inline-block text-3xl sm:text-4xl font-semibold tracking-wide text-white hover:text-white/80 transition"
                      >
                        {l.name}
                      </a>
                    </li>
                  ))}

                  <li className="pt-4">
                    <div className={`mx-auto mb-3 h-px max-w-[620px] bg-gradient-to-r ${brandGrad} opacity-40`} />
                    <div className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-[#BD9CFF] to-[#FF79CF] bg-clip-text text-transparent">
                      Properties
                    </div>
                    <ul className="mt-4 space-y-2">
                      {properties.map((p) => (
                        <li key={p.name}>
                          <Link
                            to={p.href}
                            onClick={() => setOpen(false)}
                            className="inline-block rounded-xl px-4 py-2 text-lg text-white/90 hover:bg-white/10"
                          >
                            {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>

                <div className="mt-10 flex flex-col items-center gap-3 text-white/90">
                  <a
                    href={WA("Booking inquiry — via mobile menu")}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-slate-900 font-semibold bg-white hover:bg-white/95 active:scale-[0.98] transition"
                  >
                    Book on WhatsApp
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
