"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { redirect } from "next/navigation";
const page = () => {
  // States
  const [showPasswordInputFields, setShowPasswordInputFields] = useState(false);
  const [showopt, setShowopt] = useState(false);
  const [puttedOtp, setPuttedOtp] = useState("");
  const [email, setEmail] = useState("");

  // zod setup
  const passwordSchema = z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain one uppercase letter")
        .regex(/[0-9]/, "Must contain one number")
        .regex(/[^a-zA-Z0-9]/, "Must contain one special character"),

      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  // react hook form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // opt sending function
  const sendOtp = async (email) => {
    if (!email || !email.includes(".com") || !email.includes("@")) {
      toast.error("Provide a valid email");
      return;
    }
    const { data, error } = await authClient.forgetPassword.emailOtp({
      email: email, // required
    });
    toast.success("OTP Sent Successfully");
    setShowopt(true);
  };
  // opt verification function
  const verifyOtp = async (puttedOtp) => {
    console.log(puttedOtp);
    if (puttedOtp.length > 6) {
      toast.error("Provide a valid otp");
      return;
    }

    try {
      const { data, error } = await authClient.emailOtp.checkVerificationOtp({
        email: email, // required
        type: "forget-password", // required
        otp: puttedOtp, // required
      });
      if (data) {
        setShowopt(false);
        toast.success("OTP Verified Successfully");
        setShowPasswordInputFields(true);
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //  Password Changing function that changes the password if user verifies opt
  const changePassword = async (formData) => {
    try {
      const { data, error } = await authClient.emailOtp.resetPassword({
        email: email, // required
        otp: puttedOtp, // required
        password: formData.password, // required
      });
      if (data) {
        toast.success("Password Changed Successfully");
        reset();
        setShowPasswordInputFields(false);
        setShowopt(false);
        redirect("/signin");
      } else {
        toast.error(error.message);
        reset();
      }
    } catch (error) {
      toast.error(error.message);
      reset();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-sm">
              Enter your email address to receive a verification code
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Email address</Label>
                <Button
                  onClick={() => sendOtp(email)}
                  variant="link"
                  size="sm"
                  className="px-0"
                >
                  Send OTP
                </Button>
              </div>

              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                regex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
                placeholder="m@example.com"
              />
            </div>

            {/* OTP */}
            {showopt && (
              <div className="flex justify-center pt-2">
                <InputOTP
                  maxLength={6}
                  onChange={(value) => {
                    setPuttedOtp(value);
                    verifyOtp(value);
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            )}
          </CardContent>

          {showPasswordInputFields && (
            <CardFooter>
              <form
                className="w-full space-y-4"
                onSubmit={handleSubmit(changePassword)}
              >
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    {...register("password")}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    {...register("confirmPassword")}
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? <Spinner /> : "Change Password"}
                </Button>
              </form>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default page;
