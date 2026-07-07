import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";

import { ProductCard, CatalogFilters } from "../components/shared";
import Pagination from "../components/shared/Pagination";
import { useProducts } from "../hooks/queries/productsQuery";
import { useCategories } from "../hooks/queries/categoriesQuery";
import { useBrands } from "../hooks/queries/brandsQuery";
import type { FilterValues } from "../components/shared/CatalogFilters";
import { useHomeFilters } from "../hooks/utils/HomeFilters";

const FILTER_LABELS: Record<string, string> = {
  "best-deal": "Best Deals",
  "most-popular": "Most Popular",
  premium: "Premium Collection",
  new: "New Arrivals",
  "must-have": "This Season's Must-Haves",
  "flash-deals": "Flash Deals",
};
const CATEGORY_LABELS: Record<string, string> = {
  kids: "Kids",
  men: "Men",
  women: "Women",
};



export default function ProductsPage() {
  const navigate = useNavigate();
  const { filters: filter2 } = useHomeFilters();

  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    category: null,
    brand: null,
    size: null,
    color: null,
    priceMin: null,
    priceMax: null,
  });

  const [searchParams] = useSearchParams();

  const { user, isAuthenticated } = useAuthStore();

  const urlCategoryName = searchParams.get("category") ?? "";
  const filter = searchParams.get("filter") ?? "";

  const effectiveCategoryName = filters.category ?? urlCategoryName;

  const [page, setPage] = useState(1);

  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  const categoryId = useMemo(() => {
    if (!effectiveCategoryName) return "";
    const matchedId = categories.find(
      (c) => c.name.toLowerCase() === effectiveCategoryName.toLowerCase(),
    )?.id;

    return matchedId ?? "0000000";
  }, [categories, effectiveCategoryName]);

  const brandId = useMemo(() => {
    if (!filters.brand) return "";
    const matchedId = brands.find(
      (b) => b.name.toLowerCase() === filters.brand!.toLowerCase(),
    )?.id;
    return matchedId ?? "0000000";
  }, [brands, filters.brand]);

  const { data, isLoading, isError } = useProducts({
    search: filters.search,
    categoryId,
    brandId,
    size: filters.size ?? "",
    color: filters.color ?? "",
    priceMin: filters.priceMin ?? "",
    priceMax: filters.priceMax ?? "",
    filter,
    page,
    limit: 16,
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const func = async () => {
      setPage(1);
    };
    func();
  }, [
    filters.search,
    categoryId,
    brandId,
    filters.size,
    filters.color,
    filters.priceMin,
    filters.priceMax,
    filter,
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const pageTitle = useMemo(() => {
    if (filter) return FILTER_LABELS[filter] ?? "Products";

    if (effectiveCategoryName) {
      return (
        CATEGORY_LABELS[effectiveCategoryName.toLowerCase()] ?? "All Products"
      );
    }

    return "All Products";
  }, [filter, effectiveCategoryName]);

  if (!isAuthenticated || !user) return null;

  if (isError) {
    return (
      <div className="py-20 text-center text-gray-text">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="font-['Montserrat'] text-5xl font-bold text-foreground sm:text-8xl">
        {pageTitle}
      </div>

      <div className="mt-8">
        <CatalogFilters filters={filter2} onFilterChange={setFilters} />
      </div>

      {isLoading && (
        <div className="mt-8 w-full py-2 text-center text-gray-text">
          Loading...
        </div>
      )}

      {!isLoading && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.name}
              price={`$${product.price}`}
              imageSrc={product.images[0]?.url}
              sizeLabel={product.sizes.map((size) => size.size).join(" - ")}
              featured={product.rating >= 4}
              isMustHave={product.isMustHave}
              isFlashDeals={product.isFlashDeals}
              flashDealPrice={product.flashDealPrice}
              flashDealEndsAt={product.flashDealEndsAt}
              rating={product.rating}
              to={`/product-details/${product.id}`}
            />
          ))}
        </div>
      )}

      {!isLoading && data?.products.length === 0 && (
        <div className="mt-20 text-center text-xl text-gray-500">
          No products found.
        </div>
      )}

      {!isLoading && data && data.pagination.totalPages > 1 && (
        <Pagination
          className="mt-12 mb-8"
          currentPage={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}