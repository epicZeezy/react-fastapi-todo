import { NextRequest } from "next/server";
import { getProfileByEmail, saveProfile } from "@/lib/profile-storage";
import type { ShapeName, UserProfile } from "@/types";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SHAPES: ShapeName[] = [
  "circle",
  "square",
  "triangle",
  "rectangle",
  "hexagon",
];
const STYLES: UserProfile["stylePreference"][] = [
  "minimal",
  "bold",
  "classic",
  "playful",
];

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_RE.test(value.trim());
}

function parseProfile(input: unknown): UserProfile | { error: string } {
  if (!input || typeof input !== "object") {
    return { error: "Body must be a JSON object" };
  }
  const v = input as Record<string, unknown>;

  if (!isValidEmail(v.email)) {
    return { error: "A valid email is required" };
  }
  if (typeof v.name !== "string" || !v.name.trim()) {
    return { error: "Name is required" };
  }
  if (typeof v.favoriteShape !== "string" || !SHAPES.includes(v.favoriteShape as ShapeName)) {
    return { error: "favoriteShape is invalid" };
  }
  if (
    typeof v.stylePreference !== "string" ||
    !STYLES.includes(v.stylePreference as UserProfile["stylePreference"])
  ) {
    return { error: "stylePreference is invalid" };
  }
  if (!Array.isArray(v.categories) || !v.categories.every((c) => typeof c === "string")) {
    return { error: "categories must be an array of strings" };
  }
  const pr = v.priceRange as { min?: unknown; max?: unknown } | undefined;
  if (
    !pr ||
    typeof pr !== "object" ||
    typeof pr.min !== "number" ||
    typeof pr.max !== "number" ||
    pr.min < 0 ||
    pr.max < 0 ||
    pr.max < pr.min
  ) {
    return { error: "priceRange is invalid" };
  }
  const summary =
    typeof v.summary === "string" && v.summary.trim() ? v.summary.trim() : undefined;
  const id = typeof v.id === "string" && v.id ? v.id : crypto.randomUUID();

  return {
    id,
    name: v.name.trim(),
    email: (v.email as string).trim(),
    favoriteShape: v.favoriteShape as ShapeName,
    categories: v.categories as string[],
    stylePreference: v.stylePreference as UserProfile["stylePreference"],
    priceRange: { min: pr.min, max: pr.max },
    summary,
  };
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email || !isValidEmail(email)) {
    return Response.json({ error: "A valid email is required" }, { status: 400 });
  }
  const profile = await getProfileByEmail(email);
  if (!profile) {
    return Response.json(null, { status: 404 });
  }
  return Response.json(profile);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = parseProfile(body);
  if ("error" in parsed) {
    return Response.json(parsed, { status: 400 });
  }
  const saved = await saveProfile(parsed);
  return Response.json(saved);
}
