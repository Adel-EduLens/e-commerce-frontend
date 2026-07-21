import { useState } from "react";
import { api } from "../../lib/axios";
import {
  type Product,
  type ProductFormData,
} from "../../hooks/queries/productsQuery";
import ImageCropModal, {
  validateImageDimensions,
} from "../../components/trader/ImageCropModal";
import { toast } from "sonner";
import { COLOR_OPTIONS } from "./inventoryUtils";
import { MultiSelect } from "./InventoryShared";
import { useTranslation } from "react-i18next";
import { Toggle } from "../ui";

type ImageDirection = "FRONT" | "BACK" | "LEFT" | "RIGHT" | "TOP" | "BOTTOM";

function isImageDirection(value: unknown): value is ImageDirection {
  return (
    value === "FRONT" ||
    value === "BACK" ||
    value === "LEFT" ||
    value === "RIGHT" ||
    value === "TOP" ||
    value === "BOTTOM"
  );
}

const uploadImageFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/upload/product-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.url;
};

interface BlankProductFormModalProps {
  product?: Product;
  onSave: (data: ProductFormData) => void;
  onClose: () => void;
}

export function BlankProductFormModal({
  product,
  onSave,
  onClose,
}: BlankProductFormModalProps) {
  const { t } = useTranslation("traderBlankProducts");
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(
    (product?.blankPrice ?? product?.price)?.toString() ?? "",
  );
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  const [materials, setMaterials] = useState<string[]>(
    product?.materials?.map((m) => m.material) ?? [],
  );
  const [materialInput, setMaterialInput] = useState("");

  const [colors, setColors] = useState<
    {
      color: string;
      images: { url: string; direction: ImageDirection | "" }[];
    }[]
  >(
    product?.colors?.map((c) => ({
      color: c.colorName || c.color || "",
      images: c.images.map((img) => ({
        url: img.url || img.imageUrl || "",
        direction: isImageDirection(img.direction) ? img.direction : "",
      })),
    })) ?? [],
  );

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingColorIndex, setPendingColorIndex] = useState<number | null>(
    null,
  );
  const [uploading, setUploading] = useState(false);

  const handleColorsChange = (selected: string[]) => {
    setColors((prev) => {
      const next = prev.filter((pc) => selected.includes(pc.color));
      selected.forEach((c) => {
        if (!next.some((pc) => pc.color === c)) {
          next.push({ color: c, images: [] });
        }
      });
      return next;
    });
  };

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    colorIndex: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = await validateImageDimensions(file);
    if (error) {
      alert(error);
      return;
    }

    setPendingColorIndex(colorIndex);
    setCropSrc(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleCrop = async (file: File) => {
    if (pendingColorIndex === null) return;
    try {
      setUploading(true);
      const url = await uploadImageFile(file);

      const newColors = [...colors];
      newColors[pendingColorIndex].images.push({ url, direction: "" });
      setColors(newColors);
    } catch (err) {
      console.log(err);
      toast.error(t("failedUploadImage"))
    } finally {
      setUploading(false);
      setCropSrc(null);
      setPendingColorIndex(null);
    }
  };

  const handleSave = () => {
    // Validate
    if (!name.trim()) return alert(t("nameRequired"));
    if (colors.length === 0) return alert(t("oneColorRequired"));
    for (const c of colors) {
      if (!c.color.trim())
        return alert(t("colorNameRequired"));
      if (c.images.length === 0)
        return alert(`${t("oneImageRequiredColor")} ${c.color}`);
      for (const img of c.images) {
        if (!img.direction)
          return alert(
            `${t("directionRequiredColor")} ${c.color}`,
          );
      }
    }

    onSave({
      name,
      description: description || undefined,
      price: price ? parseFloat(price) : undefined,
      blankPrice: price ? parseFloat(price) : undefined,
      isActive,
      productTypes: ["BLANK"],
      materials: materials.map((m) => ({ material: m })),
      colors: colors.map((c) => ({
        color: c.color,
        name: c.color,
        code: c.color,
      })),
      images: colors.flatMap((c) => 
        c.images.map((img) => ({
          url: img.url,
          color: c.color,
          direction: img.direction,
        }))
      ),
      sizes: [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-card shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {product ? t("editBlankProduct") : t("addBlankProduct")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-text hover:text-foreground text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col gap-4 p-5 overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder={t("productName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card"
            />
            <input
              type="number"
              placeholder={t("price")}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card"
            />
          </div>
          <textarea
            placeholder={t("description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="rounded-xl min-h-[100px] border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card resize-none"
          />

          <div className="flex justify-between items-center bg-background p-3 rounded-xl">
            <label className="block font-['Montserrat'] text-sm font-semibold text-foreground">
              {t("isActive")}
            </label>
            <Toggle
              checked={isActive}
              onChange={setIsActive}
              size="sm"
              aria-label="Toggle product active status"
            />
          </div>

          {/* Materials */}
          <div className="space-y-2">
            <label className="block font-['Montserrat'] text-sm font-semibold text-foreground">
              {t("materials")}
            </label>
            <div className="flex gap-2">
              <input
                placeholder={t("addMaterialPlaceholder")}
                value={materialInput}
                onChange={(e) => setMaterialInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (materialInput.trim()) {
                      setMaterials([...materials, materialInput.trim()]);
                      setMaterialInput("");
                    }
                  }
                }}
                className="flex-1 rounded-xl border border-stroke px-4 py-2 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card"
              />
              <button
                type="button"
                onClick={() => {
                  if (materialInput.trim()) {
                    setMaterials([...materials, materialInput.trim()]);
                    setMaterialInput("");
                  }
                }}
                className="rounded-xl bg-primary px-4 py-2 font-['Montserrat'] text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                {t("add")}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {materials.map((mat, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 rounded-full bg-background px-3 py-1 font-['Montserrat'] text-xs font-medium text-foreground border border-stroke"
                >
                  {mat}
                  <button
                    type="button"
                    onClick={() =>
                      setMaterials(materials.filter((_, i) => i !== idx))
                    }
                    className="text-danger ml-1"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Colors and Images */}
          <div className="space-y-4 mt-2 border-t border-stroke pt-4">
            <div className="space-y-2">
              <label className="block font-['Montserrat'] text-sm font-semibold text-foreground">
                {t("colorsAndImages")}
              </label>
              <MultiSelect
                label={t("selectColors")}
                options={COLOR_OPTIONS}
                selected={colors.map(c => c.color)}
                onChange={handleColorsChange}
              />
            </div>

            {colors.map((c, i) => (
              <div
                key={c.color}
                className="rounded-xl border border-stroke p-4 space-y-4 bg-background/50"
              >
                <div className="flex items-center justify-between border-b border-stroke pb-2">
                  <h4 className="font-['Montserrat'] text-sm font-bold text-foreground flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full border border-stroke"
                      style={{ backgroundColor: c.color.toLowerCase() }}
                    />
                    {c.color}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleColorsChange(colors.map(x => x.color).filter(col => col !== c.color))}
                    className="text-danger text-xs font-semibold font-['Montserrat'] hover:underline"
                  >
                    {t("removeColor")}
                  </button>
                </div>

                <div className="space-y-3">
                  {c.images.map((img, imgIdx) => (
                    <div
                      key={imgIdx}
                      className="flex items-center gap-3 bg-card p-2 rounded-xl border border-stroke"
                    >
                      <img
                        src={img.url}
                        className="w-16 h-16 rounded-lg object-cover border border-stroke"
                        alt=""
                      />
                      <select
                        value={img.direction}
                        onChange={(e) => {
                          const newC = [...colors];
                          newC[i].images[imgIdx].direction = e.target
                            .value as ImageDirection;
                          setColors(newC);
                        }}
                        className="flex-1 rounded-xl border border-stroke px-3 py-2 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card"
                      >
                        <option value="" disabled>
                          {t("selectDirection")}
                        </option>
                        {[
                          { value: "FRONT", label: t("front") },
                          { value: "BACK", label: t("back") },
                          { value: "LEFT", label: t("left") },
                          { value: "RIGHT", label: t("right") },
                          { value: "TOP", label: t("top") },
                          { value: "BOTTOM", label: t("bottom") },
                        ].map((dir) => {
                          const isUsed = c.images.some(
                            (otherImg, otherIdx) =>
                              otherIdx !== imgIdx && otherImg.direction === dir.value
                          );
                          return (
                            <option key={dir.value} value={dir.value} disabled={isUsed}>
                              {dir.label} {isUsed ? t("alreadySelected") : ""}
                            </option>
                          );
                        })}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const newC = [...colors];
                          newC[i].images = newC[i].images.filter(
                            (_, idx) => idx !== imgIdx,
                          );
                          setColors(newC);
                        }}
                        className="text-danger px-2"
                      >
                        &times;
                      </button>
                    </div>
                  ))}

                  <div className="pt-2">
                    <label className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-dashed border-stroke px-4 py-2 font-['Montserrat'] text-xs font-semibold text-gray-text hover:bg-card hover:text-foreground transition bg-card w-full">
                      {t("addImage")}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFile(e, i)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 p-5 border-t border-stroke shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-stroke py-3 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:bg-background"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={handleSave}
            className="flex-1 rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? t("uploading") : t("saveBlankProduct")}
          </button>
        </div>
      </div>

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          fileName="blank_product.jpg"
          onCancel={() => {
            setCropSrc(null);
            setPendingColorIndex(null);
          }}
          onConfirm={handleCrop}
        />
      )}
    </div>
  );
}
