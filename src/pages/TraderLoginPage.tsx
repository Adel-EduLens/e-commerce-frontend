import type { AxiosError } from 'axios'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { FaFacebookSquare } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'sonner'
import type { ApiErrorResponse } from '../types/api'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useForm } from 'react-hook-form'
import { loginSchema, type LoginFormValues } from '../schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../lib/axios'
import { useTranslation } from 'react-i18next'

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative h-[20px] w-[40px] shrink-0 cursor-pointer overflow-hidden rounded-[36.5px] border-[0.5px] border-gray-light transition-colors"
      style={{
        backgroundColor: checked
          ? 'var(--primary, #bbff63)'
          : 'var(--gray-light, #ededed)',
      }}
    >
      <div
        className="absolute top-0 h-[20px] w-[20px] transition-[left] duration-200 rtl:transition-[right]"
        style={{
          left: checked ? 20 : 0,
        }}
      >
        <div className="absolute inset-[10%] rounded-[12px] bg-card shadow-[1px_1px_2px_-1px_rgba(51,51,51,0.3)]" />
      </div>
    </button>
  )
}

const TraderLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const { t, i18n } = useTranslation('auth')
  const isRTL = i18n.language?.startsWith('ar')
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onLogin = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const response = await api.post('/trader/login', data)
      const { token, trader: loggedInUser } = response.data.data
      setAuth(loggedInUser, token)
      toast.success(t('toast.welcomeBack', { name: loggedInUser.name }))
      navigate('/dashboard/trader')
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>
      const errMsg = err.response?.data?.message || t('toast.loginFailed')
      toast.error(errMsg)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="flex min-h-screen w-full items-center justify-center    px-0 py-6 font-['Inter'] sm:px-4 lg:px-6"
    >
      <div className="relative flex w-full max-w-[1440px] flex-col overflow-hidden rounded-none bg-card sm:rounded-[24px] lg:h-[1024px] lg:min-h-[820px] lg:flex-row">
        {/* Form area */}
        <div className="order-1 flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:order-none lg:w-1/2 lg:px-16 lg:py-0">
          <div className="flex w-full max-w-[480px] flex-col">
            <div className="flex justify-between mb-5 items-center">
              <img
                src="/images/auth/logo.png"
                alt="Gen Z"
                className="h-[40px] w-[75px] object-contain sm:h-[48px] sm:w-[90px]"
              />
            </div>
            <form
              onSubmit={handleLoginSubmit(onLogin)}
              className="flex flex-col gap-[32px] sm:gap-[40px]"
            >
              {/* Header */}
              <div className="flex flex-col gap-[14px]">
                <h1 className="font-['Montserrat'] text-[28px] font-semibold leading-normal text-foreground sm:text-[36px]">
                  {t('login.title')}
                </h1>
                <p className="font-['Montserrat'] text-[15px] font-medium leading-normal text-gray-text sm:text-[16px]">
                  {t('login.subtitle')}
                </p>
              </div>

              {/* Fields */}
              <div className="flex flex-col gap-[32px]">
                <div className="flex flex-col gap-[24px]">
                  {/* Email */}
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-['Montserrat'] text-[15px] font-semibold leading-none tracking-[0.15px] text-foreground">
                      {t('fields.email.label')}
                    </label>
                    <input
                      type="email"
                      placeholder={t('fields.email.placeholder')}
                      className="h-[56px] w-full rounded-[16px] border-[0.5px] border-[#e5e5e5] bg-gray-light px-[16px] font-['Inter'] text-[15px] leading-[20px] text-foreground outline-none placeholder:text-gray-text"
                      {...registerLogin('email')}
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
                      {t('fields.password.label')}
                    </label>
                    <div className="flex flex-col gap-[16px]">
                      <div className="relative h-[56px] w-full">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t('fields.password.placeholder')}
                          className="h-full w-full rounded-[16px] border-[0.5px] border-[#e5e5e5] bg-gray-light px-[16px] pe-[48px] font-['Inter'] text-[15px] leading-[20px] text-foreground outline-none placeholder:text-gray-text"
                          {...registerLogin('password')}
                        />
                        <button
                          type="button"
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
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
                      {loginErrors.password && (
                        <p className="text-[13px] text-red-500">
                          {loginErrors.password.message}
                        </p>
                      )}
                      {/* Remember me + Forgot password */}
                      <div className="flex h-auto w-full flex-wrap items-center gap-[16px]">
                        <div className="flex flex-1 items-center gap-[8px]">
                          <Toggle
                            checked={rememberMe}
                            onChange={setRememberMe}
                          />
                          <span className="font-['Montserrat'] text-[13px] font-medium leading-[20px] tracking-[0.3px] text-foreground">
                            {t('rememberMe')}
                          </span>
                        </div>
                        <Link
                          to="#"
                          className="flex-1 text-end font-['Montserrat'] text-[13px] font-medium leading-[20px] tracking-[0.3px] text-[#007aff]"
                        >
                          {t('forgotPassword')}
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
                  {isLoading ? t('login.submitting') : t('login.submit')}
                </button>
                <div className="flex flex-wrap items-end justify-center gap-[8px] font-['Montserrat'] text-[13px] font-medium leading-[20px] tracking-[0.3px]">
                  <span className="text-foreground">
                    {t('login.noAccount')}
                  </span>
                  <Link to="/signup" className="text-[#007aff] text-end">
                    {t('login.signupLink')}
                  </Link>
                </div>
                <div className="my-2 flex w-full flex-col gap-4 sm:my-6 sm:flex-row">
                  <button
                    type="button"
                    className="flex gap-x-4 bg-[#0f1115] rounded-[14px] py-4 flex-1 justify-center"
                  >
                    <FaFacebookSquare size={24} color="#1877F2 " />
                    {t('socials.facebook')}
                  </button>
                  <button
                    type="button"
                    className="flex gap-x-4 bg-[#0f1115] rounded-[14px] py-4 flex-1 justify-center"
                  >
                    <FcGoogle size={24} />
                    {t('socials.google')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Hero image panel — hidden on mobile/tablet, shown from lg breakpoint up */}
        <div className="order-2 hidden w-1/2 p-[32px] lg:block lg:order-none">
          <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-black">
            <img
              src={'/images/auth/signup-hero.png'}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TraderLoginPage
