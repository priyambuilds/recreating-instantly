"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FormSchema = z.object({
  pin: z
    .string()
    .min(4, { message: "Your one-time password must be 4 characters." }),
});

type OtpFormData = z.infer<typeof FormSchema>;

interface OtpPageProps {
  id: number;
  userIdentifier: string; // email, as required by backend
  otpExpiresAt: string; // ISO8601 string from backend
}

function safeString(x: any): string {
  if (!x) return "";
  if (typeof x === "string" || typeof x === "number") return String(x);
  if (typeof x === "object") {
    if ("message" in x && typeof x.message === "string") return x.message;
    if ("msg" in x && typeof x.msg === "string") return x.msg;
    if ("detail" in x)
      return typeof x.detail === "string" ? x.detail : JSON.stringify(x.detail);
    return JSON.stringify(x);
  }
  return String(x);
}

export default function InputOTPForm({
  id,
  userIdentifier,
  otpExpiresAt,
}: OtpPageProps) {
  const [countdown, setCountdown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [otpError, setOtpError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const form = useForm<OtpFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { pin: "" },
  });

  // Countdown for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    setIsResendDisabled(false);
  }, [countdown]);

  // Initial countdown start
  useEffect(() => {
    setIsResendDisabled(true);
    setCountdown(30);
  }, []);

  // Send verification code to backend
  const onSubmit = async (data: OtpFormData) => {
    setOtpError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const res = await fetch("/user/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id,
          email: userIdentifier,
          otp: Number(data.pin),
          otp_expires_at: otpExpiresAt,
        }),
      });
      if (res.ok) {
        setSuccessMsg("OTP Verified Successfully! You have been verified.");
        // Optional: window.location.href = "/dashboard";
      } else {
        const json = await res.json().catch(() => ({}));
        setOtpError(
          safeString(
            json.detail || json.msg || json.message || "Invalid or expired OTP"
          )
        );
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (isResendDisabled) return;
    setOtpError("");
    setSuccessMsg("");
    setIsResendDisabled(true);
    setCountdown(30);
    try {
      const res = await fetch("/user/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id,
          email: userIdentifier,
          // Add otp_expires_at if your backend requires for /resend as well
        }),
      });
      if (res.ok) setSuccessMsg("A new OTP has been sent to your phone/email.");
      else {
        const json = await res.json().catch(() => ({}));
        setOtpError(
          safeString(
            json.detail ||
              json.msg ||
              json.message ||
              "Unable to resend OTP. Try later."
          )
        );
      }
    } catch {
      setOtpError("Network error. Please try again.");
    }
  };

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Enter OTP</CardTitle>
          <p className="text-sm text-muted-foreground">
            We've sent a 4-digit code to your email/phone
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              autoComplete="off"
            >
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="block text-center">
                      One-Time Password
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP maxLength={4} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormDescription className="text-center">
                      Please enter the 4-digit code sent to your phone/email.
                    </FormDescription>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
              {otpError && (
                <p className="mt-1 text-center text-red-500" role="alert">
                  {otpError}
                </p>
              )}
              {successMsg && (
                <p className="mt-1 text-center text-green-600" role="status">
                  {successMsg}
                </p>
              )}
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.watch("pin").length !== 4 || loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              {isResendDisabled ? (
                <span className="cursor-not-allowed text-muted-foreground">
                  Try again in {formatTime(countdown)}
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  className="font-medium cursor-pointer text-primary hover:underline"
                  type="button"
                  disabled={isResendDisabled}
                >
                  Try again
                </button>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
