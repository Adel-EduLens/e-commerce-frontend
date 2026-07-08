import { useEffect, useMemo, useState } from "react";

import { CompareCard } from "../components/compare/CompareCard";
import { CompareEmpty } from "../components/compare/CompareEmpty";
import { CompareHeader } from "../components/compare/CompareHeader";

import {
  clearCompareProducts,
  getCompareProducts,
  removeCompareProduct,
} from "../utils/compareStorage";

import { useCompareProducts } from "../hooks/queries/productsQuery";

export default function ComparePage() {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  useEffect(() => {
    const func = () => {
      setCompareIds(getCompareProducts());
    };
    func();
  }, []);

  const queries = useCompareProducts(compareIds);

  const loading = queries.some((query) => query.isLoading);

  const products = useMemo(() => {
    return queries.map((query) => query.data).filter(Boolean);
  }, [queries]);

  const handleRemove = (id: string) => {
    const updated = removeCompareProduct(id);

    setCompareIds(updated);
  };

  const handleClear = () => {
    clearCompareProducts();

    setCompareIds([]);
  };

  if (!compareIds.length) {
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
          {Array.from({ length: compareIds.length }).map((_, index) => (
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
                key={product.id}
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
