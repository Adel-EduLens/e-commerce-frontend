import { useMemo, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "../shared/ProductCard";
import LoadingSpinner from "../shared/LoadingSpinner";
import { useRecommendedProducts, useProductFilters, type ProductColor } from "../../hooks/queries/productsQuery";
import { useTopCategories } from "../../hooks/queries/recommendQuery";
import { useCategories } from "../../hooks/queries/categoriesQuery";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

type RecommedProductsProps = {
  currentProductId?: string;
};

export function RecommedProducts({
  currentProductId,
}: RecommedProductsProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("productDetails");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // 1. Get Top Categories from the user's Recommendation Model
  const { data: topCategories = [], isLoading: isTopCategoriesLoading } = useTopCategories(5);
  const { data: categories = [] } = useCategories();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedPriceSort, setSelectedPriceSort] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const sortBy = selectedPriceSort ? "price" : "rating";
  const sortOrder =
    selectedPriceSort === "low-to-high"
      ? "asc"
      : selectedPriceSort === "high-to-low"
        ? "desc"
        : "desc";

  // 2. Fetch products to recommend (server-side filtering & limit 4)
  const { data, isLoading: isProductsLoading } = useRecommendedProducts({
    categories: topCategories.length > 0 ? topCategories : undefined,
    limit: 4,
    excludeId: currentProductId,
    categoryId: selectedCategory || undefined,
    size: selectedSize || undefined,
    color: selectedColor || undefined,
    sortBy,
    sortOrder,
  });

  const { data: filtersData } = useProductFilters();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Calculate available filter options
  const availableCategories = useMemo(() => {
    if (topCategories.length > 0) {
      const filtered = categories.filter((c) => topCategories.includes(c.id));
      if (filtered.length > 0) return filtered;
    }
    return categories;
  }, [categories, topCategories]);

  const availableSizes = useMemo(() => {
    return filtersData?.sizes ?? [];
  }, [filtersData]);

  const availableColors = useMemo(() => {
    return filtersData?.colors ?? [];
  }, [filtersData]);

  const priceSortOptions = useMemo(() => [
    { label: t("priceSortLowToHigh"), value: "low-to-high" },
    { label: t("priceSortHighToLow"), value: "high-to-low" }
  ], [t]);

  // 4. Products returned from server-side filtering
  const filteredProducts = useMemo(() => {
    const list = data?.products ?? [];
    return list.filter((p) => p.id !== currentProductId).slice(0, 4);
  }, [data, currentProductId])
  const isLoading = isProductsLoading || (isAuthenticated && isTopCategoriesLoading);

  if (isLoading) {
    return (
      <section className="flex flex-col items-start justify-start gap-6 sm:gap-8 w-full font-['Montserrat'] select-none mt-10">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl sm:text-4xl">
            {t("recommendedForYou")}
          </h2>
        </div>
        <div className="flex w-full justify-center mt-8">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (filteredProducts.length === 0 && !selectedCategory && !selectedSize && !selectedColor && !selectedPriceSort) {
    return null;
  }

  return (
    <section className="flex flex-col items-start justify-start gap-6 sm:gap-8 w-full font-['Montserrat'] select-none mt-10">
      <div className="w-full">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl sm:text-4xl">
          {t("recommendedForYou")}
        </h2>
        <div className="mt-4 flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground/80">{t("filterBy")}</span>
          <div ref={dropdownRef} className="flex flex-wrap items-center gap-3 relative z-30">
            {/* Category Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "Category" ? null : "Category")}
                className={`flex items-center justify-between gap-2 rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground/80 cursor-pointer hover:bg-gray-light border border-stroke transition ${selectedCategory ? "border-primary text-primary" : ""
                }`}
            >
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : t("categoryLabel")}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {activeDropdown === "Category" && (
              <div className="absolute top-full left-0 mt-1 z-40 min-w-[160px] rounded-xl bg-card border border-stroke shadow-lg p-2 max-h-60 overflow-y-auto">
                <div
                  onClick={() => { setSelectedCategory(null); setActiveDropdown(null); }}
                  className="px-3 py-2 text-sm text-foreground/85 hover:bg-gray-light rounded-lg cursor-pointer transition font-medium"
                >
                  {t("allCategories")}
                </div>
                  {availableCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setActiveDropdown(null); }}
                      className={`px-3 py-2 text-sm hover:bg-gray-light rounded-lg cursor-pointer transition ${selectedCategory === cat.id ? "text-primary font-semibold bg-primary/5" : "text-foreground/80"
                        }`}
                    >
                      {cat.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Size Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "Size" ? null : "Size")}
                className={`flex items-center justify-between gap-2 rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground/80 cursor-pointer hover:bg-gray-light border border-stroke transition ${selectedSize ? "border-primary text-primary" : ""
                }`}
            >
              {selectedSize ? `${t("size")}: ${selectedSize}` : t("size")}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {activeDropdown === "Size" && (
              <div className="absolute top-full left-0 mt-1 z-40 min-w-[120px] rounded-xl bg-card border border-stroke shadow-lg p-2 max-h-60 overflow-y-auto">
                <div
                  onClick={() => { setSelectedSize(null); setActiveDropdown(null); }}
                  className="px-3 py-2 text-sm text-foreground/85 hover:bg-gray-light rounded-lg cursor-pointer transition font-medium"
                >
                  {t("allSizes")}
                </div>
                  {availableSizes.map((s) => (
                    <div
                      key={s}
                      onClick={() => { setSelectedSize(s); setActiveDropdown(null); }}
                      className={`px-3 py-2 text-sm hover:bg-gray-light rounded-lg cursor-pointer transition ${selectedSize === s ? "text-primary font-semibold bg-primary/5" : "text-foreground/80"
                        }`}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Color Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "Color" ? null : "Color")}
                className={`flex items-center justify-between gap-2 rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground/80 cursor-pointer hover:bg-gray-light border border-stroke transition ${selectedColor ? "border-primary text-primary" : ""
                }`}
            >
              {selectedColor ? `${t("color")}: ${selectedColor}` : t("color")}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {activeDropdown === "Color" && (
              <div className="absolute top-full left-0 mt-1 z-40 min-w-[140px] rounded-xl bg-card border border-stroke shadow-lg p-2 max-h-60 overflow-y-auto">
                <div
                  onClick={() => { setSelectedColor(null); setActiveDropdown(null); }}
                  className="px-3 py-2 text-sm text-foreground/85 hover:bg-gray-light rounded-lg cursor-pointer transition font-medium"
                >
                  {t("allColors")}
                </div>
                  {availableColors.map((c) => (
                    <div
                      key={c}
                      onClick={() => { setSelectedColor(c); setActiveDropdown(null); }}
                      className={`px-3 py-2 text-sm hover:bg-gray-light rounded-lg cursor-pointer transition ${selectedColor === c ? "text-primary font-semibold bg-primary/5" : "text-foreground/80"
                        }`}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Sort Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "Price" ? null : "Price")}
                className={`flex items-center justify-between gap-2 rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground/80 cursor-pointer hover:bg-gray-light border border-stroke transition ${selectedPriceSort ? "border-primary text-primary" : ""
                }`}
            >
              {selectedPriceSort ? priceSortOptions.find(o => o.value === selectedPriceSort)?.label : t("priceLabel")}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {activeDropdown === "Price" && (
              <div className="absolute top-full left-0 mt-1 z-40 min-w-[160px] rounded-xl bg-card border border-stroke shadow-lg p-2">
                <div
                  onClick={() => { setSelectedPriceSort(null); setActiveDropdown(null); }}
                  className="px-3 py-2 text-sm text-foreground/85 hover:bg-gray-light rounded-lg cursor-pointer transition font-medium"
                >
                  {t("defaultPriceSort")}
                </div>
                  {priceSortOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => { setSelectedPriceSort(opt.value); setActiveDropdown(null); }}
                      className={`px-3 py-2 text-sm hover:bg-gray-light rounded-lg cursor-pointer transition ${selectedPriceSort === opt.value ? "text-primary font-semibold bg-primary/5" : "text-foreground/80"
                        }`}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reset Filters Option */}
            {(selectedCategory || selectedSize || selectedColor || selectedPriceSort) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSize(null);
                  setSelectedColor(null);
                  setSelectedPriceSort(null);
                }}
                className="text-xs font-semibold text-primary hover:underline ml-2 cursor-pointer"
              >
                {t("clearFilters")}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-8 mt-2">
        {filteredProducts.length === 0 ? (
          <p className="font-['Montserrat'] text-lg text-gray-text py-8">{t("noRecommendedProducts")}</p>
        ) : (
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const firstColor = product.colors?.[0];
              const imageSrc =
                firstColor?.images?.[0]?.url ||
                firstColor?.images?.[0]?.imageUrl ||
                product.images?.[0]?.url ||
                "";
              const sizesList = firstColor?.variants || [];
              const sizeLabel =
                sizesList
                  .map((s) => s.size)
                  .filter(Boolean)
                  .join("-") || "Default";

              return (
                <ProductCard
                  key={product.id}
                  productId={product.id}
                  title={product.name}
                  subtitle={product.description || "High-end product tailored for you"}
                  price={`${product.shopPrice ?? product.wholesalePrice ?? product.retailPrice ?? product.blankPrice ?? product.price ?? 0} ${t("egp")}`}
                  imageSrc={imageSrc}
                  sizeLabel={sizeLabel}
                  colors={
                    product.colors
                      ?.map((c: ProductColor & { colorHex?: string }) => c.colorHex || c.colorCode || c.color || c.colorName)
                      .filter(Boolean) || []
                  }
                  rating={product.rating || 4.5}
                  to={`/product-details/${product.id}`}
                />
              );
            })}
          </div>
        )}
        <button
          onClick={() => navigate(`/products?category=${encodeURIComponent("kids")}`)}
          className="mt-2 rounded-md border border-primary px-8 py-2 text-sm font-bold text-primary hover:bg-primary-tint transition"
        >
          {t("viewMore")}
        </button>
      </div>
    </section>
  );
}