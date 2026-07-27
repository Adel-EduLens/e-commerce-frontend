import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useCategories } from "../../hooks/queries/categoriesQuery";
import { useBrands } from "../../hooks/queries/brandsQuery";
import { useCollections } from "../../hooks/queries/collectionsQuery";
import {
  useCreateProduct,
  useUpdateProduct,
  useProduct,
} from "../../hooks/queries/productsQuery";
import type {
  ProductFormData,
  ProductColor as QueryProductColor,
} from "../../hooks/queries/productsQuery";
import { Toggle } from "../ui";
import { MultiSelect } from "./InventoryShared";
import ImageCropModal, { validateImageDimensions } from "./ImageCropModal";
import {
  type InventoryItem,
  COLOR_OPTIONS,
  uploadImageFile,
  getColorVar,
} from "./inventoryUtils";

interface ProductImageItem {
  file?: File;
  url?: string;
  direction?: string;
}

interface ProductColor {
  color: string;
  images: ProductImageItem[];
  variants: {
    size: string;
    quantity: number;
  }[];
  stock?: number;
}

const formatForDateTimeLocal = (dateStr?: string | null) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
};

export function UnifiedProductModal({
  item,
  onClose,
}: {
  item?: InventoryItem | null;
  onClose: () => void;
}) {
  const { t: tShared } = useTranslation("traderInventoryShared");

  const isEditing = !!item;

  // Base Fields
  const [name, setName] = useState(item?.product || "");
  const [shopCategoryIds, setShopCategoryIds] = useState<string[]>(
    isEditing && (item.type === "product" || item.type === "retail")
      ? item.categoryIds || []
      : [],
  );
  const [wholesaleCategoryIds, setWholesaleCategoryIds] = useState<string[]>(
    isEditing && item.type === "wholesale" ? item.categoryIds || [] : [],
  );
  const [retailCategoryIds, setRetailCategoryIds] = useState<string[]>(
    isEditing && item.type === "retail" ? item.categoryIds || [] : [],
  );
  const [brandId, setBrandId] = useState(item?.brandId || "");
  const [collectionIds, setCollectionIds] = useState<string[]>(
    isEditing && (item as any)?.collections
      ? (item as any).collections.map((c: any) => String(c.id))
      : isEditing && (item as any)?.collectionIds
        ? (item as any).collectionIds.map((id: any) => String(id))
        : [],
  );
  const [description, setDescription] = useState(item?.description || "");
  const [sku, setSku] = useState(item?.sku || "");

  // Toggles
  const [isShop, setIsShop] = useState(false);
  const [isWholesale, setIsWholesale] = useState(false);
  const [isRetail, setIsRetail] = useState(false);
  const [isBlank, setIsBlank] = useState(false);

  // Shop Fields
  const [shopPrice, setShopPrice] = useState("");
  const [isMustHave, setIsMustHave] = useState(item?.isMustHave || false);
  const [isFlashDeals, setIsFlashDeals] = useState(item?.isFlashDeals || false);
  const [flashDealPrice, setFlashDealPrice] = useState(
    item?.flashDealPrice?.toString() || "",
  );
  const [flashDealEndsAt, setFlashDealEndsAt] = useState(
    item?.flashDealEndsAt || "",
  );
  const [sizeguide, setSizeguide] = useState<File | string | null>(null);

  // Wholesale Fields
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [minOrder, setMinOrder] = useState(item?.minOrder?.toString() || "1");
  const [isBestDeal, setIsBestDeal] = useState(item?.isBestDeal || false);
  const [isMostPopular, setIsMostPopular] = useState(
    item?.isMostPopular || false,
  );
  const [isPremiumCollection, setIsPremiumCollection] = useState(
    item?.isPremiumCollection || false,
  );

  // Retail Fields
  const [retailPrice, setRetailPrice] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // Blank Fields
  const [blankPrice, setBlankPrice] = useState("");
  const [materials, setMaterials] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Variants/Colors
  const [selectedColors, setSelectedColors] = useState<string[]>(
    item?.colors || [],
  );
  const [productColors, setProductColors] = useState<ProductColor[]>(
    isEditing
      ? (item?.colors || []).filter(Boolean).map((color) => ({
          color,
          images:
            item?.imagesByColor
              ?.filter((img) => img.color === color)
              .map((img) => ({ url: img.url, direction: img.direction })) || [],
          variants: [],
          stock: 0,
        }))
      : [],
  );

  const [cropState, setCropState] = useState<{
    color: string;
    src: string;
    name: string;
  } | null>(null);
  const [addingSizeForColor, setAddingSizeForColor] = useState<string | null>(
    null,
  );
  const [newSizeSelections, setNewSizeSelections] = useState<
    Record<string, string>
  >({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [sizeCropState, setSizeCropState] = useState<{
    src: string;
    name: string;
  } | null>(null);

  const { data: categories = [] } = useCategories();
  const shopCategories = categories.filter((c) => c.isShop);
  const wholesaleCategories = categories.filter((c) => c.isWholesale);
  const retailCategories = categories.filter((c) => c.isRental || c.isRetail);
  const { data: brands = [] } = useBrands();
  const { data: collections = [] } = useCollections();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const { data: fullProduct, isLoading: isProductLoading } = useProduct(
    isEditing ? item.id : undefined,
  );

  useEffect(() => {
    const func = () => {
      if (isEditing && fullProduct) {
        const rawTypes = (fullProduct as any).productTypes;
        const pTypes = Array.isArray(rawTypes)
          ? rawTypes
              .map((pt: any) => (typeof pt === "string" ? pt : pt?.type))
              .filter(Boolean)
          : [];

        if (pTypes.length > 0) {
          setIsShop(pTypes.includes("SHOP"));
          setIsWholesale(pTypes.includes("WHOLESALE"));
          setIsRetail(pTypes.includes("RENTAL") || pTypes.includes("RETAIL"));
          setIsBlank(pTypes.includes("BLANK"));
        } else {
          setIsShop(fullProduct.shopPrice != null);
          setIsWholesale(fullProduct.wholesalePrice != null);
          setIsRetail(
            fullProduct.rentalPrice != null || fullProduct.retailPrice != null,
          );
          setIsBlank(fullProduct.blankPrice != null);
        }

        if (fullProduct.shopPrice != null)
          setShopPrice(fullProduct.shopPrice.toString());
        if (fullProduct.wholesalePrice != null)
          setWholesalePrice(fullProduct.wholesalePrice.toString());
        if (fullProduct.rentalPrice != null || fullProduct.retailPrice != null)
          setRetailPrice(
            (fullProduct.rentalPrice ?? fullProduct.retailPrice)!.toString(),
          );
        if (fullProduct.blankPrice != null)
          setBlankPrice(fullProduct.blankPrice.toString());

        if (fullProduct.isMustHave != null)
          setIsMustHave(fullProduct.isMustHave);
        if (fullProduct.isFlashDeals != null)
          setIsFlashDeals(fullProduct.isFlashDeals);
        if (fullProduct.flashDealPrice != null)
          setFlashDealPrice(fullProduct.flashDealPrice.toString());
        if (fullProduct.flashDealEndsAt != null)
          setFlashDealEndsAt(
            formatForDateTimeLocal(fullProduct.flashDealEndsAt),
          );

        if (fullProduct.depositAmount != null)
          setDepositAmount(fullProduct.depositAmount.toString());
        if (fullProduct.securityDeposit != null)
          setSecurityDeposit(fullProduct.securityDeposit.toString());
        if (fullProduct.termsAndConditions)
          setTermsAndConditions(fullProduct.termsAndConditions);
        if (fullProduct.privacyPolicy)
          setPrivacyPolicy(fullProduct.privacyPolicy);

        if (fullProduct.name) setName(fullProduct.name);
        if (fullProduct.description) setDescription(fullProduct.description);
        if (fullProduct.sku) setSku(fullProduct.sku);
        if (fullProduct.sizeguide) setSizeguide(fullProduct.sizeguide);

        const catIds =
          fullProduct.categories?.map((c: { id: string | number }) =>
            String(c.id),
          ) ||
          item?.categoryIds ||
          [];
        if (catIds.length > 0) {
          setShopCategoryIds(catIds);
          setWholesaleCategoryIds(catIds);
          setRetailCategoryIds(catIds);
        }

        if (fullProduct.colors && fullProduct.colors.length > 0) {
          const mappedColors = fullProduct.colors
            .map((c: any) => {
              const rawVariants = c.variants || c.sizes || [];
              return {
                color: c.colorName || c.color || "",
                images:
                  c.images
                    ?.map(
                      (img: {
                        url?: string;
                        imageUrl?: string;
                        direction?: string;
                      }) => ({
                        url: img.url || img.imageUrl,
                        direction: img.direction,
                      }),
                    )
                    .filter((i: { url?: string }) => Boolean(i.url)) || [],
                variants: (() => {
                  const map = new Map<
                    string,
                    { size: string; quantity: number }
                  >();
                  for (const v of rawVariants) {
                    if (!v || !v.size) continue;
                    const key = String(v.size).trim().toLowerCase();
                    if (!map.has(key)) {
                      map.set(key, {
                        size: String(v.size).trim(),
                        quantity: v.quantity ?? v.stock ?? 0,
                      });
                    }
                  }
                  return Array.from(map.values());
                })(),
                stock: c.stock || 0,
              };
            })
            .filter((c: { color: string }) => !!c.color);

          setProductColors(mappedColors);
          setSelectedColors(
            mappedColors.map((c: { color: string }) => c.color),
          );
        }

        if (
          (fullProduct as any).collections &&
          Array.isArray((fullProduct as any).collections)
        ) {
          setCollectionIds(
            (fullProduct as any).collections.map((c: any) => String(c.id)),
          );
        } else if (
          (fullProduct as any).collectionIds &&
          Array.isArray((fullProduct as any).collectionIds)
        ) {
          setCollectionIds(
            (fullProduct as any).collectionIds.map((id: any) => String(id)),
          );
        }
      } else if (isEditing && item) {
        const catIds = item.categoryIds || [];
        if (catIds.length > 0) {
          setShopCategoryIds(catIds);
          setWholesaleCategoryIds(catIds);
          setRetailCategoryIds(catIds);
        }
        if (item.flashDealEndsAt) {
          setFlashDealEndsAt(formatForDateTimeLocal(item.flashDealEndsAt));
        }
        if (
          (item as any).collections &&
          Array.isArray((item as any).collections)
        ) {
          setCollectionIds(
            (item as any).collections.map((c: any) => String(c.id)),
          );
        } else if (
          (item as any).collectionIds &&
          Array.isArray((item as any).collectionIds)
        ) {
          setCollectionIds(
            (item as any).collectionIds.map((id: any) => String(id)),
          );
        }
      }
    };
    func();
  }, [fullProduct, isEditing, item]);

  const handleColorsChange = (colors: string[]) => {
    const validColors = colors.filter(Boolean);
    setSelectedColors(validColors);
    setProductColors((prev) => {
      const next = prev.filter((pc) => validColors.includes(pc.color));
      colors.forEach((c) => {
        if (!next.some((pc) => pc.color === c)) {
          next.push({
            color: c,
            images: [],
            variants: [],
          });
        }
      });
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const finalCategoryIds = Array.from(
      new Set([
        ...(isShop ? shopCategoryIds : []),
        ...(isWholesale ? wholesaleCategoryIds : []),
        ...(isRetail ? retailCategoryIds : []),
      ]),
    );

    const isOnlyBlank = isBlank && !isShop && !isWholesale && !isRetail;

    if (!name || (finalCategoryIds.length === 0 && !isOnlyBlank)) {
      const msg =
        "Name and at least one category (in selected sections except Blank) are required.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!sku) {
      const msg = "SKU is required.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!isShop && !isWholesale && !isRetail && !isBlank) {
      const msg =
        "Please select at least one product type (Shop, Wholesale, Retail, or Blank).";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (productColors.length === 0) {
      const msg = "Please select at least one color/package.";
      setError(msg);
      toast.error(msg);
      return;
    }

    for (const pc of productColors) {
      const seenSizes = new Set<string>();
      for (const v of pc.variants) {
        const lower = v.size.trim().toLowerCase();
        if (seenSizes.has(lower)) {
          const msg = `Duplicate size "${v.size}" found for color "${pc.color}".`;
          setError(msg);
          toast.error(msg);
          return;
        }
        seenSizes.add(lower);
      }
    }

    try {
      setUploading(true);

      const colorsData = await Promise.all(
        productColors.map(async (pc) => {
          const uploadedUrls = await Promise.all(
            pc.images.map(async (img) => {
              if (img.url) return { url: img.url, direction: img.direction };
              if (img.file) {
                const url = await uploadImageFile(img.file);
                return { url, direction: img.direction };
              }
              return null;
            }),
          );
          const validUploads = uploadedUrls.filter(Boolean) as {
            url: string;
            direction?: string;
          }[];
          const colorStock =
            pc.variants && pc.variants.length > 0
              ? pc.variants.reduce((s, v) => s + (v.quantity || 0), 0)
              : (pc.stock ?? 0);
          return {
            color: pc.color,
            minOrder: isWholesale ? Number(minOrder) || 1 : 1,
            stock: colorStock,
            images: validUploads.map((u) => ({
              url: u.url,
              color: pc.color,
              direction: u.direction,
            })),
            sizes: (() => {
              const map = new Map<string, { size: string; quantity: number }>();
              for (const v of pc.variants) {
                const key = v.size.trim().toLowerCase();
                if (!map.has(key)) {
                  map.set(key, { size: v.size.trim(), quantity: v.quantity });
                }
              }
              return Array.from(map.values());
            })(),
          };
        }),
      );

      const allImages = colorsData.flatMap((c) => c.images);
      const calculatedStock = colorsData.reduce((sum, c) => sum + c.stock, 0);

      const productTypes: string[] = [];
      if (isShop) productTypes.push("SHOP");
      if (isWholesale) productTypes.push("WHOLESALE");
      if (isRetail) productTypes.push("RENTAL");
      if (isBlank) productTypes.push("BLANK");

      const payload: ProductFormData = {
        name,
        description,
        categoryIds: finalCategoryIds,
        sku: sku || undefined,
        stock: calculatedStock,
        productTypes,
        colors: colorsData.map((c) => ({
          color: c.color,
          name: c.color,
          code: c.color,
          minOrder: c.minOrder,
          stock: c.stock,
          sizes: c.sizes,
        })),
        images: allImages,
      };

      if (brandId) payload.brandId = brandId;

      if (isShop) {
        payload.shopPrice = Number(shopPrice);
        payload.isMustHave = isMustHave;
        payload.isFlashDeals = isFlashDeals;
        if (isFlashDeals) {
          payload.flashDealPrice = Number(flashDealPrice);
          payload.flashDealEndsAt = flashDealEndsAt;
        }
        if (sizeguide) {
          if (typeof sizeguide === "string") {
            payload.sizeguide = sizeguide;
          } else {
            payload.sizeguide = await uploadImageFile(sizeguide);
          }
        }
        if (collectionIds && collectionIds.length > 0) {
          payload.collectionIds = collectionIds;
        } else {
          payload.collectionIds = [];
        }
      } else {
        payload.shopPrice = null;
        payload.collectionIds = [];
      }

      if (isWholesale) {
        payload.wholesalePrice = Number(wholesalePrice);
        payload.minOrder = Number(minOrder) || 1;
        payload.isBestDeal = isBestDeal;
        payload.isMostPopular = isMostPopular;
        payload.isPremiumCollection = isPremiumCollection;
      } else {
        payload.wholesalePrice = null;
      }

      if (isRetail) {
        payload.rentalPrice = Number(retailPrice);
        payload.depositAmount = Number(depositAmount);
        payload.securityDeposit = Number(securityDeposit);
        payload.termsAndConditions = termsAndConditions;
        payload.privacyPolicy = privacyPolicy;
        payload.isFeatured = isFeatured;
      } else {
        payload.rentalPrice = null;
      }

      if (isBlank) {
        payload.blankPrice = Number(blankPrice);
        payload.isActive = isActive;
        if (materials) {
          payload.materials = [{ material: materials }];
        }
      } else {
        payload.blankPrice = null;
      }

      if (isEditing) {
        await updateProduct.mutateAsync({ id: item.id, ...payload });
      } else {
        await createProduct.mutateAsync(payload);
      }

      setUploading(false);
      onClose();
    } catch (err: unknown) {
      setUploading(false);
      console.log(err);
      let errMsg = tShared("somethingWentWrong");
      const error = err as {
        response?: {
          data?: { errors?: Record<string, string[]>; message?: string };
        };
        message?: string;
      };
      if (error?.response?.data?.errors) {
        // Validation errors returned as an object { field: ["message"] }
        const validationErrors = error.response.data.errors;
        const firstErrorKey = Object.keys(validationErrors)[0];
        if (firstErrorKey && validationErrors[firstErrorKey].length > 0) {
          errMsg = validationErrors[firstErrorKey][0];
        } else {
          errMsg = error.response.data.message || errMsg;
        }
      } else if (error?.response?.data?.message) {
        errMsg = error.response.data.message;
      } else if (error?.message) {
        errMsg = error.message;
      }
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {cropState && (
        <ImageCropModal
          imageSrc={cropState.src}
          fileName={cropState.name}
          onConfirm={(croppedFile) => {
            URL.revokeObjectURL(cropState.src);
            const col = cropState.color;
            setCropState(null);
            setProductColors((prev) =>
              prev.map((pc, idx) =>
                pc.color === col || String(idx) === col
                  ? {
                      ...pc,
                      images: [
                        ...pc.images,
                        { file: croppedFile, direction: "" },
                      ],
                    }
                  : pc,
              ),
            );
          }}
          onCancel={() => {
            URL.revokeObjectURL(cropState.src);
            setCropState(null);
          }}
        />
      )}

      {sizeCropState && (
        <ImageCropModal
          imageSrc={sizeCropState.src}
          fileName={sizeCropState.name}
          onConfirm={(croppedFile) => {
            URL.revokeObjectURL(sizeCropState.src);
            setSizeCropState(null);
            setSizeguide(croppedFile);
          }}
          onCancel={() => {
            URL.revokeObjectURL(sizeCropState.src);
            setSizeCropState(null);
          }}
        />
      )}

      <div className="w-full max-w-2xl rounded-2xl bg-card shadow-xl max-h-[90vh] flex flex-col text-foreground">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {isEditing ? tShared("editItem") : tShared("addItem")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-text hover:text-foreground text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {isEditing && isProductLoading ? (
          <div className="flex-1 overflow-y-auto p-5 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-5 space-y-6 bg-card"
          >
            {error && (
              <div className="text-red-500 text-sm font-semibold">{error}</div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-text">
                  {tShared("nameLabel") || "Name *"}
                </label>
                <input
                  placeholder={tShared("namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-text">
                  {tShared("skuLabel") || "SKU *"}
                </label>
                <input
                  placeholder={tShared("skuPlaceholder")}
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card"
                />
              </div>
            </div>

            <div className="space-y-1 w-1/2 pr-2">
              <label className="text-xs font-semibold text-gray-text">
                {tShared("brandLabel") || "Brand"}
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card"
              >
                <option value="" className="bg-card text-foreground">
                  {tShared("selectBrand")}
                </option>
                {brands.map((b) => (
                  <option
                    key={b.id}
                    value={b.id}
                    className="bg-card text-foreground"
                  >
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-text">
                {tShared("descriptionLabel") || "Description"}
              </label>
              <textarea
                placeholder={tShared("descriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card resize-none"
              />
            </div>

            {/* Product Types Toggles */}
            <div className="rounded-xl border border-stroke p-4 space-y-4">
              <h3 className="font-['Montserrat'] text-sm font-bold text-foreground">
                {tShared("productTypes") ||
                  "Product Types (Select at least one)"}
              </h3>

              {/* SHOP */}
              <div className="border border-stroke rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">
                    {tShared("shopProduct") || "Shop Product"}
                  </span>
                  <Toggle checked={isShop} onChange={setIsShop} size="md" />
                </div>
                {isShop && (
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stroke">
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-gray-text">
                        {tShared("shopCategories") || "Shop Categories *"}
                      </label>
                      <MultiSelect
                        label={tShared("selectCategory")}
                        options={shopCategories.map((c) => ({
                          value: c.id,
                          label: c.name,
                        }))}
                        selected={shopCategoryIds}
                        onChange={setShopCategoryIds}
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-gray-text">
                        {tShared("collections") || "Collections (Optional)"}
                      </label>
                      <MultiSelect
                        label={
                          tShared("selectCollection") || "Select Collection(s)"
                        }
                        options={collections.map((c) => ({
                          value: c.id,
                          label: c.name,
                        }))}
                        selected={collectionIds}
                        onChange={setCollectionIds}
                      />
                    </div>
                    <input
                      type="number"
                      placeholder={tShared("shopPrice") || "Shop Price"}
                      value={shopPrice}
                      onChange={(e) => setShopPrice(e.target.value)}
                      className="rounded-xl border border-stroke px-4 py-2 text-sm outline-none focus:border-primary text-foreground bg-card"
                    />
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">
                          {tShared("mustHave") || "Must Have"}
                        </span>
                        <Toggle
                          checked={isMustHave}
                          onChange={setIsMustHave}
                          size="sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">
                          {tShared("sizeGuideImage") || "Size Guide Image"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="text-xs w-full text-foreground"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const err = await validateImageDimensions(file);
                              if (err) {
                                toast.error(`Image dimensions error: ${err}`);
                                e.target.value = "";
                                return;
                              }
                              const src = URL.createObjectURL(file);
                              setSizeCropState({ src, name: file.name });
                            }
                          }}
                        />
                        {sizeguide && (
                          <span className="text-xs text-green-600">
                            {tShared("selected") || "Selected"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">
                          {tShared("flashDeal") || "Flash Deal"}
                        </span>
                        <Toggle
                          checked={isFlashDeals}
                          onChange={setIsFlashDeals}
                          size="sm"
                        />
                      </div>
                      {isFlashDeals && (
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder={
                              tShared("dealPricePlaceholder") ||
                              "Flash Deal Price"
                            }
                            value={flashDealPrice}
                            onChange={(e) => setFlashDealPrice(e.target.value)}
                            className="rounded-xl border border-stroke px-4 py-2 text-sm outline-none focus:border-primary text-foreground bg-card"
                          />
                          <input
                            type="datetime-local"
                            value={flashDealEndsAt}
                            onChange={(e) => setFlashDealEndsAt(e.target.value)}
                            className="rounded-xl border border-stroke px-4 py-2 text-sm outline-none focus:border-primary text-foreground bg-card"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* WHOLESALE */}
            <div className="border border-stroke rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">
                  {tShared("wholesaleProduct") || "Wholesale Product"}
                </span>
                <Toggle
                  checked={isWholesale}
                  onChange={setIsWholesale}
                  size="md"
                />
              </div>
              {isWholesale && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stroke">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-text">
                      {tShared("wholesaleCategories") ||
                        "Wholesale Categories *"}
                    </label>
                    <MultiSelect
                      label={tShared("selectCategory")}
                      options={wholesaleCategories.map((c) => ({
                        value: c.id,
                        label: c.name,
                      }))}
                      selected={wholesaleCategoryIds}
                      onChange={setWholesaleCategoryIds}
                    />
                  </div>
                  <input
                    type="number"
                    placeholder={tShared("wholesalePrice") || "Wholesale Price"}
                    value={wholesalePrice}
                    onChange={(e) => setWholesalePrice(e.target.value)}
                    className="rounded-xl border border-stroke px-4 py-2 text-sm outline-none focus:border-primary text-foreground bg-card"
                  />
                  <input
                    type="number"
                    placeholder={tShared("minOrder") || "Min Order"}
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="rounded-xl border border-stroke px-4 py-2 text-sm outline-none focus:border-primary text-foreground bg-card"
                  />

                  <div className="col-span-2 flex items-center gap-6 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">
                        {tShared("bestDeal") || "Best Deal"}
                      </span>
                      <Toggle
                        checked={isBestDeal}
                        onChange={setIsBestDeal}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">
                        {tShared("mostPopular") || "Most Popular"}
                      </span>
                      <Toggle
                        checked={isMostPopular}
                        onChange={setIsMostPopular}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">
                        {tShared("premiumCollection") || "Premium Collection"}
                      </span>
                      <Toggle
                        checked={isPremiumCollection}
                        onChange={setIsPremiumCollection}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RETAIL */}
            <div className="border border-stroke rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">
                  {tShared("retailProduct") || "Retail Product"}
                </span>
                <Toggle checked={isRetail} onChange={setIsRetail} size="md" />
              </div>
              {isRetail && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stroke">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-text">
                      {tShared("retailCategories") || "Retail Categories *"}
                    </label>
                    <MultiSelect
                      label={tShared("selectCategory")}
                      options={retailCategories.map((c) => ({
                        value: c.id,
                        label: c.name,
                      }))}
                      selected={retailCategoryIds}
                      onChange={setRetailCategoryIds}
                    />
                  </div>
                  <input
                    type="number"
                    placeholder={tShared("retailPrice") || "Retail Price"}
                    value={retailPrice}
                    onChange={(e) => setRetailPrice(e.target.value)}
                    className="rounded-xl border border-stroke px-4 py-2 text-sm outline-none focus:border-primary text-foreground bg-card"
                  />
                  <input
                    type="number"
                    placeholder={tShared("depositAmount") || "Deposit Amount"}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="rounded-xl border border-stroke px-4 py-2 text-sm outline-none focus:border-primary text-foreground bg-card"
                  />
                  <input
                    type="number"
                    placeholder={
                      tShared("securityDeposit") || "Security Deposit"
                    }
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    className="rounded-xl border border-stroke px-4 py-2 text-sm outline-none focus:border-primary text-foreground bg-card"
                  />
                  <input
                    type="text"
                    placeholder={
                      tShared("termsAndConditions") || "Terms & Conditions"
                    }
                    value={termsAndConditions}
                    onChange={(e) => setTermsAndConditions(e.target.value)}
                    className="rounded-xl border border-stroke px-4 py-2 text-sm outline-none focus:border-primary text-foreground bg-card"
                  />
                  <input
                    type="text"
                    placeholder={tShared("privacyPolicy") || "Privacy Policy"}
                    value={privacyPolicy}
                    onChange={(e) => setPrivacyPolicy(e.target.value)}
                    className="col-span-2 rounded-xl border border-stroke px-4 py-2 text-sm outline-none focus:border-primary text-foreground bg-card"
                  />
                  <div className="col-span-2 flex items-center gap-2 mt-2">
                    <span className="text-xs">
                      {tShared("featuredRetailProduct") ||
                        "Featured Retail Product"}
                    </span>
                    <Toggle
                      checked={isFeatured}
                      onChange={setIsFeatured}
                      size="sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* BLANK */}
            <div className="border border-stroke rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">
                  {tShared("blankProduct") || "Blank Product"}
                </span>
                <Toggle checked={isBlank} onChange={setIsBlank} size="md" />
              </div>
              {isBlank && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stroke">
                  <input
                    type="number"
                    placeholder={tShared("blankPrice") || "Blank Price"}
                    value={blankPrice}
                    onChange={(e) => setBlankPrice(e.target.value)}
                    className="rounded-xl border border-stroke px-4 py-2 text-sm outline-none focus:border-primary text-foreground bg-card"
                  />
                  <input
                    type="text"
                    placeholder={tShared("materials") || "Materials"}
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    className="rounded-xl border border-stroke px-4 py-2 text-sm outline-none focus:border-primary text-foreground bg-card"
                  />
                  <div className="col-span-2 flex items-center gap-2 mt-2">
                    <span className="text-xs">
                      {tShared("isActive") || "Is Active"}
                    </span>
                    <Toggle
                      checked={isActive}
                      onChange={setIsActive}
                      size="sm"
                    />
                  </div>
                </div>
              )}
            </div>

            <MultiSelect
              label={tShared("selectColors")}
              options={COLOR_OPTIONS}
              selected={selectedColors}
              onChange={handleColorsChange}
            />

            {productColors.map((pc) => (
              <div
                key={pc.color}
                className="rounded-xl border border-stroke p-4 space-y-3 bg-background"
              >
                <div className="flex items-center justify-between border-b border-stroke pb-2">
                  <h4 className="font-['Montserrat'] text-sm font-bold text-foreground flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full border border-stroke"
                      style={{ backgroundColor: getColorVar(pc.color) }}
                    />
                    {pc.color}
                  </h4>
                </div>

                <div className="space-y-2">
                  <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                    Upload Images
                  </p>
                  <div className="flex flex-wrap gap-2 items-center">
                    {pc.images.map((imgItem, imgIdx) => {
                      const previewUrl =
                        imgItem.url ||
                        (imgItem.file ? URL.createObjectURL(imgItem.file) : "");
                      return (
                        <div
                          key={imgIdx}
                          className="flex flex-col gap-1 items-center"
                        >
                          <div className="relative w-16 h-16 rounded-lg border border-stroke overflow-hidden group">
                            <img
                              src={previewUrl}
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (imgItem.file)
                                  URL.revokeObjectURL(previewUrl);
                                setProductColors((prev) =>
                                  prev.map((item) =>
                                    item.color === pc.color
                                      ? {
                                          ...item,
                                          images: item.images.filter(
                                            (_, idx) => idx !== imgIdx,
                                          ),
                                        }
                                      : item,
                                  ),
                                );
                              }}
                              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                            >
                              Delete
                            </button>
                          </div>
                          {isBlank && (
                            <select
                              value={imgItem.direction || ""}
                              onChange={(e) => {
                                const newDir = e.target.value;
                                setProductColors((prev) =>
                                  prev.map((item) =>
                                    item.color === pc.color
                                      ? {
                                          ...item,
                                          images: item.images.map((i, idx) =>
                                            idx === imgIdx
                                              ? { ...i, direction: newDir }
                                              : i,
                                          ),
                                        }
                                      : item,
                                  ),
                                );
                              }}
                              className="text-[10px] w-full p-1 border border-stroke rounded bg-card text-foreground"
                            >
                              <option value="">Direction</option>
                              {[
                                { val: "FRONT", lbl: "Front" },
                                { val: "BACK", lbl: "Back" },
                                { val: "LEFT", lbl: "Left" },
                                { val: "RIGHT", lbl: "Right" },
                                { val: "TOP", lbl: "Top" },
                                { val: "BOTTOM", lbl: "Bottom" },
                              ].map((opt) => {
                                const isUsed = pc.images.some(
                                  (i, idx) =>
                                    idx !== imgIdx && i.direction === opt.val,
                                );
                                if (isUsed) return null;
                                return (
                                  <option key={opt.val} value={opt.val}>
                                    {opt.lbl}
                                  </option>
                                );
                              })}
                            </select>
                          )}
                        </div>
                      );
                    })}
                    <label className="w-16 h-16 rounded-lg border-2 border-dashed border-stroke hover:border-primary hover:text-primary flex flex-col items-center justify-center cursor-pointer transition text-gray-text bg-card">
                      <span className="text-xl font-bold">+</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const err = await validateImageDimensions(file);
                            if (err) {
                              toast.error(`Error: ${err}`);
                              return;
                            }
                            setCropState({
                              color: pc.color,
                              src: URL.createObjectURL(file),
                              name: file.name,
                            });
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                      Sizes & Quantities
                    </p>
                    {addingSizeForColor === pc.color ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={newSizeSelections[pc.color] ?? "M"}
                          onChange={(e) =>
                            setNewSizeSelections((prev) => ({
                              ...prev,
                              [pc.color]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const selectedSize =
                                newSizeSelections[pc.color] ?? "M";
                              if (
                                pc.variants.some((v) => v.size === selectedSize)
                              ) {
                                toast.error("Size already exists");
                                return;
                              }
                              setProductColors((prev) =>
                                prev.map((item) =>
                                  item.color === pc.color
                                    ? {
                                        ...item,
                                        variants: [
                                          ...item.variants,
                                          { size: selectedSize, quantity: 0 },
                                        ],
                                      }
                                    : item,
                                ),
                              );
                              setAddingSizeForColor(null);
                            }
                          }}
                          className="text-xs border border-stroke rounded px-2 py-1 outline-none focus:border-primary bg-white"
                        >
                          {["XXS", "XS", "S", "M", "L", "XL", "XXL"].map(
                            (s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ),
                          )}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const selectedSize =
                              newSizeSelections[pc.color] ?? "M";
                            if (
                              pc.variants.some((v) => v.size === selectedSize)
                            ) {
                              toast.error("Size already exists");
                              return;
                            }
                            setProductColors((prev) =>
                              prev.map((item) =>
                                item.color === pc.color
                                  ? {
                                      ...item,
                                      variants: [
                                        ...item.variants,
                                        { size: selectedSize, quantity: 0 },
                                      ],
                                    }
                                  : item,
                              ),
                            );
                            setAddingSizeForColor(null);
                          }}
                          className="text-xs bg-primary text-white px-2 py-1 rounded font-semibold hover:opacity-90"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddingSizeForColor(null)}
                          className="text-xs border border-stroke text-gray-text px-2 py-1 rounded font-semibold hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAddingSizeForColor(pc.color);
                          setNewSizeSelections((prev) => ({
                            ...prev,
                            [pc.color]: prev[pc.color] ?? "M",
                          }));
                        }}
                        className="text-xs text-primary font-semibold hover:opacity-80"
                      >
                        + Add Size
                      </button>
                    )}
                  </div>
                  {pc.variants.length > 0 && (
                    <table className="w-full text-left font-['Montserrat'] text-xs border border-stroke rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-secondary text-primary font-bold">
                          <th className="p-2 border-b border-stroke">Size</th>
                          <th className="p-2 border-b border-stroke">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pc.variants.map((v, vIdx) => (
                          <tr
                            key={vIdx}
                            className="bg-card border-b border-stroke"
                          >
                            <td className="p-2 font-semibold">{v.size}</td>
                            <td className="p-2 flex items-center justify-between gap-2">
                              <input
                                type="number"
                                min="0"
                                value={v.quantity}
                                onChange={(e) => {
                                  const qty = Number(e.target.value);
                                  setProductColors((prev) =>
                                    prev.map((item) =>
                                      item.color === pc.color
                                        ? {
                                            ...item,
                                            variants: item.variants.map(
                                              (variant, idx) =>
                                                idx === vIdx
                                                  ? {
                                                      ...variant,
                                                      quantity: qty,
                                                    }
                                                  : variant,
                                            ),
                                          }
                                        : item,
                                    ),
                                  );
                                }}
                                className="w-16 border border-stroke rounded px-1.5 py-0.5 outline-none focus:border-primary"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setProductColors((prev) =>
                                    prev.map((item) =>
                                      item.color === pc.color
                                        ? {
                                            ...item,
                                            variants: item.variants.filter(
                                              (_, idx) => idx !== vIdx,
                                            ),
                                          }
                                        : item,
                                    ),
                                  );
                                }}
                                className="text-red-500 hover:text-red-700 text-xs font-bold px-1"
                                title="Delete size"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            ))}

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-stroke py-3 font-['Montserrat'] text-sm font-semibold text-foreground bg-card hover:bg-background transition"
              >
                {tShared("cancel")}
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
              >
                {uploading
                  ? tShared("saving") || "Saving..."
                  : isEditing
                    ? tShared("saveChanges") || "Save Changes"
                    : tShared("save") || "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
