"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/data/products";
import { useAppState } from "@/lib/context";
import { formatPrice } from "@/lib/utils";
import type { Order, ShapeName } from "@/types";

const gradientBarClass: Record<ShapeName, string> = {
  circle: "from-shape-circle-from to-shape-circle-to",
  square: "from-shape-square-from to-shape-square-to",
  triangle: "from-shape-triangle-from to-shape-triangle-to",
  rectangle: "from-shape-rectangle-from to-shape-rectangle-to",
  hexagon: "from-shape-hexagon-from to-shape-hexagon-to",
};

const CONFETTI_COLORS = [
  "#ec4899",
  "#9333ea",
  "#0ea5e9",
  "#06b6d4",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#6366f1",
  "#a855f7",
];

type CheckoutConfirmationProps = {
  orderId: string;
};

function ConfettiBurst({ active, seed }: { active: boolean; seed: string }) {
  const pieces = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => {
      const n =
        (seed.charCodeAt(i % Math.max(seed.length, 1)) + i * 31) % 1000;
      const left = (n * 0.1) % 100;
      const delayMs = (n % 450) / 1000;
      const duration = 2.2 + (n % 7) * 0.12;
      const dx = `${((n % 140) - 70)}px`;
      const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      const w = 6 + (n % 5);
      const h = 8 + (n % 8);
      return { left, delayMs, duration, dx, color, w, h, i };
    });
  }, [seed]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      aria-hidden
    >
      {pieces.map((p) => (
        <span
          key={p.i}
          className="confetti-piece absolute top-0 rounded-sm opacity-90 shadow-sm"
          style={{
            left: `${p.left}%`,
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
            animationDelay: `${p.delayMs}s`,
            animationDuration: `${p.duration}s`,
            ["--confetti-dx" as string]: p.dx,
          }}
        />
      ))}
    </div>
  );
}

function statusLabel(status: Order["status"]): string {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    default:
      return status;
  }
}

export default function CheckoutConfirmation({
  orderId,
}: CheckoutConfirmationProps) {
  const { orders } = useAppState();
  const [celebrate, setCelebrate] = useState(false);

  const order = useMemo(
    () => orders.find((o) => o.id === orderId) ?? null,
    [orders, orderId],
  );

  const firstItem = order?.items[0];
  const product = firstItem
    ? products.find((p) => p.id === firstItem.productId)
    : undefined;
  const accentShape: ShapeName = product?.baseShape ?? "circle";
  const totalQuantity =
    order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  useEffect(() => {
    if (!order) return;
    const t = window.requestAnimationFrame(() => setCelebrate(true));
    const end = window.setTimeout(() => setCelebrate(false), 3200);
    return () => {
      window.cancelAnimationFrame(t);
      window.clearTimeout(end);
    };
  }, [order]);

  if (!order) {
    return (
      <div className="animate-fade-in mx-auto w-full max-w-lg flex-1 px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-900">
          Order not found
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-slate-600">
          This confirmation link does not match any order in your current
          session. If you refreshed the page, mock orders are cleared—place a
          new order from the products page.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/products"
            className="inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Browse products
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <ConfettiBurst active={celebrate} seed={order.id} />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        <p className="mb-2 text-center text-sm font-medium uppercase tracking-wide text-shape-circle-from">
          You shaped it
        </p>
        <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Order confirmed
        </h1>

        {/* Future: fetch order details from Amplify Data (`generateClient`) instead of in-memory context. */}
        <article
          className={[
            "overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-lg ring-1 ring-slate-900/5",
            "animate-float-soft",
          ].join(" ")}
        >
          <div
            className={[
              "h-2 w-full bg-gradient-to-r",
              gradientBarClass[accentShape],
            ].join(" ")}
            aria-hidden
          />

          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <p className="mb-3 text-sm font-medium text-slate-500">
                {order.items.length === 1
                  ? "Item"
                  : `${order.items.length} items · ${totalQuantity} pieces`}
              </p>
              <ul className="divide-y divide-slate-200/80 rounded-xl border border-slate-200/80 bg-slate-50/40">
                {order.items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex items-start justify-between gap-4 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {item.productName}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {item.shapePath}
                      </p>
                      {item.quantity > 1 ? (
                        <p className="mt-1 text-[11px] text-slate-500">
                          Qty {item.quantity} · {formatPrice(item.price)} each
                        </p>
                      ) : null}
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-8">
                <div>
                  <dt className="font-medium text-slate-500">Total</dt>
                  <dd className="text-lg font-semibold text-slate-900">
                    {formatPrice(order.total)}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Status</dt>
                  <dd>
                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/80">
                      {statusLabel(order.status)}
                    </span>
                  </dd>
                </div>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Order ID</dt>
                <dd className="font-mono text-xs text-slate-700">{order.id}</dd>
              </div>
            </dl>

            <Link
              href="/"
              className={[
                "inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200",
                "hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]",
                "bg-gradient-to-r",
                gradientBarClass[accentShape],
              ].join(" ")}
            >
              Continue shopping
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
