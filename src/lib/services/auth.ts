import { config } from "@/lib/types/validation/config";
import { SignupFormData } from "@/lib/types/validation/auth";

// Custom error for clear error handling downstream
export class AuthError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = "AuthError";
  }
}

class AuthService {
  private baseUrl = config.NEXT_PUBLIC_API_URL;
  private requestId = () => crypto.randomUUID();

  async signup(data: Omit<SignupFormData, "confirmPassword" | "terms">) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const response = await fetch(`${this.baseUrl}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Request-ID": this.requestId(),
        },
        body: JSON.stringify(data),
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        switch (response.status) {
          case 409:
            throw new AuthError(409, "Username or email already exists");
          case 422:
            throw new AuthError(
              422,
              errorData.detail?.[0]?.msg || "Invalid input data"
            );
          case 429:
            throw new AuthError(
              429,
              "Too many attempts. Please try again later."
            );
          default:
            throw new AuthError(
              response.status,
              "Signup failed. Please try again."
            );
        }
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        (error as { name?: string }).name === "AbortError"
      ) {
        throw new AuthError(408, "Request timeout. Please try again.");
      }

      if (error instanceof AuthError) {
        throw error;
      }

      throw new AuthError(500, "Network error. Please check your connection.");
    }
  }
}

export const authService = new AuthService();
