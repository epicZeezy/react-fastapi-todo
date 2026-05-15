import ShapeShopLogoMark from "@/components/ShapeShopLogoMark";
import ShapePicker from "@/components/ShapePicker";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative isolate overflow-hidden border-b border-slate-200/80 bg-white/90 shadow-[0_1px_0_0_rgb(255_255_255_/_0.8)_inset] backdrop-blur-[2px]">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          aria-hidden
        >
          <div className="absolute -left-32 top-0 h-72 w-72 animate-float-soft rounded-full bg-shape-circle-from/30 blur-3xl" />
          <div className="absolute right-0 top-24 h-80 w-80 animate-float-soft rounded-full bg-shape-hexagon-to/25 blur-3xl [animation-delay:-2.5s]" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 animate-float-soft rounded-full bg-shape-square-from/20 blur-3xl [animation-delay:-1.2s]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="animate-fade-in-up mb-5 flex flex-wrap items-center gap-3 sm:mb-6 sm:gap-4 [animation-delay:0.02s]">
            <ShapeShopLogoMark variant="hero" gradientId="ss-logo-grad-hero" />
            <p className="min-w-0 text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">
              What Shapes Your Life?
            </p>
          </div>
          <p className="animate-fade-in-up mb-4 inline-flex items-center rounded-full border border-slate-200/90 bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-600 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md [animation-delay:0.05s]">
            Shape-first shopping
          </p>
          <h1 className="animate-fade-in-up max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl [animation-delay:0.08s]">
            Shop the universe of{" "}
            <span className="animate-gradient-shift bg-gradient-to-r from-shape-circle-from via-shape-hexagon-from to-shape-square-to bg-[length:200%_auto] bg-clip-text text-transparent">
              forms that fit your life
            </span>
            .
          </h1>
          <p className="animate-fade-in-up mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl [animation-delay:0.14s]">
            ShapeShop turns geometry into discovery: pick a base shape, spin it
            in 3D, and browse products matched to your path—from sphere to
            basketball, cone to megaphone, and beyond.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <ShapePicker />
      </section>
    </main>
  );
}
