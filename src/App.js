// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import PropertyGallery from "./components/PropertyGallery";
import TouristInnGallery from "./pages/TouristInnGallery";   // ✅ Tourist Inn
import TourInnGallery from "./pages/TourInnGallery";         // ✅ Tour Inn
import TouristInnGrand from "./pages/TouristInnGrand";       // ✅ Tourist Inn Grand (NEW)

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      {/* Common header */}
      <Header />

      <main className="min-h-[60vh]">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Explicit property pages (clean URLs) */}
          <Route path="/tourist-inn" element={<TouristInnGallery />} />
          <Route path="/tour-inn" element={<TourInnGallery />} />
          <Route path="/tourist-inn-grand" element={<TouristInnGrand />} /> {/* ✅ NEW */}

          {/* Generic, slug-based gallery (still works) */}
          <Route path="/property/:slug" element={<PropertyGallery />} />

          {/* 404 → Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Common footer */}
      <Footer />
    </BrowserRouter>
  );
}
