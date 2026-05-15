"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useAppState } from "@/lib/context";
import { categories as allCategories } from "@/data/products";
import ShapeIcon from "./ShapeIcon";
import type { ShapeName, UserProfile } from "@/types";

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

const DEFAULTS = {
  name: "",
  email: "",
  favoriteShape: "circle" as ShapeName,
  categories: [] as string[],
  stylePreference: "minimal" as UserProfile["stylePreference"],
  priceMin: 0,
  priceMax: 100,
  summary: "",
};

export default function ProfileForm() {
  const { profile, setProfile } = useAppState();

  const initial = useMemo(
    () => ({
      name: profile?.name ?? DEFAULTS.name,
      email: profile?.email ?? DEFAULTS.email,
      favoriteShape: profile?.favoriteShape ?? DEFAULTS.favoriteShape,
      categories: profile?.categories ?? DEFAULTS.categories,
      stylePreference: profile?.stylePreference ?? DEFAULTS.stylePreference,
      priceMin: profile?.priceRange.min ?? DEFAULTS.priceMin,
      priceMax: profile?.priceRange.max ?? DEFAULTS.priceMax,
      summary: profile?.summary ?? DEFAULTS.summary,
    }),
    [profile],
  );

  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [favoriteShape, setFavoriteShape] = useState<ShapeName>(
    initial.favoriteShape,
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initial.categories,
  );
  const [stylePreference, setStylePreference] = useState<
    UserProfile["stylePreference"]
  >(initial.stylePreference);
  const [priceMin, setPriceMin] = useState<number>(initial.priceMin);
  const [priceMax, setPriceMax] = useState<number>(initial.priceMax);
  const [summary, setSummary] = useState(initial.summary);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    if (priceMin < 0 || priceMax < 0) {
      setError("Prices must be zero or greater.");
      return;
    }
    if (priceMax < priceMin) {
      setError("Max price must be greater than or equal to min price.");
      return;
    }

    const next: UserProfile = {
      id: profile?.id ?? crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      favoriteShape,
      categories: selectedCategories,
      stylePreference,
      priceRange: { min: priceMin, max: priceMax },
      summary: summary.trim() || undefined,
    };

    setProfile(next);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors focus:border-shape-circle-from focus:ring-2 focus:ring-shape-circle-from/30"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors focus:border-shape-circle-from focus:ring-2 focus:ring-shape-circle-from/30"
          />
        </label>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600">
          Favorite shape
        </h2>
        <div
          role="radiogroup"
          aria-label="Favorite shape"
          className="grid grid-cols-2 gap-3 sm:grid-cols-5"
        >
          {SHAPES.map((shape) => {
            const isSelected = favoriteShape === shape;
            return (
              <button
                key={shape}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setFavoriteShape(shape)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                  isSelected
                    ? "border-shape-circle-from bg-shape-circle-from/10 text-slate-900"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <ShapeIcon shape={shape} />
                <span className="text-xs font-medium capitalize">{shape}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600">
          Preferred categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleCategory(cat)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        {selectedCategories.length === 0 && (
          <p className="text-xs text-slate-500">
            Pick one or more categories you typically shop.
          </p>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-1">
          <span className="font-medium text-slate-700">Min price ($)</span>
          <input
            type="number"
            min={0}
            step={1}
            value={priceMin}
            onChange={(e) => setPriceMin(Number(e.target.value))}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors focus:border-shape-circle-from focus:ring-2 focus:ring-shape-circle-from/30"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-1">
          <span className="font-medium text-slate-700">Max price ($)</span>
          <input
            type="number"
            min={0}
            step={1}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors focus:border-shape-circle-from focus:ring-2 focus:ring-shape-circle-from/30"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-1">
          <span className="font-medium text-slate-700">Style preference</span>
          <select
            value={stylePreference}
            onChange={(e) =>
              setStylePreference(
                e.target.value as UserProfile["stylePreference"],
              )
            }
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 capitalize outline-none transition-colors focus:border-shape-circle-from focus:ring-2 focus:ring-shape-circle-from/30"
          >
            {STYLES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-slate-700">
          Summary{" "}
          <span className="font-normal text-slate-500">(optional)</span>
        </span>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
          placeholder="Tell us a bit about your shopping vibe..."
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition-colors focus:border-shape-circle-from focus:ring-2 focus:ring-shape-circle-from/30"
        />
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {saved && !error && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          Profile saved.
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-700"
        >
          Save profile
        </button>
      </div>
    </form>
  );
}
