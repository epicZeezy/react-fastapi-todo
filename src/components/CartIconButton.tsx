"use client";

import { useAppState } from "@/lib/context";

export default function CartIconButton() {
  const { cartCount, toggleCart, isCartOpen } = useAppState();

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label={`Open cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
      aria-haspopup="dialog"
      aria-expanded={isCartOpen}
      className="relative ml-1 inline-flex items-center justify-center rounded-xl p-2 text-slate-600 transition-all duration-200 hover:bg-slate-100/90 hover:text-slate-900 active:scale-[0.96] sm:ml-1.5"
    >
      <svg
        className="h-5 w-5 sm:h-[22px] sm:w-[22px]"
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
      {cartCount > 0 ? (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gradient-to-r from-shape-circle-from to-shape-square-to px-1 text-[10px] font-bold leading-none text-white shadow-md ring-2 ring-white"
        >
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      ) : null}
    </button>
  );
}
