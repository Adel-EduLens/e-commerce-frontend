import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { ChevronDown } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────

type DropdownFilterKey = "category" | "size" | "color" | "price" | "brand";

/** Values emitted by the dropdown-style filters. */
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

  // Debounced search
  useEffect(() => {
    if (!onDropdownFilterChange) return;
    const timer = setTimeout(() => {
      onDropdownFilterChange({
        category: ddCategory,
        size: ddSize,
        color: ddColor,
        price: ddPrice,
        brand: ddBrand,
        search: searchValue,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

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

  const hasDropdownFilters = dropdownFilters && Object.keys(dropdownFilters).length > 0;

  return (
    <div className={`flex w-full flex-col items-start justify-start gap-4 ${className}`}>
      <div className="font-['Montserrat'] text-2xl font-bold text-[#1A1A1A]">
        Filter by
      </div>

      <div className="inline-flex w-full flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-start gap-3">
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
              if (!onDropdownFilterChange) return;
              // Immediate notify for dropdown mode (debounce handled above for search-only)
              notifyDropdown({ search: e.target.value });
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
