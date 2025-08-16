import { z } from "zod";

// Signup form schema using zod — validates + transforms + sanitizes
export const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscore"
      )
      .transform((val) => val.toLowerCase().trim()), // Normalizes for comparisons, avoids case issues

    fullname: z
      .string()
      .min(2, "Full name is required")
      .max(100, "Full name must be less than 100 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "Full name contains invalid characters") // No weird stuff
      .transform((val) => val.trim())
      .refine(
        (val) => val.split(" ").length <= 5, // Uncle Bob III Jr. is fine, but no 6-word names
        "Full name cannot have more than 5 parts"
      ),

    phone: z // Optional, but if present, must be valid
      .string()
      .regex(
        /^\+?[1-9]\d{9,14}$/,
        "Phone number must be 10-15 digits and can start with +"
      )
      .optional()
      .or(z.literal("")), // Empty string allowed (for form UI compatibility)

    email: z
      .email("Enter a valid email address")
      .min(6, "Email is too short")
      .max(254, "Email is too long")
      .transform((val) => val.toLowerCase().trim()),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number and special character"
      ),

    confirmPassword: z.string(), // Will be checked below
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Type — makes your forms and fetch helpers type-safe automatically
export type SignupFormData = z.infer<typeof signupSchema>;
