// src/components/WhatsAppFAB.jsx
import React from "react";

const WA_NUMBER = "9607860882";
const msg = encodeURIComponent("Hello! Please share availability & rates.");
const href = `https://wa.me/${WA_NUMBER}?text=${msg}`;

export default function WhatsAppFAB() {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[100] group"
    >
      <div className="relative h-14 w-14 grid place-items-center rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] shadow-xl ring-1 ring-black/10">
        <svg viewBox="0 0 32 32" className="h-7 w-7 text-white">
          <path fill="currentColor" d="M19.1 17.3c-.3-.2-1.7-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a8 8 0 0 1-3.9-3.4c-.3-.6.3-.6.8-1.8.1-.2 0-.4 0-.5l-.9-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.7s1.1 3.1 1.3 3.3 2.2 3.4 5.4 4.8c2 .8 2.8.9 3.8.8.6-.1 1.7-.7 1.9-1.3s.2-1.1.1-1.3-.3-.2-.6-.4zM16 3a13 13 0 0 0-11 19.9L4 29l6.3-1.7A13 13 0 1 0 16 3zm0 24a11 11 0 0 1-5.6-1.5l-.4-.2-3.7 1 1-3.6-.2-.3A11 11 0 1 1 16 27z"/>
        </svg>
        <span className="pointer-events-none absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 animate-ping bg-[#25D366]/30"></span>
      </div>
    </a>
  );
}
