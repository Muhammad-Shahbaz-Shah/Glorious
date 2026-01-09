import React from "react";
import Link from "next/link";
import { Signature } from "lucide-react";

const SignInRequired = ({purpose="Store"}) => {
  return <div className="flex min-h-[80vh] w-full items-center justify-center px-4">
          <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Signature className="h-7 w-7 text-muted-foreground" />
            </div>
  
            <h2 className="text-lg font-semibold">Sign in required</h2>
  
            <p className="text-sm text-muted-foreground">
              You need to be signed in to view your {purpose}.
            </p>
  
            <Link
              href="/signin"
              className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Sign in
            </Link>
          </div>
        </div>
};

export default SignInRequired;
