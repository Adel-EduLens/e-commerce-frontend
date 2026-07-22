import { useState } from "react";
import { api } from "../../lib/axios";
import { type Category } from "../../hooks/queries/categoriesQuery";
import ImageCropModal, {
  validateImageDimensions,
} from "../../components/trader/ImageCropModal";
import { toast } from "sonner";
import { Toggle } from "../ui/toggle";
import { useTranslation } from "react-i18next";

const uploadImageFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/upload/category-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.url;
};

interface CategoryFormModalProps {
  category?: Category;
  defaultType?: "product" | "wholesale" | "retail";
  onSave: (data: {
    name: string;
    image: string;
    appearOnHome: boolean;
    isShop: boolean;
    isWholesale: boolean;
    isRetail: boolean;
  }) => void;
  onClose: () => void;
}

export function CategoryFormModal({
  category,
  defaultType,
  onSave,
  onClose,
}: CategoryFormModalProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [image, setImage] = useState(category?.image ?? "");
  const [appearOnHome, setAppearOnHome] = useState(category?.appearOnHome ?? false);
  const [isShop, setIsShop] = useState(category?.isShop ?? (defaultType === "product" ? true : false));
  const [isWholesale, setIsWholesale] = useState(category?.isWholesale ?? (defaultType === "wholesale" ? true : false));
  const [isRetail, setIsRetail] = useState(category?.isRetail ?? (defaultType === "retail" ? true : false));
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { t } = useTranslation("traderCategoriesPage");

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
      toast.error(t("failedUploadImage"));
      console.log(err);
    } finally {
      setUploading(false);
      setCropSrc(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {category ? t("editCategory") : t("addCategory")}
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
          <input
            placeholder={t("categoryNamePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white"
          />
          <div className="flex justify-between">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              {t("appearOnHome")}
            </label>

            <Toggle
              checked={appearOnHome}
              onChange={setAppearOnHome}
              size="sm"
              aria-label={
                appearOnHome
                  ? t("disableAppearOnHome")
                  : t("enableAppearOnHome")
              }
            />
          </div>

          <div className="flex justify-between">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              {t("isShop", "Shop Category")}
            </label>
            <Toggle checked={isShop} onChange={setIsShop} size="sm" />
          </div>

          <div className="flex justify-between">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              {t("isWholesale", "Wholesale Category")}
            </label>
            <Toggle checked={isWholesale} onChange={setIsWholesale} size="sm" />
          </div>

          <div className="flex justify-between">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              {t("isRetail", "Retail Category")}
            </label>
            <Toggle checked={isRetail} onChange={setIsRetail} size="sm" />
          </div>

          <div className="space-y-2">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              {t("categoryImage")}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full text-sm text-gray-text file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-light file:text-foreground hover:file:bg-stroke cursor-pointer"
            />
          </div>

          {image && (
            <div className="relative w-24 h-24 rounded-xl border border-stroke overflow-hidden mt-2">
              <img
                src={image}
                className="h-full w-full object-cover"
                alt="Preview"
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-stroke py-3 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:bg-background"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              disabled={uploading || !name}
              onClick={() => {
                if (!isShop && !isWholesale && !isRetail) {
                  toast.error(t("atLeastOneType", "Please select at least one category type (Shop, Wholesale, or Retail)"));
                  return;
                }
                onSave({ name, image, appearOnHome, isShop, isWholesale, isRetail });
              }}
              className="flex-1 rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {uploading ? t("uploading") : t("save")}
            </button>
          </div>
        </div>
      </div>

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          fileName="category.jpg"
          onCancel={() => setCropSrc(null)}
          onConfirm={handleCrop}
        />
      )}
    </div>
  );
}
