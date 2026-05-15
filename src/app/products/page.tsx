import { Suspense } from "react";
import ProductsPageClient from "./ProductsPageClient";

function ProductsFallback() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="shimmer-loading h-4 w-24 rounded-full" />
        <div className="shimmer-loading h-9 w-2/3 max-w-md rounded-lg" />
        <div className="shimmer-loading h-16 max-w-xl rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="shimmer-loading h-96 rounded-2xl border border-slate-200/80"
          />
        ))}
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsPageClient />
    </Suspense>
  );
}
