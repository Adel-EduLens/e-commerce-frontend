import { useState } from "react";
import {
  type InventoryItem,
  getStatus,
} from "../../components/trader/inventoryUtils";
import { InventoryTablePanel } from "../../components/trader/InventoryShared";
import { Toggle } from "../../components/ui";
import { toast } from "sonner";
import {
  useRetailProducts,
  useCreateRetailProduct,
  useUpdateRetailProduct,
  useDeleteRetailProduct,
} from "../../hooks/useRetailProducts";
import { useRetailCategories } from "../../hooks/useRetailCategories";
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
  const { data: categoriesData = [] } = useRetailCategories();
  const categories: RetailCategory[] =
    categoriesData?.data || categoriesData || [];

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [discountPrice, setDiscountPrice] = useState(
    product?.discountPrice || "",
  );
  const [stock, setStock] = useState(product?.stock || 0);
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [depositAmount, setDepositAmount] = useState(
    product?.depositAmount || 0,
  );
  const [securityDeposit, setSecurityDeposit] = useState(
    product?.securityDeposit || 0,
  );

  const [sku, setSku] = useState(product?.sku || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription || "",
  );
  const [description, setDescription] = useState(product?.description || "");
  const [termsAndConditions, setTermsAndConditions] = useState(
    product?.termsAndConditions || "",
  );
  const [privacyPolicy, setPrivacyPolicy] = useState(
    product?.privacyPolicy || "",
  );

  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  const [imageUrl, setImageUrl] = useState(
    product?.images?.find((i) => i.isMain)?.url ||
      product?.images?.[0]?.url ||
      "",
  );

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = await validateImageDimensions(file);
    if (error) {
      alert(error);
      return;
    }

    setCropSrc(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleCrop = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadImageFile(file);
      setImageUrl(url);
    } catch (err) {
      console.log(err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
      setCropSrc(null);
    }
  };

  const handleSaveClick = async () => {
    setIsSubmitting(true);

    const payload = {
      name,
      slug,
      price: Number(price),
      discountPrice: discountPrice !== "" ? Number(discountPrice) : undefined,
      stock: Number(stock),
      categoryId: Number(categoryId),
      depositAmount: Number(depositAmount),
      securityDeposit: Number(securityDeposit),
      sku: sku || undefined,
      brand: brand || undefined,
      shortDescription: shortDescription || undefined,
      description: description || undefined,
      termsAndConditions: termsAndConditions || undefined,
      privacyPolicy: privacyPolicy || undefined,
      isFeatured,
      isActive,
      images: imageUrl ? [{ url: imageUrl, isMain: true }] : [],
    };

    try {
      await onSave(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          fileName="retail-product.jpg"
          onCancel={() => setCropSrc(null)}
          onConfirm={handleCrop}
        />
      )}
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {product ? "Edit Retail Product" : "Add Retail Product"}
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
            placeholder="Name *"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!product) {
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
              }
            }}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
          />

          <input
            placeholder="Slug *"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
          />

          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
          >
            <option value="">Select Category *</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
            />
            <input
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              step="1"
              required
              placeholder="Price *"
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
            />
            <input
              type="number"
              min="0"
              step="1"
              placeholder="Discount Price"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              min="0"
              required
              placeholder="Stock *"
              value={stock || ""}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
            />
            <input
              type="number"
              min="0"
              required
              placeholder="Deposit *"
              value={depositAmount || ""}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
            />
            <input
              type="number"
              min="0"
              required
              placeholder="Sec. Deposit *"
              value={securityDeposit || ""}
              onChange={(e) => setSecurityDeposit(Number(e.target.value))}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground"
            />
          </div>

          <textarea
            placeholder="Short Description"
            rows={3}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="rounded-xl border border-stroke p-3 min-h-[80px] font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground resize-y"
          />

          <textarea
            placeholder="Main Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl border border-stroke p-3 min-h-[100px] font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground resize-y"
          />

          <textarea
            placeholder="Terms & Conditions"
            rows={3}
            value={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.value)}
            className="rounded-xl border border-stroke p-3 min-h-[80px] font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground resize-y"
          />

          <textarea
            placeholder="Privacy Policy"
            rows={3}
            value={privacyPolicy}
            onChange={(e) => setPrivacyPolicy(e.target.value)}
            className="rounded-xl border border-stroke p-3 min-h-[80px] font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground resize-y"
          />

          <div>
            <label className="mb-2 block font-['Montserrat'] text-sm font-semibold text-foreground">
              Product Image
            </label>
            <div className="flex items-start gap-4">
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stroke bg-gray-50 transition hover:bg-gray-100">
                <span className="text-2xl text-gray-text">+</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>
              {imageUrl && (
                <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-stroke">
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-xl border border-stroke p-3">
              <span className="font-['Montserrat'] text-sm font-semibold text-foreground">
                Is Active
              </span>
              <Toggle
                checked={isActive}
                onChange={setIsActive}
                size="md"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-stroke p-3">
              <span className="font-['Montserrat'] text-sm font-semibold text-foreground">
                Is Featured
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
              className="flex-1 rounded-xl border border-stroke py-3 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                uploading ||
                isSubmitting ||
                !name ||
                !slug ||
                !price ||
                !categoryId
              }
              className="flex-1 rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : isSubmitting ? "Saving..." : "Save"}
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

  const {
    data: rawProducts = [],
    isLoading,
    isError,
    error: errorMsg,
  } = useRetailProducts();

  const createProduct = useCreateRetailProduct();
  const updateProduct = useUpdateRetailProduct();
  const deleteProduct = useDeleteRetailProduct();

  // Handle parsing the array properly in case it is nested
  const raw = rawProducts as Record<string, unknown>;
  const rawData = raw?.data as Record<string, unknown> | undefined;

  const productsArray: RetailProduct[] = Array.isArray(rawProducts)
    ? rawProducts
    : Array.isArray(rawData?.data)
      ? (rawData.data as RetailProduct[])
      : Array.isArray(raw?.data)
        ? (raw.data as RetailProduct[])
        : Array.isArray(raw?.products)
          ? (raw.products as RetailProduct[])
          : [];

  // Map into InventoryItem format for the shared InventoryTablePanel
  const items: InventoryItem[] = productsArray.map((p) => {
    const mainImg =
      p.images?.find((i) => i.isMain)?.url || p.images?.[0]?.url || "";

    const pRaw = p as RetailProduct & { createdAt?: string | number };
    const pDate =
      typeof pRaw.createdAt === "string" || typeof pRaw.createdAt === "number"
        ? new Date(pRaw.createdAt)
        : null;

    return {
      id: String(p.id),
      image: mainImg,
      imagesByColor: mainImg ? [{ url: mainImg }] : [],
      product: p.name,
      category: p.category?.name || "No Category",
      categoryId: String(p.categoryId),
      brandId: p.brand || "",
      stock: p.stock ?? 0,
      sku: p.sku || "",
      price: `$${p.price}`,
      priceNum: p.price,
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
      sizes: p.sizes?.map((s) => s.name) || [],
      colors: p.colors?.map((c) => c.name) || [],
      minOrder: 1,
      isMustHave: p.isFeatured ?? false,
      isFlashDeals: false,
      flashDealPrice: p.discountPrice || null,
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
          "Failed to load products",
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
              toast.success("Retail product created successfully");
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Failed to create product",
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
              toast.success("Retail product updated successfully");
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Failed to update product",
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
        onDelete={(item) => {
          deleteProduct.mutate(item.id, {
            onSuccess: () => toast.success("Product deleted"),
            onError: () => toast.error("Failed to delete product"),
          });
        }}
        showTypeFilter={false}
        title="Retail Products"
        addLabel="Add Retail Product"
      />
    </>
  );
}
