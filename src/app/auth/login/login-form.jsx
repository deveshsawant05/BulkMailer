"use client";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
import { login, signInWithGoogle } from "./actions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { PrimaryLoader, ButtonLoader } from "@/components/global/loader";


export function LoginForm({ className, setVerificationRequired,setVerifyEmail,...props }) {
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (session) {
          // Fallback client side redirect
          router.replace("/dashboard");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Unexpected error checking session:", err);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  const [loginError, setLoginError] = useState(null);
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoginLoading(true);
  setLoginError(null);

  const email = e.target.email.value;
  const password = e.target.password.value;
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const result = await login(formData); // Only handle result if no redirect

  setLoginLoading(false);

  if (result?.success === false) {
    if (result.error === "Email not confirmed") {
      setVerifyEmail(email);
      setVerificationRequired(true);
      return;
    }
    setLoginError(result.error);
  }
};


  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                >
                  <Image
                    src="/google.svg"
                    alt="Google Logo"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Login with Google
                </Button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="grid gap gap-6">
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  {loginError && (
                    <p className="text-red-500 text-sm text-center">
                      {loginError}
                    </p>
                  )}
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="ml-auto text-muted-foreground text-xs underline-offset-4 hover:underline hover:text-[--primary]"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    className="text-bold font-3xl"
                    placeholder="password"
                    type="password"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-[--primary] animation duration-500"
                >
                  {loginLoading ? <div className="flex no-wrap">Logging In<ButtonLoader /></div> : "Login"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="underline underline-offset-4 hover:text-[--primary] duration-500 animation"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 ">
        By clicking continue, you agree to our{" "}
        <Link className="hover:text-[--primary] animation duration-300" href="#">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link className="hover:text-[--primary] animation duration-300" href="#">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
