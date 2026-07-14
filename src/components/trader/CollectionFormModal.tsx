import { useState } from "react";
import { api } from "../../lib/axios";
import { type Collection } from "../../hooks/queries/collectionsQuery";
import { useTraderProducts } from "../../hooks/queries/productsQuery";
import ImageCropModal, {
  validateImageDimensions,
} from "./ImageCropModal";

const uploadImageFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/upload/category-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.url;
};

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

  const { data: traderProducts, isLoading: loadingProducts } = useTraderProducts();

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

  const filteredProducts = traderProducts?.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {collection ? "Edit Collection" : "Add Collection"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-text hover:text-foreground text-xl leading-none"
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
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white"
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
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white resize-none"
            />
          </div>

          <div className="flex justify-between items-center py-2">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              Appear on Home Page
            </label>

            <button
              type="button"
              onClick={() => setAppearOnHome(!appearOnHome)}
              aria-label={
                appearOnHome
                  ? `disable appear on home`
                  : `enable appear on home`
              }
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300 ${
                appearOnHome ? "bg-primary" : "bg-stroke"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-300 ${
                  appearOnHome ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div className="space-y-2">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              Collection Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full text-sm text-gray-text file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-light file:text-foreground hover:file:bg-stroke cursor-pointer"
            />
          </div>

          {image && (
            <div className="relative w-32 h-20 rounded-xl border border-stroke overflow-hidden mt-1">
              <img
                src={image}
                className="h-full w-full object-cover"
                alt="Preview"
              />
            </div>
          )}

          {/* Product selection list */}
          <div className="border-t border-stroke pt-4 mt-2">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground mb-2">
              Select Products for this Collection ({selectedProductIds.length} selected)
            </label>

            <input
              placeholder="Search trader products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mb-3 rounded-xl border border-stroke px-4 py-2 font-['Montserrat'] text-xs outline-none focus:border-primary text-foreground bg-white"
            />

            <div className="border border-stroke rounded-xl p-3 max-h-48 overflow-y-auto space-y-2 bg-gray-light/30">
              {loadingProducts ? (
                <div className="text-center py-4 text-xs text-gray-text">Loading products...</div>
              ) : filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const isChecked = selectedProductIds.includes(p.id);
                  const firstImg = p.images?.[0]?.url || "";
                  return (
                    <label
                      key={p.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white border border-transparent hover:border-stroke cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleProduct(p.id)}
                        className="rounded border-stroke text-primary focus:ring-primary h-4 w-4"
                      />
                      {firstImg && (
                        <img
                          src={firstImg}
                          alt={p.name}
                          className="w-8 h-8 rounded object-cover border border-stroke"
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
            className="flex-1 rounded-xl border border-stroke py-3 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:bg-background"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={uploading || !name || !image}
            onClick={() => onSave({ name, description, image, appearOnHome, productIds: selectedProductIds })}
            className="flex-1 rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-foreground transition hover:opacity-90 disabled:opacity-50"
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
