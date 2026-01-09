"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";
import { Camera, Store, User } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function AdminProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    storeName: "My Ecommerce Store" // Default or placeholder
  });

  // Load session data into form
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // Map Input IDs to state keys
    const keyMap = {
      "admin-name": "name",
      "username": "username",
      "store-name": "storeName"
    };
    if (keyMap[id]) {
        setFormData(prev => ({ ...prev, [keyMap[id]]: value }));
    }
  };

  const handleSave = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch("/api/updateprofile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session: session, // API requires session object for identification
          name: formData.name,// If email editing is allowed/handled by API
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
        <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
            <Spinner className="w-8 h-8" />
        </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Admin Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage store owner information and profile settings
        </p>
      </div>

      {/* Admin Profile Card */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session.user.image || "/profile.png"} />
              <AvatarFallback>{session.user.name?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
            <button
              className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground shadow"
              aria-label="Change profile image"
            >
              <Camera size={14} />
            </button>
          </div>

          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <User size={16} /> {session.user.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Store size={14} /> {formData.storeName}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Admin Name</Label>
              <Input 
                id="admin-name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Store owner name" 
               />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="admin_username" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email (read-only)</Label>
            <Input value={formData.email} disabled />
          </div>

          <Separator />

          {/* Store Info */}
          <div className="space-y-4">
            <h3 className="font-medium">Store Information</h3>

            <div className="space-y-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input 
                 id="store-name"
                 value={formData.storeName}
                 onChange={handleInputChange}
                 placeholder="My Ecommerce Store" 
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>
                {loading && <Spinner className="w-4 h-4 mr-2" />}
                Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
