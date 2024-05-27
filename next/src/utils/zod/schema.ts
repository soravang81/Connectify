import { z } from "zod"

export const SignupSchema = z.object({
    email: z
      .string()
      .email({ message: "Invalid email format" })
      .min(1, "Email is required"),
    username: z.string().min(5, "Username must be at least 5 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
export const SigninSchema = z.object({
    email: z
      .string()
      .email({ message: "Invalid email format" })
      .min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });