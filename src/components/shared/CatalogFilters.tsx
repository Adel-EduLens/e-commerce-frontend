import type { ChangeEvent } from "react";
import { CiSearch } from "react-icons/ci";
import { useEffect, useState } from "react";
type Category = {
  id: string;
  name: string;
};

type Brand = {
  id: string;
  name: string;
};

type CatalogFiltersProps = {
  className?: string;

  onSearchChange: (value: string) => void;

  sortBy: "name" | "price" | "rating";
  onSortChange: (value: "name" | "price" | "rating") => void;

  categoryId: string;
  onCategoryChange: (value: string) => void;
  categories: Category[];

  brandId: string;
  onBrandChange: (value: string) => void;
  brands: Brand[];
};

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
}: CatalogFiltersProps) {
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(inputValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue, onSearchChange]);

  return (
    <div className={`flex flex-col gap-5 ${className}` }>
      <h2 className="font-['Montserrat'] text-2xl font-bold text-[#1A1A1A] sm:text-3xl">
        Filter Products
      </h2>

      <div className="flex flex-col flex-wrap items-stretch gap-4 sm:flex-row sm:items-center">
        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onSortChange(e.target.value as "name" | "price" | "rating")
          }
          className="w-full rounded-2xl bg-[#EDEDED] px-5 py-4 text-lg outline-none sm:w-auto"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
        </select>

        {/* Category */}
        <select
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-2xl bg-[#EDEDED] px-5 py-4 text-lg outline-none sm:w-auto"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {/* Brand */}
        <select
          value={brandId}
          onChange={(e) => onBrandChange(e.target.value)}
          className="w-full rounded-2xl bg-[#EDEDED] px-5 py-4 text-lg outline-none sm:w-auto"
        >
          <option value="">All Brands</option>

          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="flex w-full items-center rounded-2xl bg-[#EDEDED] px-4 py-3 sm:ml-auto sm:w-96">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by name or category..."
            className="min-w-0 flex-1 bg-transparent text-lg outline-none"
          />

          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white flex items-center justify-center">
            <CiSearch size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}