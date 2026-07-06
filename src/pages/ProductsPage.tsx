import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";

import { ProductCard, CatalogFilters } from "../components/shared";
import Pagination from "../components/shared/Pagination";
import { buildPriceRanges } from "../utils/priceRanges";
import { useProducts } from "../hooks/queries/productsQuery";
import { useCategories } from "../hooks/queries/categoriesQuery";
import { useBrands } from "../hooks/queries/brandsQuery";

const FILTER_LABELS: Record<string, string> = {
  "best-deal": "Best Deals",
  "most-popular": "Most Popular",
  premium: "Premium Collection",
  new: "New Arrivals",
  "must-have": "This Season's Must-Haves",
  "flash-deals": "Flash Deals",
};
const CATEGORY_LABELS: Record<string, string> = {
  kids: "Kids",
  men: "Men",
  women: "Women",
};

function useHomeFilters() {
  const { data } = useProducts({ limit: 100 });

  const products = data?.products ?? [];
  const allCategories = useMemo(
    () => [...new Set(products.map((p) => p.category.name))],
    [products],
  );
  const allBrands = useMemo(
    () => [
      ...new Set(
        products.map((p) => p.brand?.name).filter(Boolean) as string[],
      ),
    ],
    [products],
  );
  const allSizes = useMemo(
    () => [...new Set(products.flatMap((p) => p.sizes.map((s) => s.size)))],
    [products],
  );
  const allColors = useMemo(
    () => [...new Set(products.flatMap((p) => p.colors.map((c) => c.color)))],
    [products],
  );
  const priceRanges = useMemo(
    () => buildPriceRanges(products.map((p) => p.price)),
    [products],
  );

  return useMemo(
    () => [
      { key: "category", label: "Category", options: allCategories },
      { key: "brand", label: "Brand", options: allBrands },
      { key: "size", label: "Size", options: allSizes },
      { key: "color", label: "Color", options: allColors },
      ...(priceRanges.length > 1
        ? [{ key: "price", label: "Price", options: priceRanges }]
        : []),
    ],
    [allCategories, allBrands, allSizes, allColors, priceRanges],
  );
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const filter2 = useHomeFilters();

  const [filters, setFilters] = useState({
    search: "",
    category: null as string | null,
    brand: null as string | null,
    size: null as string | null,
    color: null as string | null,
    price: null as string | null,
  });

  // Sorting isn't wired to any UI control yet — sensible defaults for now.
  const [sortBy] = useState<string>("createdAt");
  const [sortOrder] = useState<"asc" | "desc">("desc");

  const [searchParams] = useSearchParams();

  const { user, isAuthenticated } = useAuthStore();

  const urlCategoryName = searchParams.get("category") ?? "";
  const filter = searchParams.get("filter") ?? "";

  
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
    price: filters.price ?? "",
    filter,
    sortOrder,
    page,
    limit: 8,
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

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
    filters.price,
    filter,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const pageTitle = useMemo(() => {
    if (filter) return FILTER_LABELS[filter] ?? "Products";

    if (effectiveCategoryName) {
      return (
        CATEGORY_LABELS[effectiveCategoryName.toLowerCase()] ?? "All Products"
      );
    }

    return "All Products";
  }, [filter, effectiveCategoryName]);

  if (!isAuthenticated || !user) return null;

  if (isError) {
    return (
      <div className="py-20 text-center text-gray-text">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="font-['Montserrat'] text-5xl font-bold text-[#1A1A1A] sm:text-8xl">
        {pageTitle}
      </div>

      <div className="mt-8">
        <CatalogFilters filters={filter2} onFilterChange={setFilters} />
      </div>

      {isLoading && (
        <div className="mt-8 w-full py-2 text-center text-gray-text">
          Loading...
        </div>
      )}

      {!isLoading && (
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          {data?.products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.name}
              price={`$${product.price}`}
              imageSrc={product.images[0]?.url}
              sizeLabel={product.sizes.map((size) => size.size).join(" - ")}
              featured={product.rating >= 4}
              isMustHave={product.isMustHave}
              isFlashDeals={product.isFlashDeals}
              flashDealPrice={product.flashDealPrice}
              flashDealEndsAt={product.flashDealEndsAt}
              rating={product.rating}
              to={`/product-details/${product.id}`}
            />
          ))}
        </div>
      )}

      {!isLoading && data?.products.length === 0 && (
        <div className="mt-20 text-center text-xl text-gray-500">
          No products found.
        </div>
      )}

      {!isLoading && data && data.pagination.totalPages > 1 && (
        <Pagination
          className="mt-12 mb-8"
          currentPage={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
