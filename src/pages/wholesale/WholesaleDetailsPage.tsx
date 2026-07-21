import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "../../store/useAuthStore";
import { useAddSignalMutation } from "../../hooks/queries/recommendQuery";
import { useWholesale } from "../../hooks/queries/wholesaleQuery";
import { ProductGallery } from "../../components/product/ProductGallery";
import { ProductInfoPanel } from "../../components/product/ProductInfoPanel";
import { RecommedProducts } from "../../components/product/recommedProducts";
import type { DetailItem } from "../../types/DetailItem";
import { useAddRecentlyViewed } from "../../hooks/useRecentlyViewed";

export default function WholesaleDetailsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation("productDetails");
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const { data: wholesale, isLoading: isPending, isError } = useWholesale(id);
  const { mutate: addSignal } = useAddSignalMutation();
  const { mutate: addRecentlyViewed } = useAddRecentlyViewed();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Track recently viewed wholesale product
  useEffect(() => {
    if (wholesale && wholesale.id) {
      addRecentlyViewed({ productType: "WHOLESALE", productId: wholesale.id });
    }
  }, [wholesale, wholesale?.id, addRecentlyViewed]);

  // Initialize selected values on wholesale product load
  useEffect(() => {
    if (wholesale && wholesale.wholesaleColors && wholesale.wholesaleColors.length > 0) {
      const firstColor = wholesale.wholesaleColors[0];
      setSelectedColor(firstColor.color || "");

      const firstAvailableSize = firstColor.sizes?.[0]?.size || "";
      setSelectedSize(firstAvailableSize);

      const firstImage = wholesale.images?.[0]?.url || "";
      setSelectedImage(firstImage);

      setQuantity(wholesale.minOrder || 1);
    } else if (wholesale) {
      const firstImage = wholesale.images?.[0]?.url || "";
      setSelectedImage(firstImage);
      setQuantity(wholesale.minOrder || 1);
    }
  }, [wholesale]);

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    const colorObj = wholesale?.wholesaleColors?.find((c) => c.color === colorName);
    if (colorObj) {
      const firstAvailableSize = colorObj.sizes?.[0]?.size || "";
      setSelectedSize(firstAvailableSize);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }
  if (isPending) return <div className="p-10 text-center">{t("loading")}</div>;
  if (isError || !wholesale)
    return <div className="p-10 text-center">{t("wholesaleProductNotFound")}</div>;

  const item: DetailItem = {
    ...wholesale,
    price:
      wholesale.wholesalePrice ??
      wholesale.price ??
      wholesale.shopPrice ??
      wholesale.retailPrice ??
      wholesale.blankPrice ??
      0,
    brandName: typeof wholesale.brand === "string" ? wholesale.brand : wholesale.brand?.name ?? null,
    minOrder: wholesale.minOrder ?? 1,
    colors: (wholesale.wholesaleColors || []).map((wc) => ({ id: wc.id, color: wc.color })),
    sizes: Array.from(
      new Map(
        (wholesale.wholesaleColors || [])
          .flatMap((wc) => wc.sizes || [])
          .map((s) => [s.size, { id: s.id, size: s.size }])
      ).values()
    ),
  };

  return (
    <div className="w-full bg-background">
      <div className="mx-auto flex w-full max-w-[1428px] flex-col gap-12 px-4 py-6 sm:px-6 sm:py-8 lg:gap-20 lg:px-8 lg:py-10">
        <div className="font-['Montserrat'] text-sm font-normal text-gray-text sm:text-base">
          {t("home")} / {t("wholesale")} / {wholesale.category?.name} / {wholesale.name}
        </div>

        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
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
            productType="WHOLESALE"
            rawProduct={wholesale as unknown as Record<string, unknown>}
          />
        </div>
        <RecommedProducts currentProductId={wholesale.id} />
      </div>
    </div>
  );
}
