function Shimmer({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded-lg ${className}`} />
  );
}

export function ProfileSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      {/* Banner */}
      <div className="h-24 bg-slate-200 animate-pulse" />
      <div className="px-6 pb-6">
        <div className="flex flex-wrap items-end gap-4 -mt-10 mb-5">
          <Shimmer className="w-20 h-20 rounded-2xl flex-shrink-0" />
          <div className="flex-1 pb-1 space-y-2">
            <Shimmer className="h-6 w-44 rounded-lg" />
            <Shimmer className="h-4 w-28 rounded-lg" />
            <div className="flex gap-2 mt-1">
              <Shimmer className="h-5 w-16 rounded-full" />
              <Shimmer className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 border-t border-slate-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`flex gap-3 p-3 rounded-xl bg-slate-50 ${i === 4 ? "col-span-2 sm:col-span-3" : ""}`}>
              <Shimmer className="w-7 h-7 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Shimmer className="h-2.5 w-12 rounded" />
                <Shimmer className="h-4 w-28 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Shimmer className="h-44 rounded-none" />
      <div className="p-4 space-y-3">
        <div className="space-y-1.5">
          <Shimmer className="h-5 w-3/4 rounded" />
          <Shimmer className="h-3.5 w-full rounded" />
          <Shimmer className="h-3.5 w-2/3 rounded" />
        </div>
        <div className="flex gap-1.5">
          <Shimmer className="h-5 w-16 rounded-full" />
          <Shimmer className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex gap-1.5 pt-2 border-t border-slate-100">
          <Shimmer className="h-5 w-10 rounded-full" />
          <Shimmer className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {[3, 2].map((count, si) => (
        <div key={si} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200">
            <Shimmer className="w-8 h-8 rounded-lg" />
            <Shimmer className="h-5 w-24 rounded" />
            <Shimmer className="ml-auto h-5 w-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}