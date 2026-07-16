import { Link } from "react-router-dom";
import { useCategories, type Category } from "../../hooks/queries/categoriesQuery";
import { useRetailCategories } from "../../hooks/useRetailCategories";
import type { RetailCategory } from "../../types/retail";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslation } from "react-i18next";
interface CategoriesSectionProps {
  isWholesale?: boolean;
  isRetail?: boolean;
}

function CategoriesSection({ isWholesale = false, isRetail = false }: CategoriesSectionProps) {
  const { data: standardCategories = [], isLoading: isStandardLoading } = useCategories(isWholesale, { enabled: !isRetail });
  const { data: retailCategoriesResponse, isLoading: isRetailLoading } = useRetailCategories({ enabled: isRetail });
  const { t } = useTranslation("ui");
  const isCategoriesLoading = isRetail ? isRetailLoading : isStandardLoading;

  // Normalize retail categories response which might be wrapped
  let categories: (Category | RetailCategory)[] = standardCategories;
  if (isRetail) {
    categories = retailCategoriesResponse?.data || [];
  }

  return (
    <div className="mt-16 flex w-full flex-col items-center justify-start gap-10">
      <div className="self-stretch text-center font-['Montserrat'] text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground">
        {t("categoriesSection.title")}
      </div>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {isCategoriesLoading && (
          <LoadingSpinner containerClassName="py-20 col-span-1 sm:col-span-2 lg:col-span-3" />
        )}
        {!isCategoriesLoading &&
          categories
            .filter((category) => category.appearOnHome || isWholesale || isRetail)
            .map((category) => (
              <Link
                key={category.id}
                to={
                  isWholesale
                    ? `/wholesale?category=${category.name}`
                    : isRetail
                    ? `/retail/shop?category=${category.name}`
                    : `/products?category=${category.name}`
                }
                className="relative w-full overflow-hidden rounded-2xl bg-white no-underline aspect-[448/547]"
              >
                <img
                  alt={category.name}
                  src={category.image}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 sm:px-8 sm:py-3">
                  <div className="font-['Montserrat'] text-xl sm:text-2xl lg:text-4xl font-bold text-foreground whitespace-nowrap">
                    {category.name}
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}

export default CategoriesSection;
