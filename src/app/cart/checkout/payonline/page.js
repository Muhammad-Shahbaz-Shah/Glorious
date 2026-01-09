"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatabaseBackupIcon, FileImage, Loader2, Upload } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";

export default function PayOnlinePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!orderId) {
      toast.error("No Order ID found");
      router.push("/cart/checkout");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const { data } = await res.json();

        if (data.paymentInfo.status === "Paid") {
          toast.info("This order is already paid.");
          router.push("/cart/checkout");
        }

        setOrder(data);
      } catch (error) {
        toast.error("Failed to load order details");
        router.push("/cart/checkout");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setScreenshot(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!screenshot) {
      toast.error("Please upload a screenshot of your payment");
      return;
    }

    setSubmitting(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(screenshot);
      reader.onload = async () => {
        const base64Image = reader.result;

        const res = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            screenshot: base64Image,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success("Payment submitted for verification");
          router.push("/orders");
        } else {
          toast.error(data.message || "Failed to submit payment");
        }
      };
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
        <Spinner className="h-10 w-10 text-primary animate-spin" />

        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Fetching your data…
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Payment
          </CardTitle>
          <CardDescription className="text-center">
            Transfer the amount to one of the accounts below and upload the
            screenshot.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount:</span>
              <span className="text-primary">
                ${order?.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="border p-4 rounded-lg text-center space-y-2">
              <h3 className="font-bold text-primary">Easypaisa</h3>
              <p className="text-sm font-medium">0300-1234567</p>
              <p className="text-xs text-muted-foreground">
                Title: Glorious Brand
              </p>
            </div>
            <div className="border p-4 rounded-lg text-center space-y-2">
              <h3 className="font-bold text-primary">JazzCash</h3>
              <p className="text-sm font-medium">0300-7654321</p>
              <p className="text-xs text-muted-foreground">
                Title: Glorious Brand
              </p>
            </div>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25 hover:border-primary"
            }`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="relative aspect-video w-full max-w-[200px] mx-auto">
                <Image
                  src={preview}
                  alt="Upload preview"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center  gap-2  font-mono text-muted-foreground/80">
                <FileImage className="h-8 w-8" />
                <p>Drag & drop screenshot here, or click to select</p>
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            size="lg"
            disabled={submitting}
          >
            {submitting ? (
              <Spinner className="mr-2 h-4 w-4 " />
            ) : (
              "Confirm Payment"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
