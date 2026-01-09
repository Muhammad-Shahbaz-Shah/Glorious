const ProductLoader = () => {
  return (
    <div className="group  relative w-full flex flex-row sm:flex-col gap-3 bg-card border border-border/60 shadow-sm rounded-2xl p-2 transition-all">
      {/* IMAGE SECTION SKELETON - Matched to h-24 mobile / h-40 desktop */}
      <div className="relative h-24 w-24 min-w-[96px] sm:h-40 sm:w-full overflow-hidden rounded-xl bg-muted animate-pulse shrink-0">
        <div className="absolute top-1 left-1 h-3 w-7 bg-muted-foreground/20 rounded-full" />
      </div>

      {/* CONTENT SECTION SKELETON */}
      <div className="flex flex-col justify-between flex-1 py-1 pr-1 overflow-hidden">
        <div>
          <div className="flex justify-between items-start">
            {/* Category Skeleton */}
            <div className="h-2.5 w-12 bg-muted animate-pulse rounded" />

            {/* Mobile Rating Skeleton (sm:hidden) */}
            <div className="flex items-center gap-0.5 sm:hidden">
              <div className="h-2.5 w-2.5 bg-muted animate-pulse rounded-full" />
              <div className="h-2.5 w-4 bg-muted animate-pulse rounded" />
            </div>
          </div>

          {/* Title Skeleton */}
          <div className="mt-2 space-y-1.5">
            <div className="h-3.5 w-full bg-muted animate-pulse rounded" />
            <div className="h-3.5 w-2/3 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* PRICE & ACTION SKELETON */}
        <div className="mt-4 flex items-end justify-between">
          <div className="flex flex-col gap-1.5">
            {/* Old Price Skeleton */}
            <div className="h-2 w-10 bg-muted animate-pulse rounded" />
            {/* Price Skeleton */}
            <div className="h-5 w-16 bg-muted animate-pulse rounded" />
          </div>

          {/* Button Skeleton - Matched to h-8 w-8 */}
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default ProductLoader;
