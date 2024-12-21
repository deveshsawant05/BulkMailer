"use client";
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
import GitHubIcon from "@mui/icons-material/GitHub";
import { login, signInWithGoogle, signInWithGitHub } from "./actions";
import { permanentRedirect, useRouter } from "next/navigation";
import { Login } from "@mui/icons-material";
import { useState ,useEffect } from "react";
import { createClient } from '@/utils/supabase/client'

export function LoginForm({ className, ...props }) {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        return;
      }
      console.log(session);
      
      if (session) {
        // Redirect to dashboard if the user is already logged in
        permanentRedirect('/dashboard');
      }
      else{
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);
  const [loginError, setLoginError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const { error } = await login(formData);
      if (error) {
        setLoginError(error);
      } else {
        permanentRedirect("/dashboard");
      }
    } catch (err) {
      setLoginError("An unexpected error occurred");
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
      const redirectTo = `${window.location.origin}/dashboard`; // Get the current URL dynamically
      await signInWithGoogle(redirectTo);
    };
  const handleGithubLogin = async () => {
    const redirectTo = `${window.location.origin}/dashboard`; // Get the current URL dynamically
      await signInWithGitHub(redirectTo);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your GitHub or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGithubLogin}
                >
                  <GitHubIcon
                    style={{ fontSize: "32px", marginRight: "8px" }}
                  />
                  Login with GitHub
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                >
                  <img
                    src="/google.svg"
                    alt="Google Logo"
                    className="h-5 w-5 mr-2"
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
                    <a
                      href="#"
                      className="ml-auto text-muted-foreground text-sm underline-offset-4 hover:underline hover:text-[--primary]"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    className="text-bo</a>ld font-3xl"
                    placeholder="password"
                    type="password"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-[--primary] animation duration-500"
                >
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="underline underline-offset-4 hover:text-[--primary] duration-500 animation"
                >
                  Sign up
                </a>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 ">
        By clicking continue, you agree to our{" "}
        <a className="hover:text-[--primary] animation duration-300" href="#">
          Terms of Service
        </a>{" "}
        and{" "}
        <a className="hover:text-[--primary] animation duration-300" href="#">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
