"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import ProductLoader from "./productLoader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import Link from "next/link";

const ProductCard = ({ product }) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const addToCart = async (e) => {
    e.preventDefault(); // Prevent link navigation
    setAddingToCart(true);
    if (!user) {
      toast.error("Please sign in first");
      setAddingToCart(false);
      return;
    }
    try {
      const res = await fetch("/api/mycart/addtocart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          userId: user.id,
          price: product.discountPrice,
          name: product.name,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAddingToCart(false);
    }
  };

  const getInitialImage = () => {
    if (Array.isArray(product?.image) && product.image.length > 0) return product.image[0];
    return product?.image || "/placeholderImage.png";
  };

  const [imgSrc, setImgSrc] = useState(getInitialImage());

  useEffect(() => { setImgSrc(getInitialImage()); }, [product?.image]);

  const discountPercentage = Math.floor(((product.price - product.discountPrice) / product.price) * 100);

  return (
    <div className="group relative w-full flex flex-col gap-2 p-3 rounded-3xl bg-card hover:bg-muted/50 transition-all duration-300 border border-border/40 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/shop/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-secondary/20">
          <Image
            src={imgSrc}
            alt={product?.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImgSrc("/placeholderImage.png")}
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 z-10">
              <span className="inline-flex items-center px-2 py-1 rounded-lg bg-red-500/90 backdrop-blur-sm text-[10px] font-bold text-white shadow-sm">
                -{discountPercentage}%
              </span>
            </div>
          )}

          {/* Quick Action Overlay (Desktop) */}
          <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
             <Button
                size="sm"
                onClick={addToCart}
                className="rounded-full shadow-xl bg-white/90 text-black hover:bg-white hover:scale-105 backdrop-blur-md"
              >
                {addingToCart ? <Spinner className="w-4 h-4" /> : <span className="flex items-center gap-1.5 font-medium text-xs">Add to Cart</span>}
              </Button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-3 space-y-1.5">
          <div className="flex justify-between items-start">
             <h3 className="text-sm font-semibold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product?.name}
            </h3>
          </div>
          
           <div className="flex items-center justify-between pt-1">
             <div className="flex flex-col">
               <span className="text-[11px] text-muted-foreground line-through decoration-red-400">
                 ${product?.price}
               </span>
               <div className="flex items-baseline gap-1">
                 <span className="text-lg font-bold text-foreground tracking-tight">
                   ${product?.discountPrice}
                 </span>
               </div>
             </div>
             
             {product?.rating > 0 ? (
               <div className="flex items-center gap-1 bg-yellow-400/10 px-1.5 py-0.5 rounded-md">
                 <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                 <span className="text-xs font-semibold text-yellow-700">
                   {product.rating.toFixed(1)}
                 </span>
                 {product?.numReviews > 0 && (
                   <span className="text-[10px] text-muted-foreground ml-0.5">
                     ({product.numReviews})
                   </span>
                 )}
               </div>
             ) : (
               <div className="flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-md">
                 <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">New Arrival</span>
               </div>
             )}
           </div>
        </div>
      </Link>
      
      {/* Mobile Add Button (Visible only on touch devices usually, but for now fallback if hover isn't primary interaction) */}
       <div className="md:hidden mt-2">
            <Button
                className="w-full rounded-xl text-xs h-9"
                onClick={addToCart}
                disabled={addingToCart}
            >
               {addingToCart ? <Spinner className="w-3 h-3"/> : "Add to Cart"}
            </Button>
        </div>
    </div>
  );
};

export { ProductCard }; // Export individually for use in other files


// --- MAIN SECTION COMPONENT ---
const SubProductsSection = ({ products, Heading, SubHeading }) => {
  const hasProducts = products?.length > 0;
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="mb-3 w-full px-3 md:px-10 py-4 md:py-10 flex flex-col gap-3 items-center justify-center">
      {/* Header Section
      <div className="text-center max-w-2xl">
        <h2 className="text-5xl font-bold text-emerald-900 mb-6">{Heading}</h2>
        <p className="max-w-2xl text-zinc-500 text-lg leading-relaxed">
          {SubHeading}
        </p>
      </div> */}

      {/* PC Grid: Changed to Grid for better alignment than flex-wrap */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 w-full max-w-7xl">
        {hasProducts ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : isLoading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <ProductLoader key={index} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            No products found in this category.
          </div>
        )}
      </div>

      {/* Mobile Carousel */}
      <div className="w-full my-3 md:hidden">
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          <CarouselContent className="">
            {hasProducts ? (
              products.map((product) => (
                <CarouselItem
                  key={product._id}
                  className=" basis-[78%] shrink-0"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))
            ) : isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <CarouselItem key={index} className="basis-[78%]">
                  <ProductLoader />
                </CarouselItem>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                No products found in this category.
              </div>
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default SubProductsSection;
