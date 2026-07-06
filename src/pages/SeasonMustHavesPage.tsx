import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";

import {
  ProductCard,
  CatalogFilters,
} from "../components/shared";
import Pagination from "../components/shared/Pagination";

import { useProducts } from "../hooks/queries/productsQuery";
import { useCategories } from "../hooks/queries/categoriesQuery";
import { useBrands } from "../hooks/queries/brandsQuery";

export default function SeasonMustHavesPage() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuthStore();

  const [search, setSearch] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [brandId, setBrandId] = useState("");

  const [sortBy, setSortBy] = useState<
    "name" | "price" | "rating"
  >("name");

  const [sortOrder] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
  } = useProducts({
    search,
    categoryId,
    brandId,
    sortBy,
    sortOrder,
    page,
    limit: 4,
  });

  const {
    data: categories = [],
  } = useCategories();

  const {
    data: brands = [],
  } = useBrands();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const asyncFunc = async () => {
      setPage(1);
    }
    asyncFunc();
  }, [search, categoryId, brandId, sortBy, sortOrder]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  if (!isAuthenticated || !user) {
    return null;
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-gray-text">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="font-['Montserrat'] text-8xl font-bold text-foreground">
        This Season’s Must-Haves
      </div>

      <div className="mt-8">
        <CatalogFilters
          onSearchChange={setSearch}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
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

      {isError && (
        <div className="mt-8 w-full py-2 text-center text-gray-text">
          Something went wrong. Please try again later.
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
              sizeLabel={product.sizes
                .map((size) => size.size)
                .join(" - ")}
              featured={product.rating >= 4}
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