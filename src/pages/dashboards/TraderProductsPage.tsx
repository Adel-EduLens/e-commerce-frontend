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

  const items: InventoryItem[] = traderProducts.map((p) => ({
    id: p.id,
    image: p.images[0]?.url ?? "",
    imagesByColor: p.images.map((img) => ({ url: img.url, color: img.color ?? undefined })),
    product: p.name,
    category: p.category?.name ?? "",
    categoryId: p.categoryId,
    stock: p.stock ?? 0,
    sku: p.sku ?? "",
    price: `$${p.price}`,
    priceNum: p.price,
    date: new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    createdAtRaw: new Date(p.createdAt).getTime(),
    status: getStatus(p.stock ?? 0),
    type: "product" as const,
    description: p.description ?? "",
    sizes: p.sizes?.map((s) => s.size) ?? [],
    colors: p.colors?.map((c) => c.color) ?? [],
    minOrder: 1,
  }));

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
