import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";
import { useRecommendationStore } from "../store/useRecommendationStore";

import { useProduct } from "../hooks/queries/productsQuery";
import { useParams } from "react-router-dom";
import { ProductGallery } from "../components/product/ProductGallery";
import { ProductInfoPanel } from "../components/product/ProductInfoPanel";
import { ReviewsSection } from "../components/product/ReviewsSection";

import { RecommedProducts } from "../components/product/recommedProducts";
import { useReviews } from "../hooks/queries/reviewQuery";
import type { DetailItem } from "../types/DetailItem";

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const { data: product, isPending, isError } = useProduct(id);
  const { data: reviews = [] } = useReviews(id);
  const addSignal = useRecommendationStore((s) => s.addSignal);

  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (product && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0].color);
    }
  }, [product, selectedColor]);

  useEffect(() => {
    if (product) {
      addSignal(product.id, product.categoryId, "view");
    }
  }, [product?.id]);

  if (!isAuthenticated || !user) {
    return null;
  }
  if (isPending) return <div className="p-10 text-center">Loading...</div>;
  if (isError || !product)
    return <div className="p-10 text-center">Product not found.</div>;

  const item: DetailItem = {
    ...product,
    brandName: product.brand?.name ?? null,
    sizeguide: product.sizeguide,
  };

  return (
    <div className="w-full bg-background">
      <div className="mx-auto flex w-full max-w-[1428px] flex-col gap-12 px-4 py-6 sm:px-6 sm:py-8 lg:gap-20 lg:px-8 lg:py-10">
        <div className="font-['Montserrat'] text-sm font-normal text-gray-text sm:text-base">
          Home / {product.category.name} / {product.name}
        </div>

        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <ProductGallery selectedColor={selectedColor} item={item} />

          <ProductInfoPanel
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            item={item}
            reviewCount={reviews.length}
          />
        </div>
        <ReviewsSection />
        <RecommedProducts currentProductId={product.id} currentCategoryId={product.categoryId} />
      </div>
    </div>
  );
}
