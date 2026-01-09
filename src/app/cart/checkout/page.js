"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  ListOrdered,
  MapPin,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "@/lib/auth-client";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  // states
  // states

  const [orderItems, setorderItems] = useState([]);
  const [loading, setLoading] = useState(false);

  let totalPrice;

  // initially fectching cart to get products to be ordered and final amount to be paid

  const fetchCart = async () => {
    const res = await fetch("/api/mycart");
    const { data } = await res.json();
    const newItems = data.items.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: Array.isArray(item.product.image) 
        ? (item.product.image[0] || "/placeholderImage.png") 
        : (item.product.image || "/placeholderImage.png"),
      product: item.product._id,
    }));
    setorderItems(newItems);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // schema for from
  const checkoutSchema = z.object({
    shippingInfo: z.object({
      address: z.string().min(5, "Address is too short"),
      city: z.string().min(2, "City is required"),
      state: z.string().min(2, "State is required"),
      country: z.string().min(1, "Select a country"),
      postalCode: z.coerce.number().positive("Invalid postal code"),
      phoneNo: z.coerce.number().min(1000000, "Invalid phone number"),
    }),
    paymentMethod: z.string().min(1, "Please select a payment method"),
  });

  // form setup

  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingInfo: {
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        phoneNo: "",
      },
      paymentMethod: "",
    },
  });

  const selectedPaymentMethod = form.watch("paymentMethod");

  // submit function to place order and to  redirect on payment page if user selects online payment

  const onSubmit = async (values) => {
    if (!session?.user?.id) {
      toast.error("Please sign in to place an order");
      return;
    }
    if (!session?.user?.emailVerified) {
      toast.error("Please verify your email to place an order");
      return;
    }
    setLoading(true)
    totalPrice = orderItems
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
    const isOnline = values.paymentMethod === "Online";

    const orderPayload = {
      shippingInfo: values.shippingInfo,
      orderItems: orderItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity, 
        product: item.product,
      })),
      paymentInfo: {
        status: isOnline ? "pending" : "unpaid",
        method: isOnline ? "Online" : "COD",
        paidAt: isOnline ? new Date().toISOString() : "Not Paid Yet",
        screenshot:""
      },
      itemsPrice: totalPrice,
      shippingPrice: 0,
      totalPrice: totalPrice,
      orderStatus: "Processing",
    };

    // actuall api to place order
    try {
      const response = await fetch("/api/orders/createorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });
      const { data } = await response.json();

      if (isOnline) {
        // Redirect to payment page with order ID
        router.push(`/cart/checkout/payonline?orderId=${data._id}`);
      } else {
        toast.success("Order placed successfully");
        router.push("/orders"); // Redirect to orders page for COD too
      }
    }catch (error) {
      toast.error(error.message);
    }finally {
      setLoading(false)
    }
  };

  

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-10">Checkout</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-8">
            {/* ITEMS CARD */}

            {/* SHIPPING CARD */}
            <Card className="rounded-2xl border-none shadow-md bg-card">
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    Shipping Information
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="shippingInfo.address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="123 Street Name, Area"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingInfo.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingInfo.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingInfo.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pakistan">Pakistan</SelectItem>
                          <SelectItem value="United States">
                            United States
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingInfo.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="75500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingInfo.phoneNo"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0300..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-none shadow-md bg-card">
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ListOrdered className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Review Your Items</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden border">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm md:text-base leading-tight">
                            {item.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-md">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* PAYMENT CARD */}
            <Card className="rounded-2xl border-none shadow-md bg-card">
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Payment Method</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Choose your payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Online">
                            Online (EasyPaisa/JazzCash)
                          </SelectItem>
                          <SelectItem value="COD">Cash on Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-4">
            <Card className="rounded-2xl border-none shadow-lg h-fit sticky top-10">
              <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <CardTitle>Order Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items Total</span>
                  <span className="font-medium">
                    {orderItems
                      .reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}{" "}
                    $
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="font-bold text-lg">Total Amount</span>
                  <span className="font-bold text-2xl text-primary">
                    {orderItems
                      .reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}{" "}
                    $
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {selectedPaymentMethod === "Online" ? (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold  shadow-lg"
                    >
                      <Wallet className="mr-2 h-5 w-5" />
                      {loading ? <Spinner /> : 'Pay With Easypaisa Jazzcash'}
                    </Button>
                  ) : (
                    <Button
                        type="submit"
                        disabled={loading}
                      className="w-full h-12 rounded-xl font-semibold text-lg shadow-md transition-all active:scale-[0.98]"
                    >
                      {loading ? <Spinner /> : "Confirm Order"}
                    </Button>
                  )}
                </div>

                <p className="text-[11px] text-center text-muted-foreground uppercase tracking-widest pt-2">
                  Secure Encrypted Transaction
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
