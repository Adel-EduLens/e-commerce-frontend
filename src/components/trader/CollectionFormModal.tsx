import { useState } from "react";
import { type Collection } from "../../hooks/queries/collectionsQuery";
import { useTraderProducts } from "../../hooks/queries/productsQuery";
import ImageCropModal, {
  validateImageDimensions,
} from "./ImageCropModal";
import { Toggle } from "../ui/toggle";
import { uploadImageFile } from "./inventoryUtils";
import { LoadingSpinner } from "../shared";

interface CollectionFormModalProps {
  collection?: Collection;
  onSave: (data: {
    name: string;
    description: string;
    image: string;
    appearOnHome: boolean;
    productIds: string[];
  }) => void;
  onClose: () => void;
}

export function CollectionFormModal({
  collection,
  onSave,
  onClose,
}: CollectionFormModalProps) {
  const [name, setName] = useState(collection?.name ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [image, setImage] = useState(collection?.image ?? "");
  const [appearOnHome, setAppearOnHome] = useState(
    collection?.appearOnHome ?? true,
  );
  
  // Track selected product IDs
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    collection?.products?.map((p) => p.id) ?? []
  );

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: traderProducts, isLoading: loadingProducts } = useTraderProducts("SHOP");

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
      setImage(url);
    } catch (err) {
      console.log(err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
      setCropSrc(null);
    }
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const shopProducts = traderProducts?.filter((p) => {
    if (Array.isArray(p.productTypes)) {
      return p.productTypes.some((pt: any) => (typeof pt === "string" ? pt === "SHOP" : pt?.type === "SHOP"));
    }
    return true;
  });

  const filteredProducts = shopProducts?.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl bg-card border border-stroke shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {collection ? "Edit Collection" : "Add Collection"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-text hover:text-foreground text-xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col gap-4 p-5 overflow-y-auto flex-1">
          <div>
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground mb-1">
              Collection Name *
            </label>
            <input
              placeholder="e.g. Color of Summer Outfit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-background placeholder:text-gray-text"
            />
          </div>

          <div>
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground mb-1">
              Description
            </label>
            <textarea
              placeholder="Collection description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-background resize-none placeholder:text-gray-text"
            />
          </div>

          <div className="flex justify-between items-center py-2">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              Appear on Home Page
            </label>

            <Toggle
              checked={appearOnHome}
              onChange={setAppearOnHome}
              size="sm"
              aria-label={
                appearOnHome
                  ? "disable appear on home"
                  : "enable appear on home"
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              Collection Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full text-sm text-gray-text file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-stroke/30 file:text-foreground hover:file:bg-stroke cursor-pointer"
            />
            {image && (
              <div className="relative w-full h-40 rounded-xl border border-stroke overflow-hidden mt-2 bg-background flex items-center justify-center">
                <img
                  src={image}
                  className="h-full max-w-full object-contain"
                  alt="Preview"
                />
              </div>
            )}
          </div>

          {/* Product selection list */}
          <div className="border-t border-stroke pt-4 mt-2">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground mb-2">
              Select Products for this Collection ({selectedProductIds.length} selected)
            </label>

            <input
              placeholder="Search shop products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mb-3 rounded-xl border border-stroke px-4 py-2 font-['Montserrat'] text-xs outline-none focus:border-primary text-foreground bg-background placeholder:text-gray-text"
            />

            <div className="border border-stroke rounded-xl p-3 max-h-48 overflow-y-auto space-y-2 bg-background/50">
              {loadingProducts ? (
                <LoadingSpinner containerClassName="py-6" size="sm" text="Loading products..." />
              ) : filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const isChecked = selectedProductIds.includes(p.id);
                  const firstImg = p.images?.[0]?.url || "";
                  return (
                    <label
                      key={p.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-stroke/30 dark:hover:bg-white/5 border border-transparent hover:border-stroke cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleProduct(p.id)}
                        className="rounded border-stroke text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                      />
                      {firstImg && (
                        <img
                          src={firstImg}
                          alt={p.name}
                          className="w-8 h-8 rounded object-cover border border-stroke shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
                        <p className="text-[10px] text-gray-text">
                          Price: EGP {p.price} | SKU: {p.sku || "N/A"}
                        </p>
                      </div>
                    </label>
                  );
                })
              ) : (
                <div className="text-center py-4 text-xs text-gray-text">No products found</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-5 border-t border-stroke shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-stroke py-3 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:bg-stroke/20 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={uploading || !name || !image}
            onClick={() => onSave({ name, description, image, appearOnHome, productIds: selectedProductIds })}
            className="flex-1 rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {uploading ? "Uploading..." : "Save"}
          </button>
        </div>
      </div>

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          fileName="collection.jpg"
          onCancel={() => setCropSrc(null)}
          onConfirm={handleCrop}
        />
      )}
    </div>
  );
}
