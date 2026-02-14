import z from "zod/v3";

export const LoginRequest = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(5, "Username must be at least 5 characters"),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export type LoginRequest = z.infer<typeof LoginRequest>;
