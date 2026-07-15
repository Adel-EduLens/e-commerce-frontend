import { useEffect, useMemo, useState } from "react";

import { CompareCard } from "../components/compare/CompareCard";
import { CompareEmpty } from "../components/compare/CompareEmpty";
import { CompareHeader } from "../components/compare/CompareHeader";

import {
  clearCompareProducts,
  getCompareProducts,
  removeCompareProduct,
  type CompareItem,
  type CompareProductType
} from "../utils/compareStorage";

import { useCompareProducts, useCompareRetailProducts, type Product } from "../hooks/queries/productsQuery";
import type { RetailProduct } from "../types/retail";

type CompareProduct = Product & {
  productType: CompareProductType;
};
function mapRetailToCompareProduct(retail: RetailProduct & { isMapped?: boolean }): Product {
  if (retail.isMapped) return retail as unknown as Product;
  return {
    ...retail,
    isMapped: true,
    rating: retail.rating ?? retail.averageRating ?? 0,
    category: { name: retail.category?.name ?? "Retail" },
    brand: retail.brand ? { name: retail.brand.name } : undefined,
    colors: retail.colors?.map((c) => ({
      color: c.color,
      colorName: c.color,
      images: retail.images?.filter((img) => img.color === c.color).map((img) => ({ url: img.url, imageUrl: img.url })),
      variants: retail.sizes?.filter((s) => s.color === c.color).map((s) => ({ size: s.size })),
    })) ?? [],
    images: retail.images?.map((img) => ({ url: img.url, imageUrl: img.url })) ?? [],
    // Add productType property so handleRemove can remove the correct item
  } as unknown as Product;
}

export default function ComparePage() {
  const [compareItems, setCompareItems] = useState<CompareItem[]>(getCompareProducts);

  useEffect(() => {
    const func = () => {
      setCompareItems(getCompareProducts());
    };
    window.addEventListener("compareUpdated", func);
    return () => window.removeEventListener("compareUpdated", func);
  }, []);

  const shopIds = compareItems.filter((i) => i.type === "SHOP").map((i) => String(i.id));
  const retailIds = compareItems.filter((i) => i.type === "RETAIL").map((i) => String(i.id));

  const shopQueries = useCompareProducts(shopIds);
  const retailQueries = useCompareRetailProducts(retailIds);

  const loading =
    shopQueries.some((query) => query.isLoading) ||
    retailQueries.some((query) => query.isLoading);
const products = useMemo<CompareProduct[]>(() => {
  const shopProducts = shopQueries
    .map((query) => {
      const p = query.data as CompareProduct | undefined;
      if (p) p.productType = "SHOP";
      return p;
    })
    .filter(Boolean) as CompareProduct[];

  const retailProducts = retailQueries
    .map((query) => {
      const data = query.data as RetailProduct | undefined;
      return data ? (mapRetailToCompareProduct(data) as CompareProduct) : null;
    })
    .filter(Boolean) as CompareProduct[];

  const combined: CompareProduct[] = [];

  compareItems.forEach((item) => {
    if (item.type === "SHOP") {
      const found = shopProducts.find((p) => String(p.id) === String(item.id));
      if (found) combined.push(found);
    } else {
      const found = retailProducts.find((p) => String(p.id) === String(item.id));
      if (found) combined.push(found);
    }
  });

  return combined;
}, [shopQueries, retailQueries, compareItems]);

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
