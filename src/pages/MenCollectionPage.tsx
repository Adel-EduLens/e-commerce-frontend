import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CatalogFilters, Footer, Navbar, ProductCard } from "../components/shared";
import { useAuthStore } from "../store/useAuthStore";

const productRows = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
];

const featuredIndexes = new Set([2, 6, 10, 14]);

function ProductRow({ top, indexes }: { top: number; indexes: number[] }) {
  return (
    <div
      className="absolute left-[24px] inline-flex w-[1392px] items-center justify-start gap-6"
      style={{ top }}
    >
      {indexes.map((index) => (
        <ProductCard
          key={index}
          title="Amber Blaze Classic Tee"
          sizeLabel="Min.order: 50 pieces"
          price="$250-450"
          featured={featuredIndexes.has(index)}
          accentClassName="bg-[#BBFF63]"
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
    <div className="min-h-screen w-full bg-[#F9FAFB]">
      <div className="relative mx-auto h-[2520px] w-[1440px] overflow-hidden bg-[#F9FAFB]">
        <Navbar />
        <div className="absolute left-[24px] top-[122px] w-[909px] font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
          {categoryTitle}
        </div>
        <div className="absolute left-[24px] top-[220px] w-[1392px]">
          <CatalogFilters />
        </div>
        <ProductRow top={376} indexes={productRows[0]} />
        <ProductRow top={801} indexes={productRows[1]} />
        <ProductRow top={1226} indexes={productRows[2]} />
        <ProductRow top={1651} indexes={productRows[3]} />
        <Footer top="top-[2124px]" />
      </div>
    </div>
  );
}
