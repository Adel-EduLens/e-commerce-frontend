import { useMemo } from "react";
import { ProductCard } from "../shared";

import { useProducts } from "../../hooks/queries/productsQuery";
import { useTopCategories } from "../../hooks/queries/recommendQuery";
import { useAuthStore } from "../../store/useAuthStore";
import { ViewAllButton } from "../ui/ViewAllButton";
import { useNavigate } from "react-router-dom";

type RecommedProductsProps = {
  currentProductId?: string;
  currentCategoryId?: string;
};

export function RecommedProducts({
  currentProductId,
  currentCategoryId,
}: RecommedProductsProps) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: topCategories = [], isLoading: isTopCategoriesLoading } = useTopCategories(3);

  // Pick the best category to fetch from: top weighted category (excluding current if possible)
  const targetCategoryId = useMemo(() => {
    const filtered = topCategories.filter((id) => id !== currentCategoryId);
    // Prefer a different category; fall back to top category; fall back to current
    return filtered[0] ?? topCategories[0] ?? currentCategoryId;
  }, [topCategories, currentCategoryId]);

  const hasHistory = topCategories.length > 0;

  const { data, isLoading: isProductsLoading } = useProducts(
    hasHistory && targetCategoryId
      ? { categoryId: targetCategoryId, limit: 8 }
      : { sortBy: "rating", sortOrder: "desc", limit: 8 },
  );

  const products = useMemo(() => {
    const all = data?.products ?? [];
    return all
      .filter((p) => p.id !== currentProductId)
      .slice(0, 4);
  }, [data, currentProductId]);

  const isLoading = isProductsLoading || (isAuthenticated && isTopCategoriesLoading);

  if (isLoading) {
    return (
      <section className="flex flex-col items-center justify-start gap-6 sm:gap-10">
        <h2 className="w-full font-['Montserrat'] text-xl font-bold text-foreground md:text-3xl sm:text-5xl">
          Recommended for You
        </h2>
        <p className="font-['Montserrat'] text-lg text-gray-text">Loading...</p>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="flex flex-col items-start justify-start gap-6 sm:gap-8 w-full font-['Montserrat'] select-none mt-10">
      <div className="w-full">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl sm:text-4xl">
          Recommended for You
        </h2>
        <div className="mt-4 flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground/80">Filter by</span>
          <div className="flex flex-wrap items-center gap-3">
            {["Category", "Size", "Color", "Price"].map((filterName) => (
              <div
                key={filterName}
                className="flex items-center justify-between gap-2 rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground/80 cursor-pointer hover:bg-gray-light transition"
              >
                {filterName}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-8 mt-2">
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const firstColor = product.colors?.[0];
            const imageSrc = firstColor?.images?.[0]?.url || firstColor?.images?.[0]?.imageUrl || product.images?.[0]?.url || "";
            const sizesList = firstColor?.variants || [];
            const sizeLabel = sizesList.map((s: any) => s.size).filter(Boolean).join("-") || "Default";
            const isFavorite = false; // Add actual logic if needed

            return (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-stroke bg-card shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-light cursor-pointer" onClick={() => navigate(`/product-details/${product.id}`)}>
                  <img
                    src={imageSrc}
                    alt={product.name}
                    className="h-full w-full object-cover mix-blend-multiply"
                  />
                  {/* Heart Icon */}
                  <button
                    type="button"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:scale-105 transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* Content Section */}
                <div className="flex flex-col p-4 flex-1">
                  <h3 className="text-base font-semibold text-foreground line-clamp-1 cursor-pointer hover:text-primary transition" onClick={() => navigate(`/product-details/${product.id}`)}>
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-text line-clamp-2">
                    {product.description || "High-end product tailored for you"}
                  </p>

                  <div className="mt-3 flex items-end justify-between">
                    <span className="rounded border border-stroke px-2 py-0.5 text-[10px] font-medium text-foreground/80">
                      {sizeLabel}
                    </span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-lg font-bold text-primary">{product.price}</span>
                      <span className="text-xs font-semibold text-primary">EGP</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/product-details/${product.id}`)}
                    className="mt-4 w-full rounded-md bg-primary py-2 text-sm font-bold text-white hover:bg-primary-pressed transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => navigate(`/products?category=${encodeURIComponent("kids")}`)}
          className="mt-2 rounded-md border border-primary px-8 py-2 text-sm font-bold text-primary hover:bg-primary-tint transition"
        >
          View More
        </button>
      </div>
    </section>
  );
}