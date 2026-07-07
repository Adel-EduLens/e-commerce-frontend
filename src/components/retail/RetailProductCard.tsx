import { useEffect, useState } from 'react'
import type { RetailProduct } from '../../types/retail'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '../../store/useAuthStore'
import { useRateProduct } from '../../hooks/useRateProduct'
import { useAddRetailProductToCart } from '../../hooks/useCart'
import WishlistHeartButton from '../wishlist/WishlistHeartButton'
import ProductRatingStars from '../rating/ProductRatingStars'

function toNumber(value: any) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export default function RetailProductCard({ product }: { product: RetailProduct }) {
  const navigate = useNavigate()
  const addRetailProductToCart = useAddRetailProductToCart()
  const productData = product as any
  const images = Array.isArray(productData.images) ? productData.images : []
  const colors = Array.isArray(productData.colors) ? productData.colors : []
  const sizes = Array.isArray(productData.sizes) ? productData.sizes : []

  const mainImage = images.find((image: any) => image?.isMain) ?? images[0]
  const imageUrl = mainImage?.url || 'https://via.placeholder.com/360x420?text=Product'

  const priceNumber = toNumber(productData.price)
  const discountNumber = productData.discountPrice !== null && productData.discountPrice !== undefined ? toNumber(productData.discountPrice) : undefined
  const unitPrice = discountNumber && discountNumber < priceNumber ? discountNumber : priceNumber
  const hasOptions = colors.length > 0 || sizes.length > 0
  const { isAuthenticated } = useAuthStore()
  const rateProductMutation = useRateProduct()
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false)

  const initialRating = Number(
    productData.userRating ??
      productData.myRating ??
      productData.rating ??
      productData.averageRating ??
      0
  )
  const [ratingValue, setRatingValue] = useState<number>(initialRating)

  useEffect(() => {
    setRatingValue(initialRating)
  }, [initialRating])

  const handleRate = async (rating: number) => {
    if (!isAuthenticated) {
      toast.error('Please login first')
      navigate('/login')
      return
    }

    const previousRating = ratingValue
    setRatingValue(rating)
    setIsRatingSubmitting(true)

    try {
      const response = await rateProductMutation.mutateAsync({
        productType: 'RETAIL',
        productId: product.id,
        rating,
      })

      if (response?.userRating !== undefined) {
        setRatingValue(response.userRating)
      } else if (response?.rating !== undefined) {
        setRatingValue(response.rating)
      }

      toast.success('Rating saved.')
    } catch {
      setRatingValue(previousRating)
    } finally {
      setIsRatingSubmitting(false)
    }
  }

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      navigate(`/retail/${product.slug}`)
      return
    }

    if (hasOptions) {
      navigate(`/retail/${product.slug}`)
      return
    }

    const cartItem = {
      id: `retail-${product.id}-${unitPrice}`,
      retailProductId: product.id,
      title: product.name,
      unitPrice,
      currency: 'EGP' as const,
      imageSrc: imageUrl,
      quantity: 1,
      size: sizes[0]?.name,
      color: colors[0]?.name,
      colorHex: colors[0]?.hexCode ?? '#ddd',
      retailColorId: colors[0]?.id,
      retailSizeId: sizes[0]?.id,
    }

    addRetailProductToCart.mutate({
      apiPayload: {
        retailProductId: product.id,
        quantity: 1,
        retailColorId: colors[0]?.id,
        retailSizeId: sizes[0]?.id,
      },
      cartItem,
    })
  }

  return (
    <div className="group relative h-[26rem] w-full max-w-[20rem] overflow-hidden rounded-2xl bg-[#BBFF63] shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BBFF63]/60">
      <div className="absolute inset-2 z-10 overflow-hidden rounded-[1.25rem] bg-[#BBFF63]">
        <div className="relative h-[18rem] w-full overflow-hidden rounded-[1.25rem] bg-[#BBFF63]">
          <img
            src={imageUrl}
            alt={product.name}
            className="absolute bottom-0 left-1/2 h-full w-auto max-h-full max-w-full -translate-x-1/2 object-contain"
          />
          <WishlistHeartButton
            productType="RETAIL"
            productId={product.id}
            initialWishlisted={Boolean(productData.isWishlisted)}
          />
        </div>

        <div className="mt-4 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="font-['Montserrat'] text-base font-medium leading-5 text-[#1A1A1A] truncate">
                  {product.name}
                </div>
                <div className="shrink-0 text-right text-lg font-semibold text-[#1A1A1A]">
                  ${unitPrice.toFixed(2)}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <ProductRatingStars
                  productType="RETAIL"
                  productId={product.id}
                  value={ratingValue}
                  onRated={handleRate}
                  size={14}
                  disabled={isRatingSubmitting}
                />
                {productData.averageRating !== undefined ? (
                  <span className="text-xs font-medium text-slate-500">
                    {Number(productData.averageRating).toFixed(1)} avg
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/retail/${product.slug}`)}
        className="absolute inset-0 z-0"
        aria-label={`Open details for ${product.name}`}
      >
        <span className="sr-only">Open details for {product.name}</span>
      </button>
    </div>
  )
}
