import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { ChevronDown } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────

export type FilterConfig = {
  key: string;
  label: string;
  options: string[];
};

export type FilterValues = Record<string, string | null> & { search: string };

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

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-44 items-center justify-between rounded-2xl bg-[#EDEDED] p-4"
      >
        <div className="truncate font-['Montserrat'] text-xl font-medium text-[#6B7280]">
          {value ?? label}
        </div>
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
          <ChevronDown
            className={`h-5 w-5 text-[#6B7280] transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
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

function buildInitialValues(filters: FilterConfig[]): FilterValues {
  const values: FilterValues = { search: "" };
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
  const [values, setValues] = useState<FilterValues>(() =>
    buildInitialValues(filters),
  );

  // Reset state when filter config changes (e.g. new keys from API)
  const prevKeysRef = useRef("");
  const currentKeys = filters.map((f) => f.key).join(",");
  if (currentKeys !== prevKeysRef.current) {
    prevKeysRef.current = currentKeys;
  }

  // Debounced search notification
  useEffect(() => {
    if (!onFilterChange) return;
    const timer = setTimeout(() => onFilterChange(values), 400);
    return () => clearTimeout(timer);
  }, [values.search]);

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

  return (
    <div
      className={`flex w-full flex-col items-start justify-start gap-4 ${className}`}
    >
      <div className="font-['Montserrat'] text-2xl font-bold text-[#1A1A1A]">
        Filter by
      </div>

      <div className="inline-flex w-full flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-start gap-3">
          {filters.map((filter) => (
            <FilterDropdown
              key={filter.key}
              label={filter.label}
              options={filter.options}
              value={values[filter.key] ?? null}
              onChange={(v) => updateFilter(filter.key, v)}
            />
          ))}
        </div>

        {/* Search bar */}
        <div className="flex w-full items-center rounded-2xl bg-[#EDEDED] px-4 py-3 sm:w-96">
          <input
            type="text"
            value={values.search}
            onChange={(e) => updateSearch(e.target.value)}
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
