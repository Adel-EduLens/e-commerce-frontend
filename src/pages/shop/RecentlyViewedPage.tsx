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
            const isWholesale = p.productType === 'WHOLESALE';
            const wholesaleColors = item.wholesaleColors || [];
            const wholesaleSizes: string[] = Array.from(
              new Set(wholesaleColors.flatMap((wc: any) => wc.sizes?.map((s: any) => s.size) ?? []))
            );
            const imageSrc =
              (Array.isArray(item.images) && item.images.length > 0
                ? typeof item.images[0] === 'string'
                  ? item.images[0]
                  : item.images[0]?.url || item.images[0]?.imageUrl
                : undefined) ||
              item.colors?.[0]?.images?.[0]?.imageUrl ||
              item.colors?.[0]?.images?.[0]?.url ||
              item.colors?.[0]?.imageUrl ||
              item.imageUrl ||
              item.image;

            const sizeLabel =
              wholesaleSizes.length > 0
                ? wholesaleSizes.slice(0, 4).join('-')
                : item.sizes?.[0]?.size ||
                item.sizes?.[0]?.name ||
                Array.from(new Set(item.colors?.flatMap((c: any) => c.variants?.map((v: any) => v.size) ?? []) ?? [])).join(' - ');

            const targetUrl =
              p.productType === 'RENTAL' || p.productType === 'RETAIL'
                ? `/rental/shop/${item.id}`
                : isWholesale
                  ? `/wholesale/${item.id}`
                  : `/product-details/${item.id}`;

            const displayPrice =
              p.productType === 'RENTAL'
                ? item.depositAmount ?? item.rentalPrice ?? item.retailPrice ?? item.shopPrice ?? item.price ?? 0
                : p.productType === 'RETAIL'
                  ? item.retailPrice ?? item.shopPrice ?? item.rentalPrice ?? item.price ?? 0
                  : isWholesale
                    ? item.wholesalePrice ?? item.shopPrice ?? item.price ?? 0
                    : item.shopPrice ?? item.retailPrice ?? item.rentalPrice ?? item.wholesalePrice ?? item.blankPrice ?? item.price ?? 0;
            const computedImageSrc =
              item.images?.[0]?.url ||
              item.images?.[0]?.imageUrl ||
              item.colors?.[0]?.images?.[0]?.imageUrl ||
              item.colors?.[0]?.images?.[0]?.url ||
              (typeof item.images?.[0] === 'string' ? item.images[0] : undefined);

            return (
              <ProductCard
                key={p.id}
                productId={item.id}
                productType={p.productType}
                to={targetUrl}
                title={item.name}
                shopPrice={item.shopPrice}
                depositAmount={item.depositAmount}
                price={`${displayPrice} EGP`}
                imageSrc={computedImageSrc}
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
