import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Star } from '../ui/star'

const asset = (file: string) => `/home-page/${encodeURIComponent(file)}`

const defaultImage = asset(
  'medium-shot-man-posing-with-blue-background-removebg-preview 1.png'
)

export type ProductCardProps = {
  title?: string
  sizeLabel?: string
  price?: string
  to?: string
  featured?: boolean
  accentClassName?: string
  imageSrc?: string
  imageAlt?: string
  className?: string
  rating?: number
  flashDealPrice?: number
  flashDealEndsAt?: string
  isMustHave?: boolean
  isFlashDeals?: boolean
}

function useCountdown(endsAt?: string) {
  const [label, setLabel] = useState<string | null>(null)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (!endsAt) return

    const target = new Date(endsAt).getTime()

    const tick = () => {
      const diff = target - Date.now()

      if (diff <= 0) {
        setExpired(true)
        setLabel('Deal ended')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)

      if (days > 0) setLabel(`${days}d ${hours}h left`)
      else if (hours > 0) setLabel(`${hours}h ${minutes}m left`)
      else setLabel(`${minutes}m left`)
    }

    tick()
    const interval = setInterval(tick, 60 * 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  return { label, expired }
}

export default function ProductCard({
  title = 'Amber Blaze Classic Tee',
  sizeLabel = 'XS - XXL',
  price = '$250',
  to = '/product-details',
  featured = false,
  accentClassName = 'bg-[#BEA1DF]',
  imageSrc = defaultImage,
  imageAlt,
  className = '',
  rating = 0,
  flashDealPrice,
  flashDealEndsAt,
  isFlashDeals = false,
}: ProductCardProps) {
  const rootTone = featured ? accentClassName : 'bg-white'
  const mediaTone = featured ? accentClassName : 'bg-[#F9FAFB]'

  const showFlashDeal = isFlashDeals && flashDealPrice !== undefined
  const { label: countdownLabel, expired } = useCountdown(
    showFlashDeal ? flashDealEndsAt : undefined,
  )

  return (
    <Link
      to={to}
      aria-label={`Open details for ${title}`}
      className={`group relative block h-96 w-80 overflow-hidden rounded-2xl bg-card shadow-[0px_6px_20px_-2px_var(--shadow)] transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60 ${rootTone} ${className}`}
    >
      <div
        className={`absolute left-[8px] top-[8px] overflow-hidden rounded-lg ${featured ? `h-96 w-80 ${mediaTone}` : `h-64 w-80 ${mediaTone}`}`}
      >
        <img
          className={`absolute left-1/2 top-0 -translate-x-1/2 object-contain ${
            featured ? 'h-[392px] w-[269px]' : 'h-[371px] w-[247px]'
          }`}
          src={imageSrc}
          alt={imageAlt ?? title}
          draggable={false}
        />

        {/* Flash deal countdown badge - top left */}
        {showFlashDeal && countdownLabel && (
          <div
            className={`absolute left-[8px] top-[8px] flex items-center gap-1 rounded-full px-3 py-1 font-['Montserrat'] text-xs font-semibold text-white ${
              expired ? 'bg-gray-text' : 'bg-urgent'
            }`}
          >
            <svg
              className="h-3 w-3 shrink-0"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="7.5" stroke="white" strokeWidth="1.5" />
              <path
                d="M10 6v4l2.5 2"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {countdownLabel}
          </div>
        )}

        <div className="pointer-events-none absolute left-[266px] top-[8px] h-10 w-10 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#EDEDED]">
          <img
            className="absolute left-[8px] top-[8px] h-6 w-6"
            src={asset('mdi_heart.svg')}
            alt=""
            draggable={false}
          />
        </div>
      </div>

      <div
        className={`absolute left-[8px] h-24 w-80 rounded-lg bg-white ${
          featured
            ? 'top-[282px] outline outline-1 outline-offset-[-1px] outline-[#1A1A1A]'
            : 'top-[274px]'
        }`}
      >
        {/* rating row, anchored to the right edge so it never drifts */}
        <div className="absolute right-[10px] top-[8px] flex items-center justify-end ">
          {Array.from({ length: 5 }).map((_, index) => {
            const fill = Math.min(1, Math.max(0, rating - index))
            return <Star key={index} fill={fill} />
          })}
        </div>

        <div className="absolute left-[8px] top-[8px] w-40 font-['Montserrat'] text-xl font-medium leading-6 text-[#1A1A1A]">
          {title}
        </div>
        <div className="absolute left-[8px] top-[66.50px] font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
          {sizeLabel}
        </div>

        {/* price block anchored to the right edge */}
        {showFlashDeal ? (
          <div className="absolute right-[12px] top-[54px] flex flex-col items-end">
            <span className="font-['Montserrat'] text-xs font-medium text-gray-text line-through">
              {price}
            </span>
            <span className="font-['Montserrat'] text-2xl font-semibold text-urgent">
              ${flashDealPrice!.toFixed(2)}
            </span>
          </div>
        ) : (
          <div className="absolute right-[12px] top-[62px] font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
            {price}
          </div>
        )}
      </div>
    </Link>
  )
}