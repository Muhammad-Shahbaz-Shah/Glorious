"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { IconCurrencyDollar } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react"; // Add ArrowLeft to imports

// Helper Component for Image
const OrderProductImage = ({ product }) => {
  const [src, setSrc] = useState(
    Array.isArray(product.image) ? product.image[0] : product.image
  );

  const handleError = () => {
    if (Array.isArray(product.image) && product.image.length > 1 && src === product.image[0]) {
      setSrc(product.image[1]);
    } else {
      setSrc("/placeholderImage.png");
    }
  };

  return (
    <img
      className="w-full h-full object-cover"
      src={src}
      alt={product.name || "Product"}
      onError={handleError}
    />
  );
};

const page = () => {
  const [updatingId, setUpdatingId] = useState(null);
  const handleStatusUpdate = async (id, newStatus) => {
    if (!id || !newStatus) return;
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Order updated to ${newStatus}`);
        fetchOrders();
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      // setLoadingOrder(true); // Already true initially
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        const data = await res.json();
        setOrder(data.order);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast.error("Failed to fetch order details");
      } finally {
        setLoadingOrder(false);
      }
    };
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const orderDate = order ? new Date(order.createdAt) : null;

  if (loadingOrder) {
    return (
      <div className="w-full flex  p-5 h-[calc(100vh-64px)] items-center justify-center">
        <Spinner className={"w-5 h-5"} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full flex p-5 h-[calc(100vh-64px)] items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }
  return (
    <div className="w-full space-y-4">
      <Link href="/-admin/orders" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Orders</span>
      </Link>
      <div className="relative">
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
                        {/* Image handling with fallbacks */}
                        <OrderProductImage product={item.product} />
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
                    {order.user?.email && (
                      <a
                        href={`mailto:${order.user.email}`}
                        className="flex items-center gap-2 mt-3 text-xs font-semibold text-blue-600 hover:underline"
                      >
                        <Mail className="w-3 h-3" />
                        Contact User
                      </a>
                    )}
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
                    {order.paidAt
                      ? `Paid ${new Date(order.paidAt).toLocaleDateString()}`
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
              <Select
                disabled={updatingId === order._id}
                value={order.orderStatus}
                onValueChange={(val) => handleStatusUpdate(order._id, val)}
              >
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {order.paymentInfo.method === "Online" &&
                order.paymentInfo.status === "verification pending" &&
                order.paymentInfo.screenshot && (
                <Link
                  className="group"
                  href={`/-admin/orders/${order._id}/verify-payment`}
                >
                  <Button className="bg-blue-700  text-background hover:bg-blue-800 ">
                    Verify Payment
                    <IconCurrencyDollar className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-200 ease-in-out" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default page;
