import { useEffect, useRef, useState } from "react";
import { useTraderProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "../../hooks/queries/productsQuery";
import { useTraderWholesales, useCreateWholesale, useUpdateWholesale, useDeleteWholesale } from "../../hooks/queries/wholesaleQuery";
import { useCategories } from "../../hooks/queries/categoriesQuery";
import { api } from "../../lib/axios";

const asset = (file: string) =>
  `/trader-product/${file.split("/").map(encodeURIComponent).join("/")}`;

type InventoryStatus = "Active" | "Low Stock" | "Out of Stock";
type ProductType = "product" | "wholesale";

interface InventoryItem {
  id: string;
  image: string;
  imagesByColor: { url: string; color?: string }[];
  product: string;
  category: string;
  categoryId: string;
  stock: number;
  sku: string;
  price: string;
  priceNum: number;
  date: string;
  createdAtRaw: number;
  status: InventoryStatus;
  type: ProductType;
  description: string;
  sizes: string[];
  colors: string[];
  minOrder: number;
}

const alerts = [
  { title: "Low Stock Alert", message: 'Basic Tee #122" only 3 items left in stock.', time: "Oct 4, 10:32 AM" },
  { title: "Low Stock Alert", message: 'Basic Tee #122" only 3 items left in stock.', time: "Oct 4, 10:32 AM" },
  { title: "Low Stock Alert", message: 'Basic Tee #122" only 3 items left in stock.', time: "Oct 4, 10:32 AM" },
];

const activityLogs = [
  { title: "Hoodie – Black (+20)", addedBy: "Added by Ahmed", note: "Restocked from supplier", time: "Oct 3, 10:30 AM" },
  { title: "Hoodie – Black (+20)", addedBy: "Added by Ahmed", note: "Restocked from supplier", time: "Oct 3, 10:30 AM" },
  { title: "Hoodie – Black (+20)", addedBy: "Added by Ahmed", note: "Restocked from supplier", time: "Oct 3, 10:30 AM" },
];

function getStatus(stock: number): InventoryStatus {
  if (stock === 0) return "Out of Stock";
  if (stock <= 20) return "Low Stock";
  return "Active";
}

function statusPill(status: InventoryStatus) {
  if (status === "Active") return { bg: "bg-emerald-50", text: "text-emerald-700" };
  if (status === "Low Stock") return { bg: "bg-amber-100", text: "text-amber-800" };
  return { bg: "bg-red-100", text: "text-red-700" };
}

function typePill(type: ProductType) {
  return type === "wholesale"
    ? { bg: "bg-blue-50", text: "text-blue-700", label: "Wholesale" }
    : { bg: "bg-violet-50", text: "text-violet-700", label: "Product" };
}

const ITEMS_PER_PAGE = 6;

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const COLOR_OPTIONS = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Gray", "Brown", "Beige", "Navy"];

function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm text-foreground bg-white outline-none focus:border-primary"
      >
        <span className={selected.length === 0 ? "text-gray-text" : ""}>
          {selected.length === 0 ? label : selected.join(", ")}
        </span>
        <svg className={`h-4 w-4 text-gray-text transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-xl border border-stroke bg-white shadow-lg">
          <div className="flex flex-wrap gap-2 p-3">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={`rounded-lg border px-3 py-1 font-['Montserrat'] text-xs font-medium transition ${
                  selected.includes(opt)
                    ? "border-primary bg-primary text-foreground"
                    : "border-stroke bg-white text-foreground hover:bg-background"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ColorImageUpload({
  color,
  preview,
  onChange,
}: {
  color: string;
  preview: string;
  onChange: (color: string, file: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center gap-1">
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(color, f);
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="w-full rounded-xl border-2 border-dashed border-stroke py-3 font-['Montserrat'] text-xs text-gray-text hover:border-primary hover:text-primary transition flex flex-col items-center gap-1"
      >
        {preview ? (
          <img src={preview} alt={color} className="h-14 w-14 rounded-lg object-cover" />
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <span>{color}</span>
      </button>
    </div>
  );
}

async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/upload/product-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.url;
}

// Edit Item Modal
interface EditItemModalProps {
  item: InventoryItem;
  onClose: () => void;
}

function EditItemModal({ item, onClose }: EditItemModalProps) {
  const [name, setName] = useState(item.product);
  const [categoryId, setCategoryId] = useState(item.categoryId);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(String(item.priceNum));
  const [stock, setStock] = useState(String(item.stock));
  const [sku, setSku] = useState(item.sku);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(item.sizes);
  const [selectedColors, setSelectedColors] = useState<string[]>(item.colors);
  const [minOrder, setMinOrder] = useState(String(item.minOrder));

  // Per-color image state for products
  const initPreviews = () => {
    const map: Record<string, string> = {};
    item.imagesByColor.forEach((img) => {
      if (img.color) map[img.color] = img.url;
    });
    return map;
  };
  const [colorFiles, setColorFiles] = useState<Record<string, File>>({});
  const [colorPreviews, setColorPreviews] = useState<Record<string, string>>(initPreviews);

  // Single image for wholesale
  const [wholesaleFile, setWholesaleFile] = useState<File | null>(null);
  const [wholesalePreview, setWholesalePreview] = useState<string>(item.image);
  const wholesaleRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const { data: categories = [] } = useCategories();
  const updateProduct = useUpdateProduct();
  const updateWholesale = useUpdateWholesale();

  const isSaving = updateProduct.isPending || updateWholesale.isPending;

  const handleColorImage = (color: string, file: File) => {
    setColorFiles((prev) => ({ ...prev, [color]: file }));
    setColorPreviews((prev) => ({ ...prev, [color]: URL.createObjectURL(file) }));
  };

  // Keep previews in sync when colors change
  const handleColorsChange = (colors: string[]) => {
    setSelectedColors(colors);
    setColorFiles((prev) => {
      const next: Record<string, File> = {};
      colors.forEach((c) => { if (prev[c]) next[c] = prev[c]; });
      return next;
    });
    setColorPreviews((prev) => {
      const next: Record<string, string> = {};
      colors.forEach((c) => { if (prev[c]) next[c] = prev[c]; });
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (item.type === "product" && selectedColors.length > 0) {
      const missing = selectedColors.filter((c) => !colorPreviews[c]);
      if (missing.length > 0) {
        setError(`Please upload an image for: ${missing.join(", ")}`);
        return;
      }
    }

    try {
      setUploading(true);

      if (item.type === "product") {
        const images: { url: string; color: string }[] = [];
        for (const color of selectedColors) {
          const file = colorFiles[color];
          const url = file ? await uploadImageFile(file) : (colorPreviews[color] ?? "");
          images.push({ url, color });
        }
        setUploading(false);
        await updateProduct.mutateAsync({
          id: item.id,
          name,
          description,
          price: Number(price),
          categoryId,
          images,
          sizes: selectedSizes,
          colors: selectedColors,
          sku: sku || undefined,
          stock: Number(stock),
        });
      } else {
        const wholesaleUrl = wholesaleFile
          ? await uploadImageFile(wholesaleFile)
          : item.image;
        setUploading(false);
        await updateWholesale.mutateAsync({
          id: item.id,
          name,
          description,
          price: Number(price),
          categoryId,
          images: [{ url: wholesaleUrl }],
          minOrder: Number(minOrder) || 1,
          sku: sku || undefined,
          stock: Number(stock),
        });
      }
      onClose();
    } catch (err: any) {
      setUploading(false);
      setError(err?.response?.data?.message ?? err?.message ?? "Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            Edit {item.type === "product" ? "Product" : "Wholesale"}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-text hover:text-foreground text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 overflow-y-auto">
          <input
            placeholder="Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary resize-none"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Price *"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
            />
            <input
              placeholder="Stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
            />
          </div>

          <input
            placeholder="SKU (optional)"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
          />

          {item.type === "product" && (
            <>
              <MultiSelect label="Sizes" options={SIZE_OPTIONS} selected={selectedSizes} onChange={setSelectedSizes} />
              <MultiSelect label="Colors" options={COLOR_OPTIONS} selected={selectedColors} onChange={handleColorsChange} />
              {selectedColors.length > 0 && (
                <div>
                  <p className="mb-2 font-['Montserrat'] text-xs font-semibold text-foreground">Image per color *</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedColors.map((color) => (
                      <ColorImageUpload
                        key={color}
                        color={color}
                        preview={colorPreviews[color] ?? ""}
                        onChange={handleColorImage}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {item.type === "wholesale" && (
            <>
              <div>
                <input
                  ref={wholesaleRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setWholesaleFile(f);
                    setWholesalePreview(URL.createObjectURL(f));
                  }}
                />
                <button
                  type="button"
                  onClick={() => wholesaleRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-stroke py-4 font-['Montserrat'] text-sm text-gray-text hover:border-primary hover:text-primary transition flex flex-col items-center gap-1"
                >
                  {wholesalePreview ? (
                    <img src={wholesalePreview} alt="preview" className="h-20 w-20 rounded-lg object-cover" />
                  ) : (
                    <>
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Click to change image</span>
                    </>
                  )}
                </button>
                {wholesalePreview && (
                  <p className="mt-1 text-center font-['Montserrat'] text-xs text-gray-text">Click image to replace</p>
                )}
              </div>
              <input
                placeholder="Min order quantity"
                type="number"
                min="1"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
              />
            </>
          )}

          {error && <p className="font-['Montserrat'] text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSaving || uploading}
            className="rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? "Uploading images..." : isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Add Item Modal
interface AddItemModalProps {
  onClose: () => void;
}

function AddItemModal({ onClose }: AddItemModalProps) {
  const [type, setType] = useState<ProductType>("product");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minOrder, setMinOrder] = useState("1");
  const [description, setDescription] = useState("");

  // Per-color images for products
  const [colorFiles, setColorFiles] = useState<Record<string, File>>({});
  const [colorPreviews, setColorPreviews] = useState<Record<string, string>>({});

  // Single image for wholesale
  const [wholesaleFile, setWholesaleFile] = useState<File | null>(null);
  const [wholesalePreview, setWholesalePreview] = useState<string>("");
  const wholesaleRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const createWholesale = useCreateWholesale();

  const isSaving = createProduct.isPending || createWholesale.isPending;

  const handleColorImage = (color: string, file: File) => {
    setColorFiles((prev) => ({ ...prev, [color]: file }));
    setColorPreviews((prev) => ({ ...prev, [color]: URL.createObjectURL(file) }));
  };

  const handleColorsChange = (colors: string[]) => {
    setSelectedColors(colors);
    setColorFiles((prev) => {
      const next: Record<string, File> = {};
      colors.forEach((c) => { if (prev[c]) next[c] = prev[c]; });
      return next;
    });
    setColorPreviews((prev) => {
      const next: Record<string, string> = {};
      colors.forEach((c) => { if (prev[c]) next[c] = prev[c]; });
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !categoryId || !price) {
      setError("Name, category and price are required.");
      return;
    }
    if (type === "product") {
      if (selectedSizes.length === 0 || selectedColors.length === 0) {
        setError("Please select at least one size and one color.");
        return;
      }
      const missing = selectedColors.filter((c) => !colorFiles[c]);
      if (missing.length > 0) {
        setError(`Please upload an image for: ${missing.join(", ")}`);
        return;
      }
    } else {
      if (!wholesaleFile) {
        setError("Please upload an image.");
        return;
      }
    }

    try {
      setUploading(true);

      if (type === "product") {
        const images: { url: string; color: string }[] = [];
        for (const color of selectedColors) {
          const url = await uploadImageFile(colorFiles[color]);
          images.push({ url, color });
        }
        setUploading(false);
        await createProduct.mutateAsync({
          name,
          description,
          price: Number(price),
          categoryId,
          images,
          sizes: selectedSizes,
          colors: selectedColors,
          sku: sku || undefined,
          stock: stock ? Number(stock) : 0,
        });
      } else {
        const wholesaleUrl = await uploadImageFile(wholesaleFile!);
        setUploading(false);
        await createWholesale.mutateAsync({
          name,
          description,
          price: Number(price),
          categoryId,
          brand: "",
          minOrder: Number(minOrder) || 1,
          isBestDeal: false,
          isMostPopular: false,
          isPremiumCollection: false,
          images: [{ url: wholesaleUrl }],
          sku: sku || undefined,
          stock: stock ? Number(stock) : 0,
        });
      }
      onClose();
    } catch (err: any) {
      setUploading(false);
      setError(err?.response?.data?.message ?? err?.message ?? "Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">Add Item</h2>
          <button type="button" onClick={onClose} className="text-gray-text hover:text-foreground text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 overflow-y-auto">
          {/* Type toggle */}
          <div className="flex gap-2">
            {(["product", "wholesale"] as ProductType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-lg border py-2 font-['Montserrat'] text-sm font-semibold capitalize transition ${
                  type === t ? "border-primary bg-primary text-foreground" : "border-stroke bg-white text-gray-text"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <input
            placeholder="Product name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
          >
            <option value="">Select category *</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary resize-none"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Price *"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
            />
            <input
              placeholder="Stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
            />
          </div>

          <input
            placeholder="SKU (optional)"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
          />

          {type === "product" && (
            <>
              <MultiSelect label="Select sizes *" options={SIZE_OPTIONS} selected={selectedSizes} onChange={setSelectedSizes} />
              <MultiSelect label="Select colors *" options={COLOR_OPTIONS} selected={selectedColors} onChange={handleColorsChange} />
              {selectedColors.length > 0 && (
                <div>
                  <p className="mb-2 font-['Montserrat'] text-xs font-semibold text-foreground">Image per color *</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedColors.map((color) => (
                      <ColorImageUpload
                        key={color}
                        color={color}
                        preview={colorPreviews[color] ?? ""}
                        onChange={handleColorImage}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {type === "wholesale" && (
            <>
              <div>
                <input
                  ref={wholesaleRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setWholesaleFile(f);
                    setWholesalePreview(URL.createObjectURL(f));
                  }}
                />
                <button
                  type="button"
                  onClick={() => wholesaleRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-stroke py-4 font-['Montserrat'] text-sm text-gray-text hover:border-primary hover:text-primary transition flex flex-col items-center gap-1"
                >
                  {wholesalePreview ? (
                    <img src={wholesalePreview} alt="preview" className="h-20 w-20 rounded-lg object-cover" />
                  ) : (
                    <>
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Click to upload image *</span>
                    </>
                  )}
                </button>
              </div>
              <input
                placeholder="Min order quantity"
                type="number"
                min="1"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary"
              />
            </>
          )}

          {error && <p className="font-['Montserrat'] text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSaving || uploading}
            className="rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? "Uploading images..." : isSaving ? "Saving..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function TraderInventoryPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenFilter(null);
    if (openFilter) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openFilter]);

  const { data: traderProducts = [], isLoading: loadingProducts, isError: productsError, error: productsErrorMsg } = useTraderProducts();
  const { data: traderWholesales = [], isLoading: loadingWholesales, isError: wholesalesError, error: wholesalesErrorMsg } = useTraderWholesales();
  const deleteProduct = useDeleteProduct();
  const deleteWholesale = useDeleteWholesale();

  // Combine products and wholesales into unified inventory items
  const inventoryItems: InventoryItem[] = [
    ...traderProducts.map((p) => ({
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
      type: "product" as ProductType,
      description: p.description ?? "",
      sizes: p.sizes?.map((s) => s.size) ?? [],
      colors: p.colors?.map((c) => c.color) ?? [],
      minOrder: 1,
    })),
    ...traderWholesales.map((w) => ({
      id: w.id,
      image: w.images[0]?.url ?? "",
      imagesByColor: w.images.map((img) => ({ url: img.url, color: img.color ?? undefined })),
      product: w.name,
      category: w.category?.name ?? "",
      categoryId: w.categoryId,
      stock: w.stock ?? 0,
      sku: w.sku ?? "",
      price: `$${w.price}`,
      priceNum: w.price,
      date: new Date(w.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      createdAtRaw: new Date(w.createdAt).getTime(),
      status: getStatus(w.stock ?? 0),
      type: "wholesale" as ProductType,
      description: w.description ?? "",
      sizes: [],
      colors: [],
      minOrder: w.minOrder ?? 1,
    })),
  ];

  const uniqueCategories = Array.from(new Set(inventoryItems.map((i) => i.category).filter(Boolean)));

  const filtered = inventoryItems
    .filter((i) => {
      const matchesSearch =
        i.product.toLowerCase().includes(search.toLowerCase()) ||
        i.category.toLowerCase().includes(search.toLowerCase()) ||
        i.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === "all" || i.category === filterCategory;
      const matchesStatus = filterStatus === "all" || i.status === filterStatus;
      const matchesType = filterType === "all" || i.type === filterType;
      return matchesSearch && matchesCategory && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":  return a.priceNum - b.priceNum;
        case "price-desc": return b.priceNum - a.priceNum;
        case "name-asc":   return a.product.localeCompare(b.product);
        case "name-desc":  return b.product.localeCompare(a.product);
        case "stock-asc":  return a.stock - b.stock;
        case "stock-desc": return b.stock - a.stock;
        case "date-asc":   return a.createdAtRaw - b.createdAtRaw;
        default:           return b.createdAtRaw - a.createdAtRaw; // date-desc
      }
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const inStock = inventoryItems.filter((i) => i.status === "Active").length;
  const lowStock = inventoryItems.filter((i) => i.status === "Low Stock").length;
  const outOfStock = inventoryItems.filter((i) => i.status === "Out of Stock").length;

  const summaryCards = [
    { label: "In Stock", value: String(inStock), delta: "", note: "", up: true },
    { label: "Low Stock", value: String(lowStock), delta: "", note: "", up: false },
    { label: "Out of Stock", value: String(outOfStock), delta: "", note: "", up: false },
    { label: "Total Products", value: String(inventoryItems.length), delta: "", note: "", up: true },
  ];

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

  const allSelected = paginated.length > 0 && selected.size === paginated.length;

  const handleDelete = (item: InventoryItem) => {
    if (item.type === "product") {
      deleteProduct.mutate(item.id);
    } else {
      deleteWholesale.mutate(item.id);
    }
  };

  const isLoading = loadingProducts || loadingWholesales;
  const hasError = productsError || wholesalesError;

  // Snapshot percentages
  const total = inventoryItems.length || 1;
  const inStockPct = Math.round((inStock / total) * 100);
  const lowStockPct = Math.round((lowStock / total) * 100);
  const outStockPct = 100 - inStockPct - lowStockPct;

  return (
    <>
      {showModal && <AddItemModal onClose={() => setShowModal(false)} />}
      {editItem && <EditItemModal item={editItem} onClose={() => setEditItem(null)} />}
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <p className="font-['Montserrat'] text-sm font-medium text-gray-text">{card.label}</p>
                  <p className="font-['Montserrat'] text-2xl font-semibold text-foreground">{card.value}</p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary">
                  <img className="h-6 w-6" src={asset("material-symbols_inventory.svg")} alt="" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                <span className={`font-['Montserrat'] text-sm font-medium ${card.up ? "text-teal-500" : "text-rose-500"}`}>
                  {card.delta}
                </span>
                <span className="font-['Montserrat'] text-sm font-medium text-gray-text"> {card.note}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Add */}
        <div className="flex flex-wrap items-center justify-start gap-3">
          <label className="relative flex min-w-[280px] items-center">
            <img
              className="pointer-events-none absolute left-4 h-5 w-5"
              src={asset("mynaui_search.svg")}
              alt=""
            />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-2xl border border-stroke bg-white py-3 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-foreground outline-none transition placeholder:text-gray-text focus:border-stroke"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-3 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
          >
            <img className="h-5 w-5" src={asset("ic_round-plus.svg")} alt="" />
            Add Item
          </button>
        </div>

        {/* Inventory Table Panel */}
        <section className="rounded-2xl border border-stroke bg-white shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
          {/* Panel header */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">Products Table</h2>
              {/* Category filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setOpenFilter(openFilter === "category" ? null : "category"); }}
                  className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 font-['Montserrat'] text-xs font-medium transition ${filterCategory !== "all" ? "border-primary bg-primary text-foreground" : "border-stroke bg-white text-foreground hover:bg-background"}`}
                >
                  {filterCategory === "all" ? "Category" : filterCategory}
                  <img className={`h-4 w-4 transition-transform ${openFilter === "category" ? "-rotate-90" : "rotate-90"}`} src={asset("weui_arrow-outlined.svg")} alt="" />
                </button>
                {openFilter === "category" && (
                  <div className="absolute left-0 top-full z-20 mt-1 min-w-[130px] rounded-xl border border-stroke bg-white shadow-lg py-1">
                    {["all", ...uniqueCategories].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { setFilterCategory(opt); setOpenFilter(null); setPage(1); }}
                        className={`w-full px-3 py-2 text-left font-['Montserrat'] text-xs font-medium capitalize transition hover:bg-background ${filterCategory === opt ? "text-primary" : "text-foreground"}`}
                      >
                        {opt === "all" ? "All Categories" : opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setOpenFilter(openFilter === "status" ? null : "status"); }}
                  className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 font-['Montserrat'] text-xs font-medium transition ${filterStatus !== "all" ? "border-primary bg-primary text-foreground" : "border-stroke bg-white text-foreground hover:bg-background"}`}
                >
                  {filterStatus === "all" ? "Status" : filterStatus}
                  <img className={`h-4 w-4 transition-transform ${openFilter === "status" ? "-rotate-90" : "rotate-90"}`} src={asset("weui_arrow-outlined.svg")} alt="" />
                </button>
                {openFilter === "status" && (
                  <div className="absolute left-0 top-full z-20 mt-1 min-w-[140px] rounded-xl border border-stroke bg-white shadow-lg py-1">
                    {(["all", "Active", "Low Stock", "Out of Stock"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { setFilterStatus(opt); setOpenFilter(null); setPage(1); }}
                        className={`w-full px-3 py-2 text-left font-['Montserrat'] text-xs font-medium transition hover:bg-background ${filterStatus === opt ? "text-primary" : "text-foreground"}`}
                      >
                        {opt === "all" ? "All Statuses" : opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Type filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setOpenFilter(openFilter === "type" ? null : "type"); }}
                  className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 font-['Montserrat'] text-xs font-medium transition ${filterType !== "all" ? "border-primary bg-primary text-foreground" : "border-stroke bg-white text-foreground hover:bg-background"}`}
                >
                  {filterType === "all" ? "Type" : filterType === "product" ? "Product" : "Wholesale"}
                  <img className={`h-4 w-4 transition-transform ${openFilter === "type" ? "-rotate-90" : "rotate-90"}`} src={asset("weui_arrow-outlined.svg")} alt="" />
                </button>
                {openFilter === "type" && (
                  <div className="absolute left-0 top-full z-20 mt-1 min-w-[120px] rounded-xl border border-stroke bg-white shadow-lg py-1">
                    {(["all", "product", "wholesale"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { setFilterType(opt); setOpenFilter(null); setPage(1); }}
                        className={`w-full px-3 py-2 text-left font-['Montserrat'] text-xs font-medium capitalize transition hover:bg-background ${filterType === opt ? "text-primary" : "text-foreground"}`}
                      >
                        {opt === "all" ? "All Types" : opt === "product" ? "Product" : "Wholesale"}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort by */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setOpenFilter(openFilter === "sort" ? null : "sort"); }}
                  className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 font-['Montserrat'] text-xs font-medium transition ${sortBy !== "date-desc" ? "border-primary bg-primary text-foreground" : "border-stroke bg-white text-foreground hover:bg-background"}`}
                >
                  Sort by
                  <img className={`h-4 w-4 transition-transform ${openFilter === "sort" ? "-rotate-90" : "rotate-90"}`} src={asset("weui_arrow-outlined.svg")} alt="" />
                </button>
                {openFilter === "sort" && (
                  <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] rounded-xl border border-stroke bg-white shadow-lg py-1">
                    {[
                      { value: "date-desc",  label: "Newest first" },
                      { value: "date-asc",   label: "Oldest first" },
                      { value: "price-asc",  label: "Price: Low → High" },
                      { value: "price-desc", label: "Price: High → Low" },
                      { value: "stock-asc",  label: "Stock: Low → High" },
                      { value: "stock-desc", label: "Stock: High → Low" },
                      { value: "name-asc",   label: "Name: A → Z" },
                      { value: "name-desc",  label: "Name: Z → A" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setSortBy(opt.value); setOpenFilter(null); setPage(1); }}
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
              {/* Tables / Cards toggle */}
              <div className="flex items-center gap-1 rounded-2xl border border-stroke bg-white px-2 py-1">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1 rounded-2xl px-2 py-1 transition ${viewMode === "table" ? "bg-gray-light" : ""}`}
                >
                  <img className="h-6 w-6" src={asset("material-symbols_table-outline.svg")} alt="" />
                  <span className={`font-['Montserrat'] text-xs font-medium ${viewMode === "table" ? "text-foreground" : "text-gray-text"}`}>Tables</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`flex items-center gap-1 rounded-2xl px-2 py-1 transition ${viewMode === "cards" ? "bg-gray-light" : ""}`}
                >
                  <img className="h-6 w-6" src={asset("clarity_view-cards-line.svg")} alt="" />
                  <span className={`font-['Montserrat'] text-xs font-medium ${viewMode === "cards" ? "text-foreground" : "text-gray-text"}`}>Cards</span>
                </button>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
              >
                <img className="h-5 w-5" src={asset("download-cloud-02.svg")} alt="" />
                Export
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="font-['Montserrat'] text-sm text-gray-text">Loading...</p>
            </div>
          ) : hasError ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12">
              {productsError && (
                <p className="font-['Montserrat'] text-sm text-red-600">
                  Products error: {(productsErrorMsg as any)?.response?.data?.message ?? (productsErrorMsg as any)?.message ?? "Unknown error"}
                </p>
              )}
              {wholesalesError && (
                <p className="font-['Montserrat'] text-sm text-red-600">
                  Wholesales error: {(wholesalesErrorMsg as any)?.response?.data?.message ?? (wholesalesErrorMsg as any)?.message ?? "Unknown error"}
                </p>
              )}
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="font-['Montserrat'] text-sm text-gray-text">No items found. Click "Add Item" to get started.</p>
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
              {paginated.map((item) => {
                const pill = statusPill(item.status);
                const tp = typePill(item.type);
                return (
                  <div
                    key={item.id}
                    className="relative flex flex-col overflow-hidden rounded-lg border border-stroke bg-white"
                  >
                    {/* Image */}
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
                      {/* Status badge */}
                      <span className={`absolute right-3 top-3 inline-flex rounded-2xl px-2 py-1 text-sm font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>
                        {item.status}
                      </span>
                      {/* Type badge */}
                      <span className={`absolute left-3 top-3 inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${tp.bg} ${tp.text}`}>
                        {tp.label}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-2 px-2 pb-3 pt-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-['Montserrat'] text-base font-semibold text-foreground">
                          {item.product}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="font-['Montserrat'] text-sm font-medium text-gray-text">
                          {item.category}
                        </p>
                        <p className="shrink-0 font-['Montserrat'] text-sm text-gray-text">
                          <span className="text-gray-text">SKU: </span>
                          <span className="font-semibold text-foreground">{item.sku}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                          {item.price}
                        </p>
                        <p className="shrink-0 font-['Montserrat'] text-sm text-gray-text">
                          <span className="text-gray-text">Stock: </span>
                          <span className="font-semibold text-foreground">{item.stock}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditItem(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                            title="Edit"
                          >
                            <img className="h-4 w-4" src={asset("mynaui_edit.svg")} alt="Edit" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                            title="Delete"
                          >
                            <img className="h-4 w-4" src={asset("material-symbols_delete-outline.svg")} alt="Delete" />
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
                          <svg className="h-3 w-3 text-primary" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </th>
                    {["Image", "Product", "Category", "Type", "Stock", "SKU", "Price", "Date", "Status", "Actions"].map((col) => (
                      <th
                        key={col}
                        className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((item, idx) => {
                    const isChecked = selected.has(item.id);
                    const pill = statusPill(item.status);
                    const tp = typePill(item.type);
                    return (
                      <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-background"}>
                        <td className="px-4 py-3">
                          <div
                            className={`h-5 w-5 cursor-pointer rounded-md border flex items-center justify-center transition ${
                              isChecked ? "border-secondary bg-secondary" : "border-gray-300 bg-white"
                            }`}
                            onClick={() => toggleRow(item.id)}
                          >
                            {isChecked && (
                              <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                          {item.category}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${tp.bg} ${tp.text}`}>
                            {tp.label}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                          {item.stock}
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                          {item.sku}
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                          {item.price}
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditItem(item)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                              title="Edit"
                            >
                              <img className="h-4 w-4" src={asset("mynaui_edit.svg")} alt="Edit" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                              title="Delete"
                            >
                              <img className="h-4 w-4" src={asset("material-symbols_delete-outline.svg")} alt="Delete" />
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
            <div className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-2.5">
              <span className="font-['Inter'] text-sm font-medium text-foreground">{ITEMS_PER_PAGE} per page</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-2.5">
              <span className="font-['Inter'] text-sm font-medium text-foreground">
                {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)}{" "}
                <span className="text-gray-text">of {filtered.length}</span>
              </span>
              <span className="mx-1 h-5 border-l border-stroke" />
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-5 w-5 rotate-180 items-center justify-center disabled:opacity-40"
              >
                <img className="h-3 w-2" src={asset("weui_arrow-filled.svg")} alt="Prev" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-5 w-5 items-center justify-center disabled:opacity-40"
              >
                <img className="h-3 w-2" src={asset("weui_arrow-filled.svg")} alt="Next" />
              </button>
            </div>
          </div>
        </section>

        {/* Bottom panels */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Recent Alerts */}
          <div className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-['Montserrat'] text-xl font-semibold text-foreground">Recent Alerts</h3>
            </div>
            <div className="flex flex-col gap-3">
              {alerts.map((alert, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-stroke bg-background p-3 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.10)]"
                >
                  <div className="flex items-center gap-1.5">
                    <svg className="h-5 w-5 shrink-0 text-emerald-700" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="14" height="14" rx="2" />
                    </svg>
                    <p className="font-['Montserrat'] text-sm font-semibold text-foreground">{alert.title}</p>
                  </div>
                  <p className="mt-1.5 font-['Montserrat'] text-sm font-medium text-gray-text">{alert.message}</p>
                  <p className="mt-1 font-['Montserrat'] text-xs font-medium text-gray-text">{alert.time}</p>
                </div>
              ))}
            </div>
            <button type="button" className="mt-3 w-full text-center font-['Montserrat'] text-xs font-medium text-gray-text hover:text-foreground transition">
              View All
            </button>
          </div>

          {/* Inventory Snapshot */}
          <div className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <h3 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">Inventory Snapshot</h3>
            <div className="flex flex-col gap-3 mb-5">
              {[
                { label: "In Stock", count: `${inStock} items`, color: "bg-emerald-700", dot: "text-emerald-700" },
                { label: "Low Stock", count: `${lowStock} items`, color: "bg-yellow-400", dot: "text-yellow-500" },
                { label: "Out of Stock", count: `${outOfStock} items`, color: "bg-red-500", dot: "text-red-500" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className={`h-5 w-5 shrink-0 ${row.dot}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="14" height="14" rx="2" />
                    </svg>
                    <span className="font-['Montserrat'] text-sm font-semibold text-foreground">{row.label}</span>
                  </div>
                  <span className="font-['Montserrat'] text-sm font-medium text-gray-text">{row.count}</span>
                </div>
              ))}
            </div>

            {/* Stacked bar chart */}
            <div className="flex h-12 w-full overflow-hidden rounded-2xl">
              <div className="bg-emerald-700" style={{ width: `${inStockPct}%` }} />
              <div className="bg-yellow-400" style={{ width: `${lowStockPct}%` }} />
              <div className="bg-red-500" style={{ width: `${outStockPct}%` }} />
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {[
                { label: `In Stock ${inStockPct}%`, color: "bg-emerald-700" },
                { label: `Low Stock ${lowStockPct}%`, color: "bg-yellow-400" },
                { label: `Out Stock ${outStockPct}%`, color: "bg-red-500" },
              ].map((leg) => (
                <div key={leg.label} className="flex items-center gap-1.5">
                  <div className={`h-4 w-4 rounded-md shrink-0 ${leg.color}`} />
                  <span className="font-['Montserrat'] text-xs font-semibold text-foreground">{leg.label}</span>
                </div>
              ))}
            </div>

            <button type="button" className="mt-4 w-full text-center font-['Montserrat'] text-xs font-medium text-gray-text hover:text-foreground transition">
              View All
            </button>
          </div>

          {/* Activity Log */}
          <div className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-['Montserrat'] text-xl font-semibold text-foreground">Activity Log</h3>
            </div>
            <div className="flex flex-col gap-3">
              {activityLogs.map((log, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-stroke bg-background p-3 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.10)]"
                >
                  <div className="flex items-center gap-1.5">
                    <svg className="h-5 w-5 shrink-0 text-emerald-700" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="14" height="14" rx="2" />
                    </svg>
                    <p className="font-['Montserrat'] text-sm font-semibold text-foreground">{log.title}</p>
                  </div>
                  <p className="mt-1 font-['Montserrat'] text-xs font-medium text-gray-text">{log.addedBy}</p>
                  <p className="font-['Montserrat'] text-sm font-medium text-gray-text">{log.note}</p>
                  <p className="mt-1 font-['Montserrat'] text-xs font-medium text-gray-text">{log.time}</p>
                </div>
              ))}
            </div>
            <button type="button" className="mt-3 w-full text-center font-['Montserrat'] text-xs font-medium text-gray-text hover:text-foreground transition">
              View All
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
