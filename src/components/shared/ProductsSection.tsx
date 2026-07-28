type ProductsSectionProps = {
  title: string;
  navigateTo: string;
  query?: ProductsQuery;
  productType?: "SHOP" | "RENTAL" | "RETAIL" | "WHOLESALE";
};
import { useMemo, useState } from "react";
import { useCategories } from "../../hooks/queries/categoriesQuery";
import { useBrands } from "../../hooks/queries/brandsQuery";
import type { FilterValues } from "./CatalogFilters";
import { useNavigate } from "react-router-dom";
import { useProducts, type Product } from "../../hooks/queries/productsQuery";
import type { ProductsQuery } from "../../hooks/queries/productsQuery";
import ProductCard from "../shared/ProductCard";
import { ViewAllButton } from "../ui/ViewAllButton";
import CatalogFilters from "./CatalogFilters";
import { useTranslation } from "react-i18next";

export default function ProductsSection({
  title,
  navigateTo,
  query,
  productType = "SHOP",
}: ProductsSectionProps) {
  const { t } = useTranslation("productSection");
  const navigate = useNavigate();
  const isRental = productType === "RENTAL";
  const isRetail = productType === "RETAIL" || isRental;
  const isWholesale = productType === "WHOLESALE";

  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: "",
    category: null,
    brand: null,
    size: null,
    color: null,
    priceMin: null,
    priceMax: null,
  });

  const { data: standardCategories = [] } = useCategories(
    isRetail ? "RETAIL" : undefined,
  );
  const categories: { id: string | number; name: string }[] =
    standardCategories as { id: string | number; name: string }[];

  const { data: standardBrands = [] } = useBrands();
  const brands: { id: string | number; name: string }[] = standardBrands as {
    id: string | number;
    name: string;
  }[];

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

  const shopQueryFilters: ProductsQuery = {
    ...query,
    search: filterValues.search,
    categoryId,
    brandId,
    size: filterValues.size ?? "",
    color: filterValues.color ?? "",
    priceMin: filterValues.priceMin ?? "",
    priceMax: filterValues.priceMax ?? "",
    limit: 4,
    type: isRetail ? "RETAIL" : isWholesale ? "WHOLESALE" : "SHOP",
  };

  const { data: shopData, isPending, isError } = useProducts(shopQueryFilters);

  const products: Product[] = shopData?.products || [];

  const filters = useMemo(() => {
    const availableSizes = Array.from(
      new Set(
        products.flatMap(
          (p) =>
            p.colors?.flatMap((c) => c.variants?.map((v) => v.size) ?? []) ??
            [],
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
          .flatMap((p) => p.categories?.map((c) => c.name) || [])
          .filter((x): x is string => Boolean(x)),
      ),
    );

    const availableBrands = Array.from(
      new Set(
        products
          .map((p) => p.brand?.name || (p.brand as unknown as string))
          .filter((x): x is string => Boolean(x)),
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
                productType={isRental ? "RENTAL" : isRetail ? "RETAIL" : "SHOP"}
                title={product.name}
                subtitle={product.description}
                price={`${isRental ? (product.rentalPrice ?? product.retailPrice ?? product.price ?? 0) : isRetail ? (product.retailPrice ?? product.price ?? 0) : isWholesale ? (product.wholesalePrice ?? product.price ?? 0) : (product.shopPrice ?? product.price ?? 0)} EGP`}
                rentalPrice={product.rentalPrice}
                depositAmount={product.depositAmount}
                imageSrc={
                  product.colors?.[0]?.images?.[0]?.imageUrl ||
                  product.colors?.[0]?.images?.[0]?.url ||
                  ((product.images?.[0] as Record<string, unknown>)
                    ?.imageUrl as string) ||
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
                        url:
                          img.url ||
                          ((img as Record<string, unknown>).imageUrl as string),
                      }))
                    : product.colors?.flatMap(
                        (c) =>
                          c.images?.map((img) => ({
                            ...img,
                            url:
                              img.url ||
                              ((img as Record<string, unknown>)
                                .imageUrl as string),
                            color: c.colorName || c.color,
                          })) || [],
                      ) || []
                }
                brand={
                  product.brand?.name || (product.brand as unknown as string)
                }
                category={
                  product.categories?.map((c) => c.name).join(", ") || ""
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
                isFlashDeals={
                  !isRetail && !isWholesale ? product.isFlashDeals : false
                }
                flashDealPrice={
                  !isRetail && !isWholesale ? product.flashDealPrice : undefined
                }
                flashDealEndsAt={
                  !isRetail && !isWholesale
                    ? product.flashDealEndsAt
                    : undefined
                }
                rating={product.rating}
                stock={product.stock}
                to={
                  isRetail
                    ? `/rental/shop/${product.id}`
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
