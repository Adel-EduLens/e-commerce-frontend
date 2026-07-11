import { useWishlist } from '../hooks/useWishlist'
import RetailProductCard from '../components/retail/RetailProductCard'
import ProductCard from '../components/shared/ProductCard'
import { Link } from 'react-router-dom'

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

  const items: any[] = data?.data ?? []

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
          {items.map((item) => {
            if (!item.product) return null

            if (item.productType === 'RETAIL') {
              return (
                <RetailProductCard
                  key={item.id}
                  product={{ ...item.product, isWishlisted: true }}
                />
              )
            }

            if (item.productType === 'SHOP') {
              const p = item.product
              return (
                <ProductCard
                  key={item.id}
                  productId={p.id}
                  productType="SHOP"
                  title={p.name}
                  price={`${p.price} EGP`}
                  to={`/product-details/${p.id}`}
                  imageSrc={p.images?.[0]?.url}
                  rating={p.rating ?? 0}
                  flashDealPrice={p.flashDealPrice ?? undefined}
                  flashDealEndsAt={p.flashDealEndsAt ?? undefined}
                  isFlashDeals={p.isFlashDeals ?? false}
                />
              )
            }

            if (item.productType === 'WHOLESALE') {
              const p = item.product
              return (
                <ProductCard
                  key={item.id}
                  productId={p.id}
                  productType="WHOLESALE"
                  title={p.name}
                  price={`${p.price} EGP`}
                  to={`/wholesale/${p.id}`}
                  imageSrc={p.images?.[0]?.url}
                  rating={p.rating ?? 0}
                />
              )
            }

            return null
          })}
        </div>
      )}
    </div>
  )
}
