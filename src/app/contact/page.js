"use client";
import SignInRequired from "@/components/subComponents/SignInRequired";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send, Signature, UserCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const contactSchema = z.object({
  subject: z.string().min(1, "Please select a topic"),
  message: z
    .string()
    .min(10, "Please provide a bit more detail (min 10 chars)"),
});

const AuthenticatedContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get session directly from your auth client
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: "support" },
  });

  const onSubmit = async (data) => {
    if (!user || user.emailVerified === false) {
      toast.error("please verify your email first")  
      return;
    }

    setIsSubmitting(true);
    // Combine form data with session user data

    // Simulate API call
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: data.subject,
          message: data.message,
          userEmail: user.email,
          userName: user.name,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send message");
      }

      setIsSuccess(true);
      reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Handle Loading State
  if (isPending) {
    return (
      <div className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
        <Spinner className="h-10 w-10 text-primary animate-spin" />

        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Fetching your data…
        </p>
      </div>
    );
  }

  // 2. Handle Unauthenticated State (Security)
  if (!session) {
    return (
    <SignInRequired purpose="contact form"/>
    );
  }

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Help & Support
          </h1>
          <p className="text-muted-foreground">
            Hi {user?.name?.split(" ")[0] || "there"}, how can we help you
            today?
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <img
                src={user?.image}
                alt=""
                className="w-13 h-13 rounded-full"
              />
            </div>
            <h2 className="text-xl font-semibold">Message Received</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              We&apos;ve logged your request and will get back to you at{" "}
              <b>{user?.email}</b>.
            </p>
            <Button variant="link" onClick={() => setIsSuccess(false)}>
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              {/* Identity Card */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                <img
                  src={user?.image}
                  alt=""
                  className="w-13 ring ring-primary  h-13 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-none">
                    {user?.name}
                  </span>
                  <span className="text-xs tracking-wide font-mono text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
                <div className="ml-auto">
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                      user?.emailVerified
                        ? "bg-green-500/10 text-green-600"
                        : "bg-yellow-500/10 text-yellow-600"
                    }`}
                  >
                    {user?.emailVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">What is this regarding?</Label>
                <Select
                  onValueChange={(v) => setValue("subject", v)}
                  defaultValue="support"
                >
                  <SelectTrigger className="h-12 bg-background/50">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">
                      Technical Issue / Bug
                    </SelectItem>
                    <SelectItem value="billing">
                      Billing & Subscription
                    </SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="other">Something Else</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  {...register("message")}
                  id="message"
                  placeholder="Tell us what's on your mind..."
                  className="min-h-[180px] bg-background/50 resize-none text-base p-4 focus-visible:ring-primary"
                />
                {errors.message && (
                  <p className="text-xs text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                disabled={isSubmitting}
                className="w-full h-10 text-base font-medium bg-linear-270 from-primary/80 to-accent-foreground transition-all hover:shadow-lg hover:shadow-primary/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Submit Request <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground italic">
              Our typical response time is under 24 hours.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthenticatedContactPage;
