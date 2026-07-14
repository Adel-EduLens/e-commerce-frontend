type ProductsSectionProps = {
  title: string;
  navigateTo: string;
  query?: ProductsQuery;
  productType?: "SHOP" | "RETAIL";
};
import { useMemo, useState } from "react";
import { useCategories } from "../../hooks/queries/categoriesQuery";
import { useRetailCategories } from "../../hooks/useRetailCategories";
import { useBrands } from "../../hooks/queries/brandsQuery";
import { useRetailBrands } from "../../hooks/queries/retailBrandQuery";
import type { FilterValues } from "./CatalogFilters";
import { useNavigate } from "react-router-dom";
import {
  useProducts,
  transformProduct,
  type Product,
} from "../../hooks/queries/productsQuery";
import { useRetailProducts } from "../../hooks/useRetailProducts";
import type { ProductsQuery } from "../../hooks/queries/productsQuery";
import ProductCard from "../shared/ProductCard";
import { ViewAllButton } from "../ui/ViewAllButton";
import CatalogFilters from "./CatalogFilters";
import { useTranslation } from "react-i18next";

function normalizeProducts(res: unknown): Record<string, unknown>[] {
  if (!res || typeof res !== 'object') return [];
  const r = res as Record<string, unknown>;
  if (Array.isArray(r)) return r;
  if (Array.isArray(r.products)) return r.products as Record<string, unknown>[];
  if (Array.isArray(r.retailProducts)) return r.retailProducts as Record<string, unknown>[];
  if (Array.isArray(r.items)) return r.items as Record<string, unknown>[];
  if (Array.isArray(r.data)) return r.data as Record<string, unknown>[];
  
  const rData = r.data as Record<string, unknown> | undefined;
  if (rData) {
    if (Array.isArray(rData.products)) return rData.products as Record<string, unknown>[];
    if (Array.isArray(rData.retailProducts)) return rData.retailProducts as Record<string, unknown>[];
    if (Array.isArray(rData.data)) return rData.data as Record<string, unknown>[];
  }
  return [];
}

