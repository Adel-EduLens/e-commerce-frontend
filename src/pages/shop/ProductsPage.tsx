import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ProductCard, FilterCategory } from "../../components/shared";
import ShopBanner from "../../components/product/ShopBanner";
import { useProducts } from "../../hooks/queries/productsQuery";
import { useCategories } from "../../hooks/queries/categoriesQuery";
import { useBrands } from "../../hooks/queries/brandsQuery";
import { useGiftCards } from "../../hooks/queries/giftCardsQuery";
import type { FilterValues } from "../../components/shared/CatalogFilters";
import { useHomeFilters } from "../../hooks/useHomeFilters";

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
    category: urlCategoryName || null,
    brand: null,
    size: null,
    color: null,
    priceMin: null,
    priceMax: null,
  });

  const effectiveCategoryName = filters.category;

  const [page, setPage] = useState(1);

  const { data: categories = [] } = useCategories("SHOP");
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
    type: "SHOP",
  });

  const { data: wholesalesData, isLoading: isWholesaleLoading } =
    useProducts(filters.search ? { search: filters.search, type: "WHOLESALE" } : { type: "WHOLESALE" });
  const wholesales = filters.search ? wholesalesData?.products || [] : [];

  const { data: giftCards = [], isLoading: isGiftCardsLoading } =
    useGiftCards(filters.search ? filters.search : undefined);

  const isAnyLoading = isLoading || (!!filters.search && isWholesaleLoading) || isGiftCardsLoading;

  useEffect(() => {
    const func = () => {
      setFilters((prev) => ({
        ...prev,
        search: urlSearch,
        category: urlCategoryName || prev.category,
      }));
    };
    func();
  }, [urlSearch, urlCategoryName]);

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

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();

    // Add sizes from retail products
    if (data?.products) {
      data.products.forEach((product) => {
        product.colors?.forEach((color) => {
          color.variants?.forEach((variant) => {
            if (variant.size) sizes.add(variant.size);
          });
        });
      });
    }

    if (wholesales) {
      wholesales.forEach((wholesale) => {
        wholesale.colors?.forEach((wc) => {
          wc.variants?.forEach((s) => {
            if (s.size) sizes.add(s.size);
          });
        });
      });
    }

    return Array.from(sizes);
  }, [data, wholesales]);

  const allCategories = useMemo(() => {
    const hasGiftCardsCategory = categories.some(
      (c) =>
        c.name.toLowerCase() === "gift cards" ||
        c.name.toLowerCase() === "gift card"
    );
    if (!hasGiftCardsCategory) {
      return [...categories, { id: "gift-cards", name: "Gift Cards" }];
    }
    return categories;
  }, [categories]);

  const combinedProducts = useMemo(() => {
    const items: React.ReactNode[] = [];

    const isGiftCardCategory = effectiveCategoryName?.toLowerCase().includes("gift");
    const showGiftCards = !effectiveCategoryName || isGiftCardCategory;

    if (showGiftCards && giftCards && giftCards.length > 0) {
      giftCards.forEach((gc) => {
        if (filters.priceMin && gc.amount < Number(filters.priceMin)) return;
        if (filters.priceMax && gc.amount > Number(filters.priceMax)) return;

        items.push(
          <ProductCard
            key={`giftcard-${gc.id}`}
            title={gc.name}
            productId={gc.id}
            price={`${gc.amount} EGP`}
            imageSrc={gc.image || undefined}
            subtitle={gc.description || "Gift Card"}
            rating={5}
            productType="SHOP"
            showTypeBadge={!!filters.search}
            to={`/giftcard/${gc.id}`}
            stock={gc.stock ?? 100}
            hideAddToCart={true}
          />
        );
      });
    }

    if (data?.products) {
      data.products.forEach((product) => {
        items.push(
          <ProductCard
            key={`retail-${product.id}`}
            title={product.name}
            productId={product.id}
            colors={Array.from(
              new Set(
                product.colors
                  ?.map((c) => (typeof c === "string" ? c : c.colorName || c.color || (c as any).name || ""))
                  .filter(Boolean),
              ),
            )}
            images={product.images}
            shopPrice={product.shopPrice}
            price={`${product.shopPrice ?? product.retailPrice ?? product.rentalPrice ?? product.wholesalePrice ?? product.blankPrice ?? product.price ?? 0} EGP`}
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
            stock={product.stock}
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
            price={`${wholesale.wholesalePrice ?? wholesale.shopPrice ?? wholesale.retailPrice ?? wholesale.blankPrice ?? wholesale.price ?? 0} EGP`}
            imageSrc={wholesale.images[0]?.url}
            images={wholesale.images}
            rating={wholesale.rating}
            to={`/wholesale/${wholesale.id}`}
            brand={wholesale.brand?.name}
            category={wholesale.category?.name}
            colors={wholesale.colors?.map((wc) => wc.colorName || wc.color || "") || []}
            wholesaleSizes={Array.from(
              new Set(
                wholesale.colors?.flatMap((wc) =>
                  wc.variants?.map((s) => s.size),
                ) || [],
              ),
            )}
            sizeLabel={
              Array.from(
                new Set(
                  wholesale.colors?.flatMap((wc) =>
                    wc.variants?.map((s) => s.size),
                  ) || [],
                ),
              )
                .slice(0, 4)
                .join("-") || "All Sizes"
            }
            minOrder={wholesale.minOrder}
            wholesaleCard
            stock={wholesale.stock}
          />,
        );
      });
    }
    return items;
  }, [data, wholesales, giftCards, filters.search, effectiveCategoryName, filters.priceMin, filters.priceMax]);

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
        availableSizes={availableSizes.length > 0 ? availableSizes : undefined}
        isWholesale={false}
        isShop={true}
        categories={allCategories}
      />
    </div>
  );
}
