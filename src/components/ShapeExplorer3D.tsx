"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshDistortMaterial,
  OrbitControls,
} from "@react-three/drei";
import Link from "next/link";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { DoubleSide } from "three";
import { getShapeByName } from "@/data/shapes";
import { transformSlug } from "@/lib/shape-url";
import type { ShapeName, ShapeTransformation } from "@/types";

const SHAPE_ACCENT: Record<
  ShapeName,
  { color: string; distortColor?: string; envIntensity?: number }
> = {
  circle: { color: "#ec4899", distortColor: "#a855f7", envIntensity: 1.1 },
  square: { color: "#0ea5e9", distortColor: "#06b6d4", envIntensity: 1 },
  triangle: { color: "#f97316", distortColor: "#eab308", envIntensity: 1.05 },
  rectangle: { color: "#22c55e", distortColor: "#14b8a6", envIntensity: 1 },
  hexagon: { color: "#6366f1", distortColor: "#a855f7", envIntensity: 1.1 },
};

const gradientTabClass: Record<ShapeName, string> = {
  circle: "from-shape-circle-from to-shape-circle-to",
  square: "from-shape-square-from to-shape-square-to",
  triangle: "from-shape-triangle-from to-shape-triangle-to",
  rectangle: "from-shape-rectangle-from to-shape-rectangle-to",
  hexagon: "from-shape-hexagon-from to-shape-hexagon-to",
};

/** Soft outer bloom behind the canvas, keyed to the active base shape */
const canvasAmbientGlowClass: Record<ShapeName, string> = {
  circle:
    "after:bg-gradient-to-br after:from-shape-circle-from/35 after:via-shape-circle-to/12 after:to-transparent",
  square:
    "after:bg-gradient-to-br after:from-shape-square-from/35 after:via-shape-square-to/12 after:to-transparent",
  triangle:
    "after:bg-gradient-to-br after:from-shape-triangle-from/35 after:via-shape-triangle-to/12 after:to-transparent",
  rectangle:
    "after:bg-gradient-to-br after:from-shape-rectangle-from/35 after:via-shape-rectangle-to/12 after:to-transparent",
  hexagon:
    "after:bg-gradient-to-br after:from-shape-hexagon-from/35 after:via-shape-hexagon-to/12 after:to-transparent",
};

type TransformMeshProps = {
  shapeName: ShapeName;
  transform: ShapeTransformation;
  accent: string;
  distortColor?: string;
};

function AutoSpin({ children, speed = 0.35 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });
  return <group ref={ref}>{children}</group>;
}

