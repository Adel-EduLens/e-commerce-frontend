import * as z from "zod";

export interface User {
  id: string;
  name?: string;
  email?: string;
  role: "user" | "trader" | "influencer" | "admin";
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  status: "active" | "suspended";
}

export interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  clearAuth: () => void;
  getToken: () => string | null;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: ("user" | "trader" | "influencer" | "admin")[];
  redirectTo?: string;
}

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
  role: z.enum(["user", "trader", "influencer"]),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, {
      message: "Phone number must be a valid Egyptian mobile number",
    })
    .or(z.literal(""))
    .optional(),
});

export const traderLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const influencerLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type TraderLoginFormValues = z.infer<typeof traderLoginSchema>;
export type InfluencerLoginFormValues = z.infer<typeof influencerLoginSchema>;
