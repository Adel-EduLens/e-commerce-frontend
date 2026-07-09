import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ProductCard, CatalogFilters } from "../components/shared";
import Pagination from "../components/shared/Pagination";
import { useProducts } from "../hooks/queries/productsQuery";
import { useCategories } from "../hooks/queries/categoriesQuery";
import { useBrands } from "../hooks/queries/brandsQuery";
import type { FilterValues } from "../components/shared/CatalogFilters";
import { useHomeFilters } from "../hooks/utils/HomeFilters";
import { useWholesales } from "../hooks/queries/wholesaleQuery";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("productSection");

  const { filters: filter2 } = useHomeFilters();

  const [searchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") ?? "";
  const urlCategoryName = searchParams.get("category") ?? "";
  const filter = searchParams.get("filter") ?? "";

  const [filters, setFilters] = useState<FilterValues>({
    search: urlSearch,
    category: null,
    brand: null,
    size: null,
    color: null,
    priceMin: null,
    priceMax: null,
  });

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

  const { data: wholesales = [], isLoading: isWholesaleLoading } = useWholesales(
    filters.search ? { search: filters.search } : undefined
  );
  
  const isAnyLoading = isLoading || (!!filters.search && isWholesaleLoading);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: urlSearch,
    }));
  }, [urlSearch]);

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

  if (isError) {
    return (
      <div className="py-20 text-center text-gray-text">
        {t("Something went wrong. Please try again later.")}
      </div>
    );
  }

  const combinedProducts = useMemo(() => {
    const items: React.ReactNode[] = [];
    
    if (data?.products) {
      data.products.forEach((product) => {
        items.push(
          <ProductCard
            key={`retail-${product.id}`}
            title={product.name}
            productId={product.id}
            price={`$${product.price}`}
            imageSrc={product.colors?.[0]?.images?.[0]?.imageUrl || product.colors?.[0]?.images?.[0]?.url || product.images?.[0]?.url}
            sizeLabel={Array.from(new Set(product.colors?.flatMap((c) => c.variants?.map((v) => v.size) ?? []) ?? [])).join(" - ")}
            featured={product.rating >= 4}
            isMustHave={product.isMustHave}
            isFlashDeals={product.isFlashDeals}
            flashDealPrice={product.flashDealPrice}
            rating={product.rating}
            productType="SHOP"
            showTypeBadge={!!filters.search}
            to={`/product-details/${product.id}`}
          />
        );
      });
    }

    if (filters.search && wholesales) {
      wholesales.forEach((wholesale) => {
        items.push(
          <ProductCard
            key={`wholesale-${wholesale.id}`}
            title={wholesale.name}
            productId={wholesale.id}
            price={`$${wholesale.price}`}
            imageSrc={wholesale.images[0]?.url}
            sizeLabel={`Min. Order: ${wholesale.minOrder}`}
            featured={wholesale.rating >= 4}
            rating={wholesale.rating}
            productType="WHOLESALE"
            showTypeBadge={!!filters.search}
            to={`/wholesale/${wholesale.id}`}
          />
        );
      });
    }
    return items;
  }, [data, wholesales, filters.search]);

  return (
    <div className="w-full">
      <div className="font-['Montserrat'] text-5xl font-bold text-[#1A1A1A] sm:text-8xl">
        {t(pageTitle)}
      </div>

      <div className="mt-8">
        <CatalogFilters
          filters={filter2}
          initialValues={filters}
          onFilterChange={setFilters}
        />
      </div>

      {isAnyLoading && (
        <div className="mt-8 w-full py-2 text-center text-gray-text">
          {t("Loading")}
        </div>
      )}

      {!isAnyLoading && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {combinedProducts}
        </div>
      )}

      {!isAnyLoading && combinedProducts.length === 0 && (
        <div className="mt-20 text-center text-xl text-gray-500">
          {t("No products found.")}
        </div>
      )}

      {!isAnyLoading && data && data.pagination.totalPages > 1 && (
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
