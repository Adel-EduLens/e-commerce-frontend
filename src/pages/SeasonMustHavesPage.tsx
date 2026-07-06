import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";

import {
  ProductCard,
  CatalogFilters,
} from "../components/shared";
import type { DropdownFilterValues } from "../components/shared/CatalogFilters";
import Pagination from "../components/shared/Pagination";

import { useProducts } from "../hooks/queries/productsQuery";
import { useCategories } from "../hooks/queries/categoriesQuery";
import { useBrands } from "../hooks/queries/brandsQuery";

export default function SeasonMustHavesPage() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuthStore();

  const [filters, setFilters] = useState<DropdownFilterValues>({
    category: null,
    size: null,
    color: null,
    price: null,
    brand: null,
    search: "",
  });

  const [page, setPage] = useState(1);

  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  // Map selected name back to ID for the API
  const categoryId = useMemo(
    () => categories.find((c) => c.name === filters.category)?.id ?? "",
    [categories, filters.category],
  );
  const brandId = useMemo(
    () => brands.find((b) => b.name === filters.brand)?.id ?? "",
    [brands, filters.brand],
  );

  const {
    data,
    isLoading,
    isError,
  } = useProducts({
    search: filters.search,
    categoryId,
    brandId,
    sortBy: "name",
    sortOrder: "asc",
    page,
    limit: 4,
  });

  const allSizes = useMemo(
    () => [...new Set(data?.products.flatMap((p) => p.sizes.map((s) => s.size)) ?? [])],
    [data],
  );
  const allColors = useMemo(
    () => [...new Set(data?.products.flatMap((p) => p.colors.map((c) => c.color)) ?? [])],
    [data],
  );

  const dropdownFilters = useMemo(
    () => ({
      category: categories.map((c) => c.name),
      brand: brands.map((b) => b.name),
      size: allSizes,
      color: allColors,
      price: ['Under $50', '$50-100', '$100-250', '$250+'],
    }),
    [categories, brands, allSizes, allColors],
  );

  const handleFilter = useCallback((f: DropdownFilterValues) => setFilters(f), []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

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
      <div className="font-['Montserrat'] text-8xl font-bold text-foreground">
        This Season's Must-Haves
      </div>

      <div className="mt-8">
        <CatalogFilters
          dropdownFilters={dropdownFilters}
          onDropdownFilterChange={handleFilter}
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
              title={product.name}
              price={`$${product.price}`}
              imageSrc={product.images[0]?.url}
              sizeLabel={product.sizes
                .map((size) => size.size)
                .join(" - ")}
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
