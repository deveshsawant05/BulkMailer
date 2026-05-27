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
    <div className="auth-page auth-page--recovery">
      <div className="auth-container">
        <Link href="/" className="auth-brand-link">
          <Logo />
        </Link>
        
      <div className="auth-form-surface">{passwordUpdated ? (
        <PasswordUpdateSuccess email={email} />
      ) : otpVerified ? (
        <ForgotPasswordForm email={email} setPasswordUpdated={setPasswordUpdated} />
      ) : otpSent ? (
        <VerifyOTP email={email} setEmail={setEmail} otpVerified={otpVerified} setOtpVerified={setOtpVerified} />
      ) : (
        <SendOtpForm otpSent={otpSent} setOtpSent={setOtpSent} email={email} setEmail={setEmail} />
      )}</div>
      </div>
    </div>
  )
  );};

export default ForgotPassword;
