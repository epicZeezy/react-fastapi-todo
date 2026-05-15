import type { ShapeName } from "@/types";

type ShapeHeroProps = {
  shape: ShapeName;
  className?: string;
};

const gradientStops: Record<ShapeName, { from: string; to: string }> = {
  circle: {
    from: "var(--shape-circle-from)",
    to: "var(--shape-circle-to)",
  },
  square: {
    from: "var(--shape-square-from)",
    to: "var(--shape-square-to)",
  },
  triangle: {
    from: "var(--shape-triangle-from)",
    to: "var(--shape-triangle-to)",
  },
  rectangle: {
    from: "var(--shape-rectangle-from)",
    to: "var(--shape-rectangle-to)",
  },
  hexagon: {
    from: "var(--shape-hexagon-from)",
    to: "var(--shape-hexagon-to)",
  },
};

function ShapeGeometry({ shape, fill }: { shape: ShapeName; fill: string }) {
  switch (shape) {
    case "circle":
      return <circle cx="50" cy="50" r="34" fill={fill} />;
    case "square":
      return (
        <rect x="18" y="18" width="64" height="64" rx="4" fill={fill} />
      );
    case "triangle":
      return (
        <path
          d="M50 14 L86 82 L14 82 Z"
          fill={fill}
          strokeLinejoin="round"
        />
      );
    case "rectangle":
      return (
        <rect x="10" y="30" width="80" height="40" rx="3" fill={fill} />
      );
    case "hexagon":
      return (
        <path
          d="M50 12 L84 31 L84 69 L50 88 L16 69 L16 31 Z"
          fill={fill}
          strokeLinejoin="round"
        />
      );
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}

export default function ShapeHero({ shape, className }: ShapeHeroProps) {
  const gradientId = `shape-hero-gradient-${shape}`;
  const stops = gradientStops[shape];

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={`${shape} shape`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={stops.from} />
          <stop offset="100%" stopColor={stops.to} />
        </linearGradient>
      </defs>
      <ShapeGeometry shape={shape} fill={`url(#${gradientId})`} />
    </svg>
  );
}
