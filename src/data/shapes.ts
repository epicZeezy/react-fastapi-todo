import type { Shape } from "@/types";

export const shapes: Shape[] = [
  {
    id: "circle",
    name: "circle",
    displayName: "Circle",
    description:
      "The endless loop—perfect symmetry that rolls, orbits, and ripples through nature and design.",
    transformsInto: [
      {
        name: "Sphere",
        description: "A perfect 3D circle—smooth in every direction.",
        geometryType: "sphereGeometry",
      },
      {
        name: "Cylinder",
        description: "Circle extruded—great for cans, columns, and barrels.",
        geometryType: "cylinderGeometry",
      },
      {
        name: "Flat Disc",
        description: "A circle pressed flat—coins, coasters, and vinyl vibes.",
        geometryType: "circleGeometry",
      },
    ],
  },
  {
    id: "square",
    name: "square",
    displayName: "Square",
    description:
      "Stable, stackable, and satisfying—grids, pixels, and building blocks start here.",
    transformsInto: [
      {
        name: "Cube",
        description: "Six equal faces—dice, boxes, and voxel dreams.",
        geometryType: "boxGeometry",
      },
      {
        name: "Rectangular Prism",
        description: "A stretched cube—shelves, bricks, and shipping reality.",
        geometryType: "boxGeometry",
      },
      {
        name: "Flat Panel",
        description: "A thin square plane—screens, tiles, and wall art.",
        geometryType: "planeGeometry",
      },
    ],
  },
  {
    id: "triangle",
    name: "triangle",
    displayName: "Triangle",
    description:
      "The simplest polygon—sharp, directional, and surprisingly strong.",
    transformsInto: [
      {
        name: "Cone",
        description: "Triangle spun around an axis—party hats and megaphones.",
        geometryType: "coneGeometry",
      },
      {
        name: "Tetrahedron",
        description: "Four triangular faces—minimal 3D structure.",
        geometryType: "tetrahedronGeometry",
      },
      {
        name: "Pyramid",
        description: "Triangles meeting at a peak—ancient drama, modern lamp.",
        geometryType: "coneGeometry",
      },
    ],
  },
  {
    id: "rectangle",
    name: "rectangle",
    displayName: "Rectangle",
    description:
      "Stretch the square—doors, screens, and long horizons in solid form.",
    transformsInto: [
      {
        name: "Rectangular Prism",
        description: "A 3D brick—desks, books, and building materials.",
        geometryType: "boxGeometry",
      },
      {
        name: "Flat Slab",
        description: "A wide, thin solid—cutting boards and modern coffee tables.",
        geometryType: "boxGeometry",
      },
      {
        name: "Tube",
        description: "Rectangle wrapped into a tunnel—mailing tubes and skylines.",
        geometryType: "cylinderGeometry",
      },
    ],
  },
  {
    id: "hexagon",
    name: "hexagon",
    displayName: "Hexagon",
    description:
      "Nature’s tiling champion—beehives, bolts, and sci-fi honeycomb energy.",
    transformsInto: [
      {
        name: "Hexagonal Prism",
        description: "Honeycomb extruded—pencils, nuts, and futuristic columns.",
        geometryType: "cylinderGeometry",
      },
      {
        name: "Truncated Octahedron",
        description: "A space-filling solid with hex faces—math meets sculpture.",
        geometryType: "octahedronGeometry",
      },
      {
        name: "Honeycomb",
        description: "Packed hex cells—storage, structure, and sweet patterns.",
        geometryType: "cylinderGeometry",
      },
    ],
  },
];

export function getShapeByName(name: Shape["name"]): Shape | undefined {
  return shapes.find((s) => s.name === name);
}
