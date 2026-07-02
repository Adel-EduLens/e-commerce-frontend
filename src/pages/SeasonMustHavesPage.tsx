import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ProductCard, CatalogFilters } from "../components/shared";

function ProductRow() {
  return (
    <div className="inline-flex w-full items-center justify-start gap-6">
      <ProductCard />
      <ProductCard featured />
      <ProductCard featured />
      <ProductCard />
    </div>
  );
}



export default function SeasonMustHavesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

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
      <div className="w-full font-[‘Montserrat’] text-8xl font-bold text-[#1A1A1A]">
        This Season’s Must-Haves
      </div>
      <div className="mt-8 w-full">
        <CatalogFilters />
      </div>
      <div className="mt-8 flex flex-col gap-6">
        <ProductRow />
        <ProductRow />
        <ProductRow />
      </div>
    </div>
  );
}
