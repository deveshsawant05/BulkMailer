import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonLoader } from "@/components/global/loader";
import { redirect } from "next/navigation";
import { verifyOTP } from "../actions";


export function VerifyOTP({ email}) {
  const [otp, setOtp] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const handleVerifyOtp = async () => {
    setVerifyLoading(true);
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      setVerifyLoading(false);
      return;
    }
    const { success, error } = await verifyOTP(email, otp);
    if (success) {
      setVerifyLoading(false);
      redirect("/dashboard");
    } else {
      setOtpError(error || "Failed to verify OTP. Please try again.");
    }
    setVerifyLoading(false);
  };
  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify OTP</CardTitle>
          <div className="text-red-500">
            {otpError && <p className="text-sm">{otpError}</p>} 
            </div>
          <CardDescription>
            Enter the OTP sent to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
            <InputOTP
              maxLength={6}
              containerClassName="w-full flex justify-center"
              onChange={(value) => setOtp(value)}
            >
            <InputOTPGroup className="">
              <InputOTPSlot
                index={0}
                className="h-10 w-10 text-xl text-[--secondary] font-bold border-[--primary] focus:border-secondary"
              />
              <InputOTPSlot
                index={1}
                className="h-10 w-10 text-xl text-[--secondary] font-bold border-[--primary] focus:border-secondary"
              />
              <InputOTPSlot
                index={2}
                className="h-10 w-10 text-xl text-[--secondary] font-bold border-[--primary] focus:border-secondary"
              />
              <InputOTPSlot
                index={3}
                className="h-10 w-10 text-xl text-[--secondary] font-bold border-[--primary] focus:border-secondary"
              />
              <InputOTPSlot
                index={4}
                className="h-10 w-10 text-xl text-[--secondary] font-bold border-[--primary] focus:border-secondary"
              />
              <InputOTPSlot
                index={5}
                className="h-10 w-10 text-xl text-[--secondary] font-bold border-[--primary] focus:border-secondary"
              />
            </InputOTPGroup>
          </InputOTP>
          <div className="flex justify-center mt-5">
            <Button
              type="submit"
              className={`w-60 bg-black text-white hover:bg-[--primary] animation duration-500 ${otp.length !== 6 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {verifyLoading ? (
                <div className="flex no-wrap">
                  Verifying OTP
                  <ButtonLoader />
                </div>
              ) : (
                "Verify OTP"
            )}
            </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
