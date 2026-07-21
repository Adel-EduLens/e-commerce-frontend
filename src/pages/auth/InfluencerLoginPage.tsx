import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../../schemas";
import { api } from "../../lib/axios";
import { handleApiError } from "../../lib/utils";

const InfluencerLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post("/influencer/auth/login", data);
      const { token, influencer } = response.data.data;
      setAuth(influencer, token);
      toast.success(`Welcome back, ${influencer.name}!`);
      navigate("/dashboard/influencer");
    } catch (error) {
      handleApiError(error, "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background text-foreground px-0 py-6 font-['Inter'] sm:px-4 lg:px-6">
      <div className="relative flex w-full max-w-[1440px] flex-col overflow-hidden rounded-none bg-card sm:rounded-[24px] lg:h-[1024px] lg:min-h-[820px] lg:flex-row">
        {/* Form area */}
        <div className="order-1 flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:order-none lg:w-1/2 lg:px-16 lg:py-0">
          <div className="flex w-full max-w-[480px] flex-col">
            <div className="flex justify-between mb-5 items-center">
              <img
                src="/home-page/Logo.png"
                alt="Gen Z"
                className="h-[40px] w-[75px] object-contain sm:h-[48px] sm:w-[90px]"
              />
            </div>
            <form
              onSubmit={handleSubmit(onLogin)}
              className="flex flex-col gap-[32px] sm:gap-[40px]"
            >
              <div className="flex flex-col gap-[14px]">
                <h1 className="font-['Montserrat'] text-[28px] font-semibold leading-normal text-foreground sm:text-[36px]">
                  Influencer Login
                </h1>
                <p className="font-['Montserrat'] text-[15px] font-medium leading-normal text-gray-text sm:text-[16px]">
                  Sign in to access your influencer dashboard
                </p>
              </div>

              <div className="flex flex-col gap-[32px]">
                <div className="flex flex-col gap-[24px]">
                  {/* Email */}
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-['Montserrat'] text-[15px] font-semibold leading-none tracking-[0.15px] text-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="h-[56px] w-full rounded-[16px] border-[0.5px] border-stroke bg-gray-light px-[16px] font-['Inter'] text-[15px] leading-[20px] text-foreground outline-none placeholder:text-gray-text focus:border-primary"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-[13px] text-error">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-['Montserrat'] text-[15px] font-semibold leading-none tracking-[0.15px] text-foreground">
                      Password
                    </label>
                    <div className="relative h-[56px] w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-full w-full rounded-[16px] border-[0.5px] border-stroke bg-gray-light px-[16px] pe-[48px] font-['Inter'] text-[15px] leading-[20px] text-foreground outline-none placeholder:text-gray-text focus:border-primary"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute end-[16px] top-1/2 -translate-y-1/2 text-gray-text hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[13px] text-error">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-[24px]">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center rounded-[16px] bg-primary py-[17px] font-['Montserrat'] text-[18px] font-bold leading-normal text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Hero image panel */}
        <div className="order-2 hidden w-1/2 p-[32px] lg:block lg:order-none">
          <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-card">
            <img
              src="/images/auth/login-hero.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerLoginPage;
