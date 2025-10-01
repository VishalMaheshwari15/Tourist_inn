// src/components/Newsletter.jsx
export default function Newsletter() {
  return (
    <section className="relative py-12 md:py-16">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6">
        <div className="rounded-3xl bg-white/80 backdrop-blur ring-1 ring-slate-200 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <p className="text-[11px] tracking-[0.2em] uppercase text-slate-500">
              Never miss a great offer
            </p>
            <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">
              Join our short, weekly email
            </h3>
            <p className="mt-2 text-slate-600">
              Unsubscribe anytime. We’ll use your info per our privacy policy.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full md:w-auto flex gap-2"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full md:w-72 rounded-full px-4 py-2 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6A00FF]/40"
            />
            <button className="shrink-0 rounded-full px-5 py-2 font-semibold text-white bg-gradient-to-r from-[#6A00FF] to-[#FF2EA8]">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
