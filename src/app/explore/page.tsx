import { Suspense } from "react";
import ExplorePageClient from "./ExplorePageClient";

function ExploreFallback() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="h-9 w-2/3 max-w-md animate-pulse rounded bg-slate-200" />
        <div className="h-16 max-w-xl animate-pulse rounded bg-slate-100" />
      </div>
      <div className="flex h-[min(58vh,520px)] min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
        Preparing explorer…
      </div>
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreFallback />}>
      <ExplorePageClient />
    </Suspense>
  );
}
