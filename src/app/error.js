"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({ error, reset }) {
  return (
    <div
      className="flex min-h-[90vh] items-center justify-center px-6"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl border p-8 text-center shadow-lg"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        {/* Icon */}
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 10 }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 1.5,
            ease: "easeInOut",
          }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: "color-mix(in srgb, var(--primary) 15%, transparent)",
            color: "var(--primary)",
          }}
        >
          <AlertTriangle size={32} />
        </motion.div>

        {/* Title */}
        <h1 className="mb-2 text-2xl font-semibold">Something went wrong</h1>

        {/* Description */}
        <p className="mb-6 text-sm opacity-80">
          An unexpected error occurred. Please try again or refresh the page.
        </p>

        {/* Error message (optional – safe for dev) */}
        {process.env.NODE_ENV === "development" && (
          <p
            className="mb-4 rounded-md px-3 py-2 text-xs"
            style={{
              background: "var(--muted)",
              color: "var(--muted-foreground)",
            }}
          >
            {error?.message}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={reset}
            className="flex items-center gap-2"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            <RefreshCw size={16} />
            Try again
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
