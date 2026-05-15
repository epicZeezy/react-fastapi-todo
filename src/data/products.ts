import { transformSlug } from "@/lib/shape-url";
import type { Product, ShapeName } from "@/types";
import { getShapeByName } from "./shapes";

export const products: Product[] = [
  {
    id: "prod-basketball",
    name: "Basketball",
    baseShape: "circle",
    expandedShape: "Sphere",
    category: "Sports",
    price: 29.99,
    imageUrl:
      "https://placehold.co/400x300/ec4899/a855f7/png?text=Basketball",
    reason: "Classic sphere energy—bounce, grip, and outdoor courts.",
  },
  {
    id: "prod-soda-can",
    name: "Soda Can",
    baseShape: "circle",
    expandedShape: "Cylinder",
    category: "Beverages",
    price: 1.99,
    imageUrl: "https://placehold.co/400x300/f472b6/c084fc/png?text=Soda+Can",
    reason: "Cylinder-core refresh—cold fizz in a pocket-friendly form.",
  },
  {
    id: "prod-wall-art",
    name: "Wall Art",
    baseShape: "circle",
    expandedShape: "Flat Disc",
    category: "Home",
    price: 45,
    imageUrl: "https://placehold.co/400x300/e879f9/818cf8/png?text=Wall+Art",
    reason: "Flat disc drama—statement piece without stealing floor space.",
  },
  {
    id: "prod-lamp-shade",
    name: "Drum Lamp Shade",
    baseShape: "circle",
    expandedShape: "Cylinder",
    category: "Lighting",
    price: 34.5,
    imageUrl: "https://placehold.co/400x300/f0abfc/a78bfa/png?text=Lamp+Shade",
    reason: "Soft cylinder glow—cozy corners and reading nooks.",
  },
  {
    id: "prod-rubiks",
    name: "Rubik's Cube",
    baseShape: "square",
    expandedShape: "Cube",
    category: "Games",
    price: 12.99,
    imageUrl: "https://placehold.co/400x300/38bdf8/22d3ee/png?text=Rubik%27s+Cube",
    reason: "Pure cube puzzle-core—twist, learn algorithms, flex patience.",
  },
  {
    id: "prod-pizza-box",
    name: "Pizza Box",
    baseShape: "square",
    expandedShape: "Flat Panel",
    category: "Food",
    price: 8,
    imageUrl: "https://placehold.co/400x300/0ea5e9/06b6d4/png?text=Pizza+Box",
    reason: "Flat panel delivery icon—cheese deserves structural respect.",
  },
  {
    id: "prod-monitor",
    name: "4K Monitor",
    baseShape: "square",
    expandedShape: "Flat Panel",
    category: "Electronics",
    price: 329.99,
    imageUrl: "https://placehold.co/400x300/67e8f9/14b8a6/png?text=4K+Monitor",
    reason: "Pixel grid on a panel—workflows, games, and crisp type.",
  },
  {
    id: "prod-mega",
    name: "Megaphone",
    baseShape: "triangle",
    expandedShape: "Cone",
    category: "Outdoors",
    price: 19.99,
    imageUrl: "https://placehold.co/400x300/fbbf24/f97316/png?text=Megaphone",
    reason: "Cone projection—your voice gets a direction and a boost.",
  },
  {
    id: "prod-party-hat",
    name: "Party Hat",
    baseShape: "triangle",
    expandedShape: "Cone",
    category: "Party",
    price: 4.5,
    imageUrl: "https://placehold.co/400x300/fde047/facc15/png?text=Party+Hat",
    reason: "Tiny cone celebration—birthdays need a pointy silhouette.",
  },
  {
    id: "prod-desk-lamp",
    name: "Pyramid Desk Lamp",
    baseShape: "triangle",
    expandedShape: "Pyramid",
    category: "Lighting",
    price: 42,
    imageUrl: "https://placehold.co/400x300/fb923c/ea580c/png?text=Pyramid+Lamp",
    reason: "Triangular facets meet at a peak—sculptural task lighting.",
  },
  {
    id: "prod-dice-set",
    name: "D4 Dice Set",
    baseShape: "triangle",
    expandedShape: "Tetrahedron",
    category: "Games",
    price: 14,
    imageUrl: "https://placehold.co/400x300/f59e0b/d97706/png?text=D4+Dice",
    reason: "Tetrahedron roll—critical hits and critical fails, mathematically.",
  },
  {
    id: "prod-bookshelf",
    name: "Floating Bookshelf",
    baseShape: "rectangle",
    expandedShape: "Rectangular Prism",
    category: "Home",
    price: 59,
    imageUrl: "https://placehold.co/400x300/34d399/14b8a6/png?text=Bookshelf",
    reason: "Prism storage—long spans for long reads.",
  },
  {
    id: "prod-cutting-board",
    name: "Cutting Board",
    baseShape: "rectangle",
    expandedShape: "Flat Slab",
    category: "Kitchen",
    price: 24.99,
    imageUrl: "https://placehold.co/400x300/2dd4bf/0d9488/png?text=Cutting+Board",
    reason: "Flat slab prep surface—chop season, repeat.",
  },
  {
    id: "prod-mailing-tube",
    name: "Mailing Tube",
    baseShape: "rectangle",
    expandedShape: "Tube",
    category: "Office",
    price: 6.99,
    imageUrl: "https://placehold.co/400x300/5eead4/0f766e/png?text=Mailing+Tube",
    reason: "Poster-safe tunnel—posters hate folding, love tubes.",
  },
  {
    id: "prod-pencil-set",
    name: "Hex Pencil Set",
    baseShape: "hexagon",
    expandedShape: "Hexagonal Prism",
    category: "Stationery",
    price: 9.99,
    imageUrl: "https://placehold.co/400x300/a78bfa/6366f1/png?text=Hex+Pencils",
    reason: "Hex prism grip—no rolling off the desk mid-sketch.",
  },
  {
    id: "prod-bolt-kit",
    name: "Hex Bolt Kit",
    baseShape: "hexagon",
    expandedShape: "Hexagonal Prism",
    category: "Hardware",
    price: 18.5,
    imageUrl: "https://placehold.co/400x300/8b5cf6/7c3aed/png?text=Hex+Bolts",
    reason: "Tool-friendly heads—torque meets tessellation.",
  },
  {
    id: "prod-sculpture",
    name: "Truncated Sculpture",
    baseShape: "hexagon",
    expandedShape: "Truncated Octahedron",
    category: "Art",
    price: 89,
    imageUrl: "https://placehold.co/400x300/c4b5fd/7e22ce/png?text=Sculpture",
    reason: "Geometry gallery piece—conversation starter on any shelf.",
  },
  {
    id: "prod-storage",
    name: "Honeycomb Drawer Organizer",
    baseShape: "hexagon",
    expandedShape: "Honeycomb",
    category: "Organization",
    price: 22,
    imageUrl: "https://placehold.co/400x300/ddd6fe/5b21b6/png?text=Honeycomb",
    reason: "Cell packing efficiency—small things, neat kingdom.",
  },
];

