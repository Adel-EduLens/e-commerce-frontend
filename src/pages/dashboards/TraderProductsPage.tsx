import { useState } from "react";
import { type InventoryItem, getStatus } from "../../components/trader/inventoryUtils";
import { InventoryTablePanel, AddItemModal, EditItemModal } from "../../components/trader/InventoryShared";
import { useTraderProducts, useDeleteProduct } from "../../hooks/queries/productsQuery";

export default function TraderProductsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  const {
    data: traderProducts = [],
    isLoading,
    isError,
    error: errorMsg,
  } = useTraderProducts();

  const deleteProduct = useDeleteProduct();

  const items: InventoryItem[] = traderProducts.map((p) => {
    const allImages = p.colors?.flatMap((c) =>
      (c.images || []).map((img) => ({
        url: img.url || img.imageUrl || "",
        color: c.colorName,
      }))
    ) ?? [];

    const totalStock = p.colors?.reduce(
      (sum, c) => sum + (c.variants?.reduce((s, v) => s + v.quantity, 0) ?? 0),
      0
    ) ?? 0;

    const uniqueSizes = Array.from(new Set(p.colors?.flatMap((c) => c.variants?.map((v) => v.size) ?? []) ?? []));
    const uniqueColors = Array.from(new Set(p.colors?.map((c) => c.colorName) ?? []));

    return {
      id: p.id,
      image: allImages[0]?.url ?? "",
      imagesByColor: allImages,
      product: p.name,
      category: p.category?.name ?? "",
      categoryId: p.categoryId,
      brandId: p.brand?.id ?? "",
      stock: totalStock,
      sku: p.sku ?? "",
      price: `$${p.price}`,
      priceNum: p.price,
      date: new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      createdAtRaw: new Date(p.createdAt).getTime(),
      status: getStatus(totalStock),
      type: "product" as const,
      description: p.description ?? "",
      sizes: uniqueSizes,
      colors: uniqueColors,
      minOrder: 1,
      isMustHave: p.isMustHave ?? false,
      isFlashDeals: p.isFlashDeals ?? false,
      flashDealPrice: p.flashDealPrice ?? null,
      flashDealEndsAt: p.flashDealEndsAt ?? null,
      isBestDeal: false,
      isMostPopular: false,
      isPremiumCollection: false,
    };
  });

  const errorMessages = isError
    ? [(errorMsg as any)?.response?.data?.message ?? (errorMsg as any)?.message ?? "Failed to load products"]
    : [];

  return (
    <>
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          lockedType="product"
        />
      )}
      {editItem && (
        <EditItemModal item={editItem} onClose={() => setEditItem(null)} />
      )}

      <InventoryTablePanel
        items={items}
        isLoading={isLoading}
        errorMessages={errorMessages}
        onAdd={() => setShowAddModal(true)}
        onEdit={setEditItem}
        onDelete={(item) => deleteProduct.mutate(item.id)}
        showTypeFilter={false}
        title="Products Table"
        addLabel="Add Product"
      />
    </>
  );
}
