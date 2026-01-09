"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Truck
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const OrderFlowPage = () => {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${params.order}`);
        const { data } = await response.json();

        if (!response.ok) {
          throw new Error("Order not found");
        }

        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.order) {
      fetchOrder();
    }
  }, [params.order]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-10 h-10" />
        <p className="text-muted-foreground ml-4">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-destructive mb-4">
          {error || "Order not found"}
        </p>
        <Link href="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

    // -- Theme Colors --
    const primaryColor = [46, 125, 50]; // Green shade
    const secondaryColor = [200, 200, 200]; // Light Gray for lines

    // Company Header
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text("Glorious", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont(undefined, 'normal');
    doc.text("123 E-commerce St, Digital City, 12345", 14, 26);
    doc.text("support@glorious.com", 14, 30);
    doc.text("+123 456 7890", 14, 34);

    // Invoice Title
    doc.setFontSize(28);
    doc.setTextColor(...primaryColor);
    doc.text("INVOICE", 140, 25);
    
    // Invoice Details
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Invoice #`, 140, 32);
    doc.text(`: ${order._id.slice(-6).toUpperCase()}`, 170, 32);

    doc.text(`Date`, 140, 37);
    doc.text(`: ${new Date().toLocaleDateString()}`, 170, 37);
    
    doc.text(`Status`, 140, 42);
    doc.text(`: ${order.paymentInfo.status}`, 170, 42);

    // Separator Line
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(14, 48, 196, 48);
    
    // Bill To Section
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text("Bill To:", 14, 58);
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont(undefined, 'normal');
    doc.text(order.shippingInfo.address, 14, 64);
    doc.text(`${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.postalCode}`, 14, 69);
    doc.text(`Phone: ${order.shippingInfo.phoneNo}`, 14, 74);

    // Order Items Table
    const tableColumn = ["Item", "Quantity", "Unit Price", "Total"];
    const tableRows = [];

    order.orderItems.forEach(item => {
      const itemData = [
        item.name,
        item.quantity,
        `$${item.price.toFixed(2)}`,
        `$${(item.price * item.quantity).toFixed(2)}`
      ];
      tableRows.push(itemData);
    });

    autoTable(doc, {
      startY: 85, // Moved down for spacing
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { 
        fillColor: primaryColor, 
        textColor: 255,
        fontSize: 11,
        halign: 'center'
      },
      styles: { 
        fontSize: 10, 
        cellPadding: 4,
        valign: 'middle'
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      }
    });

    // Summary Section
    const finalY = doc.lastAutoTable.finalY + 15;
    
    // Summary Separator
    doc.setDrawColor(...secondaryColor);
    doc.line(130, finalY - 5, 196, finalY - 5);

    doc.setFontSize(10);
    doc.text(`Items Total:`, 140, finalY);
    doc.text(`$${order.itemsPrice.toFixed(2)}`, 190, finalY, { align: "right" });
    
    doc.text(`Shipping:`, 140, finalY + 6);
    doc.text(`$${order.shippingPrice.toFixed(2)}`, 190, finalY + 6, { align: "right" });
    
    // Total Amount Highlight
    doc.setFillColor(...primaryColor); 
    doc.rect(130, finalY + 10, 66, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Paid:`, 135, finalY + 16.5);
    doc.text(`$${order.totalPrice.toFixed(2)}`, 190, finalY + 16.5, { align: "right" });

    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text("Thank you for choosing Glorious!", 105, 280, { align: "center" });

    doc.save(`invoice_${order._id}.pdf`);
  };

  // Logic to determine which steps are completed based on schema
  const steps = [
    {
      title: "Order Placed",
      date: order.createdAt,
      description: "We have received your order and are preparing it.",
      isCompleted: !!order.createdAt,
      icon: <Package className="w-5 h-5" />,
    },
    {
      title: `Payment : ${order.paymentInfo.method ==="COD" ? "Cash On Delivery" : "Online" }`,
      date: order.createdAt,
      description: `Payment status: ${order.paymentInfo.status}`,
      isCompleted: order.paymentInfo.status === "paid" || order.paymentInfo.method === "COD",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      title: "Processing",
      date: order.orderStatus !== "Processing" ? order.paidAt : null,
      description: "Our team is handcrafted and packing your botanical items.",
      isCompleted: order.orderStatus !== "Processing" ,
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      title: "Shipped",
      date: order.orderStatus === "Delivered" ? order.deliveredAt : null, // Assuming shipment happens before delivery
      description: "Your package is on its way to your destination.",
      isCompleted:
        order.orderStatus === "Shipped" || order.orderStatus === "Delivered",
      icon: <Truck className="w-5 h-5" />,
    },
    {
      title: "Delivered",
      date: order.deliveredAt,
      description: "Package has been handed over to the recipient.",
      isCompleted: order.orderStatus === "Delivered",
      icon: <MapPin className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background  p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation */}
        <Link href="/orders">
          <Button
            variant="ghost"
            className="mb-6 -ml-4 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Orders
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: VERTICAL FLOW */}
          <div className="lg:col-span-7">
            <h2 className="text-2xl  font-bold mb-8">Order Journey</h2>
            <div className="relative space-y-0">
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex gap-6 pb-10 group">
                  {/* Vertical Line Connector */}
                  {idx !== steps.length - 1 && (
                    <div
                      className={`absolute left-[19px] top-10 w-0.5 h-full transition-colors duration-500 ${
                        step.isCompleted ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}

                  {/* Icon Node */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 shadow-sm ${
                      step.isCompleted
                        ? "bg-primary border-primary text-primary-foreground shadow-primary/20"
                        : "bg-card border-border text-muted-foreground"
                    }`}
                  >
                    {step.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.icon
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <h3
                        className={`font-bold text-lg ${
                          step.isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </h3>
                      {step.date && (
                        <span className="text-[10px] font-mono bg-accent/50 text-accent-foreground px-2 py-0.5 rounded uppercase ">
                          {new Date(step.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER DETAILS SUMMARY */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border shadow-sm sticky top-8 bg-card">
              <CardContent className="p-6">
                <h3 className=" font-bold text-xl mb-4 border-b border-border pb-2">
                  Order Summary
                </h3>

                {/* Shipping Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-1" />
                    <div className="text-sm">
                      <p className="font-bold text-foreground">
                        Shipping Address
                      </p>
                      <p className="text-muted-foreground">
                        {order.shippingInfo.address}
                      </p>
                      <p className="text-muted-foreground">
                        {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                        {order.shippingInfo.postalCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium">
                      {order.shippingInfo.phoneNo}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Items Mini List */}
                <div className="space-y-3 mb-6">
                  {order.orderItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name}{" "}
                        <span className="text-[10px]">x{item.quantity}</span>
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-muted/50 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items Price</span>
                    <span>${order.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${order.shippingPrice.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex justify-between font-bold text-lg text-primary pt-1">
                    <span>Total Paid</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleDownloadInvoice}
                  className="w-full mt-6 bg-primary text-primary-foreground hover:opacity-90"
                >
                  Download Invoice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFlowPage;
