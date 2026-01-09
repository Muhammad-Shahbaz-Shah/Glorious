"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";

const Page = () => {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/admin/orders/${id}`);
                const data = await res.json();
                if (data.success) {
                    setOrder(data.order);
                } else {
                    toast.error("Failed to fetch order");
                }
            } catch (error) {
                console.error("Error fetching order:", error);
                toast.error("An error occurred while fetching order details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    const handleVerifyPayment = async () => {
        setVerifying(true);
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    paymentInfo: {
                        ...order.paymentInfo,
                        status: "paid",
                        paidAt: new Date().toISOString(),
                    },
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Payment verified successfully");
                router.push(`/-admin/orders/${id}`);
                router.refresh();
            } else {
                toast.error(data.message || "Failed to verify payment");
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("An error occurred while verifying payment");
        } finally {
            setVerifying(false);
        }
    };

    const handleSendEmail = () => {
        if (!order?.user?.email) return;
        
        const subject = `Payment Verification Required for Order #${order._id.slice(-6).toUpperCase()}`;
        const body = `Dear Customer,%0D%0A%0D%0AWe noticed that you haven't uploaded a payment screenshot for your order #${order._id.slice(-6).toUpperCase()}. Please reply to this email with the screenshot attached or upload it through your account dashboard so we can process your order.%0D%0A%0D%0AThank you,%0D%0AGlorious Team`;
        
        window.location.href = `mailto:${order.user.email}?subject=${subject}&body=${body}`;
    };

    if (loading) {
        return (
            <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
                <Spinner className="w-8 h-8" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="w-full h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Order not found</p>
                <Link href="/-admin/orders">
                    <Button variant="outline">Back to Orders</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/-admin/orders/${id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Verify Payment</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Payment Details</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            order.paymentInfo.status === 'paid' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {order.paymentInfo.status}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Order ID</h3>
                                <p className="font-mono">{order._id}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Amount</h3>
                                <p className="text-xl font-bold">${order.totalPrice.toFixed(2)}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h3>
                                <p>{order.paymentInfo.method}</p>
                            </div>
                        </div>

                        <div className="border rounded-lg p-4 bg-muted/30">
                            <h3 className="font-medium mb-4 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-blue-500" />
                                Payment Screenshot
                            </h3>
                            
                            {order.paymentInfo.screenshot ? (
                                <div className="space-y-4">
                                    <div className="relative aspect-video w-full rounded-md overflow-hidden border bg-background">
                                        <img 
                                            src={order.paymentInfo.screenshot} 
                                            alt="Payment Screenshot"
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                    <Button 
                                        className="w-full bg-green-600 hover:bg-green-700 text-white" 
                                        onClick={handleVerifyPayment}
                                        disabled={verifying || order.paymentInfo.status === 'paid'}
                                    >
                                        {verifying ? (
                                            <>
                                                <Spinner className="w-4 h-4 mr-2" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Verify Payment
                                            </>
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-48 gap-4 text-center">
                                    <div className="p-3 bg-muted rounded-full">
                                        <AlertCircle className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">No Screenshot Uploaded</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            The customer has not uploaded a payment screenshot yet.
                                        </p>
                                    </div>
                                    <Button variant="outline" onClick={handleSendEmail} className="mt-2">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Request Proof via Email
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
