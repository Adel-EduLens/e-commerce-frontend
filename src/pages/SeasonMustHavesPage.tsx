import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Navbar, Footer, ProductCard, CatalogFilters } from "../components/shared";

function ProductRow({ top }: { top: number }) {
  return (
    <div
      className="absolute left-[24px] inline-flex w-[1392px] flex-col items-start justify-start gap-6"
      style={{ top }}
    >
      <div className="self-stretch inline-flex items-center justify-start gap-6">
        <ProductCard />
        <ProductCard featured />
        <ProductCard featured />
        <ProductCard />
      </div>
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
    <div className="relative h-[2226px] mx-auto w-[1440px] overflow-hidden bg-[#F9FAFB]">
      
      <Navbar />
      <div className="absolute left-[24px] top-[122px] w-[909px] font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        This Season’s Must-Haves
      </div>
      <div className="absolute left-[24px] top-[396px] w-[1392px]">
        <CatalogFilters />
      </div>
      <ProductRow top={552} />
      <ProductRow top={977} />
      <ProductRow top={1402} />
      <Footer top="top-[1784px]" />
    </div>
  );
}
