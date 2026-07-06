import { ProductCard } from "../shared";

import { ViewAllButton } from "../ui/ViewAllButton";

export function RecommedProducts() {
  return (
    <section className="flex  flex-col items-center justify-start gap-6 sm:gap-10">
      <h2 className="w-full font-['Montserrat'] text-xl md:text-3xl font-bold text-foreground sm:text-5xl">
        Recommended for You
      </h2>
      <div className="flex w-full flex-col items-center justify-center gap-6 sm:gap-8">
        <div className="grid w-full grid-cols-1 items-start gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          <ProductCard />
          <ProductCard featured />
          <ProductCard featured />
          <ProductCard />
        </div>
        <ViewAllButton />
      </div>
    </section>
  );
}