function TransformMesh({ shapeName, transform, accent, distortColor }: TransformMeshProps) {
  const spec = useMemo(() => {
    const t = transform.name;
    if (shapeName === "circle") {
      if (t === "Sphere")
        return { kind: "sphere" as const, args: [1, 48, 48] as const, scale: [1, 1, 1] as const };
      if (t === "Cylinder")
        return {
          kind: "cylinder" as const,
          args: [0.55, 0.55, 1.35, 40] as const,
          scale: [1, 1, 1] as const,
        };
      if (t === "Flat Disc")
        return {
          kind: "circle" as const,
          args: [1.35, 64] as const,
          rotation: [-Math.PI / 2, 0, 0] as const,
          scale: [1, 1, 1] as const,
        };
    }
    if (shapeName === "square") {
      if (t === "Cube")
        return { kind: "box" as const, args: [1.15, 1.15, 1.15] as const, scale: [1, 1, 1] as const };
      if (t === "Rectangular Prism")
        return { kind: "box" as const, args: [1.55, 0.95, 0.85] as const, scale: [1, 1, 1] as const };
      if (t === "Flat Panel")
        return {
          kind: "plane" as const,
          args: [2.1, 2.1] as const,
          rotation: [0, 0.35, 0] as const,
          scale: [1, 1, 1] as const,
        };
    }
    if (shapeName === "triangle") {
      if (t === "Cone")
        return { kind: "cone" as const, args: [0.65, 1.25, 36] as const, scale: [1, 1, 1] as const };
      if (t === "Tetrahedron")
        return { kind: "tetrahedron" as const, args: [1.15] as const, scale: [1, 1, 1] as const };
      if (t === "Pyramid")
        return { kind: "cone" as const, args: [0.72, 1.35, 4] as const, scale: [1, 1, 1] as const };
    }
    if (shapeName === "rectangle") {
      if (t === "Rectangular Prism")
        return { kind: "box" as const, args: [1.95, 0.55, 0.85] as const, scale: [1, 1, 1] as const };
      if (t === "Flat Slab")
        return { kind: "box" as const, args: [2.15, 0.12, 1.15] as const, scale: [1, 1, 1] as const };
      if (t === "Tube")
        return {
          kind: "cylinder" as const,
          args: [0.38, 0.38, 1.85, 40] as const,
          scale: [1, 1, 1] as const,
        };
    }
    if (shapeName === "hexagon") {
      if (t === "Hexagonal Prism")
        return {
          kind: "cylinder" as const,
          args: [0.58, 0.58, 1.35, 6] as const,
          scale: [1, 1, 1] as const,
        };
      if (t === "Truncated Octahedron")
        return { kind: "octahedron" as const, args: [1.05] as const, scale: [1, 1, 1] as const };
      if (t === "Honeycomb")
        return {
          kind: "cylinder" as const,
          args: [0.42, 0.42, 0.22, 6] as const,
          scale: [1, 1, 1] as const,
        };
    }
    return { kind: "sphere" as const, args: [0.9, 32, 32] as const, scale: [1, 1, 1] as const };
  }, [shapeName, transform.name]);

  const rotation = spec.rotation ?? ([0, 0, 0] as const);
  const scale = spec.scale ?? ([1, 1, 1] as const);

  const useDistort = spec.kind === "sphere" && shapeName === "circle" && transform.name === "Sphere";

  return (
    <Float speed={1.75} rotationIntensity={0.35} floatIntensity={0.55}>
      <AutoSpin>
        <group rotation={rotation} scale={scale}>
          {spec.kind === "sphere" && (
            <mesh castShadow receiveShadow>
              <sphereGeometry args={spec.args} />
              {useDistort ? (
                <MeshDistortMaterial
                  color={accent}
                  emissive={distortColor ?? accent}
                  emissiveIntensity={0.25}
                  roughness={0.28}
                  metalness={0.2}
                  distort={0.35}
                  speed={2.2}
                />
              ) : (
                <meshStandardMaterial
                  color={accent}
                  emissive={distortColor ?? accent}
                  emissiveIntensity={0.2}
                  roughness={0.32}
                  metalness={0.25}
                />
              )}
            </mesh>
          )}
          {spec.kind === "box" && (
            <mesh castShadow receiveShadow>
              <boxGeometry args={spec.args} />
              <meshStandardMaterial
                color={accent}
                emissive={distortColor ?? accent}
                emissiveIntensity={0.18}
                roughness={0.38}
                metalness={0.22}
              />
            </mesh>
          )}
          {spec.kind === "cylinder" && (
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={spec.args} />
              <meshStandardMaterial
                color={accent}
                emissive={distortColor ?? accent}
                emissiveIntensity={0.18}
                roughness={0.35}
                metalness={0.28}
              />
            </mesh>
          )}
          {spec.kind === "cone" && (
            <mesh castShadow receiveShadow>
              <coneGeometry args={spec.args} />
              <meshStandardMaterial
                color={accent}
                emissive={distortColor ?? accent}
                emissiveIntensity={0.2}
                roughness={0.4}
                metalness={0.15}
              />
            </mesh>
          )}
          {spec.kind === "tetrahedron" && (
            <mesh castShadow receiveShadow>
              <tetrahedronGeometry args={spec.args} />
              <meshStandardMaterial
                color={accent}
                emissive={distortColor ?? accent}
                emissiveIntensity={0.22}
                roughness={0.42}
                metalness={0.12}
              />
            </mesh>
          )}
          {spec.kind === "octahedron" && (
            <mesh castShadow receiveShadow>
              <octahedronGeometry args={spec.args} />
              <meshStandardMaterial
                color={accent}
                emissive={distortColor ?? accent}
                emissiveIntensity={0.2}
                roughness={0.36}
                metalness={0.35}
              />
            </mesh>
          )}
          {spec.kind === "plane" && (
            <mesh castShadow receiveShadow>
              <planeGeometry args={spec.args} />
              <meshStandardMaterial
                color={accent}
                emissive={distortColor ?? accent}
                emissiveIntensity={0.15}
                roughness={0.45}
                metalness={0.08}
                side={DoubleSide}
              />
            </mesh>
          )}
          {spec.kind === "circle" && (
            <mesh castShadow receiveShadow>
              <circleGeometry args={spec.args} />
              <meshStandardMaterial
                color={accent}
                emissive={distortColor ?? accent}
                emissiveIntensity={0.12}
                roughness={0.5}
                metalness={0.05}
                side={DoubleSide}
              />
            </mesh>
          )}
        </group>
      </AutoSpin>
    </Float>
  );
}

