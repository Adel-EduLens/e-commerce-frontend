import { useEffect, useMemo, useState } from "react";

import { CompareCard } from "../../components/compare/CompareCard";
import { CompareEmpty } from "../../components/compare/CompareEmpty";
import { CompareHeader } from "../../components/compare/CompareHeader";

import {
  clearCompareProducts,
  getCompareProducts,
  removeCompareProduct,
  type CompareItem,
  type CompareProductType
} from "../../utils/compareStorage";

import { useCompareProducts, type Product } from "../../hooks/queries/productsQuery";

type CompareProduct = Product & {
  productType: CompareProductType;
};

export default function ComparePage() {
  const [compareItems, setCompareItems] = useState<CompareItem[]>(getCompareProducts);

  useEffect(() => {
    const func = () => {
      setCompareItems(getCompareProducts());
    };
    window.addEventListener("compareUpdated", func);
    return () => window.removeEventListener("compareUpdated", func);
  }, []);

  const allIds = compareItems.map((i) => String(i.id));
  const queries = useCompareProducts(allIds);

  const loading = queries.some((query) => query.isLoading);

  const products = useMemo<CompareProduct[]>(() => {
    const loadedProducts = queries
      .map((query) => query.data as Product | undefined)
      .filter(Boolean) as Product[];

    const combined: CompareProduct[] = [];

    compareItems.forEach((item) => {
      const found = loadedProducts.find((p) => String(p.id) === String(item.id));
      if (found) {
        combined.push({
          ...found,
          productType: item.type,
        } as CompareProduct);
      }
    });

    return combined;
  }, [queries, compareItems]);

  const handleRemove = (id: string) => {
    // We need to know the type to remove it. CompareCard only passes the ID.
    // Let's find the type from our state array.
    const item = compareItems.find((i) => String(i.id) === String(id));
    if (item) {
      const updated = removeCompareProduct(item.id, item.type);
      setCompareItems(updated);
    } else {
      // Fallback
      const updated = removeCompareProduct(id, "SHOP");
      setCompareItems(updated);
    }
  };

  const handleClear = () => {
    clearCompareProducts();
    setCompareItems([]);
  };

  if (!compareItems.length) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <CompareEmpty />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <CompareHeader count={products.length} onClear={handleClear} />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: compareItems.length }).map((_, index) => (
            <div
              key={index}
              className="h-[700px] animate-pulse rounded-3xl bg-gray-light"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            if (!product) return null;
            return (
              <CompareCard
                key={`${(product).productType}-${product.id}`}
                product={product}
                onRemove={handleRemove}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
