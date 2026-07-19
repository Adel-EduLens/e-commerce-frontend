import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  type InventoryItem,
  getStatus,
  COLOR_OPTIONS,
  SIZE_OPTIONS,
} from "../../components/trader/inventoryUtils";
import { InventoryTablePanel, MultiSelect } from "../../components/trader/InventoryShared";
import { Toggle } from "../../components/ui";
import { toast } from "sonner";
import {
  useTraderRetailProducts,
  useCreateRetailProduct,
  useUpdateRetailProduct,
  useDeleteRetailProduct,
} from "../../hooks/useRetailProducts";
import { useRetailCategories } from "../../hooks/useRetailCategories";
import { useRetailBrands } from "../../hooks/queries/retailBrandQuery";
import type { RetailProduct, RetailCategory } from "../../types/retail";
import ImageCropModal, {
  validateImageDimensions,
} from "../../components/trader/ImageCropModal";
import { api } from "../../lib/axios";

async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/upload/retail-product-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.url;
}

// --- Retail Product Modal ---
export function RetailProductFormModal({
  product,
  onClose,
  onSave,
}: {
  product?: RetailProduct;
  onClose: () => void;
  onSave: (
    data: Partial<RetailProduct> | FormData | Record<string, unknown>,
  ) => Promise<void>;
}) {
  const { t } = useTranslation("traderProduct");
  const { data: categoriesData } = useRetailCategories();
  const categories: RetailCategory[] =
    ((categoriesData as unknown) as { data?: RetailCategory[] })?.data || ((categoriesData as unknown) as RetailCategory[]) || [];

  const { data: brandsData } = useRetailBrands();
  const brands: { id: string; name: string }[] = ((brandsData as unknown) as { data?: { id: string; name: string }[] })?.data || ((brandsData as unknown) as { id: string; name: string }[]) || [];

  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [depositAmount, setDepositAmount] = useState(
    product?.depositAmount || 0,
  );
  const [securityDeposit, setSecurityDeposit] = useState(
    product?.securityDeposit || 0,
  );

  const [sku, setSku] = useState(product?.sku || "");
  const [brandId, setBrandId] = useState(product?.brand?.id || product?.brandId || "");
  const [description, setDescription] = useState(product?.description || "");
  const [termsAndConditions, setTermsAndConditions] = useState(
    product?.termsAndConditions || "",
  );
  const [privacyPolicy, setPrivacyPolicy] = useState(
    product?.privacyPolicy || "",
  );
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [productColors, setProductColors] = useState<{
    color: string;
    variants: { size: string; quantity: number }[];
    images: File[];
    existingImages: { url: string }[];
  }[]>([]);

  useEffect(() => {
    if (product) {
      const colorsArr = (product.colors as unknown as Record<string, unknown>[]) || [];
      const initColorNames = Array.from(new Set(colorsArr.map((c) => (c.name || c.color || c) as string)));
      setSelectedColors(initColorNames);

      const initColors = initColorNames.map((colorName) => {
        const imagesArr = (product.images as unknown as Record<string, unknown>[]) || [];
        const matchingImages = imagesArr.filter((i) => i.color === colorName);

        const sizesArr = (product.sizes as unknown as Record<string, unknown>[]) || [];
        const matchingSizes = sizesArr.filter((s) => s.color === colorName);

        return {
          color: colorName,
          variants: matchingSizes.map((s) => ({
            size: (s.name || s.size) as string,
            quantity: (s.stock || s.quantity || 0) as number,
          })),
          images: [],
          existingImages: matchingImages.map((i) => ({ url: i.url as string })),
        };
      });

      if (initColors.length > 0) {
        setProductColors(initColors);
      }
    }
  }, [product]);

  const handleColorsChange = (colors: string[]) => {
    setSelectedColors(colors);
    setProductColors((prev) => {
      const updated = colors.map((c) => {
        const existing = prev.find((p) => p.color === c);
        return existing || { color: c, variants: [], images: [], existingImages: [] };
      });
      return updated;
    });
  };

  const [cropState, setCropState] = useState<{
    color: string;
    src: string;
    name: string;
  } | null>(null);

  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSaveClick = async () => {
    setIsSubmitting(true);
    setUploading(true);

    try {
      const colorsData = await Promise.all(
        productColors.map(async (pc) => {
          const uploadedUrls = await Promise.all(
            pc.images.map((f) => uploadImageFile(f))
          );
          const combinedUrls = [
            ...(pc.existingImages || []).map((e) => e.url),
            ...uploadedUrls,
          ];

          return {
            color: pc.color,
            images: combinedUrls.map((url) => ({ url, color: pc.color })),
            sizes: pc.variants.map((v) => ({
              size: v.size,
              quantity: v.quantity,
              color: pc.color,
            })),
            stock: pc.variants.reduce((acc, v) => acc + (v.quantity || 0), 0),
          };
        })
      );

      const allImages = colorsData.flatMap((c) => c.images);
      const allSizes = colorsData.flatMap((c) => c.sizes);
      const allColors = colorsData.map((c) => c.color);
      const totalStock = colorsData.reduce((acc, c) => acc + c.stock, 0);

      const payload = {
        name,
        price: Number(price),
        stock: totalStock,
        categoryId: Number(categoryId),
        depositAmount: Number(depositAmount),
        securityDeposit: Number(securityDeposit),
        sku: sku || undefined,
        brandId: brandId || undefined,
        description: description || undefined,
        termsAndConditions: termsAndConditions || undefined,
        privacyPolicy: privacyPolicy || undefined,
        isFeatured,
        images: allImages,
        colors: allColors,
        sizes: allSizes,
      };

      await onSave(payload);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || t("failedToSaveProduct"));
    } finally {
      setUploading(false);
      setIsSubmitting(false);
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
              prev.map((pc) =>
                pc.color === col
                  ? { ...pc, images: [...pc.images, croppedFile] }
                  : pc
              )
            );
          }}
          onCancel={() => {
            URL.revokeObjectURL(cropState.src);
            setCropState(null);
          }}
        />
      )}

      <div className="w-full max-w-md rounded-2xl bg-card shadow-xl max-h-[90vh] flex flex-col border border-stroke">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {product ? t("editRetailProduct") : t("addRetailProduct")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-text hover:text-foreground text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveClick();
          }}
          className="flex flex-col gap-4 p-5 overflow-y-auto custom-scrollbar"
        >
          <input
            placeholder={t("nameRequired")}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
          />

          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
          >
            <option value="">{t("selectCategory")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder={t("sku")}
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
            />
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
            >
              <option value="">{t("selectBrandOptional")}</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <input
              type="number"
              min="0"
              step="1"
              required
              placeholder={t("priceRequired")}
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              required
              placeholder={t("depositRequired")}
              value={depositAmount || ""}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
            />
            <input
              type="number"
              min="0"
              required
              placeholder={t("secDepositRequired")}
              value={securityDeposit || ""}
              onChange={(e) => setSecurityDeposit(Number(e.target.value))}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
            />
          </div>

          <textarea
            placeholder={t("mainDescription")}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl border border-stroke p-3 min-h-[100px] font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground resize-y"
          />

          <textarea
            placeholder={t("termsAndConditionsLabel")}
            rows={3}
            value={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.value)}
            className="rounded-xl border border-stroke p-3 min-h-[80px] font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground resize-y"
          />

          <textarea
            placeholder={t("privacyPolicyLabel")}
            rows={3}
            value={privacyPolicy}
            onChange={(e) => setPrivacyPolicy(e.target.value)}
            className="rounded-xl border border-stroke p-3 min-h-[80px] font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground resize-y"
          />

          <MultiSelect
            label={t("selectColorsRequired")}
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
                    style={{ backgroundColor: pc.color.toLowerCase() }}
                  />
                  {pc.color}
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    handleColorsChange(
                      selectedColors.filter((c) => c !== pc.color)
                    )
                  }
                  className="text-red-500 hover:text-red-700 text-xs font-semibold font-['Montserrat']"
                >
                  {t("removeColor")}
                </button>
              </div>

              {/* Multiple Image Upload */}
              <div className="space-y-2">
                <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                  {t("uploadImagesRequired")}
                </p>
                <div className="flex flex-wrap gap-2 items-center">
                  {pc.existingImages?.map((img, imgIdx) => (
                    <div
                      key={`existing-${imgIdx}`}
                      className="relative w-16 h-16 rounded-lg border border-stroke overflow-hidden group"
                    >
                      <img src={img.url} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setProductColors((prev) =>
                            prev.map((item) =>
                              item.color === pc.color
                                ? { ...item, existingImages: item.existingImages?.filter((_, idx) => idx !== imgIdx) }
                                : item
                            )
                          );
                        }}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                      >
                        {t("delete")}
                      </button>
                    </div>
                  ))}
                  {pc.images.map((imgFile, imgIdx) => {
                    const previewUrl = URL.createObjectURL(imgFile);
                    return (
                      <div
                        key={`new-${imgIdx}`}
                        className="relative w-16 h-16 rounded-lg border border-stroke overflow-hidden group"
                      >
                        <img
                          src={previewUrl}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            URL.revokeObjectURL(previewUrl);
                            setProductColors((prev) =>
                              prev.map((item) =>
                                item.color === pc.color
                                  ? {
                                      ...item,
                                      images: item.images.filter((_, idx) => idx !== imgIdx),
                                    }
                                  : item,
                              ),
                            );
                          }}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                        >
                          {t("delete")}
                        </button>
                      </div>
                    );
                  })}
                  <label className="w-16 h-16 rounded-lg border-2 border-dashed border-stroke hover:border-primary hover:text-primary flex flex-col items-center justify-center cursor-pointer transition text-gray-text bg-card">
                    <span className="text-xl font-bold">+</span>
                    <span className="text-[9px] font-['Montserrat']">{t("add")}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const err = await validateImageDimensions(file);
                          if (err) {
                            toast.error(t("imageDimensionsErrorWithColor", { color: pc.color, err, defaultValue: `${pc.color} Image: ${err}` }));
                            e.target.value = "";
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

              {/* Variant Table (Sizes & Stock) */}
              <div className="space-y-2">
                <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                  {t("sizesQuantities")}
                </p>
                {pc.variants.length > 0 && (
                  <table className="w-full text-left font-['Montserrat'] text-xs border border-stroke rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-secondary text-primary font-bold">
                        <th className="p-2 border-b border-stroke">{t("size")}</th>
                        <th className="p-2 border-b border-stroke">{t("quantity")}</th>
                        <th className="p-2 border-b border-stroke text-right">{t("action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pc.variants.map((v, vIdx) => (

                         <tr key={vIdx} className="bg-card border-b border-stroke last:border-none">
                          <td className="p-2 font-semibold">{v.size}</td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={v.quantity === 0 ? "" : v.quantity}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setProductColors((prev) =>
                                  prev.map((item) =>
                                    item.color === pc.color
                                      ? {
                                          ...item,
                                          variants: item.variants.map((v2, i2) =>
                                            i2 === vIdx ? { ...v2, quantity: val } : v2
                                          ),
                                        }
                                      : item
                                  )
                                );
                              }}
                              className="w-16 rounded border border-stroke px-2 py-1 outline-none focus:border-primary text-foreground"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setProductColors((prev) =>
                                  prev.map((item) =>
                                    item.color === pc.color
                                      ? {
                                          ...item,
                                          variants: item.variants.filter((_, i2) => i2 !== vIdx),
                                        }
                                      : item
                                  )
                                );
                              }}
                              className="text-red-500 font-semibold text-[10px]"
                            >
                              {t("remove")}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <select
                    className="flex-1 rounded-lg border border-stroke px-2 py-1.5 font-['Montserrat'] text-xs outline-none focus:border-primary"
                    onChange={(e) => {
                      const sz = e.target.value;
                      if (!sz) return;
                      setProductColors((prev) =>
                        prev.map((item) => {
                          if (item.color === pc.color) {
                            if (item.variants.some((v) => v.size === sz)) return item;
                            return { ...item, variants: [...item.variants, { size: sz, quantity: 0 }] };
                          }
                          return item;
                        })
                      );
                      e.target.value = ""; // reset
                    }}
                  >
                    <option value="">{t("addSize")}</option>
                    {SIZE_OPTIONS.map((sz) => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 gap-4 mt-2">
            <div className="flex items-center justify-between rounded-xl border border-stroke p-3">
              <span className="font-['Montserrat'] text-sm font-semibold text-foreground">
                {t("isFeatured")}
              </span>
              <Toggle
                checked={isFeatured}
                onChange={setIsFeatured}
                size="md"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-stroke py-3 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:bg-background"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={
                uploading ||
                isSubmitting ||
                !name ||
                !price ||
                !categoryId ||
                productColors.length === 0
              }
              className="flex-1 rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {uploading ? t("uploading") : isSubmitting ? t("saving") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// Fallback date to avoid calling Date.now() during render (react-hooks/purity)
const FALLBACK_DATE_RAW = Date.now();
const FALLBACK_DATE_STR = new Date(FALLBACK_DATE_RAW).toLocaleDateString(
  "en-US",
  {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
);

// --- Main Page Component ---
export default function TraderRetailProductsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<RetailProduct | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { t } = useTranslation("traderProduct");

  const {
    data: rawProducts = [],
    isLoading,
    isError,
    error: errorMsg,
  } = useTraderRetailProducts();

  const createProduct = useCreateRetailProduct();
  const updateProduct = useUpdateRetailProduct();
  const deleteProduct = useDeleteRetailProduct();

  // Handle parsing the array properly in case it is nested
  const raw = rawProducts as Record<string, unknown>;

  let productsArray: RetailProduct[] = [];
  if (Array.isArray(rawProducts)) {
    productsArray = rawProducts as RetailProduct[];
  } else if (Array.isArray(raw?.data)) {
    productsArray = raw.data as RetailProduct[];
  } else if (Array.isArray((raw?.data as Record<string, unknown>)?.products)) {
    productsArray = (raw.data as Record<string, unknown>).products as RetailProduct[];
  } else if (Array.isArray(raw?.products)) {
    productsArray = raw.products as RetailProduct[];
  }

  // Map into InventoryItem format for the shared InventoryTablePanel
  const items: InventoryItem[] = productsArray.map((p) => {
    const mainImg =
       p.images?.[0]?.url || "";

    const pRaw = p as RetailProduct & { createdAt?: string | number };
    const pDate =
      typeof pRaw.createdAt === "string" || typeof pRaw.createdAt === "number"
        ? new Date(pRaw.createdAt)
        : null;

    const imagesArr = (p.images as unknown as Record<string, unknown>[]) || [];
    const allImages: { url: string; color?: string }[] = imagesArr.map((i) => ({ url: i.url as string, color: i.color as string }));
    if (allImages.length === 0 && mainImg) {
      allImages.push({ url: mainImg });
    }

    const sizesArr = (p.sizes as unknown as Record<string, unknown>[]) || [];
    const uniqueSizes = Array.from(new Set(sizesArr.map((s) => (s.name || s.size) as string)));
    
    const colorsArr = (p.colors as unknown as Record<string, unknown>[]) || [];
    const uniqueColors = Array.from(new Set(colorsArr.map((c) => (c.name || c.color || c) as string)));

    return {
      id: String(p.id),
      image: mainImg,
      imagesByColor: allImages,
      product: p.name,
      category: p.category?.name || t("noCategory"),
      categoryId: String(p.categoryId),
      brandId: p.brandId || p.brand?.id || "",
      stock: p.stock ?? 0,
      sku: p.sku || "",
      price: `$${p.price}`,
      priceNum: Number(p.price) || 0,
      depositAmount: p.depositAmount,
      securityDeposit: p.securityDeposit,
      date: pDate
        ? pDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : FALLBACK_DATE_STR,
      createdAtRaw: pDate ? pDate.getTime() : FALLBACK_DATE_RAW,
      status: getStatus(p.stock ?? 0),
      type: "product" as const,
      description: p.description || "",
      sizes: uniqueSizes as string[],
      colors: uniqueColors as string[],
      minOrder: 1,
      isMustHave: false,
      isFlashDeals: false,
      flashDealPrice: null,
      flashDealEndsAt: null,
      isBestDeal: false,
      isMostPopular: false,
      isPremiumCollection: false,
    };
  });

  const errorMessages = isError
    ? [
        (
          errorMsg as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ??
          (errorMsg as { message?: string })?.message ??
          t("failedToLoadProducts"),
      ]
    : [];

  return (
    <>
      {showAddModal && (
        <RetailProductFormModal
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            try {
              await createProduct.mutateAsync(data);
              setShowAddModal(false);
              toast.success(t("retailProductCreatedSuccess"));
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : t("failedToCreateProduct"),
              );
            }
          }}
        />
      )}
      {editProduct && (
        <RetailProductFormModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={async (formData) => {
            try {
              await updateProduct.mutateAsync({
                id: editProduct.id,
                data: formData,
              });
              setEditProduct(null);
              toast.success(t("retailProductUpdatedSuccess"));
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : t("failedToUpdateProduct"),
              );
            }
          }}
        />
      )}

      <InventoryTablePanel
        items={items}
        isLoading={isLoading}
        errorMessages={errorMessages}
        onAdd={() => setShowAddModal(true)}
        onEdit={(item) => {
          const raw = productsArray.find(
            (p) => String(p.id) === String(item.id),
          );
          if (raw) setEditProduct(raw);
        }}
        onDelete={(item) => setDeleteId(item.id)}
        showTypeFilter={false}
        showRetailColumns={true}
        title="Retail Products"
        addLabel="Add Retail Product"
      />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 space-y-4 shadow-xl">
            <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">
              {t("deleteProduct")}
            </h3>
            <p className="font-['Montserrat'] text-sm text-gray-text">
              {t("deleteConfirmation")}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-stroke py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground bg-card hover:bg-background transition"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct.mutate(deleteId, {
                    onSuccess: () => toast.success(t("productDeletedSuccess")),
                    onError: () => toast.error(t("failedToDeleteProduct")),
                  });
                  setDeleteId(null);
                }}
                className="flex-1 rounded-xl bg-red-600 py-2.5 font-['Montserrat'] text-sm font-bold text-white transition hover:bg-red-700"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
