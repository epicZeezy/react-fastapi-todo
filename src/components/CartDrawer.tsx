"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useAppState, type CartItem } from "@/lib/context";
import { formatPrice } from "@/lib/utils";
import type { ShapeName } from "@/types";

const itemAccentBar: Record<ShapeName, string> = {
  circle: "from-shape-circle-from to-shape-circle-to",
  square: "from-shape-square-from to-shape-square-to",
  triangle: "from-shape-triangle-from to-shape-triangle-to",
  rectangle: "from-shape-rectangle-from to-shape-rectangle-to",
  hexagon: "from-shape-hexagon-from to-shape-hexagon-to",
};

export default function CartDrawer() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    placeOrder,
  } = useAppState();
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Future: persist cart across reloads via localStorage / Amplify Data.

  useEffect(() => {
    if (!isCartOpen) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const raf = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeCart();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      lastFocusedRef.current?.focus?.();
    };
  }, [isCartOpen, closeCart]);

  const onCheckout = useCallback(() => {
    if (cart.length === 0) return;
    const items = cart.map((c) => ({
      productId: c.productId,
      productName: c.productName,
      shapePath: c.shapePath,
      price: c.price,
      quantity: c.quantity,
    }));
    const order = placeOrder(items);
    closeCart();
    router.push(`/checkout/${order.id}`);
  }, [cart, placeOrder, closeCart, router]);

  return (
    <div
      className={[
        "fixed inset-0 z-[60]",
        isCartOpen ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!isCartOpen}
    >
      <div
        onClick={closeCart}
        className={[
          "absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300",
          isCartOpen ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={[
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-slate-200/80 bg-white shadow-2xl shadow-slate-900/20 transition-transform duration-300 ease-out",
          isCartOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <header className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              Your cart
            </h2>
            {cartCount > 0 ? (
              <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-slate-900 px-1.5 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="inline-flex rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
              <div className="rounded-full bg-slate-100 p-4 text-slate-500">
                <svg
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M6 7h15l-1.5 9h-12z" />
                  <path d="M6 7 5 3H2" />
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold tracking-tight text-slate-900">
                  Your cart is empty
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Add a few shapes to get started.
                </p>
              </div>
              <Link
                href="/products"
                onClick={closeCart}
                className="mt-2 inline-flex rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.99]"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {cart.map((item) => (
                <CartLine
                  key={item.productId}
                  item={item}
                  onIncrement={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                  onDecrement={() =>
                    updateQuantity(item.productId, item.quantity - 1)
                  }
                  onRemove={() => removeFromCart(item.productId)}
                />
              ))}
            </ul>
          )}
        </div>

        <footer className="border-t border-slate-200/80 bg-slate-50/50 px-5 py-4 sm:px-6">
          <dl className="mb-4 space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-600">Subtotal</dt>
              <dd className="font-semibold text-slate-900">
                {formatPrice(cartSubtotal)}
              </dd>
            </div>
            <p className="text-xs text-slate-500">
              Taxes and shipping calculated at checkout.
            </p>
          </dl>
          <button
            type="button"
            onClick={onCheckout}
            disabled={cart.length === 0}
            className={[
              "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200",
              "bg-gradient-to-r from-slate-900 to-slate-800 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]",
              "disabled:pointer-events-none disabled:opacity-60",
            ].join(" ")}
          >
            Checkout
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </footer>
      </aside>
    </div>
  );
}

type CartLineProps = {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

function CartLine({ item, onIncrement, onDecrement, onRemove }: CartLineProps) {
  const lineTotal = item.price * item.quantity;
  return (
    <li className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
      <div
        aria-hidden
        className={["h-1 w-full bg-gradient-to-r", itemAccentBar[item.accentShape]].join(" ")}
      />
      <div className="flex flex-col gap-3 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {item.productName}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {item.shapePath}
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${item.productName} from cart`}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-600"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={onDecrement}
              aria-label={`Decrease ${item.productName} quantity`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-l-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M5 12h14" />
              </svg>
            </button>
            <span
              aria-live="polite"
              className="inline-flex h-8 min-w-[2rem] items-center justify-center px-2 text-sm font-semibold text-slate-900"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrement}
              aria-label={`Increase ${item.productName} quantity`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-r-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">
              {formatPrice(lineTotal)}
            </p>
            {item.quantity > 1 ? (
              <p className="text-[11px] text-slate-500">
                {formatPrice(item.price)} each
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}
