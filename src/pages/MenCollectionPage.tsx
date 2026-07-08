import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CatalogFilters, ProductCard } from "../components/shared";
import { useAuthStore } from "../store/useAuthStore";

const productRows = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
];

const featuredIndexes = new Set([2, 6, 10, 14]);

function ProductRow({ indexes }: { indexes: number[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {indexes.map((index) => (
        <ProductCard
          key={index}
          productId={`men-collection-${index}`}
          title="Amber Blaze Classic Tee"
          sizeLabel="Min.order: 50 pieces"
          price="$250-450"
          featured={featuredIndexes.has(index)}
          accentClassName="bg-primary"
        />
      ))}
    </div>
  );
}

export default function MenCollectionPage() {
  const navigate = useNavigate();
  const { category } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const categoryTitle =
    category === "kids" ? "Kids" : category === "women" ? "Women" : "Men";

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="w-full font-['Montserrat'] text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground">
        {categoryTitle}
      </div>
      <div className="mt-8 w-full">
        <CatalogFilters />
      </div>
      <div className="mt-8 flex flex-col gap-6">
        <ProductRow indexes={productRows[0]} />
        <ProductRow indexes={productRows[1]} />
        <ProductRow indexes={productRows[2]} />
        <ProductRow indexes={productRows[3]} />
      </div>
    </div>
  );
}
