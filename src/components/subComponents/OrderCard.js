"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowRight,
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Trash,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { IconCancel } from "@tabler/icons-react";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const OrderCard = ({ order }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  // ✅ Parse ISO date string safely
  // ✅ Parse ISO date string safely
  const orderDate = order?.createdAt ? new Date(order.createdAt) : null;

  return (
    <div className="group relative">
      <Card className="border-border bg-card shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/20 flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <Badge
              className={`
                ${
                  order.orderStatus === "Delivered"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground"
                }
                px-4 py-1 rounded-full border-none font-bold uppercase text-[10px] tracking-widest
              `}
            >
              {order.orderStatus}
            </Badge>

            {/* Order ID */}
            <span className="text-xs text-muted-foreground">
              Order ID : {order._id.slice(-6).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Ordered: {orderDate?.toLocaleDateString()}
          </div>
        </div>

        <CardContent className="p-0">
          <div className="grid lg:grid-cols-12">
            {/* Items */}
            <div className="lg:col-span-7 p-6 space-y-6">
              {order.orderItems?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 border-border shadow-md rounded-xl p-2 items-center"
                >
                  <div className="h-20 w-20 rounded-lg bg-accent/30 overflow-hidden flex items-center justify-center border border-border">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        Array.isArray(item.product.image)
                          ? item.product.image[0]
                          : item.product.image
                      }
                      alt=""
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
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">{item.name}</h4>

                    <p className="text-xs text-muted-foreground mt-1 uppercase">
                      Product ID: {item.product._id.slice(-6)}
                    </p>

                    <div className="flex justify-between items-end mt-2">
                      <p className="text-sm font-medium italic">
                        Qty: {item.quantity}
                      </p>

                      <p className="text-sm font-bold text-primary">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-5 bg-muted/30 p-6 border-l border-border space-y-6 text-sm">
              {/* Shipping */}
              <section>
                <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  <MapPin className="w-3 h-3 text-primary" />
                  Shipping To
                </h5>

                <div className="pl-5 border-l-2 border-primary/20 space-y-1">
                  <p className="font-medium text-foreground">
                    {order.shippingInfo.address}
                  </p>
                  <p>
                    {order.shippingInfo.city}, {order.shippingInfo.state}
                  </p>
                  <p>
                    {order.shippingInfo.country} -{" "}
                    {order.shippingInfo.postalCode}
                  </p>
                  <p className="flex items-center gap-2 mt-2 text-xs font-semibold">
                    <Phone className="w-3 h-3" />
                    {order.shippingInfo.phoneNo}
                  </p>
                </div>
              </section>

              <Separator className="bg-border" />

              {/* Pricing */}
              <section className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items Subtotal</span>
                  <span>${order.itemsPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span>${order.shippingPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-foreground font-bold text-lg pt-2 border-t border-border/50">
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    Total
                  </span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>

                <p className="text-[10px] text-right text-primary italic font-medium uppercase tracking-widest">
                  Payment: {order.paymentInfo.status} •{" "}
                  {order.paymentInfo.paidAt
                    ? `Paid ${new Date(
                        order.paymentInfo.paidAt
                      ).toLocaleDateString()}`
                    : "Pending"}
                </p>
              </section>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="p-4 bg-background border-t border-border flex justify-between items-center">
          <p className="text-[11px] text-muted-foreground">
            {order.deliveredAt
              ? `Delivered on ${new Date(
                  order.deliveredAt
                ).toLocaleDateString()}`
              : "Delivery estimate: 3–5 Business Days"}
          </p>

          <div className="flex items-center gap-2">
            {order.orderStatus !== "Delivered" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={"bg-red-600 text-background hover:bg-red-500"}
                    size=""
                  >
                    Cancel Order
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={"flex flex-col gap-1"}>
                  Are you sure you want to cancel the order
                  <Button
                    onClick={async () => {
                      setIsDeleting(true);
                      try {
                        const res = await fetch("/api/orders/deleteorder", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            orderId: order._id,
                          }),
                        });
                        const data = await res.json();
                        console.log(res);
                        if (data.success) {
                          toast.success("Order deleted successfully");
                        } else {
                          toast.error(data.message);
                        }
                      } catch (error) {
                        toast.error(error.message);
                      } finally {
                        setIsDeleting(false);
                      }
                    }}
                    className={"bg-red-600 text-background hover:bg-red-500"}
                    size="sm"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Spinner className="w-4 h-4 text-white" />
                    ) : (
                      "Yes"
                    )}
                  </Button>
                </PopoverContent>
              </Popover>
            )}

            <Link href={`/orders/${order._id}`}>
              <Button className="bg-foreground group text-background hover:bg-foreground/90 group">
                Order Details{" "}
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderCard;
