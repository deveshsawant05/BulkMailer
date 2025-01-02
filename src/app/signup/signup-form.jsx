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

import { Eye, EyeOff, CircleCheckBig, CircleX } from "lucide-react";
import { useState ,useEffect} from "react";
import { PrimaryLoader , ButtonLoader } from "@/components/loader";
import { createClient } from "@/utils/supabase/client";

import { signup } from "./actions";
import { useRouter , permanentRedirect } from "next/navigation";
export function SignUpForm({ className, ...props }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [signupLoading, setSignupLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    setSignupLoading(true);
    e.preventDefault();
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordRegex.test(password) && password === confirmPassword) {
      const email = e.target.email.value;
      const name = e.target.name.value;
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("options", JSON.stringify({
        data: {
          name : name,
        }
      }));

      const { user, error } = await signup(formData);
      if (error) {
        setPasswordError(error);
      } else {
        router.push("/signup/confirm");
      }
    } else {
      if (!passwordRegex.test(password)) {
        setPasswordError("Password does not meet the required criteria");
      }
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
      }
    }
    setSignupLoading(false); 
  };

  const supabase = createClient();
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      if (session) {
        // Redirect to dashboard if the user is already logged in
        permanentRedirect("/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);
  
  if (loading) {
    return (
      <div className="w-full flex no-wrap justify-center mt-5">
        <h2 className="font-bold">Loading</h2>
        <PrimaryLoader />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Join us</CardTitle>
          <CardDescription>Sign up with your details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                {passwordError && (
                  <p className="text-red-500 text-sm text-center">
                    {passwordError}
                  </p>
                )}
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="Your Full Name" required  />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    className="text-bold font-3xl"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <Button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 text-[--primary-foreground] shadow-none border-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    className="text-bold font-3xl"
                    placeholder="Confirm password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                  <Button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 text-[--primary-foreground] border-0 shadow-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {confirmPasswordError && (
                  <p className="text-red-500 text-sm">{confirmPasswordError}</p>
                )}
                <div className="flex flex-col mt-2">
                  <Label className="mb-2">Password Requirements:</Label>
                  <div className="flex items-center gap-1 sm:ms-14">
                    {password.length >= 8 ? (
                      <CircleCheckBig className="text-green-500 w-4 h-4" />
                    ) : (
                      <CircleX className="text-red-500 w-4 h-4" />
                    )}
                    <span className="text-muted-foreground text-sm">
                      At least 8 characters long
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:ms-14">
                    {/[a-z]/.test(password) ? (
                      <CircleCheckBig className="text-green-500 w-4 h-4" />
                    ) : (
                      <CircleX className="text-red-500 w-4 h-4" />
                    )}
                    <span className="text-muted-foreground text-sm">
                      At least one lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:ms-14">
                    {/[A-Z]/.test(password) ? (
                      <CircleCheckBig className="text-green-500 w-4 h-4" />
                    ) : (
                      <CircleX className="text-red-500 w-4 h-4" />
                    )}
                    <span className="text-muted-foreground text-sm">
                      At least one uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:ms-14">
                    {/\d/.test(password) ? (
                      <CircleCheckBig className="text-green-500 w-4 h-4" />
                    ) : (
                      <CircleX className="text-red-500 w-4 h-4" />
                    )}
                    <span className="text-muted-foreground text-sm">
                      At least one numeric digit
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:ms-14">
                    {/[@$!%*?&]/.test(password) ? (
                      <CircleCheckBig className="text-green-500 w-4 h-4" />
                    ) : (
                      <CircleX className="text-red-500 w-4 h-4" />
                    )}
                    <span className="text-muted-foreground text-sm">
                      At least one special character
                    </span>
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-[--primary] animation duration-500"
              >
                {signupLoading ? <div className="flex no-wrap">Signing up<ButtonLoader /></div> : "Sign up"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="underline underline-offset-4 hover:text-[--primary] duration-500 animation"
                >
                  Login
                </a>
              </div>
            </div>
          </form>
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
