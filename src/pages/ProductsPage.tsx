import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ProductCard, SidebarFilters } from "../components/shared";
import ShopBanner from "../components/product/ShopBanner";
import Pagination from "../components/shared/Pagination";
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
  });

  const { data: wholesales = [], isLoading: isWholesaleLoading } =
    useWholesales(filters.search ? { search: filters.search } : undefined);

  const isAnyLoading = isLoading || (!!filters.search && isWholesaleLoading);

  useEffect(() => {
    const func = async () => {
      setFilters((prev) => ({
        ...prev,
        search: urlSearch,
      }));
    };
    func();
  }, [urlSearch]);

  useEffect(() => {
    const func = async () => {
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
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);



  const combinedProducts = useMemo(() => {
    console.log(data?.products);
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
            title={wholesale.name}
            productId={wholesale.id}
            price={`$${wholesale.price}`}
            imageSrc={wholesale.images[0]?.url}
            sizeLabel={`Min. Order: ${wholesale.minOrder}`}
            featured={wholesale.rating >= 4}
            rating={wholesale.rating}
            productType="WHOLESALE"
            showTypeBadge={!!filters.search}
            to={`/wholesale/${wholesale.id}`}
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <div className="w-full shrink-0 lg:w-64">
            <SidebarFilters
              filters={filter2}
              initialValues={filters}
              onFilterChange={setFilters}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            {isAnyLoading && (
              <div className="w-full py-2 text-center text-gray-400">
                {t("Loading")}
              </div>
            )}

            {!isAnyLoading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {combinedProducts}
              </div>
            )}

            {!isAnyLoading && combinedProducts.length === 0 && (
              <div className="mt-20 text-center text-xl text-gray-500">
                {t("No products found.")}
              </div>
            )}

            {!isAnyLoading && data && data.pagination.totalPages > 1 && (
              <Pagination
                className="mt-12 mb-8"
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
