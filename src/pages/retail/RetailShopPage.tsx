import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  ProductCard,
  FilterCategory,
} from "../../components/shared";
import { useProducts, type Product } from "../../hooks/queries/productsQuery";
import { useCategories, type Category } from "../../hooks/queries/categoriesQuery";
import { useBrands } from "../../hooks/queries/brandsQuery";
import type { FilterValues } from "../../components/shared/CatalogFilters";



export default function RetailShopPage() {
  const { t } = useTranslation("productSection");
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

  const { data: catData } = useCategories("RETAIL");
  const categories = Array.isArray(catData) ? catData : catData?.data || [];

  const { data: brandsData } = useBrands();
  const brands = Array.isArray(brandsData) ? brandsData : brandsData?.data || [];

  const categoryId = useMemo(() => {
    if (!effectiveCategoryName) return "";
    const matchedId = categories.find(
      (c: Category) => c.name.toLowerCase() === effectiveCategoryName.toLowerCase(),
    )?.id;

    return matchedId ?? "0000000";
  }, [categories, effectiveCategoryName]);

  const brandId = useMemo(() => {
    if (!filters.brand) return "";
    const matchedId = brands.find(
      (b: { id: string; name: string }) => b.name.toLowerCase() === filters.brand!.toLowerCase(),
    )?.id;
    return matchedId ?? "0000000";
  }, [brands, filters.brand]);

  const { data, isLoading, isError } = useProducts({
    search: filters.search || undefined,
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
    type: "RETAIL"
  });

  useEffect(() => {
    const func = () => {
      setFilters((prev) => ({
        ...prev,
        search: urlSearch,
        category: urlCategoryName || null,
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

  const products: Product[] = useMemo(() => {
    return data?.products || [];
  }, [data]);

  const availableSizes = useMemo(() => {
    if (products.length === 0) return undefined;
    const sizes = new Set<string>();
    products.forEach((product: Product) => {
      product.colors?.forEach((c) => {
        c.variants?.forEach((v) => {
          if (v.size) sizes.add(v.size);
        });
      });
    });
    return Array.from(sizes);
  }, [products]);

  const availableColors = useMemo(() => {
    if (products.length === 0) return undefined;
    const colors = new Set<string>();
    products.forEach((product: Product) => {
      product.colors?.forEach((c) => {
        if (c.colorName) colors.add(c.colorName);
        else if (c.color) colors.add(c.color);
      });
    });
    return Array.from(colors);
  }, [products]);

  const filter2 = useMemo(() => [
    { key: 'category', label: 'Category', options: categories.map((c: Category) => c.name) },
    { key: 'brand', label: 'Brand', options: brands.map((b: { id: string; name: string }) => b.name) },
    { key: 'size', label: 'Size', options: availableSizes || [] },
    { key: 'color', label: 'Color', options: availableColors || [] },
  ], [categories, brands, availableSizes, availableColors]);

  const productsList = useMemo(() => {
    if (products.length === 0) return [];

    return products.map((product: Product) => {
      const sizeLabels: string[] = [];
      const colorsList: string[] = [];
      
      product.colors?.forEach(c => {
         if (c.colorName || c.color) colorsList.push(c.colorName || c.color || "");
         c.variants?.forEach(v => {
            if (v.size) sizeLabels.push(v.size);
         });
      });

      const imageSrc = product.images?.[0]?.url;

      return (
        <ProductCard
          key={`retail-${product.id}`}
          title={product.name}
          productId={String(product.id)}
          colors={Array.from(new Set(colorsList))}
          images={product.images?.map((img) => ({ 
            ...img, 
            id: String(img.id),
            productId: img.productId ? String(img.productId) : undefined 
          }))}
          price={`${product.retailPrice ?? product.shopPrice ?? product.wholesalePrice ?? product.blankPrice ?? product.price ?? 0} EGP`}
          imageSrc={imageSrc}
          sizeLabel={Array.from(new Set(sizeLabels)).join(" - ")}
          featured={product.isFeatured ?? (product.rating >= 4)}
     
          rating={product.rating}
          productType="RETAIL"
          showTypeBadge={!!filters.search}
          to={`/retail/shop/${product.id}`}
          subtitle={product.description}
          stock={product.stock}
        />
      );
    });
  }, [products, filters.search]);

  if (isError) {
    return (
      <div className="py-20 text-center text-gray-text">
        {t("Something went wrong. Please try again later.")}
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen text-foreground transition-colors">
      <FilterCategory
        filtersConfig={filter2}
        initialValues={filters}
        onFilterChange={setFilters}
        isAnyLoading={isLoading}
        combinedProducts={productsList}
        totalPages={data?.pagination?.totalPages || 1}
        currentPage={data?.pagination?.page || page}
        onPageChange={setPage}
        noProductsText={t("No products found.")}
        loadingText={t("Loading")}
        availableSizes={availableSizes && availableSizes.length > 0 ? availableSizes : undefined}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
