import type { ShapeName } from "@/types";

type ShapeIconProps = {
  shape: ShapeName;
  className?: string;
};

const baseSvg =
  "h-14 w-14 shrink-0 sm:h-16 sm:w-16 stroke-[1.75] sm:stroke-2 fill-none stroke-currentColor";

export default function ShapeIcon({ shape, className }: ShapeIconProps) {
  const svgClass = [baseSvg, className].filter(Boolean).join(" ");

  switch (shape) {
    case "circle":
      return (
        <svg viewBox="0 0 24 24" className={svgClass} aria-hidden>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case "square":
      return (
        <svg viewBox="0 0 24 24" className={svgClass} aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="1.5" />
        </svg>
      );
    case "triangle":
      return (
        <svg viewBox="0 0 24 24" className={svgClass} aria-hidden>
          <path d="M12 3 22 21H2L12 3Z" strokeLinejoin="round" />
        </svg>
      );
    case "rectangle":
      return (
        <svg viewBox="0 0 24 24" className={svgClass} aria-hidden>
          <rect x="2" y="7" width="20" height="10" rx="1.5" />
        </svg>
      );
    case "hexagon":
      return (
        <svg viewBox="0 0 24 24" className={svgClass} aria-hidden>
          <path
            d="M12 2 20.66 7v10L12 22l-8.66-5V7L12 2Z"
            strokeLinejoin="round"
          />
        </svg>
      );
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}
