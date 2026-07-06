import { useMemo } from "react";
import { useProducts } from "../queries/productsQuery";

export  function useHomeFilters() {
  const { data } = useProducts({ limit: 100 });

  const products = data?.products ?? [];
  const allCategories = useMemo(
    () => [...new Set(products.map((p) => p.category.name))],
    [products],
  );
  const allBrands = useMemo(
    () => [
      ...new Set(
        products.map((p) => p.brand?.name).filter(Boolean) as string[],
      ),
    ],
    [products],
  );
  const allSizes = useMemo(
    () => [...new Set(products.flatMap((p) => p.sizes.map((s) => s.size)))],
    [products],
  );
  const allColors = useMemo(
    () => [...new Set(products.flatMap((p) => p.colors.map((c) => c.color)))],
    [products],
  );

  return useMemo(
    () => [
      { key: "category", label: "Category", options: allCategories },
      { key: "brand", label: "Brand", options: allBrands },
      { key: "size", label: "Size", options: allSizes },
      { key: "color", label: "Color", options: allColors },
    ],
    [allCategories, allBrands, allSizes, allColors],
  );
}