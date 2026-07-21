import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCategories } from "../../hooks/queries/categoriesQuery";
import { useBrands } from "../../hooks/queries/brandsQuery";
import {
  useCreateProduct,
  useUpdateProduct,
  useProduct,
  type ProductFormData,
  useAddProductColor,
  useDeleteProductColor,
  useReplaceProductColorImages,
  useAddProductColorImages,
  useDeleteProductImage,
  useUpdateProductSizeQuantity,
  useAddProductSize,
  useDeleteProductSize,
} from "../../hooks/queries/productsQuery";
import { useWholesale } from "../../hooks/queries/wholesaleQuery";


import ImageCropModal, {
  validateImageDimensions,
  MIN_IMG_WIDTH,
  MIN_IMG_HEIGHT,
} from "./ImageCropModal";
import {
  type InventoryItem,
  type InventoryStatus,
  type ProductType,
  asset,
  SIZE_OPTIONS,
  COLOR_OPTIONS,
  PAGE_SIZE_OPTIONS,
  statusPill,
  typePill,
  uploadImageFile,
} from "./inventoryUtils";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "../shared";
import { Toggle } from "../ui";

// ─── MultiSelect ───────────────────────────────────────────────────────────────
export function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: (string | { value: string; label: string })[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt],
    );
  };

  const displaySelected = selected.map(s => {
    const obj = options.find(o => typeof o === 'object' && o.value === s);
    return obj && typeof obj === 'object' ? obj.label : s;
  });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm text-foreground bg-white outline-none focus:border-primary"
      >
        <span className={selected.length === 0 ? "text-gray-text" : ""}>
          {selected.length === 0 ? label : displaySelected.join(", ")}
        </span>
        <svg
          className={`h-4 w-4 text-gray-text transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-stroke bg-white shadow-lg">
          <div className="flex flex-wrap gap-2 p-3">
            {options.map((opt) => {
              const val = typeof opt === 'string' ? opt : opt.value;
              const lbl = typeof opt === 'string' ? opt : opt.label;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => toggle(val)}
                  className={`rounded-lg border px-3 py-1 font-['Montserrat'] text-xs font-medium transition ${selected.includes(val)
                      ? "border-primary bg-primary text-foreground"
                      : "border-stroke bg-white text-foreground hover:bg-background"
                    }`}
                >
                  {lbl}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ColorImageUpload ──────────────────────────────────────────────────────────
export function ColorImageUpload({
  color,
  preview,
  onChange,
}: {
  color: string;
  preview: string;
  onChange: (color: string, file: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropFileName, setCropFileName] = useState("");
  const [dimError, setDimError] = useState("");
  const { t } = useTranslation("traderProduct");
  const handleFile = async (file: File) => {
    setDimError("");
    const err = await validateImageDimensions(file);
    if (err) {
      setDimError(err);
      return;
    }
    setCropFileName(file.name);
    setCropSrc(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          fileName={cropFileName}
          onConfirm={(croppedFile) => {
            URL.revokeObjectURL(cropSrc);
            setCropSrc(null);
            onChange(color, croppedFile);
          }}
          onCancel={() => {
            URL.revokeObjectURL(cropSrc);
            setCropSrc(null);
          }}
        />
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="w-full rounded-xl border-2 border-dashed border-stroke py-3 font-['Montserrat'] text-xs text-gray-text hover:border-primary hover:text-primary transition flex flex-col items-center gap-1"
      >
        {preview ? (
          <img
            src={preview}
            alt={color}
            className="h-14 w-14 rounded-lg object-cover"
          />
        ) : (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span>{color}</span>
      </button>
      {dimError && (
        <p className="text-center font-['Montserrat'] text-[10px] leading-tight text-red-600">
          {dimError}
        </p>
      )}
      {!dimError && !preview && (
        <p className="font-['Montserrat'] text-[10px] text-gray-text">
          {t("minImageSize", {
            width: MIN_IMG_WIDTH,
            height: MIN_IMG_HEIGHT,
          })}
        </p>
      )}
    </div>
  );
}

interface ProductColor {
  color: string;
  images: File[];
  variants: {
    size: string;
    quantity: number;
  }[];
  stock?: number;
}

// ─── Add Item Modal ────────────────────────────────────────────────────────────
export function AddItemModal({
  onClose,
  lockedType,
}: {
  onClose: () => void;
  lockedType?: ProductType;
}) {
  const [type, setType] = useState<ProductType>(lockedType ?? "product");
  const [name, setName] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [brandId, setBrandId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [productColors, setProductColors] = useState<ProductColor[]>([]);
  const [minOrder, setMinOrder] = useState("1");
  const [description, setDescription] = useState("");
  const [sharedSizes, setSharedSizes] = useState<string[]>([]);

  const handleAddPackage = () => {
    setProductColors((prev) => [
      ...prev,
      {
        color: "",
        images: [],
        variants: sharedSizes.map((size) => ({ size, quantity: 0 })),
        stock: 0,
      },
    ]);
  };

  const handleRemovePackage = (index: number) => {
    setProductColors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSharedSizesChange = (newSizes: string[]) => {
    setSharedSizes(newSizes);
    setProductColors((prev) =>
      prev.map((pc) => {
        const updatedVariants = newSizes.map((size) => {
          const existing = pc.variants.find((v) => v.size === size);
          return existing ? existing : { size, quantity: 0 };
        });
        return {
          ...pc,
          variants: updatedVariants,
        };
      })
    );
  };

  const [cropState, setCropState] = useState<{
    color: string;
    src: string;
    name: string;
  } | null>(null);



  const [isMustHave, setIsMustHave] = useState(false);
  const [isFlashDeals, setIsFlashDeals] = useState(false);
  const [flashDealPrice, setFlashDealPrice] = useState("");
  const [flashDealEndsAt, setFlashDealEndsAt] = useState("");
  const [isBestDeal, setIsBestDeal] = useState(false);
  const [isMostPopular, setIsMostPopular] = useState(false);
  const [isPremiumCollection, setIsPremiumCollection] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const { data: categories = [] } = useCategories(type === "wholesale" ? "WHOLESALE" : undefined);
  const { data: brands = [] } = useBrands();
  const createProduct = useCreateProduct();
  const isSaving = createProduct.isPending;
  const { t } = useTranslation("traderProduct");
  const { t: tShared } = useTranslation("traderInventoryShared");
  const handleColorsChange = (colors: string[]) => {
    setSelectedColors(colors);
    setProductColors((prev) => {
      const next = prev.filter((pc) => colors.includes(pc.color));
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
    if (!name || categoryIds.length === 0 || !price) {
      setError("Name, category and price are required.");
      return;
    }
    if (type === "wholesale") {
      if (productColors.length === 0) {
        setError("Please add at least one package.");
        return;
      }
      for (let i = 0; i < productColors.length; i++) {
        const pc = productColors[i];
        if (!pc.color) {
          setError(`Please select a color for Package #${i + 1}.`);
          return;
        }
        const isDuplicate = productColors.some((p, idx) => p.color === pc.color && idx !== i);
        if (isDuplicate) {
          setError(`Duplicate color selected: ${pc.color} is used in multiple packages.`);
          return;
        }
        if (pc.images.length === 0) {
          setError(`Please upload at least one image for Package #${i + 1} (${pc.color}).`);
          return;
        }
        if ((pc.stock ?? 0) < 0) {
          setError(`Stock for Package #${i + 1} (${pc.color}) cannot be negative.`);
          return;
        }
      }
      if (sharedSizes.length === 0) {
        setError("Please select at least one shared size.");
        return;
      }
      if ((Number(minOrder) || 0) < 1) {
        setError("Min order quantity must be at least 1.");
        return;
      }
    } else if (type === "product") {
      if (productColors.length === 0) {
        setError("Please select at least one color.");
        return;
      }
      for (const pc of productColors) {
        if (pc.images.length === 0) {
          setError(`Please upload at least one image for: ${pc.color}`);
          return;
        }
        if (pc.variants.length === 0) {
          setError(`Please add at least one size variant for: ${pc.color}`);
          return;
        }
        for (const v of pc.variants) {
          if (v.quantity < 0) {
            setError(
              `Quantity for ${pc.color} size ${v.size} cannot be negative.`,
            );
            return;
          }
        }
      }
    }

    try {
      setUploading(true);

      const colorsData = await Promise.all(
        productColors.map(async (pc) => {
          const urls = await Promise.all(pc.images.map(uploadImageFile));
          const colorStock = pc.stock ?? pc.variants.reduce((s, v) => s + v.quantity, 0);
          return {
            color: pc.color,
            minOrder: type === "wholesale" ? (Number(minOrder) || 1) : 1,
            stock: colorStock,
            images: urls.map((url) => ({ url, color: pc.color })),
            sizes: pc.variants.map((v) => ({ size: v.size, quantity: v.quantity })),
          };
        })
      );

      const allImages = colorsData.flatMap((c) => c.images);
      const calculatedStock = colorsData.reduce((sum, c) => sum + c.stock, 0);

      const payload: ProductFormData = {
        name,
        description,
        categoryIds,
        sku: sku || undefined,
        stock: calculatedStock,
        productTypes: [type.toUpperCase()],
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

      if (type === "wholesale") {
        payload.wholesalePrice = Number(price);
        payload.minOrder = Number(minOrder) || 1;
        payload.isBestDeal = isBestDeal;
        payload.isMostPopular = isMostPopular;
        payload.isPremiumCollection = isPremiumCollection;
      } else {
        payload.shopPrice = Number(price);
        payload.isMustHave = isMustHave;
        payload.isFlashDeals = isFlashDeals;
        if (isFlashDeals) {
          payload.flashDealPrice = Number(flashDealPrice);
          payload.flashDealEndsAt = flashDealEndsAt;
        }
      }

      setUploading(false);
      await createProduct.mutateAsync(payload);
      onClose();
    } catch (err: unknown) {
      setUploading(false);
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        e?.response?.data?.message ?? e?.message ?? t("somethingWentWrong"),
      );
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
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {tShared("addItem")}
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
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-5 overflow-y-auto"
        >
          {!lockedType && (
            <div className="flex gap-2">
              {(["product", "wholesale"] as ProductType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 rounded-lg border py-2 font-['Montserrat'] text-sm font-semibold capitalize transition ${type === t ? "border-primary bg-primary text-foreground" : "border-stroke bg-white text-gray-text"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <input
            placeholder={tShared("namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
          />

          <label className="text-xs font-semibold text-gray-text">Category *</label>
          <MultiSelect
            label={tShared("selectCategory")}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            selected={categoryIds}
            onChange={setCategoryIds}
          />

          {type === "product" && (
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
            >
              <option value="">{tShared("selectBrand")}</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}

          <textarea
            placeholder={tShared("descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="rounded-xl min-h-[70px] border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary resize-none"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder={tShared("pricePlaceholder")}
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
            />
            <input
              placeholder={tShared("stockPlaceholder")}
              type="text"
              readOnly
              disabled
              value={
                type === "wholesale"
                  ? productColors.reduce((sum, c) => sum + (c.stock ?? 0), 0) || ""
                  : productColors.reduce(
                    (sum, c) =>
                      sum + c.variants.reduce((s, v) => s + v.quantity, 0),
                    0,
                  ) || ""
              }
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none text-gray-text cursor-not-allowed"
            />
          </div>

          <input
            placeholder={tShared("skuPlaceholder")}
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
          />

          {type === "product" && (
            <div className="flex flex-col gap-3 rounded-xl border border-stroke p-3">
              <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                {tShared("productAttributes")}
              </p>
              {/* Must Have toggle */}
              <div className="flex items-center justify-between">
                <span className="font-['Montserrat'] text-sm text-foreground">
                  {tShared("mustHave")}
                </span>
                <Toggle
                  checked={isMustHave}
                  onChange={setIsMustHave}
                  size="md"
                />
              </div>
              {/* Flash Deal toggle */}
              <div className="flex items-center justify-between">
                <span className="font-['Montserrat'] text-sm text-foreground">
                  {tShared("flashDeal")}
                </span>
                <Toggle
                  checked={isFlashDeals}
                  onChange={setIsFlashDeals}
                  size="md"
                />
              </div>
              {/* Flash deal extra fields */}
              {isFlashDeals && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    placeholder={tShared("dealPricePlaceholder")}
                    type="number"
                    min="0"
                    value={flashDealPrice}
                    onChange={(e) => setFlashDealPrice(e.target.value)}
                    className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
                  />
                  <input
                    type="datetime-local"
                    value={flashDealEndsAt}
                    onChange={(e) => setFlashDealEndsAt(e.target.value)}
                    className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
                  />
                </div>
              )}
            </div>
          )}
          {type === "product" && (
            <>
              <MultiSelect
                label={tShared("selectColors")}
                options={COLOR_OPTIONS}
                selected={selectedColors}
                onChange={handleColorsChange}
              />

              {productColors.map((pc, colorIdx) => (
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
                          selectedColors.filter((c) => c !== pc.color),
                        )
                      }
                      className="text-error hover:opacity-80 text-xs font-semibold font-['Montserrat']"
                    >
                      {tShared("removeColor")}
                    </button>
                  </div>

                  {/* Multiple Image Upload */}
                  <div className="space-y-2">
                    <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                      {tShared("uploadImages")}
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                      {pc.images.map((imgFile, imgIdx) => {
                        const previewUrl = URL.createObjectURL(imgFile);
                        return (
                          <div
                            key={imgIdx}
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
                              {tShared("delete")}
                            </button>
                          </div>
                        );
                      })}
                      {/* Upload Button */}
                      <label className="w-16 h-16 rounded-lg border-2 border-dashed border-stroke hover:border-primary hover:text-primary flex flex-col items-center justify-center cursor-pointer transition text-gray-text bg-card">
                        <span className="text-xl font-bold">+</span>
                        <span className="text-[9px] font-['Montserrat']">
                          {tShared("add")}
                        </span>
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
                    {pc.images.length === 0 && (
                      <p className="text-error font-['Montserrat'] text-[10px]">
                        {tShared("atLeastOneImageRequired")}
                      </p>
                    )}
                  </div>

                  {/* Variant Table (Sizes & Stock) */}
                  <div className="space-y-2">
                    <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                      {tShared("sizesQuantities")}
                    </p>
                    {pc.variants.length > 0 && (
                      <table className="w-full text-left font-['Montserrat'] text-xs border border-stroke rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-secondary text-primary font-bold">
                            <th className="p-2 border-b border-stroke">
                              {tShared("size")}
                            </th>
                            <th className="p-2 border-b border-stroke">
                              {tShared("quantity")}
                            </th>
                            <th className="p-2 border-b border-stroke text-right">
                              {tShared("action")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {pc.variants.map((v, vIdx) => (
                            <tr
                              key={vIdx}
                              className="bg-card border-b border-stroke last:border-none"
                            >
                              <td className="p-2 font-semibold">{v.size}</td>
                              <td className="p-2">
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
                                            variants: item.variants.filter(
                                              (_, idx) => idx !== vIdx,
                                            ),
                                          }
                                          : item,
                                      ),
                                    );
                                  }}
                                  className="text-error hover:opacity-80"
                                >
                                  {tShared("delete")}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {pc.variants.length === 0 && (
                      <p className="text-error font-['Montserrat'] text-[10px]">
                        {tShared("atLeastOneSizeRequired")}
                      </p>
                    )}

                    {/* Add Size Controls */}
                    <div className="flex gap-2 items-center pt-2">
                      <select
                        id={`add-size-select-${pc.color}`}
                        className="flex-1 border border-stroke rounded-xl px-3 py-1.5 text-xs font-['Montserrat'] bg-card outline-none focus:border-primary"
                      >
                        <option value="">{tShared("size")}</option>
                        {SIZE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="0"
                        id={`add-size-qty-${pc.color}`}
                        placeholder={tShared("qty")}
                        defaultValue="10"
                        className="w-16 border border-stroke rounded-xl px-3 py-1.5 text-xs font-['Montserrat'] outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const sizeSel = document.getElementById(
                            `add-size-select-${pc.color}`,
                          ) as HTMLSelectElement;
                          const qtySel = document.getElementById(
                            `add-size-qty-${pc.color}`,
                          ) as HTMLInputElement;
                          const sizeVal = sizeSel?.value;
                          const qtyVal = Number(qtySel?.value || 0);

                          if (!sizeVal) {
                            setError(tShared("pleaseSelectSizeFirst"));
                            return;
                          }
                          if (qtyVal < 0) {
                            setError(tShared("quantityNegative"));
                            return;
                          }
                          if (pc.variants.some((v) => v.size === sizeVal)) {
                            setError(
                              tShared("sizeExists", { size: sizeVal, color: pc.color }),
                            );
                            return;
                          }

                          setError("");
                          setProductColors((prev) =>
                            prev.map((item) =>
                              item.color === pc.color
                                ? {
                                  ...item,
                                  variants: [
                                    ...item.variants,
                                    { size: sizeVal, quantity: qtyVal },
                                  ],
                                }
                                : item,
                            ),
                          );
                          sizeSel.value = "";
                        }}
                        className="rounded-xl border border-stroke hover:bg-background px-3 py-1.5 text-xs font-semibold font-['Montserrat'] transition shrink-0 bg-card"
                      >
                        {tShared("addSize")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {type === "wholesale" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Montserrat'] text-xs font-semibold text-foreground">
                  {tShared("sharedSizes")}
                </label>
                <MultiSelect
                  label={tShared("selectSharedSizes")}
                  options={SIZE_OPTIONS}
                  selected={sharedSizes}
                  onChange={handleSharedSizesChange}
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                  {tShared("packages")}
                </p>
                <button
                  type="button"
                  onClick={handleAddPackage}
                  className="rounded-xl bg-primary px-3 py-1.5 font-['Montserrat'] text-xs font-bold text-foreground transition hover:opacity-90"
                >
                  + {tShared("addPackage")}
                </button>
              </div>

              {productColors.map((pc, colorIdx) => (
                <div
                  key={colorIdx}
                  className="rounded-xl border border-stroke p-4 space-y-3 bg-gray-50"
                >
                  <div className="flex items-center justify-between border-b border-stroke pb-2">
                    <h4 className="font-['Montserrat'] text-sm font-bold text-foreground">
                      {tShared("package")} #{colorIdx + 1} {pc.color ? `(${pc.color})` : ""}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleRemovePackage(colorIdx)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold font-['Montserrat']"
                    >
                      {tShared("removePackage")}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="flex flex-col gap-1">
                      <label className="font-['Montserrat'] text-xs font-semibold text-foreground">
                        {tShared("color")}
                      </label>
                      {(() => {
                        const chosenColors = productColors
                          .map((p, idx) => (idx !== colorIdx ? p.color : ""))
                          .filter(Boolean);
                        const availableColorOptions = COLOR_OPTIONS.filter((c) => !chosenColors.includes(c));
                        return (
                          <select
                            value={pc.color}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProductColors((prev) =>
                                prev.map((item, idx) =>
                                  idx === colorIdx ? { ...item, color: val } : item
                                )
                              );
                            }}
                            className="w-full border border-stroke rounded-xl px-3 py-2 font-['Montserrat'] text-xs outline-none focus:border-primary bg-white"
                          >
                            <option value="">{tShared("selectColor")}</option>
                            {availableColorOptions.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        );
                      })()}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-['Montserrat'] text-xs font-semibold text-foreground">
                        {tShared("stock")}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={pc.stock ?? 0}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setProductColors((prev) =>
                            prev.map((item, idx) =>
                              idx === colorIdx ? { ...item, stock: val } : item
                            )
                          );
                        }}
                        className="w-full border border-stroke rounded-xl px-3 py-2 font-['Montserrat'] text-xs outline-none focus:border-primary bg-white"
                      />
                    </div>
                  </div>

                  {/* Multiple Image Upload */}
                  <div className="space-y-2">
                    <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                      {tShared("uploadImages")}
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                      {pc.images.map((imgFile, imgIdx) => {
                        const previewUrl = URL.createObjectURL(imgFile);
                        return (
                          <div
                            key={imgIdx}
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
                                  prev.map((item, idx) =>
                                    idx === colorIdx
                                      ? {
                                        ...item,
                                        images: item.images.filter(
                                          (_, i) => i !== imgIdx,
                                        ),
                                      }
                                      : item,
                                  ),
                                );
                              }}
                              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                            >
                              {tShared("delete")}
                            </button>
                          </div>
                        );
                      })}
                      {/* Upload Button */}
                      <label className="w-16 h-16 rounded-lg border-2 border-dashed border-stroke hover:border-primary hover:text-primary flex flex-col items-center justify-center cursor-pointer transition text-gray-text bg-white">
                        <span className="text-xl font-bold">+</span>
                        <span className="text-[9px] font-['Montserrat']">
                          {tShared("add")}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const err = await validateImageDimensions(file);
                              if (err) {
                                toast.error(t("imageDimensionsErrorGeneral", { err, defaultValue: `Image dimensions error: ${err}` }));
                                e.target.value = "";
                                return;
                              }
                              setCropState({
                                color: String(colorIdx),
                                src: URL.createObjectURL(file),
                                name: file.name,
                              });
                            }
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                    {pc.images.length === 0 && (
                      <p className="text-red-500 font-['Montserrat'] text-[10px]">
                        {tShared("atLeastOneImageRequired")}
                      </p>
                    )}
                  </div>

                  {sharedSizes.length > 0 && (
                    <div className="pt-1.5 flex items-center gap-1.5">
                      <span className="font-['Montserrat'] text-[10px] font-semibold text-gray-text">
                        {tShared("sizes")}:
                      </span>
                      <span className="font-['Montserrat'] text-[10px] font-bold text-foreground bg-gray-200/60 px-2 py-0.5 rounded-md">
                        {sharedSizes.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
          {type === "wholesale" && (
            <>

              <div className="flex flex-col gap-1">
                <label className="font-['Montserrat'] text-xs font-semibold text-foreground">
                  {tShared("minOrderQuantity")}
                </label>
                <input
                  placeholder="Min order quantity"
                  type="number"
                  min="1"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-3 rounded-xl border border-stroke p-3 bg-white">
                <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                  Wholesale Attributes
                </p>
                {(
                  [
                    {
                      label: t("bestDeal"),
                      value: isBestDeal,
                      set: setIsBestDeal,
                    },
                    {
                      label: t("mostPopular"),
                      value: isMostPopular,
                      set: setIsMostPopular,
                    },
                    {
                      label: t("premiumCollection"),
                      value: isPremiumCollection,
                      set: setIsPremiumCollection,
                    },
                  ] as const
                ).map(({ label, value, set }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="font-['Montserrat'] text-sm text-foreground">
                      {label}
                    </span>
                    <button
                      type="button"
                      onClick={() => set((v) => !v)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-primary" : "bg-gray-200"}`}
                    >
                      <div
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {error && (
            <p className="font-['Montserrat'] text-xs text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSaving || uploading}
            className="rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {uploading
              ? tShared("uploadingImages")
              : isSaving
                ? tShared("saving")
                : tShared("addItem")}
          </button>
        </form>
      </div>
    </div>
  );
}

interface WholesaleColorEditState {
  color: string;
  minOrder: number;
  stock: number;
  images: { id?: string; url?: string; file?: File }[];
  variants: { id?: string; size: string; quantity?: number }[];
}

// ─── Edit Item Modal ───────────────────────────────────────────────────────────
export function EditItemModal({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) {
  const { t } = useTranslation("traderProduct");
  const { t: tShared } = useTranslation("traderInventoryShared");
  const isProductType = item.type === "product";

  const [name, setName] = useState(item.product);
  const [categoryIds, setCategoryIds] = useState<string[]>(item.categoryIds || []);
  const [brandId, setBrandId] = useState(item.brandId);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(String(item.priceNum));
  const [stock, setStock] = useState(String(item.stock));
  const [sku, setSku] = useState(item.sku);
  const [minOrder, setMinOrder] = useState(String(item.minOrder));
  const [isMustHave, setIsMustHave] = useState(item.isMustHave);
  const [isFlashDeals, setIsFlashDeals] = useState(item.isFlashDeals);
  const [flashDealPrice, setFlashDealPrice] = useState(
    item.flashDealPrice != null ? String(item.flashDealPrice) : "",
  );
  const [flashDealEndsAt, setFlashDealEndsAt] = useState(
    item.flashDealEndsAt ? item.flashDealEndsAt.slice(0, 16) : "",
  );
  const [isBestDeal, setIsBestDeal] = useState(item.isBestDeal);
  const [isMostPopular, setIsMostPopular] = useState(item.isMostPopular);
  const [isPremiumCollection, setIsPremiumCollection] = useState(
    item.isPremiumCollection,
  );

  // States for new color option addition
  const [newColorName, setNewColorName] = useState("");
  const [newColorImages, setNewColorImages] = useState<File[]>([]);
  const [newColorVariants, setNewColorVariants] = useState<
    { size: string; quantity: number }[]
  >([]);
  const [newColorCropState, setNewColorCropState] = useState<{
    src: string;
    name: string;
  } | null>(null);

  const [wholesaleColorsState, setWholesaleColorsState] = useState<WholesaleColorEditState[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [sharedSizes, setSharedSizes] = useState<string[]>([]);

  const handleAddPackageEdit = () => {
    setWholesaleColorsState((prev) => [
      ...prev,
      {
        color: "",
        minOrder: 1,
        stock: 0,
        images: [],
        variants: sharedSizes.map((size) => ({ size })),
      },
    ]);
  };

  const handleSharedSizesChangeEdit = (newSizes: string[]) => {
    setSharedSizes(newSizes);
    setWholesaleColorsState((prev) =>
      prev.map((wc) => {
        const updatedVariants = newSizes.map((size) => {
          const existing = wc.variants.find((v) => v.size === size);
          return existing ? existing : { size };
        });
        return {
          ...wc,
          variants: updatedVariants,
        };
      })
    );
  };

  const { data: categories = [] } = useCategories(!isProductType);
  const { data: brands = [] } = useBrands();
  const updateProduct = useUpdateProduct();
  const isSaving = updateProduct.isPending;

  // React Query fetch for nested colors & variants
  const { data: product, isLoading: productLoading } = useProduct(
    isProductType ? item.id : undefined,
  );

  const { data: wholesale, isLoading: wholesaleLoading } = useWholesale(
    !isProductType ? item.id : undefined,
  );

  useEffect(() => {
    if (wholesale) {
      const mapped = (wholesale.wholesaleColors || []).map((wc) => {
        const colorImages = (wholesale.images || [])
          .filter((img) => img.color === wc.color)
          .map((img) => ({ id: img.id, url: img.url }));
        const colorSizes = (wc.sizes || []).map((s) => ({
          id: s.id,
          size: s.size,
        }));
        return {
          color: wc.color,
          minOrder: wc.minOrder ?? 1,
          stock: wc.stock ?? 0,
          images: colorImages,
          variants: colorSizes,
        };
      });
      setWholesaleColorsState(mapped);

      const initialSizes = Array.from(
        new Set(
      (wholesale.wholesaleColors || []).flatMap((wc) => (wc.sizes || []).map((s) => s.size))
        )
      );
      setSharedSizes(initialSizes);
    }
  }, [wholesale]);

  // Granular mutation hooks
  const addColorMutation = useAddProductColor();
  const deleteColorMutation = useDeleteProductColor();
  const replaceColorImagesMutation = useReplaceProductColorImages();
  const addColorImagesMutation = useAddProductColorImages();
  const deleteImageMutation = useDeleteProductImage();
  const updateSizeQuantityMutation = useUpdateProductSizeQuantity();
  const addSizeMutation = useAddProductSize();
  const deleteSizeMutation = useDeleteProductSize();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      setUploading(true);
      const isProductType = item?.type === "product";

      if (isProductType) {
        await updateProduct.mutateAsync({
          id: item.id,
          name,
          description,
          price: Number(price),
          shopPrice: Number(price),
          categoryIds,
          brandId: brandId || undefined,
          sku: sku || undefined,
          isMustHave,
          isFlashDeals,
          flashDealPrice:
            isFlashDeals && flashDealPrice ? Number(flashDealPrice) : null,
          flashDealEndsAt:
            isFlashDeals && flashDealEndsAt ? flashDealEndsAt : null,
        });
      } else {
        if ((Number(minOrder) || 0) < 1) {
          setError(tShared("minOrderQuantityError"));
          setUploading(false);
          return;
        }
        if (wholesaleColorsState.length === 0) {
          setError(tShared("addAtLeastOnePackage"));
          setUploading(false);
          return;
        }
        for (let i = 0; i < wholesaleColorsState.length; i++) {
          const wc = wholesaleColorsState[i];
          if (!wc.color) {
            setError(tShared("selectColorForPackage", { index: i + 1 }));
            setUploading(false);
            return;
          }
          const isDuplicate = wholesaleColorsState.some((p, idx) => p.color === wc.color && idx !== i);
          if (isDuplicate) {
            setError(tShared("duplicateColor", { color: wc.color }));
            setUploading(false);
            return;
          }
          if (wc.images.length === 0) {
            setError(tShared("uploadAtLeastOneImageForPackage", { index: i + 1, color: wc.color }));
            setUploading(false);
            return;
          }
          if (wc.stock < 0) {
            setError(tShared("stockNegative", { index: i + 1, color: wc.color }));
            setUploading(false);
            return;
          }
        }
        
        const colorsData = await Promise.all(
          wholesaleColorsState.map(async (wc) => {
            const updatedImages = await Promise.all(
              wc.images.map(async (img) => {
                if (img.file) {
                  const url = await uploadImageFile(img.file);
                  return { url, color: wc.color };
                }
                return { url: img.url!, color: wc.color };
              })
            );
            return {
              color: wc.color,
              minOrder: Number(minOrder) || 1,
              stock: wc.stock ?? 0,
              images: updatedImages,
              sizes: wc.variants.map((v) => ({ size: v.size, quantity: v.quantity ?? 0 })),
            };
          })
        );

        const allImages = colorsData.flatMap((c) => c.images);
        const calculatedStock = colorsData.reduce((sum, c) => sum + c.stock, 0);

        const payload: Partial<ProductFormData> & { id: string } = {
          id: item.id,
          name,
          description,
          categoryIds,
          images: allImages,
          wholesalePrice: Number(price),
          minOrder: Number(minOrder) || 1,
          sku: sku || undefined,
          stock: calculatedStock,
          isBestDeal,
          isMostPopular,
          isPremiumCollection,
          colors: colorsData.map((c) => ({
            color: c.color,
            name: c.color,
            code: c.color,
            minOrder: c.minOrder,
            stock: c.stock,
            sizes: c.sizes,
          })),
        };

        if (brandId) payload.brandId = brandId;
        
        await updateProduct.mutateAsync(payload);
      }
    } catch (err: unknown) {
      setUploading(false);
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        e?.response?.data?.message ?? e?.message ?? t("somethingWentWrong"),
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {newColorCropState && (
        <ImageCropModal
          imageSrc={newColorCropState.src}
          fileName={newColorCropState.name}
          onConfirm={(croppedFile) => {
            URL.revokeObjectURL(newColorCropState.src);
            setNewColorCropState(null);
            setNewColorImages((prev) => [...prev, croppedFile]);
          }}
          onCancel={() => {
            URL.revokeObjectURL(newColorCropState.src);
            setNewColorCropState(null);
          }}
        />
      )}
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {t("edit")}{" "}
            {item.type === "product" ? t("product") : t("wholesale")}
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
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-5 overflow-y-auto"
        >
          <input
            placeholder={t("nameRequired")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
          />

          <label className="text-xs font-semibold text-gray-text">Category *</label>
          <MultiSelect
            label={t("selectCategory")}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            selected={categoryIds}
            onChange={setCategoryIds}
          />

          {item.type === "product" && (
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
            >
              <option value="">{t("selectBrandOptional")}</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}

          <textarea
            placeholder={t("description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="rounded-xl min-h-[70px] border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary resize-none"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder={t("priceRequired")}
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
            />

            <input
              placeholder={t("stockCalculated")}
              type="text"
              readOnly
              disabled
              value={
                item.type === "wholesale"
                  ? wholesaleLoading
                    ? "Loading..."
                    : (wholesaleColorsState || []).reduce((sum, c) => sum + (c.stock ?? 0), 0) || ""
                  : productLoading
                    ? "Loading..."
                    : product?.colors?.reduce(
                      (sum, c) =>
                        sum +
                        (c.variants?.reduce((s, v) => s + v.quantity, 0) ??
                          0),
                      0,
                    ) || ""
              }
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none text-gray-text cursor-not-allowed"
            />
          </div>

          <input
            placeholder={t("skuOptional")}
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
          />

          {item.type === "product" && (
            <div className="flex flex-col gap-3 rounded-xl border border-stroke p-3">
              <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                {t("productAttributes")}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-['Montserrat'] text-sm text-foreground">
                  {t("mustHave")}
                </span>
                <button
                  type="button"
                  onClick={() => setIsMustHave((v) => !v)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${isMustHave ? "bg-primary" : "bg-gray-200"}`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isMustHave ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-['Montserrat'] text-sm text-foreground">
                  {t("flashDeal")}
                </span>
                <button
                  type="button"
                  onClick={() => setIsFlashDeals((v) => !v)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${isFlashDeals ? "bg-primary" : "bg-gray-200"}`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isFlashDeals ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
              {isFlashDeals && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    placeholder={t("dealPrice")}
                    type="number"
                    min="0"
                    value={flashDealPrice}
                    onChange={(e) => setFlashDealPrice(e.target.value)}
                    className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
                  />
                  <input
                    type="datetime-local"
                    value={flashDealEndsAt}
                    onChange={(e) => setFlashDealEndsAt(e.target.value)}
                    className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
                  />
                </div>
              )}
            </div>
          )}

          {isProductType && (
            <div className="space-y-4">
              <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                {t("productColorsAndVariants")}
              </p>

              {productLoading && (
                <p className="text-gray-text font-['Montserrat'] text-xs">
                  {t("loadingVariants")}
                </p>
              )}

              {/* Render existing product colors & variants */}
              {product?.colors?.map((color) => (
                <div
                  key={color.id}
                  className="rounded-xl border border-stroke p-4 space-y-3 bg-gray-50"
                >
                  <div className="flex items-center justify-between border-b border-stroke pb-2">
                    <h4 className="font-['Montserrat'] text-sm font-bold text-foreground flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full border border-stroke"
                        style={{
                          backgroundColor: (
                            color.colorName ||
                            (color as any).color ||
                            ""
                          ).toLowerCase(),
                        }}
                      />
                      {color.colorName || (color as any).color}
                    </h4>
                    <button
                      type="button"
                      disabled={deleteColorMutation.isPending}
                      onClick={async () => {
                        if (
                          confirm(
                            `Are you sure you want to delete color "${color.colorName || (color as any).color}"?`,
                          )
                        ) {
                          try {
                            await deleteColorMutation.mutateAsync({
                              colorId: color.id,
                              productId: product.id,
                            });
                          } catch (err: any) {
                            setError(
                              err?.response?.data?.message ??
                              err?.message ??
                              t("failedDeleteColor"),
                            );
                          }
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold font-['Montserrat'] disabled:opacity-50"
                    >
                      {deleteColorMutation.isPending
                        ? "Deleting..."
                        : "Delete Color"}
                    </button>
                  </div>

                  {/* Color Images List */}
                  <div className="space-y-2">
                    <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                      {tShared("uploadImages")}
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                      {color.images?.map((img) => (
                        <div
                          key={img.id}
                          className="relative w-16 h-16 rounded-lg border border-stroke overflow-hidden group"
                        >
                          <img
                            src={img.imageUrl || img.url}
                            alt={color.colorName || (color as any).color}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            disabled={deleteImageMutation.isPending}
                            onClick={async () => {
                              if (color.images.length <= 1) {
                                setError(
                                  tShared("atLeastOneImageVariant"),
                                );
                                return;
                              }
                              try {
                                await deleteImageMutation.mutateAsync({
                                  imageId: img.id,
                                  productId: product.id,
                                });
                              } catch (err: any) {
                                setError(
                                  err?.response?.data?.message ??
                                  err?.message ??
                                  t("failedDeleteImage"),
                                );
                              }
                            }}
                            className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold disabled:opacity-50"
                          >
                            {tShared("delete")}
                          </button>
                        </div>
                      ))}

                      {/* Add Image Picker */}
                      <label className="w-16 h-16 rounded-lg border-2 border-dashed border-stroke hover:border-primary hover:text-primary flex flex-col items-center justify-center cursor-pointer transition text-gray-text bg-white">
                        <span className="text-xl font-bold">+</span>
                        <span className="text-[9px] font-['Montserrat']">
                          {t("add")}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const err = await validateImageDimensions(file);
                              if (err) {
                                toast.error(t("imageDimensionsError", { err, defaultValue: `Image dimensions: ${err}` }));
                                return;
                              }
                              const fd = new FormData();
                              fd.append("images", file);
                              try {
                                await addColorImagesMutation.mutateAsync({
                                  colorId: color.id,
                                  formData: fd,
                                  productId: product.id,
                                });
                              } catch (err: any) {
                                setError(
                                  err?.response?.data?.message ??
                                  err?.message ??
                                  tShared("failedToAddImage"),
                                );
                              }
                            }
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Size Variants Table */}
                  <div className="space-y-2">
                    <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                      {tShared("sizesQuantities")}
                    </p>
                    {color.variants && color.variants.length > 0 && (
                      <table className="w-full text-left font-['Montserrat'] text-xs border border-stroke rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-secondary text-primary font-bold">
                            <th className="p-2 border-b border-stroke">{tShared("size")}</th>
                            <th className="p-2 border-b border-stroke">
                              {tShared("quantity")}
                            </th>
                            <th className="p-2 border-b border-stroke text-right">
                              {tShared("action")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {color.variants.map((v) => (
                            <tr
                              key={v.id}
                              className="bg-white border-b border-stroke last:border-none"
                            >
                              <td className="p-2 font-semibold">{v.size}</td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  min="0"
                                  defaultValue={v.quantity}
                                  onBlur={async (e) => {
                                    const newQty = Number(e.target.value);
                                    if (newQty === v.quantity) return;
                                    if (newQty < 0) {
                                      setError("Quantity cannot be negative.");
                                      return;
                                    }
                                    try {
                                      await updateSizeQuantityMutation.mutateAsync(
                                        {
                                          variantId: v.id,
                                          quantity: newQty,
                                          productId: product.id,
                                        },
                                      );
                                    } catch (err: any) {
                                      setError(
                                        err?.response?.data?.message ??
                                        err?.message ??
                                        t("failedUpdateQuantity"),
                                      );
                                    }
                                  }}
                                  className="w-16 border border-stroke rounded px-1.5 py-0.5 outline-none focus:border-primary"
                                />
                              </td>
                              <td className="p-2 text-right">
                                <button
                                  type="button"
                                  disabled={deleteSizeMutation.isPending}
                                  onClick={async () => {
                                    if (color.variants.length <= 1) {
                                      setError(
                                        "A color variant must have at least one size variant.",
                                      );
                                      return;
                                    }
                                    try {
                                      await deleteSizeMutation.mutateAsync({
                                        variantId: v.id,
                                        productId: product.id,
                                      });
                                    } catch (err: any) {
                                      setError(
                                        err?.response?.data?.message ??
                                        err?.message ??
                                        "Failed to delete size.",
                                      );
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 disabled:opacity-50 font-semibold"
                                >
                                  {t("delete")}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {/* Add Size to Existing Color */}
                    <div className="flex gap-2 items-center pt-2">
                      <select
                        id={`edit-add-size-${color.id}`}
                        className="flex-1 border border-stroke rounded-xl px-3 py-1.5 text-xs font-['Montserrat'] bg-white outline-none focus:border-primary"
                      >
                        <option value="">{tShared("selectSize")}</option>
                        {SIZE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="0"
                        id={`edit-add-qty-${color.id}`}
                        placeholder={tShared("qty")}
                        defaultValue="10"
                        className="w-16 border border-stroke rounded-xl px-3 py-1.5 text-xs font-['Montserrat'] outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        disabled={addSizeMutation.isPending}
                        onClick={async () => {
                          const sizeSel = document.getElementById(
                            `edit-add-size-${color.id}`,
                          ) as HTMLSelectElement;
                          const qtySel = document.getElementById(
                            `edit-add-qty-${color.id}`,
                          ) as HTMLInputElement;
                          const sVal = sizeSel?.value;
                          const qVal = Number(qtySel?.value || 0);

                          if (!sVal) {
                            setError(t("selectSizeError"));
                            return;
                          }
                          if (qVal < 0) {
                            setError(t("negativeQuantity"));
                            return;
                          }
                          if (color.variants.some((v) => v.size === sVal)) {
                            setError(t("sizeAlreadyExists"));
                            return;
                          }

                          try {
                            setError("");
                            await addSizeMutation.mutateAsync({
                              colorId: color.id,
                              size: sVal,
                              quantity: qVal,
                              productId: product.id,
                            });
                            sizeSel.value = "";
                          } catch (err: any) {
                            setError(
                              err?.response?.data?.message ??
                              err?.message ??
                              "Failed to add size.",
                            );
                          }
                        }}
                        className="rounded-xl border border-stroke hover:bg-background px-3 py-1.5 text-xs font-semibold font-['Montserrat'] transition shrink-0 bg-white disabled:opacity-50"
                      >
                        Add Size
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Color Section */}
              <div className="rounded-xl border border-dashed border-stroke p-4 space-y-3 bg-white">
                <h4 className="font-['Montserrat'] text-xs font-bold text-foreground uppercase tracking-wider">
                  {t("addNewColorOption")}
                </h4>

                <div className="flex gap-2 items-center">
                  <select
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="w-full border border-stroke rounded-xl px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary bg-white"
                  >
                    <option value="">{t("color")}</option>
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upload Images for New Color */}
                {newColorName && (
                  <div className="space-y-2">
                    <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                      {t("uploadImagesForNewColor")} {newColorName} *
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                      {newColorImages.map((imgFile, idx) => {
                        const previewUrl = URL.createObjectURL(imgFile);
                        return (
                          <div
                            key={idx}
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
                                setNewColorImages((prev) =>
                                  prev.filter((_, i) => i !== idx),
                                );
                              }}
                              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                            >
                              Delete
                            </button>
                          </div>
                        );
                      })}
                      <label className="w-16 h-16 rounded-lg border-2 border-dashed border-stroke hover:border-primary hover:text-primary flex flex-col items-center justify-center cursor-pointer transition text-gray-text bg-white">
                        <span className="text-xl font-bold">+</span>
                        <span className="text-[9px] font-['Montserrat']">
                          {tShared("add")}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const err = await validateImageDimensions(file);
                              if (err) {
                                toast.error(t("newColorImageError", { err, defaultValue: `New color image: ${err}` }));
                                return;
                              }
                              setNewColorCropState({
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
                )}

                {/* Size list for New Color */}
                {newColorName && (
                  <div className="space-y-2">
                    <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                      {t("sizeVariantsFor", { color: newColorName })}
                    </p>
                    {newColorVariants.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newColorVariants.map((v, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 bg-gray-100 border border-stroke px-2.5 py-1 rounded-lg font-['Montserrat'] text-xs"
                          >
                            {v.size} ({v.quantity})
                            <button
                              type="button"
                              onClick={() =>
                                setNewColorVariants((prev) =>
                                  prev.filter((_, i) => i !== idx),
                                )
                              }
                              className="text-red-500 font-bold hover:text-red-700"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 items-center">
                      <select
                        id="new-color-size-sel"
                        className="flex-1 border border-stroke rounded-xl px-3 py-1.5 text-xs font-['Montserrat'] bg-white outline-none focus:border-primary"
                      >
                        <option value="">{tShared("selectSize")}</option>
                        {SIZE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="0"
                        id="new-color-qty-input"
                        placeholder={tShared("qty")}
                        defaultValue="10"
                        className="w-16 border border-stroke rounded-xl px-3 py-1.5 text-xs font-['Montserrat'] outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const sizeSel = document.getElementById(
                            "new-color-size-sel",
                          ) as HTMLSelectElement;
                          const qtySel = document.getElementById(
                            "new-color-qty-input",
                          ) as HTMLInputElement;
                          const sVal = sizeSel?.value;
                          const qVal = Number(qtySel?.value || 0);

                          if (!sVal) {
                            setError("Select a size.");
                            return;
                          }
                          if (qVal < 0) {
                            setError("Quantity cannot be negative.");
                            return;
                          }
                          if (newColorVariants.some((v) => v.size === sVal)) {
                            setError("Size already added.");
                            return;
                          }

                          setError("");
                          setNewColorVariants((prev) => [
                            ...prev,
                            { size: sVal, quantity: qVal },
                          ]);
                          sizeSel.value = "";
                        }}
                        className="rounded-xl border border-stroke hover:bg-background px-3 py-1.5 text-xs font-semibold font-['Montserrat'] transition bg-white"
                      >
                        Add Size
                      </button>
                    </div>
                  </div>
                )}

                {newColorName && (
                  <button
                    type="button"
                    disabled={addColorMutation.isPending}
                    onClick={async () => {
                      if (newColorImages.length === 0) {
                        setError(
                          "Please upload at least one image for the new color.",
                        );
                        return;
                      }
                      if (newColorVariants.length === 0) {
                        setError(
                          "Please add at least one size variant for the new color.",
                        );
                        return;
                      }

                      setError("");
                      try {
                        const fd = new FormData();
                        fd.append("colorName", newColorName);
                        fd.append("variants", JSON.stringify(newColorVariants));
                        newColorImages.forEach((imgFile) => {
                          fd.append("images", imgFile);
                        });

                        await addColorMutation.mutateAsync({
                          productId: product!.id,
                          formData: fd,
                        });

                        // Reset new color fields
                        setNewColorName("");
                        setNewColorImages([]);
                        setNewColorVariants([]);
                      } catch (err: any) {
                        setError(
                          err?.response?.data?.message ??
                          err?.message ??
                          "Failed to save new color option.",
                        );
                      }
                    }}
                    className="w-full bg-foreground text-white rounded-xl py-2 font-['Montserrat'] text-xs font-bold hover:bg-foreground/90 transition disabled:opacity-50"
                  >
                    {addColorMutation.isPending
                      ? t("addingColorOption")
                      : t("saveColorOption")}
                  </button>
                )}
              </div>
            </div>
          )}

          {item.type === "wholesale" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Montserrat'] text-xs font-semibold text-foreground">
                  {tShared("sharedSizes")}
                </label>
                <MultiSelect
                  label={tShared("selectSharedSizes")}
                  options={SIZE_OPTIONS}
                  selected={sharedSizes}
                  onChange={handleSharedSizesChangeEdit}
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                  {tShared("packages")}
                </p>
                <button
                  type="button"
                  onClick={handleAddPackageEdit}
                  className="rounded-xl bg-primary px-3 py-1.5 font-['Montserrat'] text-xs font-bold text-foreground transition hover:opacity-90"
                >
                  + {tShared("addPackage")}
                </button>
              </div>

              {wholesaleColorsState.map((wc, colorIdx) => (
                <div
                  key={colorIdx}
                  className="rounded-xl border border-stroke p-4 space-y-3 bg-gray-50 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-stroke pb-2">
                    <h4 className="font-['Montserrat'] text-sm font-bold text-foreground">
                      {tShared("package")} #{colorIdx + 1} {wc.color ? `(${wc.color})` : ""}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setWholesaleColorsState((prev) =>
                          prev.filter((_, idx) => idx !== colorIdx)
                        );
                      }}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold font-['Montserrat']"
                    >
                      {tShared("removePackage")}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="flex flex-col gap-1">
                      <label className="font-['Montserrat'] text-xs font-semibold text-foreground">
                        {tShared("color")}
                      </label>
                      {(() => {
                        const chosenColors = wholesaleColorsState
                          .map((p, idx) => (idx !== colorIdx ? p.color : ""))
                          .filter(Boolean);
                        const availableColorOptions = COLOR_OPTIONS.filter((c) => !chosenColors.includes(c));
                        return (
                          <select
                            value={wc.color}
                            onChange={(e) => {
                              const val = e.target.value;
                              setWholesaleColorsState((prev) =>
                                prev.map((item, idx) =>
                                  idx === colorIdx ? { ...item, color: val } : item
                                )
                              );
                            }}
                            className="w-full border border-stroke rounded-xl px-3 py-2 font-['Montserrat'] text-xs outline-none focus:border-primary bg-white"
                          >
                            <option value="">{tShared("selectColor")}</option>
                            {availableColorOptions.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        );
                      })()}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-['Montserrat'] text-xs font-semibold text-foreground">
                        {tShared("stock")}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={wc.stock ?? 0}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setWholesaleColorsState((prev) =>
                            prev.map((item, idx) =>
                              idx === colorIdx ? { ...item, stock: val } : item
                            )
                          );
                        }}
                        className="w-full border border-stroke rounded-xl px-3 py-2 font-['Montserrat'] text-xs outline-none focus:border-primary bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                      {tShared("uploadImages")}
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                      {wc.images.map((img, imgIdx) => {
                        const previewUrl = img.file ? URL.createObjectURL(img.file) : img.url;
                        return (
                          <div
                            key={imgIdx}
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
                                if (img.file) {
                                  URL.revokeObjectURL(previewUrl!);
                                }
                                setWholesaleColorsState((prev) =>
                                  prev.map((item, idx) =>
                                    idx === colorIdx
                                      ? {
                                        ...item,
                                        images: item.images.filter((_, i) => i !== imgIdx),
                                      }
                                      : item
                                  )
                                );
                              }}
                              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                            >
                              Delete
                            </button>
                          </div>
                        );
                      })}
                      <label className="w-16 h-16 rounded-lg border-2 border-dashed border-stroke hover:border-primary hover:text-primary flex flex-col items-center justify-center cursor-pointer transition text-gray-text bg-white">
                        <span className="text-xl font-bold">+</span>
                        <span className="text-[9px] font-['Montserrat']">{tShared("add")}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const err = await validateImageDimensions(file);
                              if (err) {
                                toast.error(t("imageDimensionsErrorGeneral", { err, defaultValue: `Image dimensions error: ${err}` }));
                                e.target.value = "";
                                return;
                              }
                              setWholesaleColorsState((prev) =>
                                prev.map((item, idx) =>
                                  idx === colorIdx
                                    ? {
                                      ...item,
                                      images: [...item.images, { file }],
                                    }
                                    : item
                                )
                              );
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {sharedSizes.length > 0 && (
                    <div className="pt-1.5 flex items-center gap-1.5">
                      <span className="font-['Montserrat'] text-[10px] font-semibold text-gray-text">
                        {tShared("sizes")}:
                      </span>
                      <span className="font-['Montserrat'] text-[10px] font-bold text-foreground bg-gray-200/60 px-2 py-0.5 rounded-md">
                        {sharedSizes.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <label className="font-['Montserrat'] text-xs font-semibold text-foreground">
                  {tShared("minOrderQuantity")}
                </label>
                <input
                  placeholder="Min order quantity"
                  type="number"
                  min="1"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-3 rounded-xl border border-stroke p-3 bg-white">
                <p className="font-['Montserrat'] text-xs font-semibold text-foreground">
                  {t("wholesaleAttributes")}
                </p>
                {(
                  [
                    {
                      label: "Best Deal",
                      value: isBestDeal,
                      set: setIsBestDeal,
                    },
                    {
                      label: "Most Popular",
                      value: isMostPopular,
                      set: setIsMostPopular,
                    },
                    {
                      label: "Premium Collection",
                      value: isPremiumCollection,
                      set: setIsPremiumCollection,
                    },
                  ] as const
                ).map(({ label, value, set }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="font-['Montserrat'] text-sm text-foreground">
                      {label}
                    </span>
                    <button
                      type="button"
                      onClick={() => set((v) => !v)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-primary" : "bg-gray-200"}`}
                    >
                      <div
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {error && (
            <p className="font-['Montserrat'] text-xs text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSaving || uploading}
            className="rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {uploading
              ? t("uploadingImages")
              : isSaving
                ? t("saving")
                : t("saveChanges")}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Inventory Table Panel ─────────────────────────────────────────────────────
interface InventoryTablePanelProps {
  items: InventoryItem[];
  isLoading: boolean;
  errorMessages?: string[];
  onAdd?: () => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  showTypeFilter?: boolean;
  showRetailColumns?: boolean;
  title?: string;
  addLabel?: string;
}

export function InventoryTablePanel({
  items,
  isLoading,
  errorMessages = [],
  onAdd,
  onEdit,
  onDelete,
  showTypeFilter = true,
  showRetailColumns = false,
  title = "Products Table",
  addLabel = "Add Item",
}: InventoryTablePanelProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const { t } = useTranslation("traderProduct");
  useEffect(() => {
    const handleClickOutside = () => setOpenFilter(null);
    if (openFilter) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openFilter]);

  const uniqueCategories = Array.from(
    new Set(items.flatMap((i) => i.categories?.map((c) => c.name) || [])),
  );

  const filtered = items
    .filter((i) => {
      const q = search.toLowerCase();
      const matchesSearch =
        i.product.toLowerCase().includes(q) ||
        (i.categories && i.categories.some((c) => c.name.toLowerCase().includes(q))) ||
        i.sku.toLowerCase().includes(q);
      const matchesCategory =
        filterCategory === "all" || (i.categories && i.categories.some((c) => c.name === filterCategory));
      const matchesStatus = filterStatus === "all" || i.status === filterStatus;
      const matchesType =
        !showTypeFilter || filterType === "all" || i.type === filterType;
      return matchesSearch && matchesCategory && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.priceNum - b.priceNum;
        case "price-desc":
          return b.priceNum - a.priceNum;
        case "name-asc":
          return a.product.localeCompare(b.product);
        case "name-desc":
          return b.product.localeCompare(a.product);
        case "stock-asc":
          return a.stock - b.stock;
        case "stock-desc":
          return b.stock - a.stock;
        case "date-asc":
          return a.createdAtRaw - b.createdAtRaw;
        case "none":
          return 0;
        default:
          return b.createdAtRaw - a.createdAtRaw;
      }
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setPage(1);
    setOpenFilter(null);
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === paginated.length
        ? new Set()
        : new Set(paginated.map((i) => i.id)),
    );
  };
  const allSelected =
    paginated.length > 0 && selected.size === paginated.length;

  const tableColumns = showTypeFilter
    ? [
      "image",
      "product",
      "category",
      "type",
      "stock",
      "sku",
      "price",
      ...(showRetailColumns ? ["Deposit", "Security"] : []),
      "date",
      "status",
      "actions",
    ]
    : [
      "image",
      "product",
      "category",
      "stock",
      "sku",
      "price",
      ...(showRetailColumns ? ["Deposit", "Security"] : []),
      "date",
      "status",
      "actions",
    ];

  const filterBtn = (key: string, label: string, active: boolean) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setOpenFilter(openFilter === key ? null : key);
      }}
      className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 font-['Montserrat'] text-xs font-medium transition ${active ? "border-primary bg-primary text-foreground" : "border-stroke bg-white text-foreground hover:bg-background"}`}
    >
      {label}
      <img
        className={`h-4 w-4 transition-transform ${openFilter === key ? "-rotate-90" : "rotate-90"}`}
        src={asset("weui_arrow-outlined.svg")}
        alt=""
      />
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Search + Add */}
      <div className="flex flex-wrap items-center justify-start gap-3">
        <label className="relative flex min-w-70 items-center">
          <img
            className="pointer-events-none absolute left-4 h-5 w-5"
            src={asset("mynaui_search.svg")}
            alt=""
          />
          <input
            type="text"
            placeholder={t("search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-2xl border border-stroke bg-white py-3 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-foreground outline-none transition placeholder:text-gray-text focus:border-stroke"
          />
        </label>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-3 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
          >
            <img className="h-5 w-5" src={asset("ic_round-plus.svg")} alt="" />
            {t(addLabel)}
          </button>
        )}
      </div>

      {/* Panel */}
      <section className="rounded-2xl border border-stroke bg-white shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
        {/* Panel header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">
              {t(title)}
            </h2>

            {/* Category */}
            <div className="relative">
              {filterBtn(
                "category",
                filterCategory === "all" ? t("category") : filterCategory,
                filterCategory !== "all",
              )}
              {openFilter === "category" && (
                <div className="absolute left-0 top-full z-20 mt-1 min-w-32 rounded-xl border border-stroke bg-white shadow-lg py-1">
                  {["all", ...uniqueCategories].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setFilterCategory(opt);
                        setOpenFilter(null);
                        setPage(1);
                      }}
                      className={`w-full px-3 py-2 text-left font-['Montserrat'] text-xs font-medium capitalize transition hover:bg-background ${filterCategory === opt ? "text-primary" : "text-foreground"}`}
                    >
                      {opt === "all" ? "All Categories" : opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="relative">
              {filterBtn(
                "status",
                filterStatus === "all" ? t("status") : filterStatus,
                filterStatus !== "all",
              )}
              {openFilter === "status" && (
                <div className="absolute left-0 top-full z-20 mt-1 min-w-35 rounded-xl border border-stroke bg-white shadow-lg py-1">
                  {(
                    [
                      t("all"),
                      t("active"),
                      t("lowStock"),
                      t("outOfStock"),
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setFilterStatus(opt);
                        setOpenFilter(null);
                        setPage(1);
                      }}
                      className={`w-full px-3 py-2 text-left font-['Montserrat'] text-xs font-medium transition hover:bg-background ${filterStatus === opt ? "text-primary" : "text-foreground"}`}
                    >
                      {opt === "all" ? "All Statuses" : opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Type */}
            {showTypeFilter && (
              <div className="relative">
                {filterBtn(
                  "type",
                  filterType === "all"
                    ? t("type")
                    : filterType === "product"
                      ? t("product")
                      : t("wholesale"),
                  filterType !== "all",
                )}
                {openFilter === "type" && (
                  <div className="absolute left-0 top-full z-20 mt-1 min-w-30 rounded-xl border border-stroke bg-white shadow-lg py-1">
                    {(["all", "product", "wholesale"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setFilterType(opt);
                          setOpenFilter(null);
                          setPage(1);
                        }}
                        className={`w-full px-3 py-2 text-left font-['Montserrat'] text-xs font-medium capitalize transition hover:bg-background ${filterType === opt ? "text-primary" : "text-foreground"}`}
                      >
                        {opt === "all"
                          ? "All Types"
                          : opt === "product"
                            ? "Product"
                            : "Wholesale"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sort by */}
            <div className="relative">
              {filterBtn(
                "sort",
                t("sortBy"),
                sortBy !== "date-desc" && sortBy !== "none",
              )}
              {openFilter === "sort" && (
                <div className="absolute left-0 top-full z-20 mt-1 min-w-40 rounded-xl border border-stroke bg-white shadow-lg py-1">
                  {[
                    { value: "none", label: t("none") },
                    { value: "date-desc", label: t("dateDesc") },
                    { value: "date-asc", label: t("dateAsc") },
                    { value: "price-asc", label: t("priceAsc") },
                    { value: "price-desc", label: t("priceDesc") },
                    { value: "stock-asc", label: t("stockAsc") },
                    { value: "stock-desc", label: t("stockDesc") },
                    { value: "name-asc", label: t("nameAsc") },
                    { value: "name-desc", label: t("nameDesc") },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.value);
                        setOpenFilter(null);
                        setPage(1);
                      }}
                      className={`w-full px-3 py-2 text-left font-['Montserrat'] text-xs font-medium transition hover:bg-background ${sortBy === opt.value ? "text-primary" : "text-foreground"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-2xl border border-stroke bg-white px-2 py-1">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1 rounded-2xl px-2 py-1 transition ${viewMode === "table" ? "bg-gray-light" : ""}`}
              >
                <img
                  className="h-6 w-6"
                  src={asset("material-symbols_table-outline.svg")}
                  alt=""
                />
                <span
                  className={`font-['Montserrat'] text-xs font-medium ${viewMode === "table" ? "text-foreground" : "text-gray-text"}`}
                >
                  {t("tables")}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-1 rounded-2xl px-2 py-1 transition ${viewMode === "cards" ? "bg-gray-light" : ""}`}
              >
                <img
                  className="h-6 w-6"
                  src={asset("clarity_view-cards-line.svg")}
                  alt=""
                />
                <span
                  className={`font-['Montserrat'] text-xs font-medium ${viewMode === "cards" ? "text-foreground" : "text-gray-text"}`}
                >
                  {t("cards")}
                </span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                const headers = showTypeFilter
                  ? [
                    "Product",
                    "Category",
                    "Type",
                    "Stock",
                    "SKU",
                    "Price",
                    ...(showRetailColumns ? ["Deposit", "Security Deposit"] : []),
                    "Date",
                    "Status",
                  ]
                  : [
                    "Product",
                    "Category",
                    "Stock",
                    "SKU",
                    "Price",
                    ...(showRetailColumns ? ["Deposit", "Security Deposit"] : []),
                    "Date",
                    "Status",
                  ];
                const rows = filtered.map((i) =>
                  showTypeFilter
                    ? [
                      i.product,
                      i.categories?.map((c) => c.name).join(", ") || "",
                      i.type,
                      i.stock,
                      i.sku,
                      i.priceNum,
                      ...(showRetailColumns ? [i.depositAmount ?? 0, i.securityDeposit ?? 0] : []),
                      i.date,
                      i.status,
                    ]
                    : [
                      i.product,
                      i.categories?.map((c) => c.name).join(", ") || "",
                      i.stock,
                      i.sku,
                      i.priceNum,
                      ...(showRetailColumns ? [i.depositAmount ?? 0, i.securityDeposit ?? 0] : []),
                      i.date,
                      i.status,
                    ],
                );
                const csv = [headers, ...rows]
                  .map((r) =>
                    r
                      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                      .join(","),
                  )
                  .join("\n");
                const blob = new Blob([csv], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${title.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
            >
              <img
                className="h-5 w-5"
                src={asset("download-cloud-02.svg")}
                alt=""
              />
              {t("export")}
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSpinner text={t("loading")} containerClassName="py-12" />
        ) : errorMessages.length > 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12">
            {errorMessages.map((msg, i) => (
              <p key={i} className="font-['Montserrat'] text-sm text-red-600">
                {msg}
              </p>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="font-['Montserrat'] text-sm text-gray-text">
              {t("noItemsFound", { addLabel })}
            </p>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginated.map((item) => {
              const pill = statusPill(item.status as InventoryStatus);
              const tp = typePill(item.type as ProductType);
              return (
                <div
                  key={item.id}
                  className="relative flex flex-col overflow-hidden rounded-lg border border-stroke bg-white"
                >
                  <div className="relative mx-2 mt-2 h-48 overflow-hidden rounded-lg">
                    {item.image ? (
                      <img
                        className="h-full w-full rounded-lg object-cover"
                        src={item.image}
                        alt={item.product}
                      />
                    ) : (
                      <div className="h-full w-full rounded-lg bg-background" />
                    )}
                    <span
                      className={`absolute right-3 top-3 inline-flex rounded-2xl px-2 py-1 text-sm font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}
                    >
                      {item.status}
                    </span>
                    {showTypeFilter && (
                      <span
                        className={`absolute left-3 top-3 inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${tp.bg} ${tp.text}`}
                      >
                        {tp.label}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 px-2 pb-3 pt-2">
                    <p className="truncate font-['Montserrat'] text-base font-semibold text-foreground">
                      {item.product}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-['Montserrat'] text-sm font-medium text-gray-text">
                        {item.categories?.map((c) => c.name).join(", ")}
                      </p>
                      <p className="shrink-0 font-['Montserrat'] text-sm text-gray-text">
                        SKU:{" "}
                        <span className="font-semibold text-foreground">
                          {item.sku}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                        {item.price}
                      </p>
                      <p className="shrink-0 font-['Montserrat'] text-sm text-gray-text">
                        Stock:{" "}
                        <span className="font-semibold text-foreground">
                          {item.stock}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                        >
                          <img
                            className="h-4 w-4"
                            src={asset("mynaui_edit.svg")}
                            alt="Edit"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                        >
                          <img
                            className="h-4 w-4"
                            src={asset("material-symbols_delete-outline.svg")}
                            alt="Delete"
                          />
                        </button>
                      </div>
                      <p className="font-['Montserrat'] text-xs font-medium text-gray-text">
                        {item.date}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-4 py-3">
                    <div
                      className="h-5 w-5 cursor-pointer rounded-md border border-primary bg-secondary flex items-center justify-center"
                      onClick={toggleAll}
                    >
                      {allSelected && (
                        <svg
                          className="h-3 w-3 text-primary"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                  {tableColumns.map((col) => (
                    <th
                      key={col}
                      className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap"
                    >
                      {col === "Deposit" || col === "Security" ? col : t(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((item, idx) => {
                  const isChecked = selected.has(item.id);
                  const pill = statusPill(item.status as InventoryStatus);
                  const tp = typePill(item.type as ProductType);
                  return (
                    <tr
                      key={item.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-background"}
                    >
                      <td className="px-4 py-3">
                        <div
                          className={`h-5 w-5 cursor-pointer rounded-md border flex items-center justify-center transition ${isChecked ? "border-secondary bg-secondary" : "border-gray-300 bg-white"}`}
                          onClick={() => toggleRow(item.id)}
                        >
                          {isChecked && (
                            <svg
                              className="h-3 w-3 text-white"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M2 6l3 3 5-5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item.image ? (
                          <img
                            className="mx-auto h-7 w-7 rounded-lg object-cover"
                            src={item.image}
                            alt={item.product}
                          />
                        ) : (
                          <div className="mx-auto h-7 w-7 rounded-lg bg-background" />
                        )}
                      </td>
                      <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                        {item.product}
                      </td>
                      <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                        {item.categories?.map(c => c.name).join(", ")}
                      </td>
                      {showTypeFilter && (
                        <td className="px-3 py-3 text-center">
                          <span
                            className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${tp.bg} ${tp.text}`}
                          >
                            {tp.label}
                          </span>
                        </td>
                      )}
                      <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                        {item.stock}
                      </td>
                      <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                        {item.sku}
                      </td>
                      <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                        {item.price}
                      </td>
                      {showRetailColumns && (
                        <>
                          <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                            ${item.depositAmount ?? 0}
                          </td>
                          <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                            ${item.securityDeposit ?? 0}
                          </td>
                        </>
                      )}
                      <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                          >
                            <img
                              className="h-4 w-4"
                              src={asset("mynaui_edit.svg")}
                              alt="Edit"
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(item)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                          >
                            <img
                              className="h-4 w-4"
                              src={asset("material-symbols_delete-outline.svg")}
                              alt="Delete"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 border-t border-stroke px-4 py-3">
          {/* Per-page selector */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenFilter(openFilter === "pagesize" ? null : "pagesize");
              }}
              className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-2.5 font-['Inter'] text-sm font-medium text-foreground transition hover:bg-background"
            >
              {t("perPage", { count: itemsPerPage })}
              <img
                className={`h-4 w-4 transition-transform ${openFilter === "pagesize" ? "rotate-180" : ""}`}
                src={asset("weui_arrow-outlined.svg")}
                alt=""
              />
            </button>
            {openFilter === "pagesize" && (
              <div className="absolute bottom-full left-0 z-20 mb-1 min-w-30 rounded-xl border border-stroke bg-white shadow-lg py-1">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handlePageSizeChange(size)}
                    className={`w-full px-3 py-2 text-left font-['Inter'] text-sm font-medium transition hover:bg-background ${itemsPerPage === size ? "text-primary" : "text-foreground"}`}
                  >
                    {size} per page
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Page info + prev/next */}
          <div className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-2.5">
            <span className="font-['Inter'] text-sm font-medium text-foreground">
              {filtered.length === 0
                ? "0"
                : Math.min((safePage - 1) * itemsPerPage + 1, filtered.length)}
              –{Math.min(safePage * itemsPerPage, filtered.length)}{" "}
              <span className="text-gray-text">
                {t("of")} {filtered.length}
              </span>
            </span>
            <span className="mx-1 h-5 border-l border-stroke" />
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex h-5 w-5 items-center justify-center disabled:opacity-40"
            >
              <img
                className="h-3 w-2"
                src={asset("weui_arrow-filled.svg")}
                alt={t("prev")}
              />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex h-5 w-5 rotate-180 items-center justify-center disabled:opacity-40"
            >
              <img
                className="h-3 w-2"
                src={asset("weui_arrow-filled.svg")}
                alt={t("next")}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
