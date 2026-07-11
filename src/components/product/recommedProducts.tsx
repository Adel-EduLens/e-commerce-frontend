import { useMemo, useState, useEffect, useRef } from "react";
import { ProductCard } from "../shared";

import { useProducts } from "../../hooks/queries/productsQuery";
import { useTopCategories } from "../../hooks/queries/recommendQuery";
import { useCategories } from "../../hooks/queries/categoriesQuery";
import { useAuthStore } from "../../store/useAuthStore";
import { ViewAllButton } from "../ui/ViewAllButton";
import { useNavigate } from "react-router-dom";

type RecommedProductsProps = {
  currentProductId?: string;
  currentCategoryId?: string;
};

export function RecommedProducts({
  currentProductId,
  currentCategoryId,
}: RecommedProductsProps) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  
  // 1. Get Top Categories from the user's Recommendation Model
  const { data: topCategories = [], isLoading: isTopCategoriesLoading } = useTopCategories(5);
  const { data: categories = [] } = useCategories();

  // 2. Fetch products to recommend
  const { data, isLoading: isProductsLoading } = useProducts({
    limit: 100,
    sortBy: "rating",
    sortOrder: "desc",
  });

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedPriceSort, setSelectedPriceSort] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  // 3. Filter products to match top categories from recommend model
  const baseRecommendedProducts = useMemo(() => {
    const all = data?.products ?? [];
    if (topCategories.length > 0) {
      return all.filter((p) => topCategories.includes(p.categoryId));
    }
    // Fallback: if no history or not logged in, recommend top rated products
    return all;
  }, [data, topCategories]);

  // 4. Calculate available option values dynamically based on baseRecommendedProducts
  const availableCategories = useMemo(() => {
    const categoryIds = Array.from(new Set(baseRecommendedProducts.map((p) => p.categoryId)));
    return categories.filter((c) => categoryIds.includes(c.id));
  }, [baseRecommendedProducts, categories]);

  const availableSizes = useMemo(() => {
    const sizesSet = new Set<string>();
    baseRecommendedProducts.forEach((p) => {
      p.colors?.forEach((c: any) => {
        c.variants?.forEach((v: any) => {
          if (v.size) sizesSet.add(v.size);
        });
      });
    });
    return Array.from(sizesSet);
  }, [baseRecommendedProducts]);

  const availableColors = useMemo(() => {
    const colorsSet = new Set<string>();
    baseRecommendedProducts.forEach((p) => {
      p.colors?.forEach((c: any) => {
        if (c.colorName) colorsSet.add(c.colorName);
      });
    });
    return Array.from(colorsSet);
  }, [baseRecommendedProducts]);

  const priceSortOptions = [
    { label: "Price: Low to High", value: "low-to-high" },
    { label: "Price: High to Low", value: "high-to-low" }
  ];

  // 5. Apply selected filters to the recommended list
  const filteredProducts = useMemo(() => {
    let result = [...baseRecommendedProducts];

    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }
    if (selectedSize) {
      result = result.filter((p) => 
        p.colors?.some((c: any) => c.variants?.some((v: any) => v.size === selectedSize && v.quantity > 0))
      );
    }
    if (selectedColor) {
      result = result.filter((p) => 
        p.colors?.some((c: any) => c.colorName.toLowerCase() === selectedColor.toLowerCase())
      );
    }
    if (selectedPriceSort) {
      if (selectedPriceSort === "low-to-high") {
        result.sort((a, b) => a.price - b.price);
      } else if (selectedPriceSort === "high-to-low") {
        result.sort((a, b) => b.price - a.price);
      }
    }

    return result
      .filter((p) => p.id !== currentProductId)
      .slice(0, 4);
  }, [baseRecommendedProducts, selectedCategory, selectedSize, selectedColor, selectedPriceSort, currentProductId]);

  const isLoading = isProductsLoading || (isAuthenticated && isTopCategoriesLoading);

  if (isLoading) {
    return (
      <section className="flex flex-col items-center justify-start gap-6 sm:gap-10">
        <h2 className="w-full font-['Montserrat'] text-xl font-bold text-foreground md:text-3xl sm:text-5xl">
          Recommended for You
        </h2>
        <p className="font-['Montserrat'] text-lg text-gray-text">Loading...</p>
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
          Recommended for You
        </h2>
        <div className="mt-4 flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground/80">Filter by</span>
          <div ref={dropdownRef} className="flex flex-wrap items-center gap-3 relative z-30">
            {/* Category Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "Category" ? null : "Category")}
                className={`flex items-center justify-between gap-2 rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground/80 cursor-pointer hover:bg-gray-light border border-stroke transition ${
                  selectedCategory ? "border-primary text-primary" : ""
                }`}
              >
                {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "Category"}
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
                    All Categories
                  </div>
                  {availableCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setActiveDropdown(null); }}
                      className={`px-3 py-2 text-sm hover:bg-gray-light rounded-lg cursor-pointer transition ${
                        selectedCategory === cat.id ? "text-primary font-semibold bg-primary/5" : "text-foreground/80"
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
                className={`flex items-center justify-between gap-2 rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground/80 cursor-pointer hover:bg-gray-light border border-stroke transition ${
                  selectedSize ? "border-primary text-primary" : ""
                }`}
              >
                {selectedSize ? `Size: ${selectedSize}` : "Size"}
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
                    All Sizes
                  </div>
                  {availableSizes.map((s) => (
                    <div
                      key={s}
                      onClick={() => { setSelectedSize(s); setActiveDropdown(null); }}
                      className={`px-3 py-2 text-sm hover:bg-gray-light rounded-lg cursor-pointer transition ${
                        selectedSize === s ? "text-primary font-semibold bg-primary/5" : "text-foreground/80"
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
                className={`flex items-center justify-between gap-2 rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground/80 cursor-pointer hover:bg-gray-light border border-stroke transition ${
                  selectedColor ? "border-primary text-primary" : ""
                }`}
              >
                {selectedColor ? `Color: ${selectedColor}` : "Color"}
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
                    All Colors
                  </div>
                  {availableColors.map((c) => (
                    <div
                      key={c}
                      onClick={() => { setSelectedColor(c); setActiveDropdown(null); }}
                      className={`px-3 py-2 text-sm hover:bg-gray-light rounded-lg cursor-pointer transition ${
                        selectedColor === c ? "text-primary font-semibold bg-primary/5" : "text-foreground/80"
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
                className={`flex items-center justify-between gap-2 rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground/80 cursor-pointer hover:bg-gray-light border border-stroke transition ${
                  selectedPriceSort ? "border-primary text-primary" : ""
                }`}
              >
                {selectedPriceSort ? priceSortOptions.find(o => o.value === selectedPriceSort)?.label : "Price"}
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
                    Default
                  </div>
                  {priceSortOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => { setSelectedPriceSort(opt.value); setActiveDropdown(null); }}
                      className={`px-3 py-2 text-sm hover:bg-gray-light rounded-lg cursor-pointer transition ${
                        selectedPriceSort === opt.value ? "text-primary font-semibold bg-primary/5" : "text-foreground/80"
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
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-8 mt-2">
        {filteredProducts.length === 0 ? (
          <p className="font-['Montserrat'] text-lg text-gray-text py-8">No recommended products match these filters.</p>
        ) : (
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const firstColor = product.colors?.[0];
              const imageSrc = firstColor?.images?.[0]?.url || firstColor?.images?.[0]?.imageUrl || product.images?.[0]?.url || "";
              const sizesList = firstColor?.variants || [];
              const sizeLabel = sizesList.map((s: any) => s.size).filter(Boolean).join("-") || "Default";

              return (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-stroke bg-card shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-light cursor-pointer" onClick={() => navigate(`/product-details/${product.id}`)}>
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="h-full w-full object-cover mix-blend-multiply"
                    />
                    {/* Heart Icon */}
                    <button
                      type="button"
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:scale-105 transition"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col p-4 flex-1">
                    <h3 className="text-base font-semibold text-foreground line-clamp-1 cursor-pointer hover:text-primary transition" onClick={() => navigate(`/product-details/${product.id}`)}>
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-text line-clamp-2">
                      {product.description || "High-end product tailored for you"}
                    </p>

                    <div className="mt-3 flex items-end justify-between">
                      <span className="rounded border border-stroke px-2 py-0.5 text-[10px] font-medium text-foreground/80">
                        {sizeLabel}
                      </span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-lg font-bold text-primary">{product.price}</span>
                        <span className="text-xs font-semibold text-primary">EGP</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/product-details/${product.id}`)}
                      className="mt-4 w-full rounded-md bg-primary py-2 text-sm font-bold text-white hover:bg-primary-pressed transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <button
          onClick={() => navigate(`/products?category=${encodeURIComponent("kids")}`)}
          className="mt-2 rounded-md border border-primary px-8 py-2 text-sm font-bold text-primary hover:bg-primary-tint transition"
        >
          View More
        </button>
      </div>
    </section>
  );
}