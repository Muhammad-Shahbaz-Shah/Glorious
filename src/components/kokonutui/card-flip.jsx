"use client";

import { ArrowRight, Building2, Repeat2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
export default function CategoryCard({
  name,
  company,
  description,
  image, link
}) {
  const [isFlipped, setIsFlipped] = useState(false);
const [imgSrc, setImgSrc] = useState(image);

  return (

    /* Changed h-[280px] to h-[220px] to tighten the overall footprint */
    <div
      className="group relative select-none h-[220px] w-full max-w-[260px] [perspective:2000px] cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
      >
        {/* FRONT SIDE */}
       <div
          className={`absolute inset-0 h-full w-full rounded-xl border border-border bg-card p-2.5 shadow-sm [backface-visibility:hidden] flex flex-col transition-opacity duration-300 ${isFlipped ? "opacity-0" : "opacity-100"
            }`}
        >
          {/* Reduced aspect-video to a shallower height to save space */}
          <div className="relative h-32 w-full overflow-hidden rounded-lg bg-muted">
            <img
              src={imgSrc}
              alt={name}
              onError={(e) => setImgSrc("/placeholderImage.png")}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 rounded-md bg-background/90 backdrop-blur-sm px-1.5 py-0.5 border border-border text-[9px] font-bold text-primary shadow-sm">
              {company.length} BRANDS
            </div>
          </div>

          {/* Tightened margins (mt-2 instead of mt-3) */}
          <div className="mt-2 flex items-center justify-between gap-2 px-0.5">
            <div className="overflow-hidden">
              <h3 className="text-base font-bold leading-none text-foreground tracking-tight truncate">
                {name}
              </h3>
              <p className="mt-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">
                {company[0]} & More
              </p>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Repeat2 className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className={`absolute inset-0 h-full w-full overflow-hidden rounded-xl border border-primary/20 bg-card p-3 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col transition-opacity duration-300 ${isFlipped ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Building2 className="h-3 w-3 text-primary" />
              <span className="text-[9px] font-bold text-primary uppercase">Partners</span>
            </div>

            <h3 className="text-sm font-bold text-foreground mb-1">{name}</h3>

            <p className="text-[10px] leading-tight text-muted-foreground mb-2">
              {description}
            </p>

            <div className="flex flex-wrap gap-1">
              {company.map((brand, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 bg-secondary text-secondary-foreground text-[8px] font-bold rounded border border-border/50"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-border">
            <Link href={link}><button className="flex w-full items-center justify-between rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground hover:opacity-90 transition-all active:scale-95">
              <span>EXPLORE</span>
              <ArrowRight className="h-3 w-3" />
            </button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}