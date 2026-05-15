import { LOGO_MARK_PATH_LAYERS } from "@/lib/shapeShopLogoPaths";

type ShapeShopLogoMarkProps = {
  /** Must be unique per SVG instance on the page (gradient `url(#id)`). */
  gradientId: string;
  variant?: "default" | "hero";
};

/**
 * Static brand mark: five shape paths from a shared map, arranged in a ring.
 * No client JS, no animation — sustainable for nav + marketing surfaces.
 */
export default function ShapeShopLogoMark({
  gradientId,
  variant = "default",
}: ShapeShopLogoMarkProps) {
  const outer =
    variant === "hero"
      ? "relative inline-flex h-14 w-14 shrink-0 sm:h-16 sm:w-16"
      : "relative inline-flex h-9 w-9 shrink-0 sm:h-10 sm:w-10";
  const frame =
    variant === "hero"
      ? "rounded-2xl ring-slate-200/80"
      : "rounded-xl ring-slate-200/80";

  return (
    <span className={[outer, "isolate"].join(" ")} aria-hidden>
      <span
        className={[
          "pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-100/90 to-white shadow-inner shadow-slate-200/60 ring-1",
          frame,
        ].join(" ")}
      />
      <svg
        viewBox="0 0 24 24"
        className="relative z-[1] h-full w-full p-[5px] sm:p-1"
        fill="none"
        role="img"
        aria-label="ShapeShop mark: five base shapes"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--shape-circle-from)" />
            <stop offset="35%" stopColor="var(--shape-hexagon-from)" />
            <stop offset="70%" stopColor="var(--shape-square-to)" />
            <stop offset="100%" stopColor="var(--shape-triangle-to)" />
          </linearGradient>
        </defs>
        <g
          stroke={`url(#${gradientId})`}
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {LOGO_MARK_PATH_LAYERS.map(({ shape, d, transform }) => (
            <path
              key={shape}
              transform={transform}
              d={d}
              vectorEffect="nonScalingStroke"
            />
          ))}
        </g>
      </svg>
    </span>
  );
}
