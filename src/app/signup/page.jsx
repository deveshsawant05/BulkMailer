"use client"
import { GalleryVerticalEnd } from "lucide-react"
import { useRouter } from "next/navigation";
import { createClient } from '@/utils/supabase/client'
import { useState ,useEffect } from "react";

import { SignUpForm } from "./signup-form"
import Logo from "@/components/logo"
export default function SignUpPage() {
    const router = useRouter();
    const supabase = createClient();
    useEffect(() => {
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        console.log(session);
        
        if (session) {
          // Redirect to dashboard if the user is already logged in
          router.push('/dashboard');
        }
      };
  
      checkSession();
    }, [router]);
  return (
    (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:py-6 md:px-10">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <Logo />
        </a>
        <SignUpForm />
      </div>
    </div>)
  );
}
