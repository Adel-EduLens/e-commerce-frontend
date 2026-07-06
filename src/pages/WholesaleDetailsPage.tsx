import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";
import { useRecommendationStore } from "../store/useRecommendationStore";
import { useWholesale } from "../hooks/queries/wholesaleQuery";
import { ProductGallery } from "../components/product/ProductGallery";
import { ProductInfoPanel } from "../components/product/ProductInfoPanel";
import { RecommedProducts } from "../components/product/recommedProducts";
import type { DetailItem } from "../types/DetailItem";

export default function WholesaleDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const { data: wholesale, isPending, isError } = useWholesale(id);
  const addSignal = useRecommendationStore((s) => s.addSignal);

  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (wholesale) {
      addSignal(wholesale.id, wholesale.categoryId, "view");
    }
  }, [wholesale?.id]);

  if (!isAuthenticated || !user) {
    return null;
  }
  if (isPending) return <div className="p-10 text-center">Loading...</div>;
  if (isError || !wholesale)
    return <div className="p-10 text-center">Wholesale product not found.</div>;

  const item: DetailItem = {
    ...wholesale,
    brandName: wholesale.brand ?? null,
    minOrder: wholesale.minOrder,
    colors: [],
    sizes: [],
  };

  return (
    <div className="w-full bg-background">
      <div className="mx-auto flex w-full max-w-[1428px] flex-col gap-12 px-4 py-6 sm:px-6 sm:py-8 lg:gap-20 lg:px-8 lg:py-10">
        <div className="font-['Montserrat'] text-sm font-normal text-gray-text sm:text-base">
          Home / Wholesale / {wholesale.category.name} / {wholesale.name}
        </div>

        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <ProductGallery selectedColor={selectedColor} item={item} />

          <ProductInfoPanel
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            item={item}
          />
        </div>
        <RecommedProducts currentProductId={wholesale.id} currentCategoryId={wholesale.categoryId} />
      </div>
    </div>
  );
}
