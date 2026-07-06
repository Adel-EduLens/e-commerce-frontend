import { useMemo } from "react";
import { ProductCard } from "../shared";

import { useProducts } from "../../hooks/queries/productsQuery";
import { useRecommendationStore } from "../../store/useRecommendationStore";
import { useShallow } from "zustand/react/shallow";
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
  const topCategories = useRecommendationStore(
    useShallow((s) => s.getTopCategories(3))
  );

  // Pick the best category to fetch from: top weighted category (excluding current if possible)
  const targetCategoryId = useMemo(() => {
    const filtered = topCategories.filter((id) => id !== currentCategoryId);
    // Prefer a different category; fall back to top category; fall back to current
    return filtered[0] ?? topCategories[0] ?? currentCategoryId;
  }, [topCategories, currentCategoryId]);

  const hasHistory = topCategories.length > 0;

  const { data, isLoading } = useProducts(
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

  if (isLoading) {
    return (
      <section className="flex flex-col items-center justify-start gap-6 sm:gap-10">
        <h2 className="w-full font-['Montserrat'] text-xl font-bold text-foreground md:text-3xl sm:text-5xl">
          Recommended for You
        </h2>
        <p className="font-['Montserrat'] text-lg text-[#6B7280]">Loading...</p>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="flex flex-col items-center justify-start gap-6 sm:gap-10">
      <h2 className="w-full font-['Montserrat'] text-xl font-bold text-foreground md:text-3xl sm:text-5xl">
        Recommended for You
      </h2>
      <div className="flex w-full flex-col items-center justify-center gap-6 sm:gap-8">
        <div className="grid w-full grid-cols-1 items-start gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.name}
              price={`$${product.price}`}
              imageSrc={product.images[0]?.url}
              sizeLabel={product.sizes.map((s) => s.size).join(" - ")}
              featured={product.rating >= 4}
              rating={product.rating}
              to={`/product-details/${product.id}`}
            />
          ))}
        </div>
        <ViewAllButton onClick={() => navigate(`/products?category=${encodeURIComponent("kids")}`)} />
      </div>
    </section>
  );
}