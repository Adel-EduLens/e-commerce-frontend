import { useWishlist } from '../../hooks/useWishlist'
import RetailProductCard from '../../components/retail/RetailProductCard'
import ProductCard from '../../components/shared/ProductCard'
import { Link } from 'react-router-dom'
import type { RetailProduct } from '../../types/retail'

import type { WishlistProductType } from '../../types/wishlist'

type WholesaleColor = {
  color: string
  sizes: { size: string }[]
}

type FavoriteProduct = {
  id: string
  name: string
  price: number
  shopPrice?: number
  rentalPrice?: number
  retailPrice?: number
  wholesalePrice?: number
  blankPrice?: number
  depositAmount?: number | null
  images?: { id: string; url: string; color?: string }[]
  rating?: number
  description?: string
  flashDealPrice?: number | null
  flashDealEndsAt?: string | null
  isFlashDeals?: boolean | null
  brand?: string
  category?: { name?: string }
  wholesaleColors?: WholesaleColor[]
  minOrder?: number
} & Record<string, unknown>

type FavoriteItem = {
  id: string
  productType: WishlistProductType
  product?: FavoriteProduct
}

function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <img
        src="/image 82.png"
        alt="No favorites yet"
        className="mb-2 w-48 h-auto object-contain"
        draggable={false}
      />
      <h3 className="font-['Montserrat'] text-2xl font-semibold text-foreground">
        No favorites yet
      </h3>
      <p className="font-['Montserrat'] text-base text-gray-text">
        Start exploring and save what you love.
      </p>
      <Link
        to="/products"
        className="mt-4 rounded-xl bg-danger px-8 py-3 font-['Montserrat'] text-base font-medium text-white transition-all "
      >
        Start Shopping
      </Link>
    </div>
  )
}


export default function FavoritesPage() {
  const { data, isLoading } = useWishlist()

  const items = (data?.data ?? []) as FavoriteItem[]

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="font-['Montserrat'] text-4xl font-bold text-foreground">Favorites</div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[26rem] w-full max-w-[20rem] rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="font-['Montserrat'] text-4xl font-bold text-foreground">
        Favorites
        {items.length > 0 && (
          <span className="ml-3 font-['Montserrat'] text-2xl font-medium text-gray-text">
            ({items.length})
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from(new Map(items.filter(i => i.product).map(item => [item.product!.id, item])).values()).map((item) => {
            const p = item.product!
            const wholesaleColors = (p.wholesaleColors ?? []) as WholesaleColor[]
            const wholesaleSizes = Array.from(new Set(wholesaleColors.flatMap((wc) => wc.sizes.map((s) => s.size))))

            const isGiftCard = item.productType === 'GIFT_CARD' || (p as any).productType === 'GIFT_CARD' || Boolean(p.giftCardAmounts);

            // Determine routing path based on the type it was favorited as
            let route = `/product-details/${p.id}`;
            if (isGiftCard) route = `/gift-card/${p.id}`;
            else if (item.productType === 'WHOLESALE') route = `/wholesale/${p.id}`;
            else if (item.productType === 'RENTAL' || item.productType === 'RETAIL') route = `/rental/shop/${p.id}`;

            const firstGiftCardAmount = typeof p.giftCardAmounts === 'string' ? p.giftCardAmounts.split(',')[0]?.trim() : undefined;

            const favDisplayPrice =
              isGiftCard
                ? p.price ?? p.shopPrice ?? (firstGiftCardAmount ? Number(firstGiftCardAmount) : 0)
                : item.productType === 'RENTAL'
                  ? p.rentalPrice ?? (p.depositAmount as number | undefined) ?? p.retailPrice ?? p.shopPrice ?? p.price ?? 0
                  : item.productType === 'RETAIL'
                    ? p.retailPrice ?? p.shopPrice ?? p.rentalPrice ?? p.price ?? 0
                    : item.productType === 'WHOLESALE'
                      ? p.wholesalePrice ?? p.shopPrice ?? p.price ?? 0
                      : p.shopPrice ?? p.retailPrice ?? p.rentalPrice ?? p.wholesalePrice ?? p.blankPrice ?? p.price ?? 0;

            const cardProductType = isGiftCard ? 'GIFT_CARD' : item.productType;

            return (
              <ProductCard
                key={item.id}
                productId={p.id}
                productType={cardProductType as any}
                showTypeBadge={true}
                title={p.name}
                subtitle={p.description || undefined}
                shopPrice={p.shopPrice}
                rentalPrice={p.rentalPrice}
                depositAmount={p.depositAmount ?? undefined}
                price={`${favDisplayPrice} EGP`}
                to={route}
                imageSrc={p.images?.[0]?.url || (p as any).image}
                images={p.images}
                rating={p.rating ?? 0}
                flashDealPrice={p.flashDealPrice ?? undefined}
                flashDealEndsAt={p.flashDealEndsAt ?? undefined}
                isFlashDeals={p.isFlashDeals ?? false}
                brand={typeof p.brand === "string" ? p.brand : (p.brand as any)?.name}
                category={p.category?.name}
                colors={Array.from(
                  new Set(
                    ((p.colors as any[])?.map((c) => (typeof c === "string" ? c : c.colorName || c.color || c.name || "")) ?? [])
                      .concat(wholesaleColors.map((wc) => wc.color || (wc as any).colorName))
                      .filter(Boolean),
                  ),
                )}
                wholesaleSizes={wholesaleSizes}
                sizeLabel={isGiftCard ? "Gift Card" : (wholesaleSizes.slice(0, 4).join("-") || "All Sizes")}
                minOrder={p.minOrder}
                wholesaleCard={item.productType === 'WHOLESALE'}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
