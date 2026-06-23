import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "../lib/axios";
import { loginSchema, signupSchema } from "../schemas";
import type { LoginFormValues, SignupFormValues } from "../schemas";

interface AuthPageProps {
  mode: "login" | "signup";
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative h-[20px] w-[40px] shrink-0 cursor-pointer overflow-hidden rounded-[36.5px] border-[0.5px] border-gray-light transition-colors"
      style={{ backgroundColor: checked ? "var(--primary, #bbff63)" : "var(--gray-light, #ededed)" }}
    >
      <div
        className="absolute top-0 h-[20px] w-[20px] transition-[left] duration-200"
        style={{ left: checked ? 20 : 0 }}
      >
        <div className="absolute inset-[10%] rounded-[12px] bg-card shadow-[1px_1px_2px_-1px_rgba(51,51,51,0.3)]" />
      </div>
    </button>
  );
}

export default function AuthPage({ mode }: AuthPageProps) {
  const isLogin = mode === "login";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "user",
    },
  });

  const onLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", data);
      const { token, user } = response.data.data;
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/");
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/signup", data);
      const { token, user } = response.data.data;
      setAuth(user, token);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message || "Registration failed. Try again.";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background font-['Inter']">
      {/* Main container — Figma: 1440×1024 */}
      <div className="relative w-[1440px] h-[1024px] overflow-hidden rounded-[24px] bg-card">
        {/* Logo — Login: x=104 y=88 | Signup: x=104 y=86 */}
        <img
          src="/images/auth/logo.png"
          alt="Gen Z"
          className={`absolute left-[104px] h-[48px] w-[90px] object-contain ${isLogin ? "top-[88px]" : "top-[86px]"}`}
        />

        {/* Right image panel — Figma: y=32, w=720, h=960, rounded-[32px] */}
        <div className="absolute right-0 top-0 h-full w-[720px] p-[32px] pl-0 hidden lg:block">
          <div className="relative h-[960px] w-[720px] overflow-hidden rounded-[32px] bg-black">
            <img
              src={
                isLogin
                  ? "/images/auth/login-hero.png"
                  : "/images/auth/signup-hero.png"
              }
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Left form area — Login: centered | Signup: offset down by 50.5px */}
        <div
          className={`absolute left-[104px] w-[480px] ${
            isLogin
              ? "top-1/2 -translate-y-1/2"
              : "top-[calc(50%+50.5px)] -translate-y-1/2"
          }`}
        >
          {isLogin ? (
            /* ─── Login Form ─── */
            <form
              onSubmit={handleLoginSubmit(onLogin)}
              className="flex flex-col gap-[40px]"
            >
              {/* Header */}
              <div className="flex flex-col gap-[14px]">
                <h1 className="font-['Montserrat'] text-[36px] font-semibold leading-normal text-foreground">
                  Login{" "}
                </h1>
                <p className="font-['Montserrat'] text-[16px] font-medium leading-normal text-gray-text">
                  Welcome, let's get started
                </p>
              </div>

              {/* Fields */}
              <div className="flex flex-col gap-[32px]">
                <div className="flex flex-col gap-[24px]">
                  {/* Email */}
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-['Montserrat'] text-[15px] font-semibold leading-none tracking-[0.15px] text-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="h-[56px] w-[480px] rounded-[16px] border-[0.5px] border-[#e5e5e5] bg-gray-light px-[16px] font-['Inter'] text-[15px] leading-[20px] text-foreground outline-none placeholder:text-gray-text"
                      {...registerLogin("email")}
                    />
                    {loginErrors.email && (
                      <p className="text-[13px] text-red-500">
                        {loginErrors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-['Montserrat'] text-[15px] font-semibold leading-none tracking-[0.15px] text-foreground">
                      Password
                    </label>
                    <div className="flex flex-col gap-[16px]">
                      <div className="relative h-[56px] w-[480px]">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className="h-full w-full rounded-[16px] border-[0.5px] border-[#e5e5e5] bg-gray-light px-[16px] pr-[48px] font-['Inter'] text-[15px] leading-[20px] text-foreground outline-none placeholder:text-gray-text"
                          {...registerLogin("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-[16px] top-1/2 -translate-y-1/2 text-gray-text hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                      {loginErrors.password && (
                        <p className="text-[13px] text-red-500">
                          {loginErrors.password.message}
                        </p>
                      )}
                      {/* Remember me + Forgot password */}
                      <div className="flex h-[20px] w-[480px] items-center gap-[16px]">
                        <div className="flex flex-1 items-center gap-[8px]">
                          <Toggle
                            checked={rememberMe}
                            onChange={setRememberMe}
                          />
                          <span className="font-['Montserrat'] text-[13px] font-medium leading-[20px] tracking-[0.3px] text-foreground">
                            Remember me
                          </span>
                        </div>
                        <Link
                          to="#"
                          className="flex-1 text-right font-['Montserrat'] text-[13px] font-medium leading-[20px] tracking-[0.3px] text-[#007aff]"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit + Switch */}
              <div className="flex flex-col items-center gap-[24px]">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center rounded-[16px] bg-[#0f1115] py-[17px] font-['Montserrat'] text-[18px] font-bold leading-normal text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
                <div className="flex items-end justify-center gap-[8px] font-['Montserrat'] text-[13px] font-medium leading-[20px] tracking-[0.3px]">
                  <span className="text-foreground">
                    Dont have an account?
                  </span>
                  <Link to="/signup" className="text-[#007aff] text-right">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          ) : (
            /* ─── Signup Form ─── */
            <form
              onSubmit={handleSignupSubmit(onSignup)}
              className="flex flex-col gap-[40px]"
            >
              {/* Header */}
              <div className="flex flex-col gap-[14px]">
                <h1 className="font-['Montserrat'] text-[36px] font-semibold leading-normal text-foreground">
                  Sign Up
                </h1>
                <p className="font-['Montserrat'] text-[16px] font-medium leading-normal text-gray-text">
                  Welcome, let's get started
                </p>
              </div>

              {/* Fields */}
              <div className="flex flex-col gap-[32px]">
                <div className="flex flex-col gap-[24px]">
                  {/* Email */}
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-['Montserrat'] text-[15px] font-semibold leading-none tracking-[0.15px] text-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="h-[56px] w-[480px] rounded-[16px] border-[0.5px] border-[#e5e5e5] bg-gray-light px-[16px] font-['Inter'] text-[15px] leading-[20px] text-foreground outline-none placeholder:text-gray-text"
                      {...registerSignup("email")}
                    />
                    {signupErrors.email && (
                      <p className="text-[13px] text-red-500">
                        {signupErrors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-['Montserrat'] text-[15px] font-semibold leading-none tracking-[0.15px] text-foreground">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      className="h-[56px] w-[480px] rounded-[16px] border-[0.5px] border-[#e5e5e5] bg-gray-light px-[16px] font-['Inter'] text-[15px] leading-[20px] text-foreground outline-none placeholder:text-gray-text"
                      {...registerSignup("phone")}
                    />
                  </div>

                  {/* Name */}
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-['Montserrat'] text-[15px] font-semibold leading-none tracking-[0.15px] text-foreground">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="h-[56px] w-[480px] rounded-[16px] border-[0.5px] border-[#e5e5e5] bg-gray-light px-[16px] font-['Inter'] text-[15px] leading-[20px] text-foreground outline-none placeholder:text-gray-text"
                      {...registerSignup("name")}
                    />
                    {signupErrors.name && (
                      <p className="text-[13px] text-red-500">
                        {signupErrors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-['Montserrat'] text-[15px] font-semibold leading-none tracking-[0.15px] text-foreground">
                      Account Type
                    </label>
                    <select
                      className="h-[56px] w-[480px] cursor-pointer appearance-none rounded-[16px] border-[0.5px] border-[#e5e5e5] bg-gray-light px-[16px] font-['Inter'] text-[15px] leading-[20px] text-foreground outline-none"
                      {...registerSignup("role")}
                    >
                      <option value="user">Customer</option>
                      <option value="trader">Trader</option>
                      <option value="admin">Administrator</option>
                    </select>
                    {signupErrors.role && (
                      <p className="text-[13px] text-red-500">
                        {signupErrors.role.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-['Montserrat'] text-[15px] font-semibold leading-none tracking-[0.15px] text-foreground">
                      Password
                    </label>
                    <div className="flex flex-col gap-[16px]">
                      <div className="relative h-[56px] w-[480px]">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className="h-full w-full rounded-[16px] border-[0.5px] border-[#e5e5e5] bg-gray-light px-[16px] pr-[48px] font-['Inter'] text-[15px] leading-[20px] text-foreground outline-none placeholder:text-gray-text"
                          {...registerSignup("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-[16px] top-1/2 -translate-y-1/2 text-gray-text hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                      {signupErrors.password && (
                        <p className="text-[13px] text-red-500">
                          {signupErrors.password.message}
                        </p>
                      )}
                      {/* Terms toggle */}
                      <div className="flex items-center gap-[8px]">
                        <Toggle
                          checked={agreeTerms}
                          onChange={setAgreeTerms}
                        />
                        <span className="font-['Montserrat'] text-[13px] font-medium leading-[20px] tracking-[0.3px] text-foreground">
                          I agree to the Terms & Conditions
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit + Switch */}
              <div className="flex flex-col items-center gap-[24px]">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center rounded-[16px] bg-[#0f1115] py-[17px] font-['Montserrat'] text-[18px] font-bold leading-normal text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </button>
                <div className="flex items-end justify-center gap-[8px] font-['Montserrat'] text-[13px] font-medium leading-[20px] tracking-[0.3px]">
                  <span className="text-foreground">
                    Already have an account?
                  </span>
                  <Link to="/login" className="text-[#007aff] text-right">
                    Log In
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
