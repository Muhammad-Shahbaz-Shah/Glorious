"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="flex min-h-[90vh] items-center justify-center px-6"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg rounded-2xl border p-10 text-center shadow-xl"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        {/* Floating Icon */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: "color-mix(in srgb, var(--primary) 15%, transparent)",
            color: "var(--primary)",
          }}
        >
          <Ghost size={36} />
        </motion.div>

        {/* 404 */}
        <h1
          className="mb-2 text-6xl font-extrabold tracking-tight"
          style={{ color: "var(--primary)" }}
        >
          404
        </h1>

        {/* Title */}
        <h2 className="mb-3 text-2xl font-semibold">Page not found</h2>

        {/* Description */}
        <p className="mb-8 text-sm opacity-80">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/">
            <Button
              className="flex items-center gap-2"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              <Home size={16} />
              Go Home
            </Button>
          </Link>

          <Link href="/shop">
            <Button variant="outline" className="flex items-center gap-2">
              <Search size={16} />
              Browse Products
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
