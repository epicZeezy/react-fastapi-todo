"use client";

import Link from "next/link";
import { shapes } from "@/data/shapes";
import { useAppState } from "@/lib/context";
import type { ShapeName } from "@/types";
import ShapeHero from "./ShapeHero";

const gradientHeadingClass: Record<ShapeName, string> = {
  circle: "from-shape-circle-from to-shape-circle-to",
  square: "from-shape-square-from to-shape-square-to",
  triangle: "from-shape-triangle-from to-shape-triangle-to",
  rectangle: "from-shape-rectangle-from to-shape-rectangle-to",
  hexagon: "from-shape-hexagon-from to-shape-hexagon-to",
};

const heroTintClass: Record<ShapeName, string> = {
  circle: "bg-pink-50/60",
  square: "bg-sky-50/60",
  triangle: "bg-amber-50/60",
  rectangle: "bg-emerald-50/60",
  hexagon: "bg-violet-50/60",
};

const hoverGlowClass: Record<ShapeName, string> = {
  circle:
    "hover:shadow-[0_20px_50px_-12px_rgba(236,72,153,0.45)] focus-visible:shadow-[0_20px_50px_-12px_rgba(236,72,153,0.45)]",
  square:
    "hover:shadow-[0_20px_50px_-12px_rgba(14,165,233,0.45)] focus-visible:shadow-[0_20px_50px_-12px_rgba(14,165,233,0.45)]",
  triangle:
    "hover:shadow-[0_20px_50px_-12px_rgba(249,115,22,0.45)] focus-visible:shadow-[0_20px_50px_-12px_rgba(249,115,22,0.45)]",
  rectangle:
    "hover:shadow-[0_20px_50px_-12px_rgba(34,197,94,0.45)] focus-visible:shadow-[0_20px_50px_-12px_rgba(34,197,94,0.45)]",
  hexagon:
    "hover:shadow-[0_20px_50px_-12px_rgba(99,102,241,0.45)] focus-visible:shadow-[0_20px_50px_-12px_rgba(99,102,241,0.45)]",
};

export default function ShapePicker() {
  const { setShape } = useAppState();

  return (
    <section
      className="w-full"
      aria-labelledby="shape-picker-heading"
    >
      <div className="mb-8 flex flex-col gap-2 sm:mb-10">
        <h2
          id="shape-picker-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          Pick your starting shape
        </h2>
        <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
          Each geometry unlocks its own 3D transformations and a curated shelf
          of products. Tap a card to explore.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {shapes.map((shape) => (
          <li key={shape.id} className="min-w-0">
            <Link
              href={`/explore?shape=${shape.name}`}
              onClick={() => setShape(shape.name)}
              className={[
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300",
                "hover:-translate-y-1 hover:scale-[1.02] hover:border-transparent",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
                hoverGlowClass[shape.name],
              ].join(" ")}
            >
              <div
                className={[
                  "pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r opacity-90 transition-opacity duration-300 group-hover:opacity-100",
                  gradientHeadingClass[shape.name],
                ].join(" ")}
                aria-hidden
              />

              <div
                className={[
                  "relative mb-4 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 shadow-inner",
                  heroTintClass[shape.name],
                ].join(" ")}
              >
                <ShapeHero
                  shape={shape.name}
                  className="h-3/4 w-3/4 drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-slate-500 shadow-sm ring-1 ring-slate-200/70 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                  Explore
                </span>
              </div>

              <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                {shape.displayName}
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                {shape.description}
              </p>

              <p className="mt-4 text-sm font-medium text-slate-500 transition-colors group-hover:text-slate-900">
                Open in 3D explorer →
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
