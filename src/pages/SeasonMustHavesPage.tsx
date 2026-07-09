import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";

import {
  ProductCard,
  CatalogFilters,
} from "../components/shared";
import type { FilterValues } from "../components/shared/CatalogFilters";
import Pagination from "../components/shared/Pagination";

import { useProducts } from "../hooks/queries/productsQuery";
import { buildPriceRanges } from "../utils/priceRanges";

export default function SeasonMustHavesPage() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuthStore();

  const [filterState, setFilterState] = useState<FilterValues>({ search: "", priceMax: "", priceMin: '' });

  const [page, setPage] = useState(1);

  // Fetch all products (no filters) for building filter options from real data
  const { data: allData } = useProducts({ limit: 100 });
  const allProducts = allData?.products ?? [];

  // Map selected name back to ID for the API query
  const categoryId = useMemo(
    () => allProducts.find((p) => p.category.name === filterState.category)?.category.id ?? "",
    [allProducts, filterState.category],
  );
  const brandId = useMemo(
    () => allProducts.find((p) => p.brand?.name === filterState.brand)?.brand?.id ?? "",
    [allProducts, filterState.brand],
  );

  const {
    data,
    isLoading,
    isError,
  } = useProducts({
    search: filterState.search,
    categoryId,
    brandId,
    sortBy: "name",
    sortOrder: "asc",
    page,
    limit: 4,
  });

  const allCategories = useMemo(() => [...new Set(allProducts.map((p) => p.category.name))], [allProducts]);
  const allBrands = useMemo(() => [...new Set(allProducts.map((p) => p.brand?.name).filter(Boolean) as string[])], [allProducts]);
  const allSizes = useMemo(() => [...new Set(allProducts.flatMap((p) => p.colors?.flatMap((c) => c.variants?.map((v) => v.size) ?? []) ?? []))], [allProducts]);
  const allColors = useMemo(() => [...new Set(allProducts.flatMap((p) => p.colors?.map((c) => c.colorName) ?? []))], [allProducts]);
  const priceRanges = useMemo(() => buildPriceRanges(allProducts.map((p) => p.price)), [allProducts]);

  const filterConfigs = useMemo(
    () => [
      { key: "category", label: "Category", options: allCategories },
      { key: "brand", label: "Brand", options: allBrands },
      { key: "size", label: "Size", options: allSizes },
      { key: "color", label: "Color", options: allColors },
      ...(priceRanges.length > 1 ? [{ key: "price", label: "Price", options: priceRanges }] : []),
    ],
    [allCategories, allBrands, allSizes, allColors, priceRanges],
  );

  const handleFilter = useCallback((f: FilterValues) => setFilterState(f), []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    setPage(1);
  }, [filterState]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  if (!isAuthenticated || !user) {
    return null;
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-gray-text">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="font-['Montserrat'] text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground">
        This Season's Must-Haves
      </div>

      <div className="mt-8">
        <CatalogFilters
          filters={filterConfigs}
          onFilterChange={handleFilter}
        />
      </div>

      {isLoading && (
        <div className="mt-8 w-full py-2 text-center text-gray-text">
          Loading...
        </div>
      )}

      {!isLoading && (
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          {data?.products.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              title={product.name}
              price={`$${product.price}`}
              imageSrc={product.colors?.[0]?.images?.[0]?.imageUrl || product.colors?.[0]?.images?.[0]?.url || product.images?.[0]?.url}
              sizeLabel={Array.from(new Set(product.colors?.flatMap((c) => c.variants?.map((v) => v.size) ?? []) ?? [])).join(" - ")}
              featured={product.rating >= 4}
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
