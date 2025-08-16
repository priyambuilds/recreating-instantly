import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url("Invalid API URL"),
  NEXT_PUBLIC_ENVIRONMENT: z.enum(["development", "staging", "production"]),
});

export const config = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",
});
