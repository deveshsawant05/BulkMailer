"use client"
import { GalleryVerticalEnd } from "lucide-react"
import { useRouter } from "next/navigation";
import { createClient } from '@/utils/supabase/client'
import { useState ,useEffect } from "react";
import Link from "next/link";
import { SignUpForm } from "./signup-form"
import { VerifyOTP } from "../components/verify-otp";
import Logo from "@/components/logo"
export default function SignUpPage() {
    const router = useRouter();
    const supabase = createClient();
    useEffect(() => {
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Redirect to dashboard if the user is already logged in
          router.push('/dashboard');
        }
      };
  
      checkSession();
    }, [router, supabase.auth]);

  const [email, setEmail] = useState("");
  const [confirmSignUp, setConfirmSignUp] = useState(false);

  return (
    (
    <div className="auth-page auth-page--signup">
      <div className="auth-container">
        <Link href="/" className="auth-brand-link">
          <Logo />
        </Link>
        <div className="auth-form-surface">{confirmSignUp ? <VerifyOTP email={email} /> : <SignUpForm email={email} setEmail={setEmail} setConfirmSignUp={setConfirmSignUp} />}</div>
      </div>
    </div>)
  );
}
