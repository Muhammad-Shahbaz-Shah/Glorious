"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ChevronRight,
  ArrowLeft,
  Package,
  SlidersHorizontal,
} from "lucide-react";

import { ProductCard } from "@/components/subComponents/SubProductsSection";
import ProductLoader from "@/components/subComponents/productLoader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

const FALLBACK_IMAGE =
  "/placeholder.png";

const CategoryDetailPage = () => {
  const params = useParams();
  const categoryId = params.category;

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return;
    window.scrollTo(0, 0);

    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`/api/categories?id=${categoryId}`),
          fetch(`/api/products?category=${categoryId}`),
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        if (catData.status !== 200 ) {
          setError("Category not found");
        } else {
          setCategory(catData.data);
        }

        if (prodData && prodData.data?.length) {

          setProducts(prodData.data || []);
        } 
      } catch (err) {
        setError("Unable to connect to the server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (loading) return <CategorySkeleton />;
  if (error || !category) return <CategoryError message={error} />;

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* --- Dynamic Hero Section --- */}
      <section className="relative h-[50vh] min-h-[400px] border-border shadow-2xl   w-[90%] rounded-3xl mx-auto flex items-center overflow-hidden">
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          src={category.image || FALLBACK_IMAGE}
          alt={category.name}
          className="absolute inset-0 hover:scale-105 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />

        <div className="container relative z-10 mx-auto px-4 mt-20">
          <nav className="flex items-center text-sm font-medium text-muted-foreground mb-6 backdrop-blur-md bg-white/10 w-fit px-3 py-1 shadow-2xl rounded-full border border-white/20">
            <Link
              href="/"
              className="hover:text-primary transition-colors flex items-center"
            >
              <Home className="w-3.5 h-3.5 mr-1 " /> Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-1 opactiy-50" />
            <Link
              href="/categories"
              className="hover:text-primary transition-colors"
            >
              Categories
            </Link>
            <ChevronRight className="w-4 h-4 mx-1 opacity-50" />
            <span className="text-foreground font-semibold font-mono">
              {category.name}
            </span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl   md:text-7xl font-bold tracking-tight mb-3">
              {category.name}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {category.description ||
                `Discover our exclusive collection of ${category.name.toLowerCase()}.`}
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- Content Section --- */}
      <main className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                Products
                <span className="text-xs bg-white font-bold border w-6 h-6   flex items-center justify-center shadow-2xl rounded-full "> {products.length}</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Showing results for "{category.name}"
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {products.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
              >
                {products.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

/* --- Sub-Components for Cleanliness --- */

const CategorySkeleton = () => (
  
    <div className="bg-background min-h-screen pb-20 animate-pulse">
      {/* ================= HERO SKELETON ================= */}
      <section className="relative h-[50vh] min-h-[400px] w-[90%] rounded-3xl mx-auto overflow-hidden">
        {/* Image placeholder */}
        <div className="absolute inset-0 bg-muted" />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />

        <div className="container relative z-10 mx-auto px-4 mt-20">
          {/* Breadcrumb skeleton */}
          <div className="h-8 w-64 rounded-full bg-muted mb-6" />

          {/* Title skeleton */}
          <div className="space-y-4 max-w-3xl">
            <div className="h-14 md:h-20 w-3/4 bg-muted rounded-xl" />
            <div className="h-6 w-2/3 bg-muted rounded-md" />
            <div className="h-6 w-1/2 bg-muted rounded-md" />
          </div>
        </div>
      </section>

      {/* ================= CONTENT SKELETON ================= */}
      <main className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="space-y-2">
              <div className="h-7 w-40 bg-muted rounded-md" />
              <div className="h-4 w-64 bg-muted rounded-md" />
            </div>

            <div className="h-9 w-32 bg-muted rounded-md" />
          </div>

          {/* Product grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-background overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-square bg-muted" />

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 bg-muted rounded-md" />
                  <div className="h-4 w-1/2 bg-muted rounded-md" />
                  <div className="h-5 w-1/3 bg-muted rounded-md mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
);

const CategoryError = ({ message }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <Empty className="w-full max-w-md rounded-xl border border-border bg-background p-10 shadow-sm">
        <EmptyHeader className="text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Package className="h-10 w-10 text-primary" />
          </div>

          {/* Title */}
          <EmptyTitle className="text-2xl font-semibold tracking-tight">
            {message || "Category Not Found"}
          </EmptyTitle>

          {/* Description */}
          <EmptyDescription className="mt-3 text-sm text-muted-foreground leading-relaxed">
            We couldn’t find the category you’re looking for.
            <br />
            It may have been moved or removed.
          </EmptyDescription>
        </EmptyHeader>

        {/* Action */}
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/categories">
              <ArrowLeft className="h-4 w-4" />
              Browse Categories
            </Link>
          </Button>
        </div>
      </Empty>
    </div>
  );
};


const EmptyState = () => (
  <div className="py-20 text-center border-2 border-dashed rounded-xl">
    <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
    <h3 className="text-lg font-medium">No products found</h3>
    <p className="text-muted-foreground mb-6">
      We're currently restocking this category.
    </p>
    <Button asChild variant="link">
      <Link href="/categories">Explore other categories</Link>
    </Button>
  </div>
);

export default CategoryDetailPage;
