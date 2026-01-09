"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconCardsFilled } from "@tabler/icons-react";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import CardFlip from "../kokonutui/card-flip";
import { Button } from "../ui/button";
import CategoryLoader from "./CategoryLoader";
import MobileFlipCard from "./MobileFlipCard";
import { useMemo } from "react";
const Categories = ({ categories, isLoading }) => {
  const activeCategories = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return [];
    return categories.slice(0, 8);
  }, [categories]);

  const Header = () => (
    <div className="flex items-center justify-center w-full mt-7 gap-6">
      <div className="h-px hidden sm:block flex-1 bg-linear-to-r from-transparent via-border to-border" />
      <div className="text-center flex items-center flex-col space-y-2">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Popular Categories
        </h2>
        <p className="text-muted-foreground text-sm max-w-[300px] mx-auto">
          Explore our most popular product categories and find what you need
        </p>
        <Link href={"/categories"}>
          <Button
            variant={"link"}
            className="flex active:scale-90 group items-center gap-2"
          >
            Browse All Categories{" "}
            <ArrowRightIcon className="w-5 group-hover:translate-x-3 transition-all h-5" />
          </Button>
        </Link>
      </div>
      <div className="h-px hidden sm:block flex-1 bg-linear-to-l from-transparent via-border to-border" />
    </div>
  );

  const EmptyState = () => (
    <Empty className="my-10 border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCardsFilled />
        </EmptyMedia>
        <EmptyTitle>No Categories Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any categories yet. We are working on it.
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
    <div className="w-full px-4 md:px-0">
      <Header />

      {/* Desktop Grid */}
      <div className="hidden md:flex items-center justify-center flex-wrap md:px-10 px-2 py-4 md:py-10 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <CategoryLoader key={index} />
          ))
        ) : activeCategories.length > 0 ? (
          activeCategories.map((category, index) => (
            <CardFlip
              key={index}
              name={category.name}
              company={category.company}
              description={category.description}
              image={category.image}
              subtitle="Explore More About It"
              link={`/categories/${category._id}`}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Mobile View */}
      <div className="block md:hidden w-full py-5">
        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="min-w-[75%]">
                <CategoryLoader />
              </div>
            ))}
          </div>
        ) : activeCategories.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {activeCategories.map((category, index) => (
                <CarouselItem key={index} className="basis-[85%] sm:basis-[75%] shrink-0">
                  <MobileFlipCard
                    name={category.name}
                    company={category.company}
                    image={category.image}
                    description={category.description}
                    link={`/categories/${category._id}`}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Categories;

// skelton for mobile
