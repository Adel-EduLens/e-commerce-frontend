import { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useToggleWishlist, useWishlistStatus } from '../../hooks/useWishlist'
import { useAuthStore } from '../../store/useAuthStore'
import type { WishlistProductType } from '../../types/wishlist'

type WishlistHeartButtonProps = {
  productType: WishlistProductType
  productId: number | string
  initialWishlisted?: boolean
  className?: string
}

export default function WishlistHeartButton({
  productType,
  productId,
  initialWishlisted = false,
  className = '',
}: WishlistHeartButtonProps) {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [hovered, setHovered] = useState(false)
  const [localWishlisted, setLocalWishlisted] = useState(Boolean(initialWishlisted))
  const { data: statusData } = useWishlistStatus(productType, productId)
  const toggleWishlist = useToggleWishlist()

  useEffect(() => {
    setLocalWishlisted(Boolean(initialWishlisted))
  }, [initialWishlisted, productType, productId])

  const isActive = useMemo(() => {
    return hovered || localWishlisted || Boolean(statusData?.isWishlisted)
  }, [hovered, localWishlisted, statusData?.isWishlisted])

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isAuthenticated) {
      navigate('/login')
      toast.error('Please login first')
      return
    }

    setLocalWishlisted((current) => !current)
    toggleWishlist.mutate({ productType, productId })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={toggleWishlist.isPending}
      aria-label={isActive ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 shadow-sm transition-all hover:scale-105 ${className} ${toggleWishlist.isPending ? 'opacity-70' : ''}`}
    >
      <Heart
        size={18}
        strokeWidth={1.8}
        className={`transition-colors ${isActive ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
        fill={isActive ? 'currentColor' : 'none'}
      />
    </button>
  )
}
