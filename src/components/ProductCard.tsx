import { getShapeByName } from "@/data/shapes";
import { formatPrice } from "@/lib/utils";
import type { Product, ShapeName } from "@/types";
import ShapeNowButton from "./ShapeNowButton";

const gradientBarClass: Record<ShapeName, string> = {
  circle: "from-shape-circle-from to-shape-circle-to",
  square: "from-shape-square-from to-shape-square-to",
  triangle: "from-shape-triangle-from to-shape-triangle-to",
  rectangle: "from-shape-rectangle-from to-shape-rectangle-to",
  hexagon: "from-shape-hexagon-from to-shape-hexagon-to",
};

const softTintClass: Record<ShapeName, string> = {
  circle: "bg-pink-50/50",
  square: "bg-sky-50/50",
  triangle: "bg-amber-50/50",
  rectangle: "bg-emerald-50/50",
  hexagon: "bg-violet-50/50",
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const shape = getShapeByName(product.baseShape);
  const baseLabel = shape?.displayName ?? product.baseShape;
  const shapePath = `${baseLabel} → ${product.expandedShape} → ${product.name}`;

  return (
    <article
      className={[
        "flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/5 transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-md",
      ].join(" ")}
    >
      {/* Future: load product + inventory from Amplify Data (`generateClient`) instead of static `products`. */}
      <div
        className={[
          "h-1.5 w-full bg-gradient-to-r",
          gradientBarClass[product.baseShape],
        ].join(" ")}
        aria-hidden
      />

      <div className={["relative flex flex-1 flex-col p-5", softTintClass[product.baseShape]].join(" ")}>
        <div className="mb-4 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote placeholder host; configure `images.remotePatterns` to switch to `next/image`. */}
          <img
            src={product.imageUrl}
            alt=""
            className="aspect-[4/3] h-auto w-full object-cover"
            loading="lazy"
          />
        </div>

        <nav
          className="mb-3 text-xs font-medium text-slate-500"
          aria-label="Shape path"
        >
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <li className="text-slate-700">{baseLabel}</li>
            <li aria-hidden className="text-slate-400">
              →
            </li>
            <li className="text-slate-700">{product.expandedShape}</li>
            <li aria-hidden className="text-slate-400">
              →
            </li>
            <li className="font-semibold text-slate-900">{product.name}</li>
          </ol>
        </nav>

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            {product.name}
          </h2>
          <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200/80">
            {product.category}
          </span>
        </div>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">
          {product.reason}
        </p>

        <p className="mb-3 text-lg font-semibold text-slate-900">
          {formatPrice(product.price)}
        </p>

        <ShapeNowButton
          productId={product.id}
          productName={product.name}
          shapePath={shapePath}
          accentShape={product.baseShape}
        />
      </div>
    </article>
  );
}
