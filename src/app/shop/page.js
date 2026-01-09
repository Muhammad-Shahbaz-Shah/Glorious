"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, SearchX, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/subComponents/SubProductsSection";
import ProductLoader from "@/components/subComponents/productLoader";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Toggle } from "@/components/ui/toggle";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isToggle, setIsToggle] = useState(false);
  const [bufferToggle, setBufferToggle] = useState(false);

  const handleSliderFilter = (value) => {
    const [min, max] = value;
  };
 
  const fetchProducts = async (page = 1) => {
    
    setLoading(true);
    try {
      const res = await fetch(
        `/api/products?page=${page}&limit=15&searchQuery=${searchQuery}`,
        { next: { revalidate: 3600 } }
      );
      const { data, pagination } = await res.json();
      if (data) {
        setProducts(data);
      }
      if (pagination) {
        setTotalPages(pagination.totalPages);
        setCurrentPage(pagination.currentPage);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    await fetchProducts(1);
  };

  
  useEffect(() => {
    if (searchQuery === "") {
      fetchProducts(currentPage)
    }
  }, [searchQuery]);

  const handlePriceFilter = (val) => {
    if (!val) return;
    if (val === "default") {
     fetchProducts(currentPage)
    }
    const sortedProducts = [...products].sort((a, b) => {
      if (val === "LowtoHigh") return a.price - b.price;
      if (val === "HightoLow") return b.price - a.price;
      return 0;
    });
    setProducts(sortedProducts);
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const catRes = await fetch(`/api/categories` ,{ next: { revalidate: 3600 }});
        const catData = await catRes.json();
        if (catData?.status === 200 && catData.data?.length) {
          setCategories(catData.data || []);
        }
        await fetchProducts(1);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const fetchData = () => {
    // Keeping this as a wrapper if used elsewhere or removing calls to it
    fetchProducts(currentPage);
  };

  return (
    <div className="max-w-[98%] mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="space-y-6 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
            <p className="text-muted-foreground mt-1">
              Find products that match your style
            </p>
          </div>

          {/* Mobile Filters */}
        </div>
      </div>

      <div className="sticky top-[64px] z-40 -mx-4 px-4 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center gap-4 py-4 max-w-7xl mx-auto">
          {/* Search Input Group */}
          <div className="flex items-center gap-2 w-full md:flex-1 relative group">
            <div className="absolute left-3 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="h-4 w-4" />
            </div>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10 h-11 rounded-xl bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background transition-all"
            />
            <Button
              onClick={() => handleSearch()}
              className="rounded-xl h-11 px-6 shadow-sm hover:shadow-md transition-all"
            >
              Search
            </Button>
          </div>

          {/* Actions Group */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select onValueChange={(val) => handlePriceFilter(val)}>
              <SelectTrigger className="w-full md:w-[180px] h-11 rounded-xl bg-muted/50 border-none focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="default">Newest First</SelectItem>
                  <SelectItem value="LowtoHigh">Price: Low to High</SelectItem>
                  <SelectItem value="HightoLow">Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Desktop Filters */}

        {/* Products Area */}
        <main className="lg:col-span-4 space-y-6">
          {/* Status Bar */}
          <div className="flex items-center justify-between py-1  border-b border-border/40">
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground font-mono tracking-wider">
                Results:{" "}
                <span className="text-foreground">{products.length}</span>
              </p>
            
            </div>
          </div>

          {/* Product Grid (your card goes here) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products?.length > 0 ? (
              products.map((item) => <ProductCard product={item} key={item._id} />)
            ) : loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <ProductLoader key={index} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <SearchX className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  No products found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try to refresh the page.
                </p>
              </div>
            )}
          </div>

          {/* Pagination Placeholder */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if(loading) return;
                    setBufferToggle((prev)=>!prev)
                    fetchProducts(currentPage - 1)
                  }}
                  className={
                    currentPage === 1 || loading
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => {
                        if(loading) return;
                        setBufferToggle((prev)=>!prev)
                        fetchProducts(page)
                      }}
                      className={loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if(loading) return;
                    setBufferToggle((prev)=>!prev)
                    fetchProducts(currentPage + 1)
                  }}
                  className={
                    currentPage === totalPages || loading
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
