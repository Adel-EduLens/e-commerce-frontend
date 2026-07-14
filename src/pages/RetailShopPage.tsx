import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  ProductCard,
  SidebarFilters,
  LoadingSpinner,
} from "../components/shared";
import Pagination from "../components/shared/Pagination";
import { useProducts } from "../hooks/queries/productsQuery";
import { useCategories } from "../hooks/queries/categoriesQuery";
import { useBrands } from "../hooks/queries/brandsQuery";
import type { FilterValues } from "../components/shared/CatalogFilters";
import { useHomeFilters } from "../hooks/utils/HomeFilters";

export default function RetailShopPage() {
  const { t } = useTranslation("productSection");
  const { filters: filter2 } = useHomeFilters();
  const [searchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") ?? "";
  const urlCategoryName = searchParams.get("category") ?? "";
  const filter = searchParams.get("filter") ?? "";
  const collectionId = searchParams.get("collectionId") ?? "";

  const [filters, setFilters] = useState<FilterValues>({
    search: urlSearch,
    category: urlCategoryName || null,
    brand: null,
    size: null,
    color: null,
    priceMin: null,
    priceMax: null,
  });

  const effectiveCategoryName = filters.category;
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
    collectionId,
  });

  useEffect(() => {
    const func = () => {
      setFilters((prev) => ({
        ...prev,
        search: urlSearch,
        category: urlCategoryName || null,
      }));
    };
    func();
  }, [urlSearch, urlCategoryName]);

  useEffect(() => {
    const func = () => {
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
    collectionId,
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const availableSizes = useMemo(() => {
    if (!data?.products) return undefined;
    const sizes = new Set<string>();
    data.products.forEach((product) => {
      product.colors?.forEach((color) => {
        color.variants?.forEach((variant) => {
          if (variant.size) sizes.add(variant.size);
        });
      });
    });
    return Array.from(sizes);
  }, [data]);

  const productsList = useMemo(() => {
    if (!data?.products) return [];

    return data.products.map((product) => (
      <ProductCard
        key={`retail-${product.id}`}
        title={product.name}
        productId={product.id}
        colors={
          product.colors
            ?.map((c) => c.colorName || c.color)
            .filter(Boolean) as string[]
        }
        images={product.images}
        price={`$${product.price}`}
        imageSrc={
          product.colors?.[0]?.images?.[0]?.imageUrl ||
          product.colors?.[0]?.images?.[0]?.url ||
          product.images?.[0]?.url
        }
        sizeLabel={Array.from(
          new Set(
            product.colors?.flatMap(
              (c) => c.variants?.map((v) => v.size) ?? [],
            ) ?? [],
          ),
        ).join(" - ")}
        featured={product.rating >= 4}
        isMustHave={product.isMustHave}
        isFlashDeals={product.isFlashDeals}
        flashDealPrice={product.flashDealPrice}
        rating={product.rating}
        productType="SHOP"
        showTypeBadge={!!filters.search}
        to={`/product-details/${product.id}`}
        subtitle={product.description}
      />
    ));
  }, [data, filters.search]);

  if (isError) {
    return (
      <div className="py-20 text-center text-gray-text">
        {t("Something went wrong. Please try again later.")}
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen text-foreground transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <div className="w-full shrink-0 lg:w-64">
            <SidebarFilters
              filters={filter2}
              initialValues={filters}
              onFilterChange={setFilters}
              availableSizes={availableSizes}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            {isLoading && (
              <LoadingSpinner containerClassName="py-12" text={t("Loading")} />
            )}

            {!isLoading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {productsList}
              </div>
            )}

            {!isLoading && productsList.length === 0 && (
              <div className="mt-20 text-center text-xl text-gray-500">
                {t("No products found.")}
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
        </div>
      </div>
    </div>
  );
}
