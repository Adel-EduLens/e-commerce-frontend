import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  ProductCard,
  FilterCategory,
} from "../components/shared";
import { useRetailProducts } from "../hooks/useRetailProducts";
import { useRetailCategories } from "../hooks/useRetailCategories";
import { useRetailBrands } from "../hooks/queries/retailBrandQuery";
import type { FilterValues } from "../components/shared/CatalogFilters";

import type { RetailProduct, RetailCategory, RetailProductSize, RetailProductColor, RetailProductImage } from "../types/retail";

type RetailApiResponse = {
  data?: {
    products?: RetailProduct[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  } | RetailProduct[];
  products?: RetailProduct[];
  pagination?: {
    page: number;
    totalPages: number;
  };
  totalPages?: number;
  currentPage?: number;
};

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

  const { data: catData } = useRetailCategories();
  const categories = Array.isArray(catData) ? catData : catData?.data || [];

  const { data: brandsData } = useRetailBrands();
  const brands = Array.isArray(brandsData) ? brandsData : brandsData?.data || [];

  const categoryId = useMemo(() => {
    if (!effectiveCategoryName) return "";
    const matchedId = categories.find(
      (c: RetailCategory) => c.name.toLowerCase() === effectiveCategoryName.toLowerCase(),
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

  const { data, isLoading, isError } = useRetailProducts({
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

  const products: RetailProduct[] = useMemo(() => {
    const typedData = data as RetailApiResponse | RetailProduct[] | undefined;
    if (Array.isArray(typedData)) return typedData;
    if (typedData && !Array.isArray(typedData)) {
      if (Array.isArray(typedData.products)) return typedData.products;
      if (Array.isArray(typedData.data)) return typedData.data;
      if (typedData.data && !Array.isArray(typedData.data) && Array.isArray(typedData.data.products)) return typedData.data.products;
    }
    return [];
  }, [data]);

  const availableSizes = useMemo(() => {
    if (products.length === 0) return undefined;
    const sizes = new Set<string>();
    products.forEach((product: RetailProduct) => {
      product.sizes?.forEach((size: RetailProductSize) => {
        if (size.size) sizes.add(size.size);
      });
    });
    return Array.from(sizes);
  }, [products]);

  const availableColors = useMemo(() => {
    if (products.length === 0) return undefined;
    const colors = new Set<string>();
    products.forEach((product: RetailProduct) => {
      product.colors?.forEach((c: RetailProductColor) => {
        if (c.color) colors.add(c.color);
      });
    });
    return Array.from(colors);
  }, [products]);

  const filter2 = useMemo(() => [
    { key: 'category', label: 'Category', options: categories.map((c: RetailCategory) => c.name) },
    { key: 'brand', label: 'Brand', options: brands.map((b: { id: string; name: string }) => b.name) },
    { key: 'size', label: 'Size', options: availableSizes || [] },
    { key: 'color', label: 'Color', options: availableColors || [] },
  ], [categories, brands, availableSizes, availableColors]);

  const productsList = useMemo(() => {
    if (products.length === 0) return [];

    return products.map((product: RetailProduct) => {
      let sizeLabels: string[] = [];
      if (product.sizes && Array.isArray(product.sizes)) {
         sizeLabels = product.sizes.map((s: RetailProductSize) => s.size).filter(Boolean) as string[];
      }
      
      const colorsList = product.colors
            ?.map((c: RetailProductColor) => c.color)
            .filter(Boolean) as string[];

      const imageSrc = product.images?.[0]?.url;

      return (
        <ProductCard
          key={`retail-${product.id}`}
          title={product.name}
          productId={String(product.id)}
          colors={colorsList}
          images={product.images?.map((img: RetailProductImage) => ({ 
            ...img, 
            id: String(img.id),
            productId: img.productId ? String(img.productId) : undefined 
          }))}
          price={`$${product.price}`}
          imageSrc={imageSrc}
          sizeLabel={sizeLabels.join(" - ")}
          featured={product.isFeatured ?? (product.rating >= 4)}
     
          rating={product.rating}
          productType="SHOP"
          showTypeBadge={!!filters.search}
          to={`/retail/shop/${product.id}`}
          subtitle={product.description}
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
        totalPages={
          (data as RetailApiResponse)?.data && !Array.isArray((data as RetailApiResponse)?.data)
            ? ((data as RetailApiResponse).data as Exclude<RetailApiResponse["data"], RetailProduct[] | undefined>)?.pagination?.totalPages || 1
            : (data as RetailApiResponse)?.pagination?.totalPages || (data as RetailApiResponse)?.totalPages || 1
        }
        currentPage={
          (data as RetailApiResponse)?.data && !Array.isArray((data as RetailApiResponse)?.data)
            ? ((data as RetailApiResponse).data as Exclude<RetailApiResponse["data"], RetailProduct[] | undefined>)?.pagination?.page || page
            : (data as RetailApiResponse)?.pagination?.page || (data as RetailApiResponse)?.currentPage || page
        }
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
