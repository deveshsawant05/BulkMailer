"use client";
import React from 'react';
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";
import {
    Card,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function VerifiedEmail() {

    const router = useRouter();

    const handleBackToLogin = () => {
        router.push("/login");
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:py-6 md:px-10">
            <Card className="flex w-full max-w-sm flex-col gap-5 justify-center items-center p-6 text-center ">
                <a href="/" className="flex items-center gap-2 self-center font-medium">
                    <Logo />
                </a>
                <CardTitle>Email Verified</CardTitle>
                <CardDescription>Your email has been successfully verified. You can now log in using your account.</CardDescription>
                <Button
                    type="button"
                    className="w-full bg-black text-white hover:bg-[--primary] animation duration-500"
                    onClick={handleBackToLogin}
                >
                    Back to Login
                </Button>
            </Card>
        </div>
    );
};