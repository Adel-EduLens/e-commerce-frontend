import { useWishlist } from '../hooks/useWishlist'
import RetailProductCard from '../components/retail/RetailProductCard'
import ProductCard from '../components/shared/ProductCard'
import { Link } from 'react-router-dom'
import type { RetailProduct } from '../types/retail'

type WholesaleColor = {
  color: string
  sizes: { size: string }[]
}

type FavoriteProduct = {
  id: string
  name: string
  price: number
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
  productType: 'RETAIL' | 'SHOP' | 'WHOLESALE'
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

            // Determine routing path based on the type it was favorited as
            let route = `/product-details/${p.id}`;
            if (item.productType === 'WHOLESALE') route = `/wholesale/${p.id}`;
            else if (item.productType === 'RETAIL') route = `/retail/${p.id}`;

            return (
              <ProductCard
                key={item.id}
                productId={p.id}
                productType={item.productType as any}
                title={p.name}
                subtitle={p.description || undefined}
                price={`${p.shopPrice ?? p.retailPrice ?? p.wholesalePrice ?? p.blankPrice ?? p.price ?? 0} EGP`}
                to={route}
                imageSrc={p.images?.[0]?.url}
                images={p.images}
                rating={p.rating ?? 0}
                flashDealPrice={p.flashDealPrice ?? undefined}
                flashDealEndsAt={p.flashDealEndsAt ?? undefined}
                isFlashDeals={p.isFlashDeals ?? false}
                brand={p.brand}
                category={p.category?.name}
                colors={wholesaleColors.map((wc) => wc.color)}
                wholesaleSizes={wholesaleSizes}
                sizeLabel={wholesaleSizes.slice(0, 4).join("-") || "All Sizes"}
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
