"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CartIconButton from "@/components/CartIconButton";
import ShapeShopLogoMark from "@/components/ShapeShopLogoMark";

const links = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  {
    href: "/explore?shape=circle",
    label: "Explore",
    match: (p: string) => p.startsWith("/explore"),
  },
  {
    href: "/products",
    label: "Products",
    match: (p: string) => p.startsWith("/products"),
  },
  {
    href: "/profile",
    label: "Profile",
    match: (p: string) => p.startsWith("/profile"),
  },
] as const;

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 shadow-sm shadow-slate-200/40 backdrop-blur-xl supports-[backdrop-filter]:bg-white/65">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group relative flex min-w-0 items-center gap-2.5 text-slate-900 transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] sm:gap-3"
        >
          <ShapeShopLogoMark gradientId="ss-logo-grad-nav" />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="relative inline-block w-fit max-w-full">
              <span className="block bg-gradient-to-r from-shape-circle-from via-shape-hexagon-from to-shape-square-to bg-clip-text text-lg font-semibold tracking-tight text-transparent transition-opacity group-hover:opacity-90">
                ShapeShop
              </span>
              <span
                className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-gradient-to-r from-shape-circle-from to-shape-square-to transition-all duration-300 group-hover:w-full"
                aria-hidden
              />
            </span>
            <span className="block max-w-[14rem] truncate text-[11px] font-medium leading-tight tracking-wide text-slate-500 sm:max-w-none sm:text-xs">
              What Shapes Your Life?
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1" aria-label="Main">
          {links.map(({ href, label, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={[
                  "relative rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 sm:px-3.5",
                  active
                    ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md shadow-slate-900/15"
                    : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900 active:scale-[0.98]",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
          <CartIconButton />
        </nav>
      </div>
    </header>
  );
}
