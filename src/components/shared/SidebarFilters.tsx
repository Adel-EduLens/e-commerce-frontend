import { useEffect, useState } from "react";
import { SlidersHorizontal, ChevronRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type FilterValues, type FilterConfig } from "./CatalogFilters";
import { useCategories } from "../../hooks/queries/categoriesQuery";
import { useBrands } from "../../hooks/queries/brandsQuery";

type SidebarFiltersProps = {
  className?: string;
  filters?: FilterConfig[];
  initialValues?: Partial<FilterValues>;
  onFilterChange?: (values: FilterValues) => void;
  availableSizes?: string[];
  isWholesale?: boolean;
  isShop?: boolean;
  categories?: { id: string | number; name: string }[];
  brands?: { id: string | number; name: string }[];
};

const MAX_PRICE = 20000;

export default function SidebarFilters({
  className = "",
  initialValues,
  onFilterChange,
  availableSizes,
  isWholesale,
  isShop,
  categories: propCategories,
  brands: propBrands,
}: SidebarFiltersProps) {
  const { t } = useTranslation("sidebarFilter");
  const { data: defaultCategories = [] } = useCategories(
    isWholesale ? "WHOLESALE" : isShop ? "SHOP" : undefined
  );
  const { data: defaultBrands = [] } = useBrands();

  const categories = propCategories || defaultCategories;
  const brands = propBrands || defaultBrands;

  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [brandsOpen, setBrandsOpen] = useState(true);

  const [values, setValues] = useState<FilterValues>(() => {
    return {
      search: initialValues?.search ?? "",
      priceMin: initialValues?.priceMin ?? null,
      priceMax: initialValues?.priceMax ?? null,
      category: initialValues?.category ?? null,
      brand: initialValues?.brand ?? null,
      size: initialValues?.size ?? null,
      color: initialValues?.color ?? null,
      ...initialValues,
    } as FilterValues;
  });

  useEffect(() => {
    const func = async () => {
      if (initialValues) {
        setValues((prev) => {
          const next = { ...prev };
          let changed = false;

          for (const key of Object.keys(
            initialValues,
          ) as (keyof FilterValues)[]) {
            const value = initialValues[key];

            if (value !== undefined && value !== prev[key]) {
              next[key] = value;
              changed = true;
            }
          }

          return changed ? next : prev;
        });
      }
    };
    func();
  }, [initialValues]);

  // Debounced notification for filter changes
  useEffect(() => {
    if (!onFilterChange) return;
    const timer = setTimeout(() => onFilterChange(values), 400);
    return () => clearTimeout(timer);
  }, [values, onFilterChange]);

  const updateFilter = (key: string, value: string | null) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFilter = (key: string, value: string) => {
    setValues((prev) => {
      const prevVal = prev[key];
      const isSelected =
        typeof prevVal === "string"
          ? prevVal.toLowerCase() === value.toLowerCase()
          : prevVal === value;
      return { ...prev, [key]: isSelected ? null : value };
    });
  };

  const resetFilters = () => {
    setValues({
      search: "",
      priceMin: null,
      priceMax: null,
      category: null,
      brand: null,
      size: null,
      color: null,
    } as FilterValues);
  };

  const currentMin = Number(values.priceMin) || 0;
  const currentMax = Number(values.priceMax) || MAX_PRICE;
  const minPercent = (currentMin / MAX_PRICE) * 100;
  const maxPercent = (currentMax / MAX_PRICE) * 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), currentMax - 1);
    updateFilter("priceMin", value.toString());
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), currentMin + 1);
    updateFilter("priceMax", value.toString());
  };

  const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const sizesToDisplay = availableSizes ?? defaultSizes;
  const colors = [
    { name: "Black", hex: "#1a1a1a" },
    { name: "White", hex: "#ffffff" },
    { name: "Cream", hex: "#e5d9c5" },
    { name: "Red", hex: "#c1121f" },
    { name: "Blue", hex: "#2b4c7e" },
    { name: "Green", hex: "#4b6043" },
  ];

  return (
    <div
      className={`flex w-full flex-col font-['Montserrat'] p-2 rounded-sm border border-card-border text-foreground ${className}`}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-text">
          <SlidersHorizontal size={16} />
          {t("Filters")}
        </div>
        <button
          onClick={resetFilters}
          className="text-xs font-bold uppercase tracking-wider text-gray-text hover:text-foreground underline transition-colors"
        >
          {t("Reset all")}
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8 border-b border-stroke pb-8">
        <button
          onClick={() => setCategoriesOpen(!categoriesOpen)}
          className="mb-4 flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-text hover:text-foreground"
        >
          {t("Categories")}
          {categoriesOpen ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
        {categoriesOpen && (
          <div className="flex flex-col gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleFilter("category", cat.name)}
                className={`flex items-center justify-between text-sm font-medium transition-colors hover:text-foreground ${
                  values.category?.toLowerCase() === cat.name.toLowerCase()
                    ? "text-danger"
                    : "text-gray-text"
                }`}
              >
                {t(cat.name)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="mb-8 border-b border-stroke pb-8">
        <button
          onClick={() => setBrandsOpen(!brandsOpen)}
          className="mb-4 flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-text hover:text-foreground"
        >
          {t("Brands")}
          {brandsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {brandsOpen && (
          <div className="flex flex-col gap-3">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => toggleFilter("brand", brand.name)}
                className={`flex items-center justify-between text-sm font-medium transition-colors hover:text-foreground ${
                  values.brand?.toLowerCase() === brand.name.toLowerCase() ? "text-danger" : "text-gray-text"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-8 border-b border-stroke pb-8">
        <div className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-text">
          {t("Price Range")}
        </div>
        <div className="mb-4 flex items-center justify-between text-sm text-gray-text">
          <span>{currentMin} EGP</span>
          <span>{currentMax} EGP</span>
        </div>
        <div className="relative mt-2 h-1 w-full rounded-full bg-stroke">
          {/* Active track */}
          <div
            className="absolute h-full rounded-full bg-danger"
            style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
          />
          {/* Min Thumb */}
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            value={currentMin}
            onChange={handleMinChange}
            className="pointer-events-none absolute -top-[6px] w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-danger [&::-webkit-slider-thumb]:bg-background [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-danger [&::-moz-range-thumb]:bg-background"
          />
          {/* Max Thumb */}
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            value={currentMax}
            onChange={handleMaxChange}
            className="pointer-events-none absolute -top-[6px] w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-danger [&::-webkit-slider-thumb]:bg-background [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-danger [&::-moz-range-thumb]:bg-background"
          />
        </div>
      </div>

      {/* Size */}
      <div className="mb-8 border-b border-stroke pb-8">
        <div className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-text">
          {t("Size")}
        </div>
        <div className="flex flex-wrap gap-2">
          {sizesToDisplay.map((s) => (
            <button
              key={s}
              onClick={() => toggleFilter("size", s)}
              className={`flex h-8 min-w-[2rem] items-center justify-center rounded border px-2 text-xs font-medium transition-colors ${
                values.size?.toLowerCase() === s.toLowerCase()
                  ? "border-danger bg-danger text-white"
                  : "border-stroke text-gray-text hover:border-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <div className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-text">
          {t("Color")}
        </div>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => toggleFilter("color", c.name)}
              className={`flex h-6 w-6 items-center justify-center rounded-full transition-all border border-stroke ${
                values.color?.toLowerCase() === c.name.toLowerCase()
                  ? "ring-1 ring-foreground ring-offset-2 ring-offset-background"
                  : "hover:scale-110"
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
