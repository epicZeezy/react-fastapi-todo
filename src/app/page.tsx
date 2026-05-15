import ShapePicker from "@/components/ShapePicker";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative isolate overflow-hidden border-b border-slate-200/80 bg-white">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          aria-hidden
        >
          <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-shape-circle-from/30 blur-3xl" />
          <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-shape-hexagon-to/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-shape-square-from/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
          <p className="mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-600 backdrop-blur">
            Shape-first shopping
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Shop the universe of{" "}
            <span className="bg-gradient-to-r from-shape-circle-from via-shape-hexagon-from to-shape-square-to bg-clip-text text-transparent">
              forms that fit your life
            </span>
            .
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            ShapeShop turns geometry into discovery: pick a base shape, spin it
            in 3D, and browse products matched to your path—from sphere to
            basketball, cone to megaphone, and beyond.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <ShapePicker />
      </section>
    </main>
  );
}
