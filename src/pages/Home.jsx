// src/pages/Home.jsx — Premium Flow + Reviews (smooth, luxe)
import "../index.css";
import HeroPro from "../components/HeroPro";
import FeaturedStay from "../components/FeaturedStay";
import DiningStrip from "../components/DiningStrip";
import PropertiesGrid from "../components/PropertiesGrid";
import OffersStrip from "../components/OffersStrip";
import Newsletter from "../components/Newsletter";
import ReviewsStrip from "../components/ReviewsStrip";
import About from "../components/About"; // ✅ Added

// demo images — swap with real photos
import tourInn from "../assets/TourInn.png";
import touristInn from "../assets/TouristInn.jpg";
import grand from "../assets/TouristInnGrand.png";

export default function Home() {
  const slides = [
    {
      src: tourInn,
      alt: "Tour Inn — premium guesthouse in Malé",
      eyebrow: "Tour Inn",
      title: "Urban Comfort in Malé",
      subtitle: "Quiet stays • modern amenities • city convenience.",
      cta1: { label: "Explore Rooms", href: "/tour-inn" },
      cta2: { label: "Book Now", href: "/property/tour-inn" },
    },
    {
      src: touristInn,
      alt: "Tourist Inn — modern rooms in Malé",
      eyebrow: "Tourist Inn",
      title: "Your City Address in Malé",
      subtitle: "Perfect for business, locals, and expats.",
      cta1: { label: "See Guesthouses", href: "/#properties" },
      cta2: { label: "Book Now", href: "/property/tourist-inn" },
    },
    {
      src: grand,
      alt: "Tourist Inn Grand — spacious rooms",
      eyebrow: "Tourist Inn Grand",
      title: "Spacious • Contemporary",
      subtitle: "Refined amenities. Central location.",
      cta1: { label: "View Suites", href: "/tourist-inn-grand" },
      cta2: { label: "Book Grand", href: "/property/grand" },
    },
  ];

  const brandBg =
    "bg-[radial-gradient(120%_100%_at_50%_-10%,rgba(106,0,255,.05),rgba(255,46,168,.04),transparent)]";

  return (
    <div className="min-h-screen flex flex-col text-slate-800 overflow-x-hidden">
      {/* HERO */}
      <HeroPro slides={slides} fit="cover" height="h-[92vh]" />

      {/* MAIN FLOW */}
      <main className={brandBg}>
        {/* Featured Stay */}
        <Section>
          <FeaturedStay />
        </Section>

        {/* About Us (standalone, no extra wrapper to avoid nested <section>) */}
        <About />

        {/* Dining strip */}
        <Section muted>
          <DiningStrip />
        </Section>

        {/* Properties */}
        <Section id="properties">
          <PropertiesGrid />
        </Section>

        {/* Offers */}
        <Section muted>
          <OffersStrip />
        </Section>

        {/* Reviews with smooth autoplay + swipe */}
        <Section>
          <ReviewsStrip />
        </Section>

        {/* Newsletter */}
        <Section muted last>
          <Newsletter />
        </Section>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------
   Lightweight section wrapper for consistent breathing space
------------------------------------------------------------- */
function Section({ children, muted = false, id, last = false }) {
  return (
    <section id={id} className={`${muted ? "bg-white/60" : "bg-transparent"}`}>
      {/* top hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-200/60 to-transparent" />
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-12 md:py-16">
        {children}
      </div>
      {/* bottom hairline (skip on last to avoid double with footer) */}
      {!last && (
        <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-200/60 to-transparent" />
      )}
    </section>
  );
}
