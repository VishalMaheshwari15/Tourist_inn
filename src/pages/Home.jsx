// src/pages/Home.jsx — Properties + Reviews anchor (#reviews)
import "../index.css";
import HeroPro from "../components/HeroPro";
import PropertiesGrid from "../components/PropertiesGrid";
import ReviewsStrip from "../components/ReviewsStrip";
import About from "../components/About";
import Facilities from "../components/Facilities";

// demo images — swap with real photos
import tourInn from "../assets/TourInn.png";
import touristInn from "../assets/TouristInn.jpg";
import grand from "../assets/TouristInnGrand.png";

export default function Home() {
  // ORDER: 1) Tourist Inn  2) Tour Inn  3) Tourist Inn Grand
  const slides = [
    // 1) Tourist Inn
    {
      src: touristInn,
      alt: "Tourist Inn — modern rooms in Malé",
      eyebrow: "Tourist Inn",
      title: "Your City Address in Malé",
      subtitle: "Perfect for business, locals, and expats.",
      // neutral CTAs only
      cta1: { label: "Explore Rooms", href: "/tourist-inn" },
      cta2: { label: "See Guesthouses", href: "/#properties" },
    },
    // 2) Tour Inn
    {
      src: tourInn,
      alt: "Tour Inn — premium guesthouse in Malé",
      eyebrow: "Tour Inn",
      title: "Urban Comfort in Malé",
      subtitle: "Quiet stays • modern amenities • city convenience.",
      cta1: { label: "Explore Rooms", href: "/tour-inn" },
      cta2: { label: "View Gallery", href: "/#gallery" },
    },
    // 3) Tourist Inn Grand
    {
      src: grand,
      alt: "Tourist Inn Grand — spacious rooms",
      eyebrow: "Tourist Inn Grand",
      title: "Spacious • Contemporary",
      subtitle: "Refined amenities. Central location.",
      cta1: { label: "View Suites", href: "/tourist-inn-grand" },
      cta2: { label: "See Guesthouses", href: "/#properties" },
    },
  ];

  const brandBg =
    "bg-[radial-gradient(120%_100%_at_50%_-10%,rgba(106,0,255,.05),rgba(255,46,168,.04),transparent)]";

  return (
    <div className="min-h-screen flex flex-col text-slate-800 overflow-x-hidden">
      {/* Whole-banner click disabled via bannerHref={null}; CTAs are already neutral */}
      <HeroPro slides={slides} fit="cover" height="h-[92vh]" bannerHref={null} />

      <main className={brandBg}>
        {/* Properties */}
        <Section id="properties">
          <PropertiesGrid />
        </Section>

        {/* About */}
        <About />

        {/* Facilities */}
        <Facilities />

        {/* Reviews — anchor so /#reviews lands here */}
        <Section id="reviews">
          <ReviewsStrip />
        </Section>
      </main>
    </div>
  );
}

/* ----------------------------------------------- */
function Section({ children, muted = false, id, last = false }) {
  return (
    <section id={id} className={`${muted ? "bg-white/60" : "bg-transparent"}`}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-200/60 to-transparent" />
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-12 md:py-16">{children}</div>
      {!last && (
        <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-200/60 to-transparent" />
      )}
    </section>
  );
}
