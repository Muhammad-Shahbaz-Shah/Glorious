"use client";
import { ArrowRight, Building2, Repeat2, Info, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MobileCategoryCard({
  name,
  company,
  image,
  description,
  link,
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  // Hidden on desktop (md:hidden) to ensure it only renders for mobile users
  return (
    <div
      className="md:hidden group relative select-none h-[100px] w-full [perspective:2000px] cursor-pointer mx-auto active:scale-[0.97] transition-transform duration-200"
      onClick={handleFlip}
    >
      <div
        className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRONT SIDE */}
        <div
          className={`absolute inset-0 h-full w-full rounded-2xl border border-border/50 bg-card p-2 shadow-sm [backface-visibility:hidden] flex flex-row gap-3 items-center transition-opacity duration-300 ${
            isFlipped ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Square Image Container */}
          <div className="relative h-full aspect-square overflow-hidden rounded-xl bg-muted shrink-0 shadow-inner">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
            />
            {/* Glassmorphism Badge */}
            <div className="absolute top-1 left-1 rounded-md bg-white/20 backdrop-blur-md px-1.5 py-0.5 border border-white/30 text-[9px] font-black text-white shadow-sm">
              {company.length} {company.length === 1 ? "Brand" : "Brands"}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-col justify-between h-full py-1 flex-1 min-w-0">
            <div>
              <h3 className="text-[15px] font-bold text-foreground truncate leading-none">
                {name}
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight mt-1 truncate">
                {company.slice(0, 2).join(", ")}{" "}
                {company.length > 2 && "& More"}
              </p>
            </div>

            <div className="flex items-end justify-between">
              <span className="text-[10px] text-primary font-semibold flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-full">
                <Info className="h-3 w-3" /> Details
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground shadow-sm">
                <Repeat2 className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className={`absolute inset-0 h-full w-full overflow-hidden rounded-2xl border border-primary/20 bg-card p-2 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-row gap-2 items-center transition-opacity duration-300 ${
            isFlipped ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex-1 flex flex-col justify-between h-full py-1 pl-1">
            <div className="overflow-hidden">
              <div className="flex items-center gap-1 mb-1">
                <Building2 className="h-3 w-3 text-primary" />
                <span className="text-[8px] font-bold text-primary uppercase tracking-widest">
                  Quick Info
                </span>
              </div>
              <p className="text-[10px] leading-tight text-muted-foreground line-clamp-2 italic">
                "{description}"
              </p>
            </div>

            <div className="flex gap-1 overflow-hidden">
              {company.slice(0, 5).map((brand, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 bg-muted text-[8px] font-medium rounded border border-border text-foreground/80 whitespace-nowrap"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button Strip */}
          <button
           
            className="flex h-8 absolute bottom-2  right-2 w-8 p-1 items-center justify-center  rounded-full bg-gradient-to-b from-primary/85 to-accent-foreground text-primary-foreground active:scale-95 transition-all shrink-0 shadow-md"
          >
            <Link href={link  } className="font-black transition-all cursor-pointer hover:scale-110 hover:rotate-180">
              <Globe className="h-4 w-4" />
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