function ExplorerScene({
  shapeName,
  activeTransform,
}: {
  shapeName: ShapeName;
  activeTransform: ShapeTransformation;
}) {
  const accent = SHAPE_ACCENT[shapeName];
  return (
    <>
      <color attach="background" args={["#0f172a"]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 3]} intensity={1.35} castShadow />
      <directionalLight position={[-3, -2, -4]} intensity={0.35} color="#c4b5fd" />
      <Environment preset="city" environmentIntensity={accent.envIntensity ?? 1} />
      <TransformMesh
        key={activeTransform.name}
        shapeName={shapeName}
        transform={activeTransform}
        accent={accent.color}
        distortColor={accent.distortColor}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} metalness={0.05} />
      </mesh>
      <OrbitControls
        enablePan={false}
        minDistance={2.25}
        maxDistance={7}
        maxPolarAngle={Math.PI / 2 - 0.08}
        target={[0, 0, 0]}
      />
    </>
  );
}

type ShapeExplorer3DProps = {
  shapeName: ShapeName;
  activeTransformName: string;
  onTransformSelect: (transformName: string) => void;
};

export default function ShapeExplorer3D({
  shapeName,
  activeTransformName,
  onTransformSelect,
}: ShapeExplorer3DProps) {
  const shape = getShapeByName(shapeName);
  const activeTransform =
    shape?.transformsInto.find((t) => t.name === activeTransformName) ??
    shape?.transformsInto[0];

  if (!shape || !activeTransform) {
    return (
      <p className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white p-6 text-sm leading-relaxed text-amber-950 shadow-sm ring-1 ring-amber-900/5">
        Shape data is missing. Return home and pick a shape again.
      </p>
    );
  }

  const productsHref = `/products?shape=${shapeName}&transform=${encodeURIComponent(
    transformSlug(activeTransform.name),
  )}`;

  return (
    <div className="flex w-full flex-col gap-6">
      <div
        className={[
          "relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-950 shadow-xl shadow-slate-900/25 ring-1 ring-white/10",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:opacity-50",
          "after:pointer-events-none after:absolute after:-inset-3 after:rounded-3xl after:opacity-70 after:blur-2xl after:content-[''] sm:after:opacity-90",
          canvasAmbientGlowClass[shapeName],
        ].join(" ")}
      >
        <div className="relative z-10 h-[min(58vh,520px)] w-full min-h-[280px] sm:min-h-[320px]">
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0.35, 4.1], fov: 48, near: 0.1, far: 40 }}
            gl={{ antialias: true, alpha: false }}
          >
            <ExplorerScene shapeName={shapeName} activeTransform={activeTransform} />
          </Canvas>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Transformation
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="3D transformation variants"
        >
          {shape.transformsInto.map((t) => {
            const selected = t.name === activeTransform.name;
            return (
              <button
                key={t.name}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onTransformSelect(t.name)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  selected
                    ? `bg-gradient-to-r text-white shadow-md ring-2 ring-white/25 ${gradientTabClass[shapeName]}`
                    : "border border-slate-200 bg-white/95 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md active:scale-[0.98]",
                ].join(" ")}
              >
                {t.name}
              </button>
            );
          })}
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{activeTransform.description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={productsHref}
          className={[
            "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.99]",
            `bg-gradient-to-r ${gradientTabClass[shapeName]}`,
          ].join(" ")}
        >
          See products for this shape →
        </Link>
        <p className="text-xs text-slate-500">
          Drag to orbit · Scroll to zoom — products filter uses the same transform slug in the URL.
        </p>
      </div>
    </div>
  );
}
