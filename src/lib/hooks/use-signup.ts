import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService, AuthError } from "@/lib/services/auth";
import { SignupFormData } from "@/lib/types/validation/auth";

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false); // For loading spinner/UI state
  const [error, setError] = useState<string>(""); // Backend/network error (not field-level)
  const router = useRouter();

  // Now returns OTP info from backend, and pushes fields into /otp page
  const signup = async (data: SignupFormData) => {
    setIsLoading(true);
    setError("");
    try {
      // Remove non-server fields
      const { confirmPassword, ...payload } = data;
      if (!payload.phone) {
        delete payload.phone;
      }

      const response = await authService.signup(payload);

      // These 3 will be returned by the backend after successful signup.
      // Adjust as needed if your backend returns a different shape!
      const { id, email, otp_expires_at } = response;

      // Option 1: PUSH AS QUERY PARAMS
      router.push(
        `/otp?id=${encodeURIComponent(id)}&email=${encodeURIComponent(email)}&otpExpiresAt=${encodeURIComponent(
          otp_expires_at
        )}`
      );

      // Option 2 (better for bigger/prod apps): use context/localStorage to persist across navigation.

      // No toast
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message); // Display clean server messages
      } else {
        const message = "An unexpected error occurred. Please try again.";
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error, clearError: () => setError("") };
}

export default useSignup;
