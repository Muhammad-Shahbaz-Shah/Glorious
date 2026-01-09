"use client";

import { motion } from "framer-motion";
import { Loader2, ShoppingBag } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="flex min-h-[90vh] items-center justify-center"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        {/* Icon container */}
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg"
          style={{
            background: "color-mix(in srgb, var(--primary) 15%, transparent)",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "linear",
            }}
            style={{ color: "var(--primary)" }}
          >
            <Loader2 size={36} />
          </motion.div>
        </div>

        {/* Brand / text */}
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <ShoppingBag size={16} />
          Loading your experience…
        </motion.div>
      </motion.div>
    </div>
  );
}
