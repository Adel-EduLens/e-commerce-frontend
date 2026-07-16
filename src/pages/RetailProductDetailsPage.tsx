import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRetailProductById } from "../hooks/useRetailProducts";
import useRetailNotifyMe from "../hooks/useRetailNotifyMe";
import { useAuthStore } from "../store/useAuthStore";
import { useAddRetailProductToCart } from "../hooks/useCart";
import { useAddRecentlyViewed } from "../hooks/useRecentlyViewed";
import { ProductGallery } from "../components/product/ProductGallery";
import { ProductInfoPanel } from "../components/product/ProductInfoPanel";
import { ReviewsSection } from "../components/product/ReviewsSection";
import { useRetailReviews } from "../hooks/queries/retailReviewQuery";
import type {
  RetailProduct,
  RetailProductImage,
  RetailProductColor,
  RetailProductSize,
} from "../types/retail";
import type { DetailItem } from "../types/DetailItem";
import { useTranslation } from "react-i18next";
/** Safely convert a value to a finite number, defaulting to 0. */
function toNumber(value: string | number | null | undefined): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** Map a RetailProduct into the shared DetailItem shape used by ProductGallery & ProductInfoPanel. */
function toDetailItem(product: RetailProduct): DetailItem {
  const images = product.images ?? [];
  const colors = product.colors ?? [];
  const sizes = product.sizes ?? [];

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    rating: product.rating,
    averageRating: product.averageRating,
    discountPrice: product.discountPrice,
    brandName: product.brand?.name ?? null,
    stock: product.stock,

    category: product.category
      ? { id: product.category.id, name: product.category.name }
      : undefined,

    images: images.map((img: RetailProductImage) => ({
      id: img.id,
      url: img.url,
      color: img.color ?? null,
    })),

    colors: colors.map((c: RetailProductColor) => ({
      id: c.id,
      color: c.color,
      colorHex: null,
    })),

    sizes: sizes.map((s: RetailProductSize) => ({
      id: s.id,
      size: s.size,
    })),
  };
}

export default function RetailProductDetailsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { id } = useParams();
  const { data: product, isLoading, error } = useRetailProductById(id ?? "");
  const typedProduct = product as RetailProduct | null | undefined;
  const { data: reviews = [] } = useRetailReviews(id);
  const { t } = useTranslation("retailDetailsPage");
  const notify = useRetailNotifyMe(user?.id);
  const addRetailProductToCart = useAddRetailProductToCart();

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
      addRecentlyViewed({ productType: "RETAIL", productId: typedProduct.id });
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
        const sizes = typedProduct.sizes ?? [];
        const images = typedProduct.images ?? [];

        if (colors.length > 0) {
          setSelectedColor(colors[0].color);
        }
        if (sizes.length > 0) {
          setSelectedSize(sizes[0].size);
        }
        if (images.length > 0) {
          setSelectedImage(images[0].url);
        }
        setQuantity(1);
      }
    };
    func();
  }, [typedProduct]);

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    // Update image to match selected color
    const images = typedProduct?.images ?? [];
    const colorImage = images.find(
      (img: RetailProductImage) =>
        img.color && img.color.toLowerCase() === colorName.toLowerCase(),
    );
    if (colorImage) {
      setSelectedImage(colorImage.url);
    }
  };

  const handleAddToCart = () => {
    if (!typedProduct) return;

    const images = typedProduct.images ?? [];
    const colors = typedProduct.colors ?? [];
    const sizes = typedProduct.sizes ?? [];
    const mainImage = images[0];

    const priceNumber = toNumber(typedProduct.price);
    const discountNumber =
      typedProduct.discountPrice !== null &&
      typedProduct.discountPrice !== undefined
        ? toNumber(typedProduct.discountPrice)
        : undefined;
    const unitPrice =
      discountNumber && discountNumber < priceNumber
        ? discountNumber
        : priceNumber;

    const selectedColorObj = colors.find(
      (c: RetailProductColor) =>
        c?.color?.toLowerCase() === selectedColor?.toLowerCase(),
    );
    const selectedSizeObj = sizes.find(
      (s: RetailProductSize) => s?.size === selectedSize,
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
      id: `retail-${typedProduct.id}-${selectedColor || "none"}-${selectedSize || "none"}`,
      retailProductId: typedProduct.id,
      title: typedProduct.name,
      unitPrice,
      currency: "EGP" as const,
      imageSrc: mainImage?.url || "",
      quantity,
      size: selectedSize,
      color: selectedColor,
      colorHex: "#ddd",
      retailColorId: selectedColor,
      retailSizeId: selectedSize,
      productType: "RETAIL" as const,
    };

    addRetailProductToCart.mutate({
      cartItem,
      apiPayload: {
        retailProductId: typedProduct.id,
        quantity,
        retailColorId: selectedColor,
        retailSizeId: selectedSize,
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
          Home / {typedProduct.category?.name ?? "Products"} /{" "}
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
            productType="RETAIL"
            reviewCount={reviews.length}
            rawProduct={typedProduct as unknown as Record<string, unknown>}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onNotifyMe={handleNotifyMe}
            isAddingToCart={addRetailProductToCart.isPending}
          />
        </div>

        {/* Retail Extra Info */}
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
        <ReviewsSection productType="RETAIL" />
      </div>
    </div>
  );
}
