import { Link } from "react-router-dom";
import { useCategories } from "../../hooks/queries/categoriesQuery";



function CategoriesSection() {
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories();

  return (
    <div className="mt-16 flex w-full flex-col items-center justify-start gap-10">
      <div className="self-stretch text-center font-['Montserrat'] text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground">
        Explore Our Categories
      </div>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {isCategoriesLoading && (
          <div className="flex items-center justify-center py-20 gap-3">
            loading...
          </div>
        )}
        {!isCategoriesLoading &&
          categories
            .filter((category) => category.appearOnHome)
            .map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.name}`}
                className="relative w-full overflow-hidden rounded-2xl bg-white no-underline aspect-[448/547]"
              >
                <img
                  src={category.image}
                  className="absolut e inset-0 h-full h-full w-full object-cover"
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
