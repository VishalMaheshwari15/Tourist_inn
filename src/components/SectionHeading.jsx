export default function SectionHeading({ eyebrow, title, sub }) {
  return (
    <header className="max-w-3xl">
      {eyebrow && (
        <p className="text-xs md:text-sm font-semibold tracking-[0.22em] uppercase text-fuchsia-400">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
      )}
      {sub && <p className="mt-3 text-slate-600">{sub}</p>}
    </header>
  );
}
