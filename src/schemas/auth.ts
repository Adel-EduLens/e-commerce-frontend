import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["user", "trader", "admin"]),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, {
      message: "Phone number must be a valid Egyptian mobile number",
    })
    .or(z.literal(""))
    .optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
