import type { ShapeName } from "@/types";

/**
 * SVG path `d` for each base shape in a 24×24 viewBox (same geometry as ShapeIcon).
 * The logo mark places each path via transform — no runtime morphing, easy to edit.
 */
export const LOGO_SHAPE_PATH_D: Record<ShapeName, string> = {
  circle:
    "M 12 3 A 9 9 0 1 1 12 21.01 A 9 9 0 1 1 12 3 Z",
  square: "M 3 3 H 21 V 21 H 3 Z",
  triangle: "M 12 3 L 22 21 H 2 Z",
  rectangle: "M 2 7 H 22 V 17 H 2 Z",
  hexagon: "M 12 2 L 20.66 7 V 17 L 12 22 L 3.34 17 V 7 Z",
};

/** Order around the mark (pentagon layout). */
export const LOGO_SHAPE_RING_ORDER: ShapeName[] = [
  "circle",
  "triangle",
  "hexagon",
  "rectangle",
  "square",
];

const VIEW_CX = 12;
const VIEW_CY = 12;
const RING_R = 6.85;
const RING_SCALE = 0.34;

function ringTransform(index: number): string {
  const deg = -90 + index * 72;
  const rad = (deg * Math.PI) / 180;
  const x = VIEW_CX + RING_R * Math.cos(rad);
  const y = VIEW_CY + RING_R * Math.sin(rad);
  return `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${RING_SCALE}) translate(${-VIEW_CX} ${-VIEW_CY})`;
}

export type LogoMarkPathLayer = {
  shape: ShapeName;
  d: string;
  transform: string;
};

export const LOGO_MARK_PATH_LAYERS: LogoMarkPathLayer[] =
  LOGO_SHAPE_RING_ORDER.map((shape, index) => ({
    shape,
    d: LOGO_SHAPE_PATH_D[shape],
    transform: ringTransform(index),
  }));
