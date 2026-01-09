"use client";

import { useState } from "react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "./SubProductsSection";
import ProductLoader from "./productLoader";

import { IconCardsFilled } from "@tabler/icons-react";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useMemo } from "react";
export default function AllProductCard({ products, isLoading, categories }) {
  const activeCategories = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return [];
    return categories.slice(0, 5); // Show first 5 categories as tabs
  }, [categories]);

  const defaultTab = activeCategories[0]?.name || "all";

  const EmptyState = ({ title, description }) => (
    <Empty className="my-10 border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCardsFilled />
        </EmptyMedia>
        <EmptyTitle>{title || "No Products Yet"}</EmptyTitle>
        <EmptyDescription>
          {description ||
            "We haven't uploaded any products yet. We are working on it."}
        </EmptyDescription>
      </EmptyHeader>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <Link href="/contact">
          Contact Us <ArrowUpRightIcon />
        </Link>
      </Button>
    </Empty>
  );

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-linear-to-b from-background to-secondary/10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center flex items-center flex-col space-y-2">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-sm max-w-[300px] mx-auto">
            Explore our most popular products and find what you need
          </p>
        </div>

        {activeCategories.length > 0 ? (
          <Tabs
            key={defaultTab}
            defaultValue={defaultTab}
            className="w-full flex flex-col items-center"
          >
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <TabsList className="h-auto p-1 bg-secondary/50 backdrop-blur-sm rounded-full border border-border/50 max-w-full overflow-x-auto flex-nowrap">
                {activeCategories.map((item, index) => (
                  <TabsTrigger
                    key={index}
                    value={item.name}
                    className="rounded-full px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm shrink-0"
                  >
                    {item.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <Link href={"/shop"}>
                <Button
                  variant="ghost"
                  className="group text-primary hover:text-primary/80 hover:bg-primary/5"
                >
                  View All Products
                  <ArrowUpRightIcon className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </Link>
            </div>

            {activeCategories.map((item, index) => (
              <TabsContent
                key={index}
                value={item.name}
                className="w-full mt-0 focus-visible:ring-0"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {products
                    .filter((product) => product.category?._id === item._id)
                    .map((product, idx) => (
                      <ProductCard key={idx} product={product} />
                    ))}
                </div>
                {products.filter((p) => p.category?._id === item._id).length ===
                  0 && (
                  <div className="w-full py-20 flex flex-col items-center justify-center text-muted-foreground text-center">
                    <IconCardsFilled className="w-16 h-16 opacity-20 mb-4" />
                    <p>No products found in this category.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
            {Array.from({ length: 5 }).map((_, index) => (
              <ProductLoader key={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <Link href={"/shop"} className="mb-8">
              <Button variant="outline" className="group">
                Browse All Products
                <ArrowUpRightIcon className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
            <EmptyState
              title="No Collections Found"
              description="We are currently organizing our store. Check back soon for new arrivals!"
            />
          </div>
        )}
      </div>
    </section>
  );
}
