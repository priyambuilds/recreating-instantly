"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signupSchema, SignupFormData } from "@/lib/types/validation/auth";
import { useSignup } from "@/hooks/use-signup";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Social icon components inline for completeness
const SocialIcon = {
  Google: () => (
    <svg className="w-4 h-4" viewBox="0 0 25 25" aria-hidden="true">
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
        fill="currentColor"
      />
    </svg>
  ),
  Github: () => (
    <svg className="w-4 h-4" viewBox="0 0 25 25" aria-hidden="true">
      <path
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        fill="currentColor"
      />
    </svg>
  ),
  Linkedin: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Twitter: () => (
    <svg className="w-4 h-4" viewBox="0 0 25 25" aria-hidden="true">
      <path
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
        fill="currentColor"
      />
    </svg>
  ),
  Discord: () => (
    <svg className="w-4 h-4" viewBox="0 0 25 25" aria-hidden="true">
      <path
        d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
        fill="currentColor"
      />
    </svg>
  ),
  Slack: () => (
    <svg className="w-4 h-4" viewBox="0 0 25 25" aria-hidden="true">
      <path
        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
        fill="currentColor"
      />
    </svg>
  ),
};

interface SignupFormProps extends React.ComponentProps<"div"> {}

export function SignupForm({ className, ...props }: SignupFormProps) {
  // Use custom signup hook for API, loading, backend error handling
  const { signup, isLoading, error: backendError, clearError } = useSignup();
  const router = useRouter();

  // Form state
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      fullname: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  // Social Login Handler (OAuth flow starts here)
  const handleSocialLogin = (provider: string) => {
    // In production, use: router.push or window.location to your actual OAuth endpoint
    window.location.href = `http://localhost:8000/user/sso/${provider}/login`;
  };

  // Main form submission
  const onSubmit = async (data: SignupFormData) => {
    clearError();
    await signup(data); // handles all API, toasts, and router push
    reset();
  };

  // Social providers defined here for fast editing
  const socialProviders = [
    { key: "google", label: "google", icon: SocialIcon.Google },
    { key: "github", label: "github", icon: SocialIcon.Github },
    { key: "linkedin", label: "linkedIn", icon: SocialIcon.Linkedin },
    { key: "x", label: "x", icon: SocialIcon.Twitter },
    { key: "slack", label: "slack", icon: SocialIcon.Slack },
    { key: "discord", label: "discord", icon: SocialIcon.Discord },
  ];

  return (
    <div className={className} {...props}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your details to create your account
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Login */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {socialProviders.map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant="outline"
                  type="button"
                  className="w-full"
                  disabled={isSubmitting || isLoading}
                  onClick={() => handleSocialLogin(key)}
                  aria-label={`Sign up with ${label}`}
                >
                  <Icon />
                  <span className="sr-only">Sign up with {label}</span>
                </Button>
              ))}
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-background text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
          </div>

          {/* Signup Form (inlined fields, not abstracted) */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...register("username")}
                className={cn(
                  errors.username && "border-red-500 focus-visible:ring-red-500"
                )}
                aria-invalid={!!errors.username}
                aria-describedby={
                  errors.username ? "username-error" : undefined
                }
              />
              {errors.username && (
                <p
                  id="username-error"
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="fullname" className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="fullname"
                type="text"
                placeholder="Enter your full name"
                {...register("fullname")}
                className={cn(
                  errors.fullname && "border-red-500 focus-visible:ring-red-500"
                )}
                aria-invalid={!!errors.fullname}
                aria-describedby={
                  errors.fullname ? "fullname-error" : undefined
                }
              />
              {errors.fullname && (
                <p
                  id="fullname-error"
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {errors.fullname.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number (Optional)
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+919988776655"
                {...register("phone")}
                className={cn(
                  errors.phone && "border-red-500 focus-visible:ring-red-500"
                )}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <p
                  id="phone-error"
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={cn(
                  errors.email && "border-red-500 focus-visible:ring-red-500"
                )}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                {...register("password")}
                className={cn(
                  errors.password && "border-red-500 focus-visible:ring-red-500"
                )}
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />
              {errors.password && (
                <p
                  id="password-error"
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className={cn(
                  errors.confirmPassword &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? "confirmPassword-error" : undefined
                }
              />
              {errors.confirmPassword && (
                <p
                  id="confirmPassword-error"
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Backend Error */}
            {backendError && (
              <div
                className="p-3 border border-red-200 rounded-md bg-red-50"
                role="alert"
              >
                <p className="text-sm text-red-800">{backendError}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading
                ? "Creating Account..."
                : "Create Account"}
            </Button>
          </form>
          {/* Login Link */}
          <div className="text-sm text-center">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <a
              href="/sign-in"
              className="font-medium underline text-primary hover:text-primary/80 underline-offset-4"
            >
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
      <p className="mt-4 text-xs text-center text-muted-foreground">
        By creating an account, you agree to our{" "}
        <a
          href="/terms"
          className="underline hover:text-primary underline-offset-4"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="underline hover:text-primary underline-offset-4"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}

export default SignupForm;
