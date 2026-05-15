"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { getShapeByName } from "@/data/shapes";
import { transformSlug } from "@/lib/shape-url";
import { useAppState } from "@/lib/context";
import type { ShapeName } from "@/types";

const ShapeExplorer3DDynamic = dynamic(
  () => import("@/components/ShapeExplorer3D"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(58vh,520px)] min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 text-sm text-slate-400">
        Loading 3D scene…
      </div>
    ),
  },
);

const VALID_SHAPES: ShapeName[] = [
  "circle",
  "square",
  "triangle",
  "rectangle",
  "hexagon",
];

function parseShapeParam(value: string | null): ShapeName {
  if (value && VALID_SHAPES.includes(value as ShapeName)) {
    return value as ShapeName;
  }
  return "circle";
}

function resolveTransformName(
  shapeName: ShapeName,
  transformQuery: string | null,
): string {
  const shape = getShapeByName(shapeName);
  const first = shape?.transformsInto[0]?.name ?? "Sphere";
  if (!shape?.transformsInto.length) return first;
  if (!transformQuery) return shape.transformsInto[0].name;

  const q = transformQuery.trim().toLowerCase();
  const normalized = q.replace(/-/g, " ");
  const match = shape.transformsInto.find(
    (t) =>
      transformSlug(t.name) === q ||
      t.name.toLowerCase() === normalized ||
      t.name.toLowerCase() === q,
  );
  return match?.name ?? shape.transformsInto[0].name;
}

export default function ExplorePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setShape, setTransform } = useAppState();

  const shapeName = useMemo(
    () => parseShapeParam(searchParams.get("shape")),
    [searchParams],
  );

  const activeTransformName = useMemo(
    () => resolveTransformName(shapeName, searchParams.get("transform")),
    [searchParams, shapeName],
  );

  useEffect(() => {
    setShape(shapeName);
    setTransform(activeTransformName);
  }, [shapeName, activeTransformName, setShape, setTransform]);

  const shape = getShapeByName(shapeName);

  const onTransformSelect = useCallback(
    (name: string) => {
      const slug = transformSlug(name);
      router.replace(`/explore?shape=${shapeName}&transform=${slug}`, {
        scroll: false,
      });
    },
    [router, shapeName],
  );

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            3D explorer
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {shape?.displayName ?? "Shapes"} in motion
          </h1>
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
            {shape?.description ??
              "Pick a base shape on the home page, then orbit these solids, switch variants, and jump into matching products."}
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex w-fit items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          ← All shapes
        </Link>
      </div>

      <ShapeExplorer3DDynamic
        shapeName={shapeName}
        activeTransformName={activeTransformName}
        onTransformSelect={onTransformSelect}
      />

      <p className="mt-10 text-center text-xs text-slate-400">
        Tip: URLs like{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
          /explore?shape=hexagon&amp;transform=hexagonal-prism
        </code>{" "}
        deep-link directly into a variant.
      </p>
    </main>
  );
}
