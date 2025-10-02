// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import PropertyGallery from "./components/PropertyGallery";
import TouristInnGallery from "./pages/TouristInnGallery";   // Tourist Inn
import TourInnGallery from "./pages/TourInnGallery";         // Tour Inn
import TouristInnGrand from "./pages/TouristInnGrand";       // Tourist Inn Grand

// NEW: legal & info pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Refunds from "./pages/Refunds";
import Services from "./pages/Services";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

// Smooth scroll to #hash targets (works after navigation)
function ScrollToHash() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    tryScroll();
    const t = setTimeout(tryScroll, 60);
    return () => clearTimeout(t);
  }, [hash, pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollToHash />
      <Header />

      <main className="min-h-[60vh]">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* ORDER MATTERS */}
          <Route path="/tour-inn" element={<TourInnGallery />} />
          <Route path="/tourist-inn-grand" element={<TouristInnGrand />} />
          <Route path="/tourist-inn" element={<TouristInnGallery />} />

          {/* Generic slug (if you need it) */}
          <Route path="/property/:slug" element={<PropertyGallery />} />

          {/* Legal / Info */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/services" element={<Services />} />

          {/* 404 → Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
