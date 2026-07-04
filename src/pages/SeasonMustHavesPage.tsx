import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ProductCard, CatalogFilters } from "../components/shared";
import { useProducts } from "../hooks/queries/productsQuery";

export default function SeasonMustHavesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { data: products, isLoading, isError } = useProducts();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-gray-text">
        Something went wrong. Please try again later.
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="w-full font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        This Season’s Must-Haves
      </div>

      <div className="mt-8 w-full">
        <CatalogFilters />
      </div>
      {isLoading && (
        <div className="mt-8 w-full py-2 text-gray-text text-center">
          Loading...
        </div>
      )}
      {isError && (
        <div className="mt-8 w-full py-2 text-gray-text text-center">
          Something went wrong. Please try again later.
        </div>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {products?.map((product) => ( 
          <ProductCard
            key={product.id}
            title={product.name}
            price={`$${product.price}`}
            imageSrc={product.images[0]?.url}
            sizeLabel={product.sizes.map((size) => size.size).join(" - ")}
            featured={product.rating >= 4}
            rating={product.rating}
            to={`/product-details/${product.id}`}
          />
        ))}
      </div>
    </div>
  );
}
