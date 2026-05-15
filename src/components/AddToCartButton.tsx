"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppState } from "@/lib/context";
import type { ShapeName } from "@/types";

const buttonGradientText: Record<ShapeName, string> = {
  circle: "from-shape-circle-from to-shape-circle-to",
  square: "from-shape-square-from to-shape-square-to",
  triangle: "from-shape-triangle-from to-shape-triangle-to",
  rectangle: "from-shape-rectangle-from to-shape-rectangle-to",
  hexagon: "from-shape-hexagon-from to-shape-hexagon-to",
};

const buttonRingClass: Record<ShapeName, string> = {
  circle: "ring-shape-circle-from/40 hover:ring-shape-circle-from/70",
  square: "ring-shape-square-from/40 hover:ring-shape-square-from/70",
  triangle: "ring-shape-triangle-from/40 hover:ring-shape-triangle-from/70",
  rectangle: "ring-shape-rectangle-from/40 hover:ring-shape-rectangle-from/70",
  hexagon: "ring-shape-hexagon-from/40 hover:ring-shape-hexagon-from/70",
};

type AddToCartButtonProps = {
  productId: string;
  productName: string;
  shapePath: string;
  price: number;
  accentShape: ShapeName;
};

export default function AddToCartButton({
  productId,
  productName,
  shapePath,
  price,
  accentShape,
}: AddToCartButtonProps) {
  const { addToCart, openCart } = useAppState();
  const [added, setAdded] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const onClick = useCallback(() => {
    addToCart({
      productId,
      productName,
      shapePath,
      price,
      quantity: 1,
      accentShape,
    });
    openCart();
    setAdded(true);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setAdded(false);
      timerRef.current = null;
    }, 1000);
  }, [addToCart, openCart, productId, productName, shapePath, price, accentShape]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Add ${productName} to cart`}
      className={[
        "group/atc relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-4 py-3 text-sm font-semibold shadow-sm transition-all duration-200",
        "ring-2 ring-inset hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]",
        buttonRingClass[accentShape],
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex items-center gap-2 bg-gradient-to-r bg-clip-text text-transparent",
          buttonGradientText[accentShape],
        ].join(" ")}
      >
        {added ? (
          <>
            <svg
              className="h-5 w-5 shrink-0 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12l5 5L20 7" />
            </svg>
            Added
          </>
        ) : (
          <>
            <svg
              className="h-5 w-5 shrink-0"
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
              <path d="M12 10v4M10 12h4" />
            </svg>
            Add to cart
          </>
        )}
      </span>
    </button>
  );
}
