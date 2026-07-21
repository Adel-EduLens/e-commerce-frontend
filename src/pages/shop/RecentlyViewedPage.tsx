import { Link } from "react-router-dom";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import ProductCard from "../../components/shared/ProductCard";

export default function RecentlyViewedPage() {
  const { data, isLoading } = useRecentlyViewed();
  const products = data?.data || [];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-foreground">
          Recently Viewed
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">Loading...</div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <p className="font-['Montserrat'] text-lg font-semibold text-gray-text">
            No recently viewed products yet
          </p>
          <Link
            to="/products"
            className="rounded-xl bg-primary px-6 py-2.5 font-['Montserrat'] text-sm font-bold text-foreground hover:opacity-90 transition-opacity"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p: any) => {
            const item = p.product;
            if (!item) return null;
            return (
              <ProductCard
                key={p.id}
                productId={item.id}
                to={p.productType === 'RETAIL' ? `/retail/${item.slug || item.id}` : p.productType === 'WHOLESALE' ? `/wholesale/${item.id}` : `/products/${item.id}`}
                title={item.name}
                price={`$${Number(item.shopPrice ?? item.wholesalePrice ?? item.retailPrice ?? item.blankPrice ?? item.price ?? 0).toFixed(2)}`}
                imageSrc={item.colors?.[0]?.images?.[0]?.imageUrl || item.colors?.[0]?.images?.[0]?.url || item.images?.[0]?.url || item.images?.[0]}
                sizeLabel={item.sizes?.[0]?.size || item.sizes?.[0]?.name || Array.from(new Set(item.colors?.flatMap((c: any) => c.variants?.map((v: any) => v.size) ?? []) ?? [])).join(" - ")}
                rating={item.rating || item.averageRating}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
