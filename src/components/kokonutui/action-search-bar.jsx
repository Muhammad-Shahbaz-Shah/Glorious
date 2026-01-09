"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Send,
  BarChart2,
  Video,
  PlaneTakeoff,
} from "lucide-react";
import useDebounce from "@/hooks/use-debounce";

/* ---------------- ANIMATIONS ---------------- */

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { 
        duration: 0.2,
        staggerChildren: 0.05 // This ensures items pop in one by one
    },
  },
  exit: {
    opacity: 0,
    y: -5,
    transition: { duration: 0.15 },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -5 },
  show: { opacity: 1, x: 0 },
};



/* ---------------- DATA ---------------- */

const allActionsSample = [
  {
    id: "1",
    label: "Book tickets",
    icon: <PlaneTakeoff className="h-4 w-4 text-blue-500" />,
    short: "⌘K",
  },
  {
    id: "2",
    label: "Summarize",
    icon: <BarChart2 className="h-4 w-4 text-orange-500" />,
    short: "⌘P",
  },
  {
    id: "3",
    label: "Screen Studio",
    icon: <Video className="h-4 w-4 text-purple-500" />,
    short: "⌘S",
  },
  {
    id: "4",
    label: "Screen Studio",
    icon: <Video className="h-4 w-4 text-purple-500" />,
    short: "⌘S",
  },
];

/* ---------------- COMPONENT ---------------- */

function ActionSearchBar({ actions = allActionsSample }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const debouncedQuery = useDebounce(query, 200);

  /* ---------------- FILTER ---------------- */

  const filteredActions = useMemo(() => {
    if (!debouncedQuery) return [...actions];
    return [...actions].filter((action) =>
      action.label.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery, actions]);

  console.log(filteredActions)
  /* ---------------- ⌘K / CTRL+K ---------------- */

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }

      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* ---------------- CLICK OUTSIDE ---------------- */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- KEY NAV ---------------- */

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredActions.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : filteredActions.length - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        handleSelect(filteredActions[activeIndex]);
        break;
    }
  };

  /* ---------------- SELECT ---------------- */

  const handleSelect = (action) => {
    console.log("Selected:", action);
    setQuery("");
    setIsOpen(false);
  };

  /* ---------------- RESET INDEX ---------------- */

  useEffect(() => {
    setActiveIndex(0);
  }, [filteredActions]);

  /* ---------------- RENDER ---------------- */

  return (
    <div ref={containerRef} className="relative w-full max-w-sm mx-auto">
      {/* Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          value={query}
          placeholder="Search anything..."
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-9"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {query ? <Send className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </div>
      </div>

      {/* Dropdown */}
     <AnimatePresence mode="popLayout">
  {isOpen && filteredActions.length > 0 && (
    <motion.div
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="show"
      exit="exit"
      // Added overflow-hidden to ensure height: auto works cleanly
      className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-popover shadow-xl overflow-hidden"
    >
        <ul className="max-h-64 overflow-y-auto p-1.5">
          {filteredActions.map((action, index) => (
            <motion.li
              // IMPORTANT: Ensure your IDs in allActionsSample are UNIQUE (1, 2, 3, 4)
              key={action.id} 
              variants={ITEM_VARIANTS}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => handleSelect(action)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors ${
                activeIndex === index
                  ? "bg-accent text-accent-foreground"
                  : "text-popover-foreground hover:bg-accent/40"
              }`}
            >
              <div className="flex items-center gap-3">
                {action.icon}
                <span className="font-medium">{action.label}</span>
              </div>

              {action.short && (
                <span className="text-[10px] px-1.5 py-0.5 border rounded bg-muted font-mono">
                  {action.short}
                </span>
              )}
            </motion.li>
          ))}
        </ul>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}

export default ActionSearchBar;
