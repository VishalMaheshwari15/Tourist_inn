// src/components/Header.jsx
import { useEffect, useId, useState } from "react";
import logo from "../assets/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const prev = { overflow: document.body.style.overflow, touch: document.body.style.touchAction };
    document.body.style.overflow = open ? "hidden" : prev.overflow;
    document.body.style.touchAction = open ? "none" : prev.touch;
    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.touchAction = prev.touch;
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brandGrad = "from-[#6A00FF] to-[#FF2EA8]";

  // ✅ NO background before scroll (pure transparent)
  const blendTop   = "bg-transparent";
  const blendSolid = "bg-[rgba(14,9,25,.70)] backdrop-blur-md border-b border-white/10";

  const nav = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Properties", href: "/#properties" },
    { name: "Contact", href: "/contact" },
  ];

  const overlayMain = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Properties", href: "/#properties" },
    { name: "Contact", href: "/contact" },
    { name: "Special Offers", href: "/offers" },
  ];

  const properties = [
    { name: "Tour Inn", href: "/tour-inn" },
    { name: "Tourist Inn", href: "/tourist-inn" },
    { name: "Tourist Inn Grand", href: "/grand" },
  ];

  const linkBase =
    "relative px-3 py-2 text-[15px] rounded-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40";
  // small shadow so text stands out on banner
  const linkColor = "text-white/90 hover:text-white drop-shadow-[0_1px_6px_rgba(0,0,0,.45)]";

  return (
    <>
      {/* subtle hairline; very low opacity */}
      <div className={`fixed top-0 left-0 right-0 z-[70] h-[2px] bg-gradient-to-r ${brandGrad} opacity-20`} />

      <header
        className={[
          "fixed top-0 left-0 w-full z-[69] transition-colors duration-300",
          solid ? blendSolid : blendTop,
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-[1180px] px-4 md:px-6">
          <div className="h-16 md:h-[76px] grid grid-cols-[auto_1fr_auto] items-center gap-3">
            {/* LOGO — no bg behind it */}
            <a href="/" aria-label="Home" className="inline-flex items-center shrink-0">
              <img
                src={logo}
                alt="Tourist Inn"
                className="h-10 w-auto select-none"
                draggable="false"
                decoding="async"
                // If your source PNG has white box, you can try this:
                // className="h-10 w-auto select-none mix-blend-multiply"
              />
            </a>

            {/* center nav */}
            <nav className="hidden md:flex justify-center items-center gap-1">
              {nav.map((item) => (
                <a key={item.name} href={item.href} className={`${linkBase} ${linkColor} group`}>
                  <span className="relative">
                    {item.name}
                    <span className="absolute -right-2 -top-1 h-1 w-1 rounded-full bg-white/80 opacity-0 group-hover:opacity-100" />
                  </span>
                  <span className="pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] origin-left bg-white/70 transition-transform duration-200 ease-out group-hover:scale-x-100 scale-x-0" />
                </a>
              ))}
            </nav>

            {/* right side */}
            <div className="flex items-center gap-2 justify-self-end">
              <a
                href="tel:+9607860882"
                className="hidden md:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 border border-white/20 drop-shadow-[0_1px_6px_rgba(0,0,0,.45)]"
              >
                Booking&nbsp;&nbsp;+960&nbsp;786&nbsp;0882
              </a>
              <button
                type="button"
                aria-controls={menuId}
                aria-expanded={open}
                onClick={() => setOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 text-white/90 hover:bg-white/10"
              >
                <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
                  <path d="M1 1h20M1 8h20M1 15h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span className="sr-only">Open menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* bottom hairlines appear only when solid */}
        {solid && (
          <>
            <div className="h-px bg-white/10" />
            <div className={`h-px bg-gradient-to-r ${brandGrad} opacity-30`} />
          </>
        )}
      </header>

      {/* Overlay menu (unchanged logic) */}
      {open && (
        <>
          <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div id={menuId} className="fixed inset-0 z-[90] flex flex-col" role="dialog" aria-label="Main menu">
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
                  {overlayMain.map((l) => (
                    <li key={l.name}>
                      <a
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="inline-block text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide text-white hover:text-white/80 transition"
                      >
                        {l.name}
                      </a>
                    </li>
                  ))}

                  <li className="pt-4">
                    <div className={`mx-auto mb-3 h-px max-w-[620px] bg-gradient-to-r ${brandGrad} opacity-40`} />
                    <div className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-[#BD9CFF] to-[#FF79CF] bg-clip-text text-transparent">
                      Properties
                    </div>
                    <ul className="mt-4 space-y-2">
                      {properties.map((p) => (
                        <li key={p.name}>
                          <a
                            href={p.href}
                            onClick={() => setOpen(false)}
                            className="inline-block rounded-xl px-4 py-2 text-lg text-white/90 hover:bg-white/10"
                          >
                            {p.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>

                <div className="mt-10 flex flex-col items-center gap-3 text-white/80">
                  <a href="tel:+9607860882" className="text-lg hover:underline">
                    Booking +960 786 0882
                  </a>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 hover:bg-white/10"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="3.5" />
                        <circle cx="17.5" cy="6.5" r="1" />
                      </svg>
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 hover:bg-white/10"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                        <path d="M13.5 9H15V6h-1.5C11.57 6 10 7.57 10 9.5V11H8v3h2v6h3v-6h2.1l.4-3H13v-1.2c0-.5.4-.8.9-.8Z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
