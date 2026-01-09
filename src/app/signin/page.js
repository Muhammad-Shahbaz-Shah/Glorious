"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function signin() {
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(29, { message: "Password must be at most    29 characters" }),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (fields) => {
    try {
      const { data, error } = await authClient.signIn.email({
        email: fields.email,
        password: fields.password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Something went wrong");
      } else {
        toast.success("Logged In Successfully");
        reset();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Link href="/signup">
              <Button variant="link">Sign Up</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <form action={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
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
                  <Link
                    href="/signin/forgetpassword"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="*********"
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col mt-4 gap-2">
            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ? <Spinner /> : "Login"}
            </Button>
            <Button
              type="button"
              onClick={() =>
                authClient.signIn.social({
                  provider: "google",
                })
              }
              variant="outline"
              className="w-full"
            >
              {isSubmitting ? <Spinner /> : "Login With Google"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
