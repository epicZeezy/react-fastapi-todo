"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { shapes } from "@/data/shapes";
import { useAppState } from "@/lib/context";
import type { ShapeName } from "@/types";
import ShapeIcon from "./ShapeIcon";
import WebGLShapeDrawer, {
  type WebGLShapeDrawerHandle,
} from "./WebGLShapeDrawer";
import { formatPrice } from "@/lib/utils";

/** Fixed studio price for user-drawn geometries (cart + checkout). */
const CUSTOM_DRAW_SHAPE_PRICE = 24;
const CUSTOM_ACCENT_SHAPE: ShapeName = "hexagon";

const gradientHeadingClass: Record<ShapeName, string> = {
  circle: "from-shape-circle-from to-shape-circle-to",
  square: "from-shape-square-from to-shape-square-to",
  triangle: "from-shape-triangle-from to-shape-triangle-to",
  rectangle: "from-shape-rectangle-from to-shape-rectangle-to",
  hexagon: "from-shape-hexagon-from to-shape-hexagon-to",
};

const iconToneClass: Record<ShapeName, string> = {
  circle: "text-shape-circle-from",
  square: "text-shape-square-from",
  triangle: "text-shape-triangle-from",
  rectangle: "text-shape-rectangle-from",
  hexagon: "text-shape-hexagon-from",
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

const customDrawGlowClass =
  "hover:shadow-[0_20px_50px_-12px_rgba(168,85,247,0.5)] focus-visible:shadow-[0_20px_50px_-12px_rgba(168,85,247,0.5)]";

const noopSubscribe = () => () => {};

function useClientMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export default function ShapePicker() {
  const { setShape, addToCart, openCart, placeOrder } = useAppState();
  const router = useRouter();
  const [drawOpen, setDrawOpen] = useState(false);
  const mounted = useClientMounted();
  const [drawing, setDrawing] = useState({ strokeCount: 0, pointCount: 0 });
  const [buyBusy, setBuyBusy] = useState(false);
  const drawerRef = useRef<WebGLShapeDrawerHandle | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!drawOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    const raf = requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [drawOpen]);

  const hasValidDrawing =
    drawing.strokeCount > 0 && drawing.pointCount >= 2;

  const buildCartPayload = useCallback(() => {
    const id = `custom-${crypto.randomUUID()}`;
    const productName = "Custom drawn shape";
    const shapePath = `WebGL sketch → ${drawing.strokeCount} stroke${
      drawing.strokeCount === 1 ? "" : "s"
    }, ${drawing.pointCount} points`;
    return {
      productId: id,
      productName,
      shapePath,
      price: CUSTOM_DRAW_SHAPE_PRICE,
      accentShape: CUSTOM_ACCENT_SHAPE,
    };
  }, [drawing.strokeCount, drawing.pointCount]);

  const onAddToCart = useCallback(() => {
    if (!hasValidDrawing) return;
    const p = buildCartPayload();
    addToCart({ ...p, quantity: 1 });
    openCart();
    setDrawOpen(false);
  }, [addToCart, buildCartPayload, hasValidDrawing, openCart]);

  const onBuyNow = useCallback(() => {
    if (!hasValidDrawing || buyBusy) return;
    setBuyBusy(true);
    window.setTimeout(() => {
      const p = buildCartPayload();
      const order = placeOrder([{ ...p, quantity: 1 }]);
      setBuyBusy(false);
      setDrawOpen(false);
      router.push(`/checkout/${order.id}`);
    }, 280);
  }, [buyBusy, buildCartPayload, hasValidDrawing, placeOrder, router]);

  const onClearCanvas = useCallback(() => {
    drawerRef.current?.clear();
  }, []);

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

      <ul className="shape-picker-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {shapes.map((shape) => (
          <li key={shape.id} className="min-w-0">
            <Link
              href={`/explore?shape=${shape.name}`}
              onClick={() => setShape(shape.name)}
              className={[
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-sm ring-1 ring-slate-900/[0.03] transition-all duration-300",
                "hover:-translate-y-1 hover:scale-[1.02] hover:border-white/0 hover:bg-white",
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

              <div className="mb-4 flex items-start justify-between gap-3">
                <span
                  className={[
                    "inline-flex rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100 transition-transform duration-300 group-hover:scale-105",
                    iconToneClass[shape.name],
                  ].join(" ")}
                >
                  <ShapeIcon shape={shape.name} />
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-slate-500 transition-colors group-hover:bg-slate-900 group-hover:text-white">
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
        <li key="draw-custom" className="min-w-0">
          <button
            type="button"
            onClick={() => {
              setDrawing({ strokeCount: 0, pointCount: 0 });
              setBuyBusy(false);
              setDrawOpen(true);
            }}
            className={[
              "group relative flex h-full min-h-[220px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-6 text-left shadow-sm ring-1 ring-slate-900/[0.03] transition-all duration-300",
              "hover:-translate-y-1 hover:scale-[1.02] hover:border-white/0 hover:bg-white",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
              customDrawGlowClass,
            ].join(" ")}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-violet-400 via-fuchsia-500 to-purple-600 opacity-95 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden
            />
            <div className="mb-4 flex items-start justify-between gap-3">
              <span className="inline-flex rounded-xl bg-violet-50 p-3 ring-1 ring-violet-100 transition-transform duration-300 group-hover:scale-105">
                <svg
                  className="h-9 w-9 text-violet-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M3 18c2.5-4 5-6 9-6s6.5 2 9 6" />
                  <path d="M12 22V12" />
                  <path d="M8 6h8M9 4h6M10 2h4" />
                </svg>
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-slate-500 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                WebGL
              </span>
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">
              Draw your own
            </h3>
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
              Open a full-screen ink lab, sketch freely with GPU line rendering,
              then cart or checkout your one-of-a-kind outline.
            </p>
            <p className="mt-4 text-sm font-medium text-slate-500 transition-colors group-hover:text-slate-900">
              Start drawing →
            </p>
          </button>
        </li>
      </ul>

      {mounted && drawOpen
        ? createPortal(
            <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
              <button
                type="button"
                aria-label="Close drawing studio"
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                onClick={() => setDrawOpen(false)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="draw-studio-title"
                className="relative flex max-h-[min(92vh,860px)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-slate-950 shadow-2xl sm:rounded-3xl"
              >
                <header className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-300/90">
                      Explore
                    </p>
                    <h2
                      id="draw-studio-title"
                      className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl"
                    >
                      WebGL shape studio
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Drag to draw. Lines are triangulated and rendered on the
                      GPU.
                    </p>
                  </div>
                  <button
                    ref={closeBtnRef}
                    type="button"
                    onClick={() => setDrawOpen(false)}
                    className="shrink-0 rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Close"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </header>

                <div className="flex-1 px-5 pb-4 pt-3 sm:px-6">
                  <WebGLShapeDrawer
                    ref={drawerRef}
                    strokeWidthPx={5}
                    className="h-[min(52vh,340px)] w-full cursor-crosshair rounded-2xl ring-1 ring-inset ring-white/15"
                    onDrawingChange={setDrawing}
                  />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>
                      {drawing.strokeCount > 0
                        ? `${drawing.strokeCount} stroke${
                            drawing.strokeCount === 1 ? "" : "s"
                          } · ${drawing.pointCount} pts`
                        : "No strokes yet"}
                    </span>
                    <button
                      type="button"
                      onClick={onClearCanvas}
                      className="rounded-lg px-2 py-1 font-medium text-violet-300 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      Clear canvas
                    </button>
                  </div>
                </div>

                <footer className="border-t border-white/10 bg-slate-900/80 px-5 py-4 sm:px-6">
                  <div className="mb-3 flex items-baseline justify-between gap-2">
                    <span className="text-sm text-slate-400">Studio edition</span>
                    <span className="text-lg font-semibold text-white">
                      {formatPrice(CUSTOM_DRAW_SHAPE_PRICE)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={onAddToCart}
                      disabled={!hasValidDrawing}
                      className={[
                        "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all",
                        "ring-2 ring-inset ring-violet-500/30 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]",
                        "disabled:pointer-events-none disabled:opacity-50",
                      ].join(" ")}
                    >
                      <svg
                        className="h-5 w-5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden
                      >
                        <path d="M6 7h15l-1.5 9h-12z" />
                        <path d="M6 7 5 3H2" />
                        <circle cx="9" cy="20" r="1" />
                        <circle cx="18" cy="20" r="1" />
                      </svg>
                      Add to cart
                    </button>
                    <button
                      type="button"
                      onClick={onBuyNow}
                      disabled={!hasValidDrawing || buyBusy}
                      aria-busy={buyBusy}
                      className={[
                        "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md transition-all",
                        "bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:scale-[1.02] hover:shadow-lg active:scale-[0.99]",
                        "disabled:pointer-events-none disabled:opacity-60",
                      ].join(" ")}
                    >
                      {buyBusy ? (
                        <>
                          <span
                            className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white"
                            aria-hidden
                          />
                          Shaping…
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-5 w-5 shrink-0 opacity-95"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden
                          >
                            <path d="M6 7h15l-1.5 9h-12z" />
                            <path d="M6 7 5 3H2" />
                            <circle cx="9" cy="20" r="1" />
                            <circle cx="18" cy="20" r="1" />
                          </svg>
                          Buy for checkout
                        </>
                      )}
                    </button>
                  </div>
                </footer>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
