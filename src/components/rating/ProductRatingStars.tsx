import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { Star } from 'lucide-react'
import type { RatingProductType } from '../../services/ratingApi'

export type ProductRatingStarsProps = {
  productType: RatingProductType
  productId?: number | string | null
  value?: number
  readonly?: boolean
  size?: number
  disabled?: boolean
  onRated?: (rating: number) => void
}

export default function ProductRatingStars({
  productType,
  productId,
  value = 0,
  readonly = false,
  size = 18,
  disabled = false,
  onRated,
}: ProductRatingStarsProps) {
  const [internalValue, setInternalValue] = useState(value)
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  const activeValue = useMemo(() => hoverValue ?? internalValue, [hoverValue, internalValue])
  const hasProductId = productId !== undefined && productId !== null
  const isInteractive = !readonly && !disabled && hasProductId

  const handleSelect = (event: MouseEvent<HTMLButtonElement>, rating: number) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isInteractive) return

    setInternalValue(rating)
    onRated?.(rating)
  }

  return (
    <div className={`flex items-center gap-1 ${disabled ? 'opacity-70' : ''}`} role="radiogroup" aria-label="Product rating">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1
        const isActive = starValue <= activeValue

        return (
          <button
            key={starValue}
            type="button"
            className={`p-0.5 transition-colors ${isInteractive ? 'cursor-pointer' : 'cursor-default'} ${!isActive ? 'hover:text-yellow-400' : ''}`}
            onMouseEnter={() => isInteractive && setHoverValue(starValue)}
            onMouseLeave={() => isInteractive && setHoverValue(null)}
            onClick={(event) => handleSelect(event, starValue)}
            aria-label={`Rate ${starValue} out of 5`}
            aria-pressed={isActive}
            disabled={!isInteractive}
          >
            <Star
              size={size}
              strokeWidth={1.6}
              className={isActive ? 'text-yellow-400' : 'text-slate-300'}
              fill={isActive ? 'currentColor' : 'none'}
            />
          </button>
        )
      })}
    </div>
  )
}
