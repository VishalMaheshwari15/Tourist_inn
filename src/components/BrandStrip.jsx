export default function BrandStrip() {
  return (
    <section aria-label="Highlights" className="relative isolate bg-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(183,140,255,.10),rgba(255,181,230,.08),transparent)]" />
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-700">
          <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" /> Central Malé</span>
          <span className="opacity-30">•</span>
          <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-violet-500" /> Urban Guesthouses</span>
          <span className="opacity-30">•</span>
          <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-400" /> Free Wi-Fi</span>
          <span className="opacity-30">•</span>
          <a href="tel:+9607860882" className="font-medium hover:underline">Booking +960&nbsp;786&nbsp;0882</a>
        </div>
      </div>
    </section>
  );
}
