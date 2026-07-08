import { Link } from "react-router-dom";
import { useRecentStore } from "../store/useRecentStore";
import ProductCard from "../components/shared/ProductCard";

export default function RecentlyViewedPage() {
  const products = useRecentStore((s) => s.products);
  const clearRecent = useRecentStore((s) => s.clearRecent);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-foreground">
          Recently Viewed
        </h1>
        {products.length > 0 && (
          <button
            type="button"
            onClick={clearRecent}
            className="font-['Montserrat'] text-sm text-gray-text hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {products.length === 0 ? (
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
          {products.map((p) => (
            <ProductCard
              key={p.id}
              productId={p.id}
              to={`/products/${p.id}`}
              title={p.name}
              price={`$${p.price.toFixed(2)}`}
              imageSrc={p.images?.[0]?.url}
              sizeLabel={p.sizes?.[0]?.size}
              rating={p.rating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
