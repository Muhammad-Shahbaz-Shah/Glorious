"use client";

import Categories from "@/components/subComponents/Categories";
import FeaturesSection from "@/components/subComponents/FeaturesSection";
import LandingPage from "@/components/subComponents/landingPage";
import ProductsSection from "@/components/subComponents/ProductsSection";
import { useEffect, useState } from "react";
const page = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`/api/categories`, { next: { revalidate: 3600 } }),
          fetch(`/api/products`, { next: { revalidate: 3600 } }),
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        setCategories(catData.data);
        setProducts(prodData.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <LandingPage />
      <Categories
        categories={categories}
        products={products}
        isLoading={isLoading}
      />
      <ProductsSection
        products={products}
        categories={categories}
        isLoading={isLoading}
      />
      <FeaturesSection />
    </>
  );
};

export default page;
