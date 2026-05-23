'use client';
import React, { useState } from 'react';
import Logo from '@/components/logo';
import { ForgotPasswordForm, SendOtpForm ,PasswordUpdateSuccess } from './forgot-pass-form';
import { VerifyOTP } from './verify-otp-form';
import Link from 'next/link';

const ForgotPassword = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  return (
        (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:py-6 md:px-10">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <Logo />
        </Link>
        
      </div>
      {passwordUpdated ? (
        <PasswordUpdateSuccess email={email} />
      ) : otpVerified ? (
        <ForgotPasswordForm email={email} setPasswordUpdated={setPasswordUpdated} />
      ) : otpSent ? (
        <VerifyOTP email={email} setEmail={setEmail} otpVerified={otpVerified} setOtpVerified={setOtpVerified} />
      ) : (
        <SendOtpForm otpSent={otpSent} setOtpSent={setOtpSent} email={email} setEmail={setEmail} />
      )}
    </div>
  )
  );};

export default ForgotPassword;