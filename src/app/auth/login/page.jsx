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
    <div className="auth-page auth-page--login">
      <div className="auth-container">
        <Link href="/" className="auth-brand-link">
          <Logo />
        </Link>

        <div className="auth-form-surface">{verificationRequired && verifyEmail ? (
          <VerifyOTP email={verifyEmail} />
        ) : (
          <LoginForm setVerificationRequired={setVerificationRequired} setVerifyEmail={setVerifyEmail} />
        )}</div>
      </div>
    </div>)
  );
}
