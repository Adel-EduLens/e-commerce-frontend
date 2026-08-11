import { useMemo } from "react";
import { useProducts, useProductFilters } from "./queries/productsQuery";

export function useHomeFilters() {
  const { data: filtersData, isLoading: isLoadingFilters } = useProductFilters();
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ limit: 100 });

  const products = productsData?.products ?? [];
  const allCategories = filtersData?.categories ?? [];
  const allBrands = filtersData?.brands ?? [];
  const allSizes = filtersData?.sizes ?? [];
  const allColors = filtersData?.colors ?? [];

  const filters = useMemo(
    () => [
      { key: "category", label: "Category", options: allCategories },
      { key: "brand", label: "Brand", options: allBrands },
      { key: "size", label: "Size", options: allSizes },
      { key: "color", label: "Color", options: allColors },
    ],
    [allCategories, allBrands, allSizes, allColors]
  );

  return { filters, products, isLoading: isLoadingProducts || isLoadingFilters };
}

export default useHomeFilters;
