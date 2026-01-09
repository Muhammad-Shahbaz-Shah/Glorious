"use client";
import { useState } from "react"; // 1. Import useState
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Signature } from "lucide-react";

const Page = () => {
  // 2. Get the session from your auth client
  const { data: session, isPending } = authClient.useSession();

  // 3. Define the missing variables
  const [attempts, setAttempts] = useState(0);
  const limit = 3;

  const handleResend = async () => {
    if (attempts < limit && session?.user?.email) {
      await authClient.sendVerificationEmail({
        email: session.user.email,
        callbackURL: "/",
      });
      setAttempts((prev) => prev + 1);
      alert("Verification email resent!");
    }
  };

  // 4. Handle loading state to avoid "undefined" errors during prerender
  if (isPending) return (
    <div className="w-full min-h-[80vh] flex items-center justify-center">
      <Spinner className={"w-10 h-10"} />
      <p className="text-muted-foreground text-lg font-semibold animate-pulse">
        Fetching The Data
      </p>
    </div>
  );
  else if (!session) {
    return <div className="w-full min-h-[80vh] flex items-center justify-center">
      <p className="text-muted-foreground text-center">
        <Signature className="w-10 h-10" />
        Please{" "}
        <Link
          href={"/signin"}
          className="font-bold text-muted-foreground hover:underline"
        >
          sign in
        </Link>{" "}
        to  verify your email.
      </p>
    </div>;
  }

  return (
    <div className="flex items-center animate-in justify-center p-2  min-h-[70vh] md:min-h-[82vh]">
      <Card className="w-full md:w-1/2 hover:shadow-2xl">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            Check your email for the verification link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            An email has been sent to <strong className="text-primary/80 px-1 font-mono tracking-wide">{session?.user?.email}</strong>.
            Please click the link in the email to verify your account.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full"
            disabled={attempts >= limit || !session}
            variant="outline"
            onClick={handleResend}
          >
            {attempts >= limit ? "Limit Reached" : "Resend Verification Email"}
          </Button>

          <Link href="/signin" className="w-full">
            <Button variant="secondary" className="w-full">
              Back to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
