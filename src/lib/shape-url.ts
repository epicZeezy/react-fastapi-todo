/** URL-safe slug for shape transform names (e.g. "Flat Disc" → "flat-disc"). */
export function transformSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}
