import React from "react";

const CategoryLoader = () => {
  return (
    <>
      {/* Desktop Loader (Vertical) - Matches CardFlip */}
      <div className="hidden md:flex h-[220px] w-full max-w-[260px] rounded-xl border border-border bg-card p-2.5 shadow-sm flex-col">
        {/* 1. Image Area Skeleton */}
        <div className="relative h-32 w-full overflow-hidden rounded-lg bg-muted animate-pulse">
          <div className="absolute top-2 right-2 h-4 w-12 rounded-md bg-muted-foreground/20" />
        </div>

        {/* 2. Content Info Skeleton */}
        <div className="mt-2 flex items-center justify-between gap-2 px-0.5">
          <div className="flex-1 space-y-2 overflow-hidden">
            {/* Category Name Line */}
            <div className="h-4 w-3/4 rounded-md bg-muted animate-pulse" />
            {/* Subtitle/Company Line */}
            <div className="h-3 w-1/2 rounded-md bg-muted/60 animate-pulse" />
          </div>

          {/* Circular Icon Skeleton */}
          <div className="h-8 w-8 shrink-0 rounded-full bg-muted animate-pulse flex items-center justify-center">
             <div className="h-4 w-4 rounded-full bg-muted-foreground/20" />
          </div>
        </div>
      </div>

      {/* Mobile Loader (Horizontal) - Matches MobileFlipCard */}
      <div className="flex md:hidden h-[100px] w-full rounded-2xl border border-border/50 bg-card p-2 shadow-sm flex-row gap-3 items-center">
        {/* 1. Square Image Skeleton */}
        <div className="h-full aspect-square rounded-xl bg-muted animate-pulse shrink-0 relative">
          <div className="absolute top-1 left-1 h-3 w-8 rounded-md bg-muted-foreground/10" />
        </div>

        {/* 2. Content Area Skeleton */}
        <div className="flex flex-col justify-between h-full py-1 flex-1 min-w-0">
          <div className="space-y-2">
            <div className="h-4 w-2/3 rounded-md bg-muted animate-pulse" />
            <div className="h-3 w-1/2 rounded-md bg-muted/60 animate-pulse" />
          </div>

          <div className="flex items-end justify-between">
            <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
            <div className="h-7 w-7 rounded-full bg-muted animate-pulse shrink-0" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryLoader;

