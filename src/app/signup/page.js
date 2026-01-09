"use client";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function signup() {
  const router = useRouter();
  // zod setup
  const { data: session } = authClient.useSession();

  const signupSchema = z
    .object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be less than 20 characters")
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Only letters, numbers, and underscores allowed"
        ),

      email: z.string().trim().email("Invalid email address").toLowerCase(),

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

  const [usercreated, setUsercreated] = useState(false);
  const limit = 3;

  const [attempts, setAttempts] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (fields) => {
    try {
      const { data, error } = await authClient.signUp.email({
        email: fields.email,
        password: fields.password,
        name: fields.username,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Something went wrong");
      } else {
        toast.success("Account created successfully!");

        reset();
        router.push("/signup/emailverification");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Enter your email below to create your account
            </CardDescription>
            <CardAction>
              <Link href="/signin">
                <Button variant="link">Sign In</Button>
              </Link>
            </CardAction>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username" className="">
                    Username
                  </Label>
                  <Input
                    {...register("username")}
                    id="username"
                    type="text"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="">
                    Email
                  </Label>
                  <Input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    {...register("password")}
                    id="password"
                    type="password"
                    required
                    placeholder="*********"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                  </div>
                  <div className="flex items-center">
                    <Input
                      {...register("confirmPassword")}
                      id="confirmPassword"
                      type="password"
                      required
                      placeholder="*********"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col mt-3   gap-2">
              <Button disabled={isSubmitting} type="submit" className="w-full">
                {isSubmitting ? <Spinner /> : "Sign Up"}
              </Button>
              <Button
                disabled={isSubmitting}
                type="button"
                onClick={() =>
                  authClient.signIn.social({
                    provider: "google",
                  })
                }
                variant="outline"
                className="w-full"
              >
                {isSubmitting ? <Spinner /> : "Sign Up with Google"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      }
    </div>
  );
}
