"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useAppState } from "@/lib/context";
import type { ShapeName } from "@/types";

const buttonGradient: Record<ShapeName, string> = {
  circle: "from-shape-circle-from to-shape-circle-to",
  square: "from-shape-square-from to-shape-square-to",
  triangle: "from-shape-triangle-from to-shape-triangle-to",
  rectangle: "from-shape-rectangle-from to-shape-rectangle-to",
  hexagon: "from-shape-hexagon-from to-shape-hexagon-to",
};

type ShapeNowButtonProps = {
  productId: string;
  productName: string;
  shapePath: string;
  accentShape: ShapeName;
};

export default function ShapeNowButton({
  productId,
  productName,
  shapePath,
  accentShape,
}: ShapeNowButtonProps) {
  const router = useRouter();
  const { placeOrder } = useAppState();
  const [busy, setBusy] = useState(false);

  const onClick = useCallback(() => {
    if (busy) return;
    setBusy(true);
    window.setTimeout(() => {
      const order = placeOrder({ productId, productName, shapePath });
      router.push(`/checkout/${order.id}`);
      setBusy(false);
    }, 300);
  }, [busy, placeOrder, productId, productName, shapePath, router]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-busy={busy}
      className={[
        "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200",
        "hover:scale-[1.02] hover:shadow-lg active:scale-[0.99] disabled:pointer-events-none disabled:opacity-80",
        `bg-gradient-to-r ${buttonGradient[accentShape]}`,
      ].join(" ")}
    >
      <svg
        className="h-5 w-5 shrink-0 opacity-95"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 7h15l-1.5 9h-12z" />
        <path d="M6 7 5 3H2" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      {busy ? "Shaping…" : "Shape now"}
    </button>
  );
}
