"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

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
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href={`/-admin/orders/${id}`}>
                        <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Payment Verification</h1>
                        <p className="text-muted-foreground text-sm">Review financial evidence for Order #{order._id.slice(-6).toUpperCase()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Current Status:</span>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                        order.paymentInfo.status.toLowerCase() === 'paid' 
                            ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                        {order.paymentInfo.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Order & Customer Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-none shadow-xl bg-card">
                        <CardHeader className="pb-2 border-b border-border/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-primary" />
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Amount Due</p>
                                    <p className="text-2xl font-black text-primary">${order.totalPrice.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Method</p>
                                    <p className="text-sm font-bold bg-muted px-2 py-1 rounded inline-block">{order.paymentInfo.method}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
                                        <Mail className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Customer</p>
                                        <p className="font-bold truncate">{order.user?.name || 'Guest User'}</p>
                                        <p className="text-xs text-muted-foreground truncate">{order.user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
                                        <AlertCircle className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Order Date</p>
                                        <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {order.paymentInfo.status.toLowerCase() !== 'paid' && !order.paymentInfo.screenshot && (
                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold">Needs Proof</p>
                                    <p className="text-xs text-muted-foreground">Ask the customer to upload payment evidence.</p>
                                </div>
                                <Button className="w-full" variant="outline" onClick={handleSendEmail}>
                                    Send Notification
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Side: Evidence Preview */}
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-xl bg-card h-full min-h-[500px] flex flex-col">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-border/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-primary" />
                                Payment Evidence
                            </CardTitle>
                            {order.paymentInfo.screenshot && (
                                <a 
                                    href={order.paymentInfo.screenshot} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                >
                                    Open Full Size <ArrowLeft className="w-3 h-3 rotate-180" />
                                </a>
                            )}
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/20">
                            {order.paymentInfo.screenshot ? (
                                <div className="w-full h-full flex flex-col gap-6">
                                    <div className="flex-1 relative rounded-2xl overflow-hidden shadow-2xl bg-black/5 flex items-center justify-center group cursor-zoom-in">
                                        <img 
                                            src={order.paymentInfo.screenshot} 
                                            alt="Payment Evidence Screenshot"
                                            className="max-w-full max-h-[400px] object-contain transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-xs font-medium text-center">Snapshot provided by customer</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
                                        <p className="text-xs text-muted-foreground italic sm:mr-auto text-center sm:text-left">
                                            Make sure to cross-check this with your bank statement before verifying.
                                        </p>
                                        <Button 
                                            className="w-full sm:w-auto h-12 px-8 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 active:scale-95 transition-all" 
                                            onClick={handleVerifyPayment}
                                            disabled={verifying || order.paymentInfo.status.toLowerCase() === 'paid'}
                                        >
                                            {verifying ? (
                                                <>
                                                    <Spinner className="w-4 h-4 mr-2" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5 mr-3" />
                                                    Confirm & Verify Payment
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-4 max-w-sm">
                                    <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto border-2 border-dashed border-muted-foreground/20">
                                        <AlertCircle className="w-10 h-10 text-muted-foreground/40" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold">No Proof Uploaded</h3>
                                        <p className="text-sm text-muted-foreground">
                                            This customer hasn't provided a payment screenshot yet. You can wait or request one via email.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Page;
