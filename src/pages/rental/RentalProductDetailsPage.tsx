import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useProduct, type Product } from "../../hooks/queries/productsQuery";
import useRetailNotifyMe from "../../hooks/useRetailNotifyMe";
import { useAuthStore } from "../../store/useAuthStore";
import { useAddProductToCart } from "../../hooks/useCart";
import { useAddRecentlyViewed } from "../../hooks/useRecentlyViewed";
import { ProductGallery } from "../../components/product/ProductGallery";
import { ProductInfoPanel } from "../../components/product/ProductInfoPanel";
import { ReviewsSection } from "../../components/product/ReviewsSection";
import { useReviews } from "../../hooks/queries/reviewQuery";
import type { DetailItem } from "../../types/DetailItem";
import { useTranslation } from "react-i18next";

/** Safely convert a value to a finite number, defaulting to 0. */
function toNumber(value: string | number | null | undefined): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toDetailItem(product: Product): DetailItem {
  const images = product.images ?? [];
  const colors = product.colors ?? [];

  const allVariants = colors.flatMap(c => c.variants || []);
  const uniqueSizes = Array.from(new Map(allVariants.map(v => [v.size, { id: v.id, size: v.size }])).values());

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.rentalPrice ?? product.retailPrice ?? product.price ?? 0,
    rating: product.rating,
    averageRating: product.rating,
    discountPrice: product.flashDealPrice,
    brandName: product.brand?.name ?? null,
    stock: product.stock,

    categories: product.categories?.map((c: any) => ({ id: c.id, name: c.name })) || [],

    images: images.map((img: { id: string; url: string; color?: string }) => ({
      id: img.id,
      url: img.url,
      color: img.color ?? null,
    })),

    colors: colors.map((c) => ({
      id: c.id,
      color: c.colorName || c.color || "",
      colorHex: null,
    })),

    sizes: uniqueSizes,
  };
}

