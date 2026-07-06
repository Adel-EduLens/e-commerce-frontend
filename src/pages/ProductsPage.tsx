import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";

import { ProductCard, CatalogFilters } from "../components/shared";
import Pagination from "../components/shared/Pagination";

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

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user, isAuthenticated } = useAuthStore();

  const categoryName = searchParams.get("category") ?? "";
  const filter = searchParams.get("filter") ?? "";

  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name");
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  const categoryId = useMemo(() => {
    const matchedId = categories.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
    )?.id;
    if (matchedId) return matchedId;
    return categoryName.length > 0 ? "0000000" : "";
  }, [categories, categoryName]);
  const { data, isLoading, isError } = useProducts({
    search,
    categoryId,
    brandId,
    filter,
    sortBy,
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
  }, [search, categoryId, brandId, filter, sortBy, sortOrder]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleCategoryChange = (id: string) => {
    const name = categories.find((c) => c.id === id)?.name ?? "";

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (name) next.set("category", name);
        else next.delete("category");
        return next;
      },
      { replace: true },
    );
  };

  const pageTitle = useMemo(() => {
    if (filter) return FILTER_LABELS[filter] ?? "Products";

    if (categoryName) {
      return CATEGORY_LABELS[categoryName.toLowerCase()] ?? "All Products";
    }

    return "All Products";
  }, [filter, categoryName]);

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
        <CatalogFilters
          onSearchChange={setSearch}
          categoryId={categoryId}
          onCategoryChange={handleCategoryChange}
          brandId={brandId}
          onBrandChange={setBrandId}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={categories}
          brands={brands}
        />
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
