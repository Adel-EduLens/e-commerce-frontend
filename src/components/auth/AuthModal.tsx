import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Eye, EyeOff, Lock, Loader2, LogIn } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '../../schemas/auth';
import { api } from '../../lib/axios';
import { useAuthStore } from '../../store/useAuthStore';
import { handleApiError } from '../../lib/utils';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  title,
  subtitle,
}: AuthModalProps) {
  const { t } = useTranslation('vote');
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  if (!isOpen) return null;

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const { token, user } = response.data.data;
      setAuth(user, token);
      toast.success(user.name ? `Welcome back, ${user.name}!` : 'Logged in successfully!');
      reset();
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      handleApiError(error, t('errorMessage', 'Failed to log in'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-stroke bg-card p-6 sm:p-8 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-text hover:bg-stroke/40 hover:text-foreground transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="font-['Montserrat'] text-xl font-bold text-foreground sm:text-2xl">
            {title || t('loginToVoteTitle', 'Sign In to Vote')}
          </h2>
          <p className="mt-1 font-['Montserrat'] text-xs text-gray-text sm:text-sm max-w-xs">
            {subtitle || t('loginToVoteSubtitle', 'You need to be signed in to cast your vote for upcoming designs.')}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Email */}
          <div className="space-y-1 text-start">
            <label className="font-['Montserrat'] text-xs font-semibold text-foreground">
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-stroke bg-background px-3.5 py-2.5 font-['Montserrat'] text-xs font-medium text-foreground outline-none transition focus:border-primary placeholder:text-gray-text"
            />
            {errors.email && (
              <p className="font-['Montserrat'] text-[11px] font-medium text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1 text-start">
            <label className="font-['Montserrat'] text-xs font-semibold text-foreground">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className="w-full rounded-xl border border-stroke bg-background py-2.5 pl-3.5 pr-10 font-['Montserrat'] text-xs font-medium text-foreground outline-none transition focus:border-primary placeholder:text-gray-text"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text hover:text-foreground transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="font-['Montserrat'] text-[11px] font-medium text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-['Montserrat'] text-xs font-bold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>{t('loginButton', 'Sign In')}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-5 text-center font-['Montserrat'] text-xs text-gray-text">
          <span>{t('dontHaveAccount', "Don't have an account?")} </span>
          <Link
            to="/signup"
            onClick={onClose}
            className="font-bold text-primary hover:underline transition"
          >
            {t('createAccount', 'Create an account')}
          </Link>
        </div>
      </div>
    </div>
  );
}
