import { ProductCard } from "../shared";
import { toast } from "sonner";

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
        <button
          type="button"
          onClick={() => toast.message("Coming soon")}
          className="inline-flex items-center justify-start gap-2 rounded-2xl bg-primary p-3 sm:p-4 cursor-pointer"
        >
          <div className="font-['Montserrat'] text-base font-semibold text-foreground sm:text-xl">
            View All
          </div>
        </button>
      </div>
    </section>
  );
}