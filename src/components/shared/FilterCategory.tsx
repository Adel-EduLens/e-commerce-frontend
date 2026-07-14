import React from "react";
import SidebarFilters from "./SidebarFilters";
import LoadingSpinner from "./LoadingSpinner";
import Pagination from "./Pagination";
import type { FilterValues, FilterConfig } from "./CatalogFilters";

interface FilterCategoryProps {
  filtersConfig?: FilterConfig[];
  initialValues: FilterValues;
  onFilterChange: (values: FilterValues) => void;
  isAnyLoading: boolean;
  combinedProducts: React.ReactNode[];
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  noProductsText?: string;
  loadingText?: string;
  availableSizes?: string[];
  isWholesale?: boolean;
}

const FilterCategory: React.FC<FilterCategoryProps> = ({

  filtersConfig,
  initialValues,
  onFilterChange,
  isAnyLoading,
  combinedProducts,
  totalPages = 1,
  availableSizes,
  isWholesale,
  currentPage = 1,
  onPageChange,
  noProductsText = "No products found.",
  loadingText = "Loading",
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <div className="w-full shrink-0 lg:w-64">
          <SidebarFilters
            filters={filtersConfig}
            initialValues={initialValues}
            onFilterChange={onFilterChange}
            availableSizes={availableSizes}
            isWholesale={isWholesale}
          />
        </div>

        {/* Main content */}
        <div className="flex-1">
          {isAnyLoading && (
            <LoadingSpinner containerClassName="py-12" text={loadingText} />
          )}

          {!isAnyLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {combinedProducts}
            </div>
          )}

          {!isAnyLoading && combinedProducts.length === 0 && (
            <div className="mt-20 text-center text-xl text-gray-500">
              {noProductsText}
            </div>
          )}

          {!isAnyLoading && totalPages > 1 && onPageChange && (
            <Pagination
              className="mt-12 mb-8"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterCategory;