import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

// ── Types ──────────────────────────────────────────────────────────────

export type FilterConfig = {
  key: string;
  label: string;
  options: string[];
};

export type FilterValues = Record<string, string | null> & {
  search: string;
  priceMin: string | null;
  priceMax: string | null;
};

type CatalogFiltersProps = {
  className?: string;
  filters?: FilterConfig[];
  onFilterChange?: (values: FilterValues) => void;
};

// ── FilterDropdown ─────────────────────────────────────────────────────

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
  const { t } = useTranslation("filters");
  return (
    <div className="relative w-full sm:w-44">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-2xl bg-gray-light p-4"
      >
        <div className="truncate font-['Montserrat'] text-sm sm:text-base lg:text-xl font-medium text-gray-text">
          {value ?? t(label)}
        </div>
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
          <ChevronDown
            className={`h-5 w-5 text-gray-text transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {
        open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-[calc(100%+8px)] z-20 flex max-h-64 min-w-full flex-col overflow-y-auto overflow-x-hidden rounded-2xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
              {value !== null && (
                <button
                  type="button"
                  onClick={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                  className="whitespace-nowrap px-4 py-3 text-left font-['Montserrat'] text-lg font-medium text-gray-text hover:bg-gray-light"
                >
                  {t("Clear")}
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
                  className={`whitespace-nowrap px-4 py-3 text-left font-['Montserrat'] text-lg font-medium hover:bg-gray-light ${value === option ? "text-foreground" : "text-gray-text"
                    }`}
                >
                  {t(option)}
                </button>
              ))}
            </div>
          </>
        )
      }
    </div >
  );
}

// ── PriceRangeInput ────────────────────────────────────────────────────

function PriceRangeInput({
  min,
  max,
  onMinChange,
  onMaxChange,
}: {
  min: string;
  max: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}) {
  const { t } = useTranslation("filters");
  const inputClasses =
    "w-full bg-transparent font-['Montserrat'] text-sm sm:text-base lg:text-xl font-medium text-foreground placeholder:text-gray-text focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="col-span-2 grid grid-cols-2 gap-3 sm:col-span-1 sm:flex sm:w-auto">
      <div className="flex items-center rounded-2xl bg-gray-light px-4 py-4 sm:w-36">
        <input
          type="number"
          min={0}
          inputMode="numeric"
          value={min}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder={t("Min Price")}
          className={inputClasses}
        />
      </div>

      <div className="flex items-center rounded-2xl bg-gray-light px-4 py-4 sm:w-36">
        <input
          type="number"
          min={0}
          inputMode="numeric"
          value={max}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder={t("Max Price")}
          className={inputClasses}
        />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────

function buildInitialValues(filters: FilterConfig[]): FilterValues {
  const values: FilterValues = { search: "", priceMin: null, priceMax: null };
  if (!Array.isArray(filters)) return values;
  for (const f of filters) {
    values[f.key] = null;
  }
  return values;
}

export default function CatalogFilters({
  className = "",
  filters = [],
  onFilterChange,
}: CatalogFiltersProps) {
  const { t } = useTranslation("filters");
  const [values, setValues] = useState<FilterValues>(() =>
    buildInitialValues(filters),
  );

  const prevKeysRef = useRef("");
  const currentKeys = filters.map((f) => f.key).join(",");
  if (currentKeys !== prevKeysRef.current) {
    prevKeysRef.current = currentKeys;
  }

  // Debounced notification for free-typed fields (search + price)
  useEffect(() => {
    if (!onFilterChange) return;
    const timer = setTimeout(() => onFilterChange(values), 400);
    return () => clearTimeout(timer);
  }, [values.search, values.priceMin, values.priceMax]);

  const updateFilter = (key: string, value: string | null) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      onFilterChange?.(next);
      return next;
    });
  };

  const updateSearch = (value: string) => {
    setValues((prev) => ({ ...prev, search: value }));
  };

  // تعديل الـ Min ليمنع تخطي الـ Max
  const updatePriceMin = (value: string) => {
    setValues((prev) => {
      if (value !== "" && prev.priceMax !== null && Number(value) > Number(prev.priceMax)) {
        // إذا كان المدخل أكبر من الماكس الحالي، نجعل المين يساوي الماكس
        return { ...prev, priceMin: prev.priceMax };
      }
      return { ...prev, priceMin: value === "" ? null : value };
    });
  };

  // تعديل الـ Max ليمنع النزول عن الـ Min
  const updatePriceMax = (value: string) => {
    setValues((prev) => {
      if (value !== "" && prev.priceMin !== null && Number(value) < Number(prev.priceMin)) {
        // إذا كان المدخل أصغر من المين الحالي، نجعل الماكس يساوي المين
        return { ...prev, priceMax: prev.priceMin };
      }
      return { ...prev, priceMax: value === "" ? null : value };
    });
  };

  return (
    <div
      className={`flex w-full flex-col items-start justify-start gap-4 ${className}`}
    >

      <div className="font-['Montserrat'] text-2xl font-bold text-foreground">
        {t("Filter by")}
      </div>
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-start sm:w-auto">
          {Array.isArray(filters) && filters.map((filter) => (
            <FilterDropdown
              key={filter.key}
              label={filter.label}
              options={filter.options}
              value={values[filter.key] ?? null}
              onChange={(v) => updateFilter(filter.key, v)}
            />
          ))}

          <PriceRangeInput
            min={values.priceMin ?? ""}
            max={values.priceMax ?? ""}
            onMinChange={updatePriceMin}
            onMaxChange={updatePriceMax}
          />
        </div>

        {/* Search bar */}
        <div className="flex w-full items-center rounded-2xl bg-gray-light px-4 py-3 sm:w-80">
          <input
            type="text"
            value={values.search}
            onChange={(e) => updateSearch(e.target.value)}

            placeholder={t("Search")}
            className="min-w-0 flex-1 bg-transparent font-['Montserrat'] text-sm sm:text-base lg:text-xl font-medium text-foreground placeholder:text-gray-text focus:outline-none"
          />
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
            <CiSearch size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}