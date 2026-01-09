"use client";

import {
  ArrowRight,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function RedesignedProductPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [tabImg, setTabImg] = useState("/placeholderImage.png");
  const [addingReview, setAddingReview] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const { data: session } = useSession();
  const params = useParams();
  const id = params?.id;
  const getProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products?id=" + id);
      const json = await res.json();
      const data = json.data;
      if (!data?.[0]) {
        toast.error("Product not found");
      } else {
        setProduct(data[0]);
        // Set initial image to the first one in the array, or placeholder
        const mainImage =
          Array.isArray(data[0].image) && data[0].image.length > 0
            ? data[0].image[0]
            : "/placeholderImage.png";
        setActiveImage(mainImage);
      }
    } catch (error) {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!id) return;

    getProduct();
  }, [id]);

  const handlePostReview = async () => {
    setAddingReview(true);
    if (!session?.user?.id) {
      toast.error("Please sign in to add a review");
      setAddingReview(false);
      setIsReviewOpen(false);
      return;
    } else if (!session?.user?.emailVerified) {
      toast.error("Please verify your email to add a review");
      setAddingReview(false);
      return;
    } else if (!rating || !review) {
      toast.error("Please provide a rating and review");
      setAddingReview(false);
      return;
    }
    try {
      const res = await fetch("/api/products/addreview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          productId: product._id,
          rating,
          comment: review.trim(),
        }),
      });
      if (res.ok) {
        toast.success("Review added successfully");
        setAddingReview(false);
        setIsReviewOpen(false);
        getProduct();
        setRating(0);
        setReview("");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to add review");
        setAddingReview(false);
      }
    } catch (error) {
      setAddingReview(false);
      toast.error("Something went wrong");
    }
  };

  const handleAddToCart = async () => {
    if (!session?.user?.id) {
      toast.error("Please sign in to add items to cart");
      return;
    } else if (!session?.user?.emailVerified) {
      toast.error("Please verify your email to add items to cart");
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch("/api/mycart/addtocart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          productId: product._id,
          quantity,
          price: product.discountPrice || product.price,
          name: product.name,
        }),
      });

      if (res.ok) {
        toast.success(`${product.name} added to cart!`);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to add to cart");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsAdding(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-10 w-10 text-primary" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
            Curating Experience
          </p>
        </div>
      </div>
    );

  if (!product) return null;

  // Rating Calculations
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  product.reviews?.forEach((rev) => {
    if (ratingCounts[rev.rating] !== undefined) ratingCounts[rev.rating]++;
  });
  const totalReviews = product.reviews?.length || 0;
  const getPercentage = (count) =>
    totalReviews > 0 ? (count / totalReviews) * 100 : 0;

  // Handle both array and potential legacy string format
  const images = Array.isArray(product.image)
    ? product.image
    : [product.image].filter(Boolean);
  const displayImages = images.length > 0 ? images : ["/placeholderImage.png"];
  const handleImageError = () => {
    // If the current failed image is the first one, try the second one
    if (images.length > 1 && activeImage === images[0]) {
      setActiveImage(images[1]);
    } else {
      // Otherwise fallback to placeholder
      setActiveImage("/placeholderImage.png");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* --- Breadcrumbs --- */}
      <nav className="mx-auto max-w-[1400px] px-6 py-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Link href="/shop">
          <span className="hover:text-foreground  flex items-center gap-1 cursor-pointer transition-colors">
            <ShoppingBag className="h-4 w-4" /> Shop
          </span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={"/categories/" + product.category?._id}>
          <span className="hover:text-foreground cursor-pointer transition-colors">
            {product.category?.name || "Collection"}
          </span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-semibold">{product.name}</span>
      </nav>

      <section className="mx-auto max-w-[1400px] px-6 pb-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* --- Left: Gallery --- */}
          <div className="lg:col-span-7 space-y-6">
            <div className="sticky top-24 space-y-4">
              <div className="group relative aspect-square lg:aspect-4/5 overflow-hidden rounded-2xl bg-secondary/20 border border-border/50">
                <Image
                  src={activeImage || "/placeholderImage.png"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  priority
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* <Button
                  variant="blur"
                  size="icon"
                  className="absolute top-6 right-6 rounded-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
                >
                  <Share2 className="h-4 w-4 text-white" />
                </Button> */}
              </div>

              <div className="grid grid-cols-5 gap-3">
                {displayImages.slice(0, 5).map((img, i) => {
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-square overflow-hidden rounded-lg border transition-all duration-300 ${
                        activeImage === img
                          ? "border-primary ring-2 ring-primary"
                          : "border-transparent opacity-50 hover:border-border"
                      }`}
                    >
                      <img
                        src={img || "/placeholderImage.png"}
                        alt={`Thumbnail ${i + 1}`}
                        className="object-cover w-full h-full"
                        onError={(e) =>
                          (e.target.src = "/placeholderImage.png")
                        }
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* --- Right: Detailed Product Info --- */}
          <div className="lg:col-span-5 flex flex-col pt-2">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="w-fit rounded-md px-3 py-1 text-xs font-medium"
              >
                {product.brand}
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                {product.name}
              </h1>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="text-base font-bold">
                  {product.rating > 0 ? (
                    product.rating.toFixed(1)
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">
                      No Ratings Yet
                    </span>
                  )}
                </span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-muted-foreground">
                {product.reviews.length || "0"} Reviews
              </span>
            </div>

            <div className="mt-8 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight">
                  ${product.discountPrice?.toLocaleString()}
                </span>
                {product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.price?.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Tax included. Free shipping on all orders.
              </p>
            </div>

            <Separator className="my-8" />

            <div className="space-y-6">
              <p className="text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="secondary"
                  className="px-3 py-1.5 rounded-md text-xs font-medium"
                >
                  {product.stock > 0
                    ? "In Stock & Ready to Ship"
                    : "Out of Stock"}
                </Badge>

                <Badge
                  variant="secondary"
                  className="px-3 py-1.5 rounded-md text-xs font-medium"
                >
                  Authenticity Guaranteed
                </Badge>
              </div>
            </div>

            {/* --- Actions --- */}
            <div className="mt-10 space-y-4">
              <div className="flex gap-4">
                <div className="flex items-center rounded-lg border border-border p-1 bg-background">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-md"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-medium text-base">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-md"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  disabled={isAdding || product.stock <= 0}
                  onClick={handleAddToCart}
                  className="flex-1 h-12 rounded-lg bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
                >
                  {isAdding ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-2 h-4 w-4" />
                  )}
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>

            {/* --- Trust Grid --- */}
            <div className="mt-10 grid grid-cols-3 w-full gap-3 pt-8 border-t border-border">
              {[
                { icon: Truck, label: "Fast Delivery" },
                { icon: RefreshCw, label: "Free Returns" },
                { icon: ShieldCheck, label: "Secure Payment" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center flex-col  group gap-1 text-sm text-muted-foreground"
                >
                  <item.icon className="h-12 w-12  hover:bg-primary hover:text-white text-accent-foreground font-bold duration-400 transition-colors rounded-full p-2.5 group-hover:bg-primary group-hover:text-white" />
                  <span>{item.label}</span>
                  <Separator orientation="verticle" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Review Section --- */}
        <div className="mt-10 border-t border-border pt-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-black  tracking-tight">
                Customer Reviews
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Based on {totalReviews} reviews from verified customers
              </p>
            </div>
            <Popover open={isReviewOpen} onOpenChange={setIsReviewOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">Write a review</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Card className="w-full max-w-md ">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-lg font-semibold">
                      Write a Review
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Share your experience with this product
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          onClick={() => setRating(star)}
                          className={`h-5 w-5 cursor-pointer transition-all ${
                            star <= rating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground hover:fill-primary hover:text-primary"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Review Input */}
                    <Textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Write your review here..."
                      className="min-h-[100px] resize-none"
                    />

                    {/* Action */}
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => {
                          setIsReviewOpen(false);
                          setRating(0);
                          setReview("");
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePostReview}
                        disabled={addingReview}
                      >
                        {addingReview ? <Spinner /> : "Post Review"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-8">
              <div className="p-6 rounded-2xl bg-secondary/20 border border-border">
                <div className="flex items-end gap-3 mb-6">
                  <div className="text-5xl font-bold">
                    {product.rating > 0 ? product.rating.toFixed(1) : "0.0"}
                  </div>
                  <div className="mb-2">
                    <div className="flex text-primary mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(product.rating || 0)
                              ? "fill-current"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {totalReviews} Ratings
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-xs font-medium w-3">{star}</span>
                      <Progress
                        value={getPercentage(ratingCounts[star])}
                        className="h-2 flex-1 bg-muted"
                      />
                      <span className="text-xs text-muted-foreground w-8 text-right">
                        {Math.round(getPercentage(ratingCounts[star]))}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              {product.reviews?.length > 0 ? (
                product.reviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-background border border-border"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.user?.image} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {review.user?.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-sm">
                            {review.user?.name}
                          </h4>
                          <div className="flex text-primary mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? "fill-current"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Verified Buyer
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    No reviews yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Be the first to share your thoughts on this product.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