export default function ProductsSection({
  title,
  navigateTo,
  query,
  productType = "SHOP",
}: ProductsSectionProps) {
  const { t } = useTranslation("productSection");
  const navigate = useNavigate();
  const isRetail = productType === "RETAIL";

  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: "",
    category: null,
    brand: null,
    size: null,
    color: null,
    priceMin: null,
    priceMax: null,
  });

  const { data: standardCategories = [] } = useCategories(false, {
    enabled: !isRetail,
  });
  const { data: retailCategoriesResponse } = useRetailCategories({
    enabled: isRetail,
  });
  let categories: { id: string | number; name: string }[] = standardCategories as { id: string | number; name: string }[];
  if (isRetail) {
    if (Array.isArray(retailCategoriesResponse))
      categories = retailCategoriesResponse;
    else if (
      retailCategoriesResponse?.data &&
      Array.isArray(retailCategoriesResponse.data)
    )
      categories = retailCategoriesResponse.data;
    else categories = [];
  }

  const { data: standardBrands = [] } = useBrands();
  const { data: retailBrandsResponse } = useRetailBrands(); // assumes it's globally enabled
  let brands: { id: string | number; name: string }[] = standardBrands as { id: string | number; name: string }[];
  if (isRetail) {
    if (Array.isArray(retailBrandsResponse)) brands = retailBrandsResponse;
    else if (
      retailBrandsResponse?.data &&
      Array.isArray(retailBrandsResponse.data)
    )
      brands = retailBrandsResponse.data;
    else brands = [];
  }

  const categoryId = useMemo(() => {
    if (!filterValues.category) return "";
    const found = categories.find(
      (c) => c.name.toLowerCase() === filterValues.category!.toLowerCase(),
    );
    return found ? String(found.id) : "0000000";
  }, [categories, filterValues.category]);

  const brandId = useMemo(() => {
    if (!filterValues.brand) return "";
    const found = brands.find(
      (b) => b.name.toLowerCase() === filterValues.brand!.toLowerCase(),
    );
    return found ? String(found.id) : "0000000";
  }, [brands, filterValues.brand]);

  const shopQueryFilters = {
    ...query,
    search: filterValues.search,
    categoryId,
    brandId,
    size: filterValues.size ?? "",
    color: filterValues.color ?? "",
    priceMin: filterValues.priceMin ?? "",
    priceMax: filterValues.priceMax ?? "",
    limit: 4,
  };

  const {
    data: shopData,
    isPending: isShopPending,
    isError: isShopError,
  } = useProducts(shopQueryFilters, { enabled: !isRetail });
  const {
    data: retailDataRaw,
    isPending: isRetailPending,
    isError: isRetailError,
  } = useRetailProducts(shopQueryFilters as unknown as Record<string, string | number | boolean | null | undefined>, { enabled: isRetail });

  const isPending = isRetail ? isRetailPending : isShopPending;
  const isError = isRetail ? isRetailError : isShopError;
  const products: Product[] = isRetail
    ? normalizeProducts(retailDataRaw).map((p) => transformProduct(p))
    : shopData?.products || [];

  const filters = useMemo(() => {
    const availableSizes = Array.from(
      new Set(
        products.flatMap(
          (p) =>
            p.colors?.flatMap(
              (c) => c.variants?.map((v) => v.size) ?? [],
            ) ?? [],
        ),
      ),
    ).filter((x): x is string => Boolean(x));

    const availableColors = Array.from(
      new Set(
        products.flatMap(
          (p) => p.colors?.map((c) => c.colorName || c.color) ?? [],
        ),
      ),
    ).filter((x): x is string => Boolean(x));

    const availableCategories = Array.from(
      new Set(
        products
          .map((p) => p.category?.name || (p.category as unknown as string))
          .filter((x): x is string => Boolean(x)),
      ),
    );

    const availableBrands = Array.from(
      new Set(
        products.map((p) => p.brand?.name || (p.brand as unknown as string)).filter((x): x is string => Boolean(x)),
      ),
    );

    return [
      {
        key: "category",
        label: "Category",
        options:
          availableCategories.length > 0
            ? availableCategories
            : categories.map((c) => c.name),
      },
      {
        key: "brand",
        label: "Brand",
        options:
          availableBrands.length > 0
            ? availableBrands
            : brands.map((b) => b.name),
      },
      { key: "size", label: "Size", options: availableSizes },
      { key: "color", label: "Color", options: availableColors },
    ];
  }, [products, categories, brands]);

  return (
    <section className="mt-16 flex w-full flex-col items-center gap-10">
      <h2 className="text-center font-['Montserrat'] text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground">
        {t(title)}
      </h2>
      <div className="mt-10 inline-flex w-full flex-col items-center justify-start gap-8">
        <CatalogFilters filters={filters} onFilterChange={setFilterValues} />
        {isPending && (
          <div className="flex w-full flex-wrap justify-center gap-6">
            <div className="w-full py-2 text-center text-gray-text">
              {t("Loading")}
            </div>
          </div>
        )}
        {isError && (
          <div className="flex w-full flex-wrap justify-center gap-6">
            <div className="w-full py-2 text-center text-gray-text">
              {t("Something went wrong")}
            </div>
          </div>
        )}
        {!isPending && !isError && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                productId={product.id}
                productType={isRetail ? "RETAIL" : "SHOP"}
                title={product.name}
                subtitle={product.description}
                price={`$${product.price}`}
                imageSrc={
                  product.colors?.[0]?.images?.[0]?.imageUrl ||
                  product.colors?.[0]?.images?.[0]?.url ||
                  (product.images?.[0] as Record<string, unknown>)?.imageUrl as string ||
                  product.images?.[0]?.url
                }
                colors={Array.from(
                  new Set(
                    product.colors
                      ?.map((c) => c.colorName || c.color)
                      .filter((x): x is string => Boolean(x)),
                  ),
                )}
                images={
                  product.images?.length > 0
                      ? product.images.map((img) => ({
                        ...img,
                        url: img.url || (img as Record<string, unknown>).imageUrl as string,
                      }))
                    : product.colors?.flatMap(
                        (c) =>
                          c.images?.map((img) => ({
                            ...img,
                            url: img.url || (img as Record<string, unknown>).imageUrl as string,
                            color: c.colorName || c.color,
                          })) || [],
                      ) || []
                }
                brand={product.brand?.name || (product.brand as unknown as string)}
                category={product.category?.name || (product.category as unknown as string)}
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
                flashDealEndsAt={product.flashDealEndsAt}
                rating={product.rating}
                to={
                  isRetail
                    ? `/retail/${product.id}`
                    : `/product-details/${product.id}`
                }
              />
            ))}
          </div>
        )}
        {!isPending && !isError && products.length > 4 && (
          <ViewAllButton onClick={() => navigate(navigateTo)} />
        )}
      </div>
    </section>
  );
}
