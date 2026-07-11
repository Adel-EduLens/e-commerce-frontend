import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRetailProductBySlug, useRetailProductById } from '../hooks/useRetailProduct'
import useRetailNotifyMe from '../hooks/useRetailNotifyMe'
import { useAuthStore } from '../store/useAuthStore'
import { useAddRetailProductToCart } from '../hooks/useCart'
import { useRateProduct } from '../hooks/useRateProduct'
import ProductRatingStars from '../components/rating/ProductRatingStars'
import { useAddRecentlyViewed } from '../hooks/useRecentlyViewed'

function toNumber(value: any) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export default function RetailProductDetailsPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { slug, id } = useParams()
  const { data: bySlug, isLoading: loadingSlug, error: slugError } = useRetailProductBySlug(slug ?? '')
  const { data: byId, isLoading: loadingId, error: idError } = useRetailProductById(id ?? '')
  const product: any = bySlug ?? byId
  const isLoading = loadingSlug || loadingId
  const error = slugError || idError

  const notify = useRetailNotifyMe(user?.id)
  const addRetailProductToCart = useAddRetailProductToCart()
  const rateProductMutation = useRateProduct()
  const [qty, setQty] = useState(1)
  const [selectedColorId, setSelectedColorId] = useState<string | number | undefined>(undefined)
  const [selectedSizeId, setSelectedSizeId] = useState<string | number | undefined>(undefined)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false)
  const [ratingValue, setRatingValue] = useState(0)

  const { mutate: addRecentlyViewed } = useAddRecentlyViewed()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login')
    }
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    if (product) {
      setRatingValue(Number(product?.userRating ?? product?.myRating ?? product?.rating ?? product?.averageRating ?? 0))
      addRecentlyViewed({ productType: 'RETAIL', productId: product.id })
    }
  }, [product?.id, product?.userRating, product?.myRating, product?.rating, product?.averageRating, addRecentlyViewed])

  const images = Array.isArray(product?.images) ? product.images : []
  const colors = Array.isArray(product?.colors) ? product.colors : []
  const sizes = Array.isArray(product?.sizes) ? product.sizes : []
  const mainImage = images.find((i: any) => i.isMain) ?? images[0]
  const priceNumber = toNumber(product?.price)
  const discountNumber = product?.discountPrice !== null && product?.discountPrice !== undefined ? toNumber(product.discountPrice) : undefined
  const unitPrice = discountNumber && discountNumber < priceNumber ? discountNumber : priceNumber
  const hasColorOptions = colors.length > 0
  const hasSizeOptions = sizes.length > 0

  const handleRate = async (rating: number) => {
    if (!product?.id) {
      toast.error('Unable to save rating: missing product ID.')
      return
    }

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
    if (!product) return

    if (product.stock <= 0) {
      setValidationMessage('This product is out of stock. Please use Notify me.')
      return
    }

    if (hasColorOptions && !selectedColorId) {
      setValidationMessage('Please select a color before adding to cart.')
      return
    }

    if (hasSizeOptions && !selectedSizeId) {
      setValidationMessage('Please select a size before adding to cart.')
      return
    }

    setValidationMessage(null)

    const cartItem = {
      id: `retail-${product.id}-${selectedColorId ?? 'none'}-${selectedSizeId ?? 'none'}`,
      retailProductId: product.id,
      title: product.name,
      unitPrice,
      currency: 'EGP' as const,
      imageSrc: mainImage?.url || 'https://via.placeholder.com/720x720?text=Product',
      quantity: qty,
      size: sizes.find((s: any) => String(s.id) === String(selectedSizeId))?.name,
      color: colors.find((c: any) => String(c.id) === String(selectedColorId))?.name,
      colorHex: colors.find((c: any) => String(c.id) === String(selectedColorId))?.hexCode ?? '#ddd',
      retailColorId: selectedColorId,
      retailSizeId: selectedSizeId,
    }

    addRetailProductToCart.mutate({
      cartItem,
      apiPayload: {
        retailProductId: product.id,
        quantity: qty,
        retailColorId: selectedColorId,
        retailSizeId: selectedSizeId,
      },
    })
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading product...
      </div>
    )
  }

  if (error) {
    return <div className="text-red-600">Failed to load product: {(error as any)?.message ?? 'Unknown error'}</div>
  }

  if (!product) {
    return <div className="text-red-600">Product not found.</div>
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 text-slate-900">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="h-96 w-full overflow-hidden rounded-2xl bg-gray-100">
            <img src={mainImage?.url || 'https://via.placeholder.com/720x720?text=Product'} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="mt-4 flex gap-2">
            {images.map((img: any) => (
              <img key={img.id} src={img.url} className="h-20 w-20 rounded-lg object-cover" alt={img.alt || product.name} />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="mt-2 text-slate-600">{product.description}</p>

          <div className="mt-4">
            <div className="text-lg font-semibold">${unitPrice.toFixed(2)}</div>
            {discountNumber && discountNumber < priceNumber ? (
              <div className="text-sm line-through text-slate-500">${priceNumber.toFixed(2)}</div>
            ) : null}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <ProductRatingStars
              productType="RETAIL"
              productId={product?.id}
              value={ratingValue}
              onRated={handleRate}
              size={16}
              disabled={isRatingSubmitting || !product?.id}
              readonly={!product?.id}
            />
            <span className="text-sm font-medium text-slate-500">
              {product?.averageRating !== undefined ? `${Number(product.averageRating).toFixed(1)} avg` : 'Not rated yet'}
            </span>
          </div>

          <div className="mt-4">
            <div className="font-medium">Colors</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {colors.map((c: any) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedColorId(c.id)}
                  className={`inline-flex h-10 min-w-[48px] items-center justify-center rounded-full border px-3 text-sm font-medium transition ${
                    String(c.id) === String(selectedColorId)
                      ? 'border-primary bg-primary/20 text-foreground'
                      : 'border-stroke bg-card text-foreground'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="font-medium">Sizes</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((s: any) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSizeId(s.id)}
                  className={`inline-flex h-10 min-w-[48px] items-center justify-center rounded-full border px-3 text-sm font-medium transition ${
                    String(s.id) === String(selectedSizeId)
                      ? 'border-primary bg-primary/20 text-foreground'
                      : 'border-stroke bg-card text-foreground'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {validationMessage ? (
            <div className="mt-4 text-sm font-medium text-red-600">{validationMessage}</div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty((current) => Math.max(1, current - 1))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-card text-foreground"
              >
                -
              </button>
              <div className="inline-flex h-10 min-w-[60px] items-center justify-center rounded-2xl border border-stroke bg-card text-foreground">
                {qty}
              </div>
              <button
                type="button"
                onClick={() => setQty((current) => current + 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-card text-foreground"
              >
                +
              </button>
            </div>

            {product.stock > 0 ? (
              <button
                type="button"
                disabled={addRetailProductToCart.isPending}
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addRetailProductToCart.isPending ? 'Adding...' : 'Add to cart'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!product?.id) return
                  notify.mutate({
                    retailProductId: product.id,
                    ...(user?.id ? { userId: user.id } : {}),
                  })
                }}
                className="inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary"
              >
                Notify me
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