export default function RentalProductDetailsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id ?? "");
  const typedProduct = product as Product | null | undefined;
  const { data: reviews = [] } = useReviews(id ?? "");
  const { t } = useTranslation(["rentalDetailsPage", "retailDetailsPage"]);
  const notify = useRetailNotifyMe(user?.id);
  const addProductToCart = useAddProductToCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { mutate: addRecentlyViewed } = useAddRecentlyViewed();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Set initial rating and track recently viewed
  useEffect(() => {
    if (typedProduct) {
      addRecentlyViewed({ productType: "RENTAL", productId: typedProduct.id });
    }
  }, [
    typedProduct,
    typedProduct?.id,
    typedProduct?.userRating,
    typedProduct?.myRating,
    typedProduct?.rating,
    typedProduct?.averageRating,
    addRecentlyViewed,
  ]);

  // Initialize selections when product loads
  useEffect(() => {
    const func = () => {
      if (typedProduct) {
        const colors = typedProduct.colors ?? [];
        const images = typedProduct.images ?? [];
        
        const sizes = colors.flatMap(c => c.variants || []);

        if (colors.length > 0) {
          const firstColorName = colors[0].colorName || colors[0].color || "";
          setSelectedColor(firstColorName);

          const firstColorImg =
            images.find(
              (img) => img.color && firstColorName && img.color.toLowerCase() === firstColorName.toLowerCase(),
            )?.url ||
            colors[0].images?.[0]?.url ||
            colors[0].images?.[0]?.imageUrl ||
            images[0]?.url ||
            "";

          if (firstColorImg) {
            setSelectedImage(firstColorImg);
          }
        } else if (images.length > 0) {
          setSelectedImage(images[0].url);
        }

        if (sizes.length > 0) {
          setSelectedSize(sizes[0].size);
        }
        setQuantity(1);
      }
    };
    func();
  }, [typedProduct]);

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    const images = typedProduct?.images ?? [];
    const colors = typedProduct?.colors ?? [];
    const colorObj = colors.find(
      (c) => (c.colorName || c.color || "").toLowerCase() === colorName.toLowerCase(),
    );

    const colorImage =
      images.find(
        (img) => img.color && colorName && img.color.toLowerCase() === colorName.toLowerCase(),
      )?.url ||
      colorObj?.images?.[0]?.url ||
      (colorObj?.images?.[0] as any)?.imageUrl;

    if (colorImage) {
      setSelectedImage(colorImage);
    }
  };

  const handleAddToCart = () => {
    if (!typedProduct) return;

    const images = typedProduct.images ?? [];
    const colors = typedProduct.colors ?? [];
    const sizes = colors.flatMap(c => c.variants || []);
    const mainImage = images[0];

    const depositAmt = (typedProduct.depositAmount !== undefined && typedProduct.depositAmount !== null)
      ? toNumber(typedProduct.depositAmount)
      : undefined;
    const priceNumber = depositAmt ?? toNumber(typedProduct.rentalPrice ?? typedProduct.retailPrice ?? typedProduct.price);
    const discountNumber =
      typedProduct.flashDealPrice !== null &&
      typedProduct.flashDealPrice !== undefined
        ? toNumber(typedProduct.flashDealPrice)
        : undefined;
    const unitPrice =
      discountNumber && discountNumber < priceNumber
        ? discountNumber
        : priceNumber;

    const selectedColorObj = colors.find(
      (c) =>
        (c?.colorName || c?.color)?.toLowerCase() === selectedColor?.toLowerCase(),
    );
    const selectedSizeObj = sizes.find(
      (s) => s?.size === selectedSize,
    );

    if (colors.length > 0 && !selectedColorObj) {
      toast.error("Please select a color before adding to cart.");
      return;
    }

    if (sizes.length > 0 && !selectedSizeObj) {
      toast.error("Please select a size before adding to cart.");
      return;
    }

    const cartItem = {
      id: `rental-${typedProduct.id}-${selectedColor || "none"}-${selectedSize || "none"}`,
      productId: typedProduct.id,
      title: typedProduct.name,
      unitPrice,
      currency: "EGP" as const,
      imageSrc: mainImage?.url || "",
      quantity,
      size: selectedSize,
      color: selectedColor,
      colorHex: "#ddd",
      productType: "RENTAL" as const,
    };

    addProductToCart.mutate({
      cartItem,
      apiPayload: {
        productId: typedProduct.id,
        quantity,
        colorId: selectedColor,
        sizeId: selectedSize,
        productType: "RENTAL"
      },
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const handleNotifyMe = () => {
    if (!typedProduct?.id) return;
    notify.mutate({
      retailProductId: typedProduct.id,
      ...(user?.id ? { userId: user.id } : {}),
    });
  };

  // ─── Guards ───────────────────────────────────────────────────────
  if (!isAuthenticated || !user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        Failed to load product:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (!typedProduct) {
    return (
      <div className="p-10 text-center text-red-600">Product not found.</div>
    );
  }

  // ─── Map to shared DetailItem ─────────────────────────────────────
  const item = toDetailItem(typedProduct);

  return (
    <div className="w-full bg-background">
      <div className="mx-auto flex w-full max-w-[1428px] flex-col gap-12 px-4 py-6 sm:px-6 sm:py-8 lg:gap-20 lg:px-8 lg:py-10">
        {/* Breadcrumb */}
        <div className="font-['Montserrat'] text-sm font-normal text-gray-text sm:text-base">
          Home / {typedProduct.categories?.map((c: any) => c.name).join(", ") || "Products"} /{" "}
          {typedProduct.name}
        </div>

        {/* Gallery + Info Panel */}
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
            productType="RENTAL"
            reviewCount={reviews.length}
            rawProduct={typedProduct as unknown as Record<string, unknown>}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            isAddingToCart={addProductToCart.isPending}
          />
        </div>

        {/* Rental Extra Info */}
        <div className="mt-4 border-t border-stroke pt-8 text-sm text-foreground">
          <h2 className="text-xl font-bold mb-6">{t("additionalInformation")}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {typedProduct.sku && (
              <div>
                <span className="font-semibold text-gray-text">{t("sku")}</span>{" "}
                <span className="font-medium">{typedProduct.sku}</span>
              </div>
            )}
            {typedProduct.depositAmount !== undefined &&
              typedProduct.depositAmount !== null && (
                <div>
                  <span className="font-semibold text-gray-text">
                    {t("depositAmount")}
                  </span>{" "}
                  <span className="font-medium">
                    {typedProduct.depositAmount} EGP
                  </span>
                </div>
              )}
            {typedProduct.securityDeposit !== undefined &&
              typedProduct.securityDeposit !== null && (
                <div>
                  <span className="font-semibold text-gray-text">
                    {t("securityDeposit")}
                  </span>{" "}
                  <span className="font-medium">
                    {typedProduct.securityDeposit} EGP
                  </span>
                </div>
              )}
          </div>

          {(typedProduct.termsAndConditions || typedProduct.privacyPolicy) && (
            <div className="mt-8 space-y-6">
              {typedProduct.termsAndConditions && (
                <div>
                  <h3 className="text-lg font-bold mb-2">{t("termsAndConditions")}</h3>
                  <p className="whitespace-pre-wrap text-gray-text leading-relaxed">
                    {typedProduct.termsAndConditions}
                  </p>
                </div>
              )}
              {typedProduct.privacyPolicy && (
                <div>
                  <h3 className="text-lg font-bold mb-2">{t("privacyPolicy")}</h3>
                  <p className="whitespace-pre-wrap text-gray-text leading-relaxed">
                    {typedProduct.privacyPolicy}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <ReviewsSection productType="RENTAL" />
      </div>
    </div>
  );
}
