"use client";

import { useEffect, useState } from "react";
import CardFlip from "@/components/kokonutui/card-flip";
import CategoryLoader from "@/components/subComponents/CategoryLoader";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconCardsFilled } from "@tabler/icons-react";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import MobileFlipCard from "@/components/subComponents/MobileFlipCard";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories", {
          next: { revalidate: 3600 },
        });
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen w-full pb-20 pt-5">
      {/* Header Section */}
      <div className="flex items-center justify-center w-full mb-10 gap-6">
        <div className="h-px hidden sm:block flex-1 bg-linear-to-r from-transparent via-border to-border" />
        <div className="text-center flex items-center flex-col space-y-2">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            All Categories
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-[500px] mx-auto">
            Browse our complete collection of product categories. Find exactly
            what you are looking for.
          </p>
        </div>
        <div className="h-1px hidden sm:block flex-1 bg-linear-to-l from-transparent via-border to-border" />
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <CategoryLoader key={index} />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <div key={category._id || index}>
                <div className="hidden md:block">
                  <CardFlip
                    name={category.name}
                    company={category.company}
                    description={category.description}
                    image={category.image}
                    subtitle="Explore More About It"
                    link={`/categories/${category._id}`}
                  />
                </div>
                <div className="block md:hidden">
                  <MobileFlipCard
                    name={category.name}
                    company={category.company}
                    description={category.description}
                    image={category.image}
                    link={`/categories/${category._id}`}
                  />
                </div>
              </div>
            ))}
          </div>

        ) : (
          <div className="flex justify-center w-full">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconCardsFilled />
                </EmptyMedia>
                <EmptyTitle>No Categories Found</EmptyTitle>
                <EmptyDescription>
                  We couldn't find any categories at the moment. Please check
                  back later.
                </EmptyDescription>
              </EmptyHeader>
              <Button
                variant="link"
                asChild
                className="text-muted-foreground"
                size="sm"
              >
                <Link href="/contact">
                  Contact Us <ArrowUpRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </Empty>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
