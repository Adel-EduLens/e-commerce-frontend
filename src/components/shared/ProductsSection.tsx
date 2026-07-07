type ProductsSectionProps = {
  title: string;
  navigateTo: string;
  query?: ProductsQuery;
};
import { useMemo, useState } from "react";
import { useCategories } from "../../hooks/queries/categoriesQuery";
import { useBrands } from "../../hooks/queries/brandsQuery";
import type { FilterValues } from "./CatalogFilters";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/queries/productsQuery";
import type { ProductsQuery } from "../../hooks/queries/productsQuery";
import ProductCard from "../shared/ProductCard";
import { ViewAllButton } from "../ui/ViewAllButton";
import { useHomeFilters } from "../../hooks/utils/HomeFilters";
import CatalogFilters from "./CatalogFilters";

export default function ProductsSection({
  title,
  navigateTo,
  query,
}: ProductsSectionProps) {
  const navigate = useNavigate();
  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: "",
    category: null,
    brand: null,
    size: null,
    color: null,
    priceMin: null,
    priceMax: null,
  });
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const categoryId = useMemo(() => {
    if (!filterValues.category) return "";

    return (
      categories.find(
        (c) => c.name.toLowerCase() === filterValues.category!.toLowerCase(),
      )?.id ?? "0000000"
    );
  }, [categories, filterValues.category]);
  const brandId = useMemo(() => {
    if (!filterValues.brand) return "";

    return (
      brands.find(
        (b) => b.name.toLowerCase() === filterValues.brand!.toLowerCase(),
      )?.id ?? "0000000"
    );
  }, [brands, filterValues.brand]);
  const filters = useHomeFilters();
  const { data, isPending, isError } = useProducts({
    ...query,
    search: filterValues.search,
    categoryId,
    brandId,
    size: filterValues.size ?? "",
    color: filterValues.color ?? "",
    priceMin: filterValues.priceMin ?? "",
    priceMax: filterValues.priceMax ?? "",
    limit: 4,
  });

  

  return (
    <section className="mt-16 flex w-full flex-col items-center gap-10">
      <h2 className="text-center font-['Montserrat'] text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground">
        {title}
      </h2>
      <div className="mt-10 inline-flex w-full flex-col items-center justify-start gap-8">
        <CatalogFilters filters={filters} onFilterChange={setFilterValues} />
        {isPending && (
          <div className="flex w-full flex-wrap justify-center gap-6">
            <div className="w-full py-2 text-center text-gray-text">
              Loading...
            </div>
          </div>
        )}
        {isError && (
          <div className="flex w-full flex-wrap justify-center gap-6">
            <div className="w-full py-2 text-center text-gray-text">
              Something went wrong. Please try again later.
            </div>
          </div>
        )}
        {!isPending && !isError && <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.name}
              price={`$${product.price}`}
              imageSrc={product.images[0]?.url}
              sizeLabel={product.sizes.map((s) => s.size).join(" - ")}
              featured={product.rating >= 4}
              isMustHave={product.isMustHave}
              isFlashDeals={product.isFlashDeals}
              flashDealPrice={product.flashDealPrice}
              flashDealEndsAt={product.flashDealEndsAt}
              rating={product.rating}
              to={`/product-details/${product.id}`}
            />
          ))}
        </div>}
        {!isPending && !isError && data?.products.length > 4 && <ViewAllButton onClick={() => navigate(navigateTo)} />}
      </div>
    </section>
  );
}
