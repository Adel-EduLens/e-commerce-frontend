import { useEffect, useState } from "react";

import { useRecommendationStore } from "../store/useRecommendationStore";
import { useAddRecentlyViewed } from "../hooks/useRecentlyViewed";

import { useProduct } from "../hooks/queries/productsQuery";
import { useParams } from "react-router-dom";
import { ProductGallery } from "../components/product/ProductGallery";
import { ProductInfoPanel } from "../components/product/ProductInfoPanel";
import { ReviewsSection } from "../components/product/ReviewsSection";
import { RecommedProducts } from "../components/product/recommedProducts";
import { useReviews } from "../hooks/queries/reviewQuery";
import type { DetailItem } from "../types/DetailItem";
import { useTranslation } from "react-i18next";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data: product, isPending, isError } = useProduct(id);
  const { data: reviews = [] } = useReviews(id);
  const addSignal = useRecommendationStore((s) => s.addSignal);
  const { mutate: addRecentlyViewed } = useAddRecentlyViewed();

  const [selectedColor, setSelectedColor] = useState("");

  const {t} = useTranslation("productDetails");


  useEffect(() => {
    const func = ()=>{
      if (product && product.colors.length > 0 && !selectedColor) {
        setSelectedColor(product.colors[0].color);
      }
    }
    func()
  }, [product, selectedColor]);

  useEffect(() => {
    if (product) {
      addSignal(product.id, product.categoryId, "view");
      addRecentlyViewed({ productType: "SHOP", productId: product.id });
    }
  }, [addSignal, product, product?.id, addRecentlyViewed]);


  if (isPending) return <div className="p-10 text-center">{t("loading")}</div>;
  if (isError || !product)
    return <div className="p-10 text-center">{t("productNotFound")}</div>;

  const item: DetailItem = {
    ...product,
    brandName: product.brand?.name ?? null,
    sizeguide: product.sizeguide,
  };

  return (
    <div className="w-full bg-background">
      <div className="mx-auto flex w-full max-w-[1428px] flex-col gap-12 px-4 py-6 sm:px-6 sm:py-8 lg:gap-20 lg:px-8 lg:py-10">
        <div className="font-['Montserrat'] text-sm font-normal text-gray-text sm:text-base">
          {t("home")} / {product.category.name} / {product.name}
        </div>

        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
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
