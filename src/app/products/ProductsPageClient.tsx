"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { shapes } from "@/data/shapes";
import {
  filterCatalog,
  products as allProducts,
  resolveTransformFromQuery,
} from "@/data/products";
import { useAppState } from "@/lib/context";
import { transformSlug } from "@/lib/shape-url";
import type { ShapeName } from "@/types";

const VALID_SHAPES: ShapeName[] = [
  "circle",
  "square",
  "triangle",
  "rectangle",
  "hexagon",
];

function parseShapeParam(value: string | null): ShapeName | null {
  if (value && VALID_SHAPES.includes(value as ShapeName)) {
    return value as ShapeName;
  }
  return null;
}

export default function ProductsPageClient() {
  const searchParams = useSearchParams();
  const { setShape, setTransform } = useAppState();

  const shapeFilter = useMemo(
    () => parseShapeParam(searchParams.get("shape")),
    [searchParams],
  );

  const transformParam = searchParams.get("transform");

  const filtered = useMemo(
    () => filterCatalog(allProducts, shapeFilter, transformParam),
    [shapeFilter, transformParam],
  );

  useEffect(() => {
    setShape(shapeFilter);
    if (shapeFilter) {
      setTransform(resolveTransformFromQuery(shapeFilter, transformParam));
    } else {
      setTransform(null);
    }
  }, [shapeFilter, transformParam, setShape, setTransform]);

  const activeShape = shapeFilter
    ? shapes.find((s) => s.name === shapeFilter)
    : null;

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Catalog
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Shape-matched products
          </h1>
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
            Filter by the same base shape and 3D transformation you used in
            the explorer—each card shows the full shape path before you shape
            it.
          </p>
        </div>
        <Link
          href={
            shapeFilter
              ? `/explore?shape=${shapeFilter}${transformParam?.trim() ? `&transform=${encodeURIComponent(transformParam.trim())}` : ""}`
              : "/explore?shape=circle"
          }
          className="inline-flex w-fit items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          Open 3D explorer →
        </Link>
      </div>

      <section aria-labelledby="filter-shape-heading" className="mb-6">
        <h2 id="filter-shape-heading" className="sr-only">
          Filter by base shape
        </h2>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Base shape
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterPill
            href="/products"
            selected={shapeFilter === null}
            label="All shapes"
          />
          {shapes.map((s) => (
            <FilterPill
              key={s.name}
              href={`/products?shape=${s.name}`}
              selected={shapeFilter === s.name}
              label={s.displayName}
            />
          ))}
        </div>
      </section>

      {activeShape ? (
        <section aria-labelledby="filter-transform-heading" className="mb-10">
          <h2 id="filter-transform-heading" className="sr-only">
            Filter by transformation
          </h2>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Transformation ({activeShape.displayName})
          </p>
          <div className="flex flex-wrap gap-2" role="list">
            <FilterPill
              href={`/products?shape=${activeShape.name}`}
              selected={
                !transformParam?.trim() ||
                resolveTransformFromQuery(activeShape.name, transformParam) ===
                  null
              }
              label="All transforms"
            />
            {activeShape.transformsInto.map((t) => {
              const slug = transformSlug(t.name);
              const selected =
                resolveTransformFromQuery(activeShape.name, transformParam) ===
                t.name;
              return (
                <FilterPill
                  key={t.name}
                  href={`/products?shape=${activeShape.name}&transform=${encodeURIComponent(slug)}`}
                  selected={selected}
                  label={t.name}
                />
              );
            })}
          </div>
        </section>
      ) : null}

      <p className="mb-6 text-sm text-slate-600">
        Showing{" "}
        <span className="font-semibold text-slate-900">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "product" : "products"}
        {shapeFilter ? (
          <>
            {" "}
            for{" "}
            <span className="font-medium text-slate-900">
              {activeShape?.displayName ?? shapeFilter}
            </span>
          </>
        ) : null}
        {shapeFilter && transformParam && resolveTransformFromQuery(shapeFilter, transformParam) ? (
          <>
            {" "}
            ·{" "}
            <span className="font-medium text-slate-900">
              {resolveTransformFromQuery(shapeFilter, transformParam)}
            </span>
          </>
        ) : null}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-14 text-center">
          <p className="text-lg font-medium text-slate-800">No matches</p>
          <p className="mt-2 text-sm text-slate-600">
            Try another transformation or browse all shapes.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <li key={product.id} className="min-w-0">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function FilterPill({
  href,
  selected,
  label,
}: {
  href: string;
  selected: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className={[
        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
        selected
          ? "bg-slate-900 text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
