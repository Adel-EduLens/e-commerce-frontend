import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type InventoryItem,
  getStatus,
} from "../../../components/trader/inventoryUtils";
import { InventoryTablePanel } from "../../../components/trader/InventoryShared";
import { toast } from "sonner";
import {
  useTraderProducts,
  useDeleteProduct,
  type Product
} from "../../../hooks/queries/productsQuery";


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
export default function TraderRetailProductsPage({ onEdit }: { onEdit: (item: InventoryItem) => void }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { t } = useTranslation("traderProduct");

  const {
    data: rawProducts = [],
    isLoading,
    isError,
    error: errorMsg,
  } = useTraderProducts("RETAIL");

  const deleteProduct = useDeleteProduct();

  // Handle parsing the array properly in case it is nested
  const raw = rawProducts as Record<string, unknown>;

  let productsArray: Product[] = [];
  if (Array.isArray(rawProducts)) {
    productsArray = rawProducts as Product[];
  } else if (Array.isArray(raw?.data)) {
    productsArray = raw.data as Product[];
  } else if (Array.isArray((raw?.data as Record<string, unknown>)?.products)) {
    productsArray = (raw.data as Record<string, unknown>).products as Product[];
  } else if (Array.isArray(raw?.products)) {
    productsArray = raw.products as Product[];
  }
  


  // Map into InventoryItem format for the shared InventoryTablePanel
  const items: InventoryItem[] = productsArray.map((p) => {
    const mainImg =
       p.images?.[0]?.url || "";

    const pRaw = p as Product & { createdAt?: string | number };
    const pDate =
      typeof pRaw.createdAt === "string" || typeof pRaw.createdAt === "number"
        ? new Date(pRaw.createdAt)
        : null;

    const allImages: { url: string; color?: string }[] = p.colors?.flatMap(c => c.images?.map(i => ({ url: i.imageUrl || i.url || "", color: c.colorName || c.color || "" }))) || [];
    if (allImages.length === 0 && mainImg) {
      allImages.push({ url: mainImg });
    }

    const uniqueSizes = Array.from(new Set(p.colors?.flatMap(c => c.variants?.map(v => v.size) || [])));
    
    const uniqueColors = Array.from(new Set(p.colors?.map(c => c.colorName || c.color || "")));

    return {
      id: String(p.id),
      image: mainImg,
      imagesByColor: allImages,
      product: p.name,
      categories: p.categories?.map(c => ({ id: c.id, name: c.name })) || [],
      categoryIds: p.categories?.map(c => String(c.id)) || [],
      brandId: p.brandId || p.brand?.id || "",
      stock: p.stock ?? 0,
      sku: p.sku || "",
      price: `$${p.retailPrice ?? p.price ?? 0}`,
      priceNum: Number(p.retailPrice ?? p.price) || 0,
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

      <InventoryTablePanel
        items={items}
        isLoading={isLoading}
        errorMessages={errorMessages}
        onEdit={onEdit}
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
