"use client";
import React, { useState } from "react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { forgotPassword, updatePassword } from "../actions";
import { Eye, EyeOff, CircleCheckBig, CircleX } from "lucide-react";
import { logout } from "../login/actions";
import { ButtonLoader } from "@/components/global/loader";

export function ForgotPasswordForm({ email, setPasswordUpdated }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    setError("");
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const { success, error } = await updatePassword(confirmPassword);
    if (success) {
      logout(false);
      setPasswordUpdated(true);
    } else {
      setError(error || "Failed to reset password");
    }
    setLoading(false);
  };
  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>Enter your new password for {email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap gap-6">
        {error && (
          <div className="flex items-center justify-center text-center text-red-500">
            <p className="text-sm">{error}</p>
          </div>
        )}
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  className="text-bold font-3xl"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handleNewPasswordChange}
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
            </div>
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-[--primary] animation duration-500"
            >
              {loading ? <div className="flex no-wrap">Resetting Password<ButtonLoader /></div> : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function SendOtpForm({ otpSent, setOtpSent, email, setEmail }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    setLoading(true);
    setError("");
    e.preventDefault();
    const email = e.target.email.value;
    const { success, error } = await forgotPassword(email);
    if (success) {
      setOtpSent(true);
      setEmail(email);
    } else {
      console.error("Error sending OTP:", error);
      setError(error || "Failed to send OTP");
    }
    e.target.reset();
    setLoading(false);
  };
  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive OTP</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-[--primary] animation duration-500"
            >
              {loading ? <div className="flex no-wrap">Sending OTP<ButtonLoader /></div> : "Send OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


export function PasswordUpdateSuccess( { email  }) {
  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Password Updated Successfully</CardTitle>
          <CardDescription>
            Your password has been updated successfully for {email}. You can now log in with your new password.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            asChild
            className="w-full bg-black text-white hover:bg-[--primary] animation duration-500"
          >
            <a href="/auth/login">Go to Login</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
