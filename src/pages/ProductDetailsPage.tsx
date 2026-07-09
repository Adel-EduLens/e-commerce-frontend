import { useEffect, useState } from "react";

import { useAddSignalMutation } from "../hooks/queries/recommendQuery";
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
  const { mutate: addSignal } = useAddSignalMutation();
  const { mutate: addRecentlyViewed } = useAddRecentlyViewed();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const {t} = useTranslation("productDetails");

  // Initialize selected values on product load
  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      const firstColor = product.colors[0];
      setSelectedColor(firstColor.colorName || firstColor.color || "");
      
      const firstAvailableSize = firstColor.variants?.find((v: any) => v.quantity > 0)?.size || firstColor.variants?.[0]?.size || "";
      setSelectedSize(firstAvailableSize);

      const firstImage = firstColor.images?.[0]?.imageUrl || firstColor.images?.[0]?.url || "";
      setSelectedImage(firstImage);
      
      setQuantity(1);
    }
  }, [product]);

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    const colorObj = product?.colors?.find((c: any) => (c.colorName || c.color) === colorName);
    if (colorObj) {
      const firstAvailableSize = colorObj.variants?.find((v: any) => v.quantity > 0)?.size || colorObj.variants?.[0]?.size || "";
      setSelectedSize(firstAvailableSize);
      
      const firstImage = colorObj.images?.[0]?.imageUrl || colorObj.images?.[0]?.url || "";
      setSelectedImage(firstImage);
      
      setQuantity(1);
    }
  };

  useEffect(() => {
    if (product) {
      addSignal({ productId: product.id, categoryId: product.categoryId, type: "view" });
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
    images: product.colors?.flatMap((c: any) =>
      (c.images || []).map((img: any) => ({
        id: img.id,
        url: img.url || img.imageUrl || "",
        color: c.colorName || c.color || "",
      }))
    ) ?? [],
    colors: (product.colors || []).map((c: any) => ({
      id: c.id,
      color: c.colorName || c.color || "",
    })),
  };

  return (
    <div className="w-full bg-background">
      <div className="mx-auto flex w-full max-w-[1428px] flex-col gap-12 px-4 py-6 sm:px-6 sm:py-8 lg:gap-20 lg:px-8 lg:py-10">
        <div className="font-['Montserrat'] text-sm font-normal text-gray-text sm:text-base">
          {t("home")} / {product.category.name} / {product.name}
        </div>

        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <ProductGallery
            selectedColor={selectedColor}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            item={item}
          />

          <ProductInfoPanel
            selectedColor={selectedColor}
            onColorChange={handleColorChange}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
            item={item}
            reviewCount={reviews.length}
            rawProduct={product}
          />
        </div>
        <ReviewsSection />
        <RecommedProducts currentProductId={product.id} currentCategoryId={product.categoryId} />
      </div>
    </div>
  );
}
