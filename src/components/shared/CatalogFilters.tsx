import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { ChevronDown } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────

type IdName = { id: string; name: string };

type DropdownFilterKey = "category" | "size" | "color" | "price" | "brand";

/** Values emitted by the dropdown-style filters (category / size / color / price). */
export type DropdownFilterValues = {
  category: string | null;
  size: string | null;
  color: string | null;
  price: string | null;
  brand: string | null;
  search: string;
};

type CatalogFiltersProps = {
  className?: string;

  /** Debounced search callback (500 ms). */
  onSearchChange?: (value: string) => void;

  // ── Select-based filters (SeasonMustHaves / MenCollection style) ──

  /** Sort select – only rendered when provided. */
  sortBy?: "name" | "price" | "rating";
  onSortChange?: (value: "name" | "price" | "rating") => void;

  /** Category select – only rendered when `categories` is provided. */
  categoryId?: string;
  onCategoryChange?: (value: string) => void;
  categories?: IdName[];

  /** Brand select – only rendered when `brands` is provided. */
  brandId?: string;
  onBrandChange?: (value: string) => void;
  brands?: IdName[];

  // ── Dropdown-pill filters (HomePage / Wholesale style) ─────────────

  /** Which dropdown pills to show and their options. Only provided keys are rendered. */
  dropdownFilters?: Partial<Record<DropdownFilterKey, string[]>>;
  /** Called whenever any dropdown pill or the search input changes. */
  onDropdownFilterChange?: (values: DropdownFilterValues) => void;
};

// ── Sub-components ─────────────────────────────────────────────────────

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-44 items-center justify-between rounded-2xl bg-[#EDEDED] p-4"
      >
        <div className="font-['Montserrat'] text-xl font-medium text-[#6B7280]">
          {value ?? label}
        </div>
        <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white">
          <ChevronDown
            className={`h-5 w-5 text-[#6B7280] transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-[calc(100%+8px)] z-20 flex min-w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
            {value !== null && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="whitespace-nowrap px-4 py-3 text-left font-['Montserrat'] text-lg font-medium text-[#6B7280] hover:bg-[#EDEDED]"
              >
                Clear
              </button>
            )}
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`whitespace-nowrap px-4 py-3 text-left font-['Montserrat'] text-lg font-medium hover:bg-[#EDEDED] ${
                  value === option ? "text-[#1A1A1A]" : "text-[#6B7280]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────

export default function CatalogFilters({
  className = "",
  onSearchChange,
  sortBy,
  onSortChange,
  categoryId,
  onCategoryChange,
  categories,
  brandId,
  onBrandChange,
  brands,
  dropdownFilters,
  onDropdownFilterChange,
}: CatalogFiltersProps) {
  const [searchValue, setSearchValue] = useState("");

  // Dropdown pill state
  const [ddCategory, setDdCategory] = useState<string | null>(null);
  const [ddSize, setDdSize] = useState<string | null>(null);
  const [ddColor, setDdColor] = useState<string | null>(null);
  const [ddPrice, setDdPrice] = useState<string | null>(null);
  const [ddBrand, setDdBrand] = useState<string | null>(null);

  // Debounced search for select-style mode
  useEffect(() => {
    if (!onSearchChange) return;
    const timer = setTimeout(() => onSearchChange(searchValue), 500);
    return () => clearTimeout(timer);
  }, [searchValue, onSearchChange]);

  // Notify dropdown filter changes
  const notifyDropdown = (updates: Partial<DropdownFilterValues>) => {
    const values: DropdownFilterValues = {
      category: ddCategory,
      size: ddSize,
      color: ddColor,
      price: ddPrice,
      brand: ddBrand,
      search: searchValue,
      ...updates,
    };
    onDropdownFilterChange?.(values);
  };

  const hasSelectFilters = sortBy !== undefined || categories || brands;
  const hasDropdownFilters = dropdownFilters && Object.keys(dropdownFilters).length > 0;

  return (
    <div className={`flex w-full flex-col items-start justify-start gap-4 ${className}`}>
      <div className="font-['Montserrat'] text-2xl font-bold text-[#1A1A1A]">
        Filter by
      </div>

      <div className="inline-flex w-full flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-start gap-3">
          {/* Select-based filters */}
          {hasSelectFilters && (
            <>
              {sortBy !== undefined && onSortChange && (
                <select
                  value={sortBy}
                  onChange={(e) =>
                    onSortChange(e.target.value as "name" | "price" | "rating")
                  }
                  className="rounded-2xl bg-[#EDEDED] px-5 py-4 text-lg outline-none"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="rating">Sort by Rating</option>
                </select>
              )}

              {categories && onCategoryChange && (
                <select
                  value={categoryId ?? ""}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="rounded-2xl bg-[#EDEDED] px-5 py-4 text-lg outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}

              {brands && onBrandChange && (
                <select
                  value={brandId ?? ""}
                  onChange={(e) => onBrandChange(e.target.value)}
                  className="rounded-2xl bg-[#EDEDED] px-5 py-4 text-lg outline-none"
                >
                  <option value="">All Brands</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}

          {/* Dropdown-pill filters */}
          {hasDropdownFilters && (
            <>
              {dropdownFilters.category && (
                <FilterDropdown
                  label="Category"
                  options={dropdownFilters.category}
                  value={ddCategory}
                  onChange={(v) => {
                    setDdCategory(v);
                    notifyDropdown({ category: v });
                  }}
                />
              )}
              {dropdownFilters.size && (
                <FilterDropdown
                  label="Size"
                  options={dropdownFilters.size}
                  value={ddSize}
                  onChange={(v) => {
                    setDdSize(v);
                    notifyDropdown({ size: v });
                  }}
                />
              )}
              {dropdownFilters.color && (
                <FilterDropdown
                  label="Color"
                  options={dropdownFilters.color}
                  value={ddColor}
                  onChange={(v) => {
                    setDdColor(v);
                    notifyDropdown({ color: v });
                  }}
                />
              )}
              {dropdownFilters.price && (
                <FilterDropdown
                  label="Price"
                  options={dropdownFilters.price}
                  value={ddPrice}
                  onChange={(v) => {
                    setDdPrice(v);
                    notifyDropdown({ price: v });
                  }}
                />
              )}
              {dropdownFilters.brand && (
                <FilterDropdown
                  label="Brand"
                  options={dropdownFilters.brand}
                  value={ddBrand}
                  onChange={(v) => {
                    setDdBrand(v);
                    notifyDropdown({ brand: v });
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* Search bar */}
        <div className="flex w-full items-center rounded-2xl bg-[#EDEDED] px-4 py-3 sm:w-96">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (hasDropdownFilters) {
                notifyDropdown({ search: e.target.value });
              }
            }}
            placeholder="Search..."
            className="min-w-0 flex-1 bg-transparent font-['Montserrat'] text-xl font-medium text-[#1A1A1A] placeholder:text-[#6B7280] focus:outline-none"
          />
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
            <CiSearch size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
