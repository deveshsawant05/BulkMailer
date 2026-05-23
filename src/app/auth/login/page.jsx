"use client"
import { useState, useEffect,useRef } from "react";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "./login-form"
import Logo from "@/components/logo";
import { VerifyOTP } from "../components/verify-otp";
import { sendOTP } from "../actions";
export default function LoginPage() {
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(null);
  
  const hasTriggeredRef = useRef(false); 

  useEffect(() => {
    if (verificationRequired && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true; // prevent future triggers
      sendOTP(verifyEmail);
    }
  }, [verificationRequired, verifyEmail]);

  return (
    (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:py-2 md:px-10">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <Logo />
        </Link>

        {verificationRequired && verifyEmail ? (
          <VerifyOTP email={verifyEmail} />
        ) : (
          <LoginForm setVerificationRequired={setVerificationRequired} setVerifyEmail={setVerifyEmail} />
        )}
      </div>
    </div>)
  );
}