export function getProductsByShape(shape: Product["baseShape"]): Product[] {
  return products.filter((p) => p.baseShape === shape);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Resolve `?transform=` to a canonical transform name, or null if it does not match this shape. */
function resolveTransformForShape(
  shapeName: ShapeName,
  transformQuery: string,
): string | null {
  const shape = getShapeByName(shapeName);
  if (!shape?.transformsInto.length) return null;
  const q = transformQuery.trim().toLowerCase();
  const normalized = q.replace(/-/g, " ");
  const match = shape.transformsInto.find(
    (t) =>
      transformSlug(t.name) === q ||
      t.name.toLowerCase() === normalized ||
      t.name.toLowerCase() === q,
  );
  return match?.name ?? null;
}

/** Canonical transform name for a shape + `?transform=` value, or null if missing/unknown. */
export function resolveTransformFromQuery(
  shapeName: ShapeName,
  transformQuery: string | null,
): string | null {
  if (!transformQuery?.trim()) return null;
  return resolveTransformForShape(shapeName, transformQuery);
}

/** Filter catalog by optional base shape and optional transform (slug or label). */
export function filterCatalog(
  items: Product[],
  shape: ShapeName | null,
  transformQuery: string | null,
): Product[] {
  let list = items;
  if (shape) list = list.filter((p) => p.baseShape === shape);
  if (shape && transformQuery?.trim()) {
    const resolved = resolveTransformForShape(shape, transformQuery);
    if (resolved) list = list.filter((p) => p.expandedShape === resolved);
  }
  return list;
}
