"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { throttle } from "@/lib/throttle";
import { IconCardsFilled } from "@tabler/icons-react";
import { ArrowUpRightIcon, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const outOfStockHandler = async () => {
    setRemovingOutOfStock(true);
    await removeHandler(arrayOfOutofStockItemsId);
    setRemovingOutOfStock(false);
  };

  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState("");
  const [removing, setRemoving] = useState(false);
  const [removingOutOfStock, setRemovingOutOfStock] = useState(false);

  const fetchCartItems = async () => {
    try {
      const res = await fetch("/api/mycart");
      const { data } = await res.json();
      setCartData(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const removeHandler = async (itemId) => {
    setRemoving(true);
    const res = await fetch("/api/mycart/updatecart?remove=true", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });

    if (res.status === 200) {
      toast.success("Item Removed");
      fetchCartItems();
    }
    setRemoving(false);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    const item = cartData.items.find((i) => i._id === itemId);

    if (!item || item.product.stock <= 0) {
      toast.error("Item is out of stock");
      return;
    }

    if (newQuantity < 1 || newQuantity > item.product.stock) {
      toast.error("Invalid quantity");
      return;
    }

    // Optimistic UI update
    setCartData((prev) => {
      const items = prev.items.map((i) =>
        i._id === itemId ? { ...i, quantity: newQuantity } : i
      );

      const bill = items.reduce(
        (sum, i) => (i.product.stock > 0 ? sum + i.price * i.quantity : sum),
        0
      );

      return { ...prev, items, bill };
    });

    try {
      const res = await fetch("/api/mycart/updatecart?updateQuantity=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      });

      if (res.status === 200) {
        toast.success("Quantity Updated");
        fetchCartItems();
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Update failed");
    }
  };

  const throttledUpdateQuantity = throttle(updateQuantity, 500);

  if (loading) {
    return (
      <div className="max-w-[85%] mx-auto p-6 space-y-6">
        {[1, 2,3].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!cartData?.items?.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconCardsFilled />
          </EmptyMedia>
          <EmptyTitle>No Items Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t added anything to your cart.
          </EmptyDescription>
        </EmptyHeader>
        <Button asChild variant="link">
          <Link href="/shop">
            Shop Now <ArrowUpRightIcon />
          </Link>
        </Button>
      </Empty>
    );
  }

  const hasOutOfStockItems = cartData.items.some(
    (item) => item.product.stock <= 0
  );

  const outofstockitem = cartData.items.filter(
    (item) => item.product.stock <= 0
  );
  const arrayOfOutofStockItemsId = outofstockitem.map((item) => item._id);

  const subtotal = cartData.items.reduce(
    (sum, item) =>
      item.product.stock > 0 ? sum + item.price * item.quantity : sum,
    0
  );

  return (
    <div className="max-w-[85%] relative  mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-10">
        Shopping Cart
        <span className="ml-2 text-muted-foreground text-base">
          ({cartData.items.length} items)
        </span>
      </h2>

      {/* <Button
        onClick={() => outOfStockHandler()}
        className={"absolute top-10 right-3  z-10"}
        variant="link"
      >
        Remove Out Of Stock Items!
      </Button> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartData.items.map((item) => {
            const isOutOfStock = item.product.stock <= 0;
            return (
              <div
                key={item._id}
                className={`flex flex-col sm:flex-row gap-6 rounded-2xl border p-5 transition ${
                  isOutOfStock ? "opacity-60" : ""
                }`}
              >
                <Link href={`/shop/${item.product._id}`}>
                  <div className="relative w-full sm:w-36 aspect-4/5 rounded-xl overflow-hidden bg-muted">
                    <img
                      src={
                        Array.isArray(item.product.image)
                          ? item.product.image[0]
                          : item.product.image
                      }
                      alt={item.product.name}
                      onError={(e) => {
                        const images = item.product.image;
                        const fallback =
                          Array.isArray(images) && images.length > 1
                            ? images[1]
                            : null;
                        if (
                          fallback &&
                          e.target.getAttribute("data-tried-fallback") !==
                            "true"
                        ) {
                          e.target.src = fallback;
                          e.target.setAttribute("data-tried-fallback", "true");
                        } else {
                          e.target.src = "/placeholderImage.png";
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <Link href={`/shop/${item.product._id}`}>
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {item.product.name}
                        </h3>
                        <p className="text-sm mt-1">
                          {isOutOfStock ? (
                            <span className="text-destructive font-semibold">
                              Out of stock
                            </span>
                          ) : (
                            <span className="text-green-600">
                              In stock • {item.product.stock} left
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="mt-5 flex justify-between items-center">
                    <div className="flex items-center gap-3 border rounded-full px-2 py-1">
                      <button
                        className="hover:bg-white border transition-all p-1 rounded-full "
                        disabled={item.quantity <= 1 || isOutOfStock}
                        onClick={() =>
                          throttledUpdateQuantity(item._id, item.quantity - 1)
                        }
                      >
                        <Minus className="w-4 h-4  " />
                      </button>

                      <span className="w-6 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        className="hover:bg-white border transition-all p-1 rounded-full "
                        disabled={
                          isOutOfStock || item.quantity >= item.product.stock
                        }
                        onClick={() =>
                          throttledUpdateQuantity(item._id, item.quantity + 1)
                        }
                      >
                        <Plus className="w-4 h-4  " />
                      </button>
                    </div>

                    <button
                      onClick={() => removeHandler(item._id)}
                      className="flex text-sm items-center gap-1 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="sticky h-fit  top-6 rounded-2xl border p-6 bg-muted/30">
          <h3 className="text-lg font-bold mb-6">Order Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <div>
            {!hasOutOfStockItems ? (
              <Button
                onClick={() => {
                  if (!session?.user?.id) {
                    toast.error("Please sign in to checkout");
                    return;
                  }
                  if (!session?.user?.emailVerified) {
                    toast.error(
                      "Please verify your email to proceed to checkout"
                    );
                    return;
                  }
                  router.push("/cart/checkout");
                }}
                disabled={hasOutOfStockItems}
                className={`mt-6 w-full rounded-xl py-3 font-semibold transition 
                  bg-primary text-primary-foreground hover:opacity-90`}
              >
                Proceed to Checkout
              </Button>
            ) : (
              <Button
                onClick={() => outOfStockHandler()}
                className={`mt-8 w-full rounded-xl py-3 font-medium capitalize tracking-wide transition 
                  bg-primary text-primary-foreground hover:opacity-90`}
              >
                {removingOutOfStock ? <Spinner /> : "Remove out of stock items"}
              </Button>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground/90 tracking-wide italic">
          Secure Checkout • Free Returns
        </p>
      </div>
    </div>
  );
};

export default Page;
