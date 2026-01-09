"use client";

import SignInRequired from "@/components/subComponents/SignInRequired";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { BadgeAlert, BadgeCheck, Mail, Signature, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (!name && !email) {
      toast.error("please fill the fields");
      setLoading(false);
      return;
    } else if (!session) {
      toast.error("Please sign in to continue.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/updateprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          session,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLoading(false);
        toast.success(data.message || "Profile updated successfully");
      } else {
        setLoading(false);
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch("/api/updateprofile?delete=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session,
        }),
      });
      if (!res.ok) {
        setIsDeleting(false);
        throw new Error("Failed to delete user");
      }
      const data = await res.json();
      if (data.success) {
        setIsDeleting(false);
        toast.success(data.message);
        authClient.signOut();
      } else {
        setIsDeleting(false);
        toast.error(data.message);
      }
    } catch (error) {
      setIsDeleting(false);
      toast.error(error.message || "Something went wrong");
    }
  };
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

  if (!session) {
    return <SignInRequired purpose="your profile" />;
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        {/* Header - Simple for Ecommerce */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-[var-muted-foreground text-sm">
            Manage your profile and order preferences.
          </p>
        </header>

        {/* Form Container */}
        <main className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-4 md:p-8 shadow-sm">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
              <div className="relative group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden relative transition-all hover:border-primary/50">
                  <img
                    src={session.user.image || "/profile.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col   gap-1 items-start justify-center">
                <h3 className="font-semibold text-lg">{session?.user?.name}</h3>
                <p className="text-sm font-mono tracking-wide text-muted-foreground">
                  {session.user.email}
                </p>
                {session.user.emailVerified ? (
                  <Badge variant={"secondary"} className=" font-mono">
                   <BadgeCheck /> verified
                  </Badge>
                ) : (
                  <Link href={"/signup/emailverification"}>
                    <span className="px-3 p-1 border-destructive flex gap-1 items-center  border rounded-full text-xs bg-destructive/30 text-red-900 font-semibold font-mono">
                    <BadgeAlert className="w-4 h-4"/>  Not Verified Click Here to Verify
                    </span>
                  </Link>
                )}
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                    placeholder={session.user.name}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                    placeholder={session.user.email}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setName("");
                  setEmail("");
                }}
                className="order-2 sm:order-1 px-4 py-2 rounded-md border border-input hover:bg-accent transition-colors text-sm font-medium"
              >
                Discard Changes
              </button>
              <button
                onClick={() => handleSubmit()}
                className="order-1 sm:order-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium"
              >
                {loading ? <Spinner /> : "Save Settings"}
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 md:p-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-red-900">
                Delete Account
              </h3>
              <p className="text-xs text-red-700">
                Permanently remove your account and all data.
              </p>
            </div>
            <span className="text-sm hover:underline font-bold text-red-600">
              <Popover>
                <PopoverTrigger>
                  {isDeleting ? <Spinner /> : "Delete"}
                </PopoverTrigger>
                <PopoverContent>
                  <div>
                    <h1 className="text-sm font-semibold text-red-900">
                      Are you sure you want to delete your account?
                    </h1>
                    <button
                      className="text-sm font-bold text-red-600 hover:underline"
                      onClick={() => handleDelete()}
                    >
                      Delete
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}
