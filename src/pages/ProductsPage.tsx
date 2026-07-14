import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ProductCard, FilterCategory } from "../components/shared";
import ShopBanner from "../components/product/ShopBanner";
import { useProducts } from "../hooks/queries/productsQuery";
import { useCategories } from "../hooks/queries/categoriesQuery";
import { useBrands } from "../hooks/queries/brandsQuery";
import type { FilterValues } from "../components/shared/CatalogFilters";
import { useHomeFilters } from "../hooks/utils/HomeFilters";
import { useWholesales } from "../hooks/queries/wholesaleQuery";
import { useTranslation } from "react-i18next";



export default function ProductsPage() {
  const { t } = useTranslation("productSection");

  const { filters: filter2 } = useHomeFilters();

  const [searchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") ?? "";
  const urlCategoryName = searchParams.get("category") ?? "";
  const filter = searchParams.get("filter") ?? "";
  const collectionId = searchParams.get("collectionId") ?? "";

  const [filters, setFilters] = useState<FilterValues>({
    search: urlSearch,
    category: null,
    brand: null,
    size: null,
    color: null,
    priceMin: null,
    priceMax: null,
  });

  const effectiveCategoryName = filters.category ?? urlCategoryName;

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

  const { data: wholesales = [], isLoading: isWholesaleLoading } =
    useWholesales(filters.search ? { search: filters.search } : undefined);

  const isAnyLoading = isLoading || (!!filters.search && isWholesaleLoading);

  useEffect(() => {
    const func = () => {
      setFilters((prev) => ({
        ...prev,
        search: urlSearch,
      }));
    };
    func();
  }, [urlSearch]);

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



  const combinedProducts = useMemo(() => {

    const items: React.ReactNode[] = [];
    if (data?.products) {
      data.products.forEach((product) => {
        items.push(
          <ProductCard
            key={`retail-${product.id}`}
            title={product.name}
            productId={product.id}
            colors={product.colors?.map((c) => c.colorName)}
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
          />,
        );
      });
    }

    if (filters.search && wholesales) {
      wholesales.forEach((wholesale) => {
        items.push(
          <ProductCard
            key={`wholesale-${wholesale.id}`}
            productId={wholesale.id}
            productType="WHOLESALE"
            title={wholesale.name}
            subtitle={wholesale.description || undefined}
            price={`$${wholesale.price}`}
            imageSrc={wholesale.images[0]?.url}
            images={wholesale.images}
            rating={wholesale.rating}
            to={`/wholesale/${wholesale.id}`}
            brand={wholesale.brand}
            category={wholesale.category?.name}
            colors={wholesale.wholesaleColors?.map(wc => wc.color) || []}
            wholesaleSizes={Array.from(new Set(wholesale.wholesaleColors?.flatMap(wc => wc.sizes.map(s => s.size)) || []))}
            sizeLabel={Array.from(new Set(wholesale.wholesaleColors?.flatMap(wc => wc.sizes.map(s => s.size)) || [])).slice(0, 4).join("-") || "All Sizes"}
            minOrder={wholesale.minOrder}
            wholesaleCard
          />,
        );
      });
    }
    return items;
  }, [data, wholesales, filters.search]);

  if (isError) {
    return (
      <div className="py-20 text-center text-gray-text">
        {t("Something went wrong. Please try again later.")}
      </div>
    );
  }

  return (

    <div className="w-full bg-background min-h-screen text-foreground transition-colors">
      <ShopBanner />
      <FilterCategory
        filtersConfig={filter2}
        initialValues={filters}
        onFilterChange={setFilters}
        isAnyLoading={isAnyLoading}
        combinedProducts={combinedProducts}
        totalPages={data?.pagination.totalPages}
        currentPage={data?.pagination.page}
        onPageChange={setPage}
        noProductsText={t("No products found.")}
        loadingText={t("Loading")}
      />
    </div>
  );
}
