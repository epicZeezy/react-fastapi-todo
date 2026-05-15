import { Suspense } from "react";
import ExplorePageClient from "./ExplorePageClient";

function ExploreFallback() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="shimmer-loading h-4 w-24 rounded-full" />
        <div className="shimmer-loading h-9 w-2/3 max-w-md rounded-lg" />
        <div className="shimmer-loading h-16 max-w-xl rounded-lg" />
      </div>
      <div className="flex h-[min(58vh,520px)] min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500 sm:min-h-[320px]">
        <div className="shimmer-loading h-9 w-9 rounded-full" aria-hidden />
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
