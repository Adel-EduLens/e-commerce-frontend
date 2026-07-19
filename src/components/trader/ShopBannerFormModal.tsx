import { useState } from "react";
import { api } from "../../lib/axios";
import { type ShopBanner } from "../../hooks/queries/shopBannerQuery";
import ImageCropModal, {
  validateImageDimensions,
} from "../../components/trader/ImageCropModal";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Toggle } from "../ui/toggle";

const uploadImageFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/upload/category-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.url;
};

interface ShopBannerFormModalProps {
  banner?: ShopBanner;
  onSave: (data: {
    title: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
    image: string;
    backgroundColor: string;
    isActive: boolean;
    order: number;
    type?: string;
  }) => void;
  onClose: () => void;
  defaultType?: string;
}

export function ShopBannerFormModal({
  banner,
  onSave,
  onClose,
  defaultType = "shop",
}: ShopBannerFormModalProps) {
  const [title, setTitle] = useState(banner?.title ?? "");
  const [description, setDescription] = useState(banner?.description ?? "");
  const [buttonText, setButtonText] = useState(banner?.buttonText ?? "");
  const [buttonLink, setButtonLink] = useState(banner?.buttonLink ?? "");
  const [backgroundColor, setBackgroundColor] = useState(banner?.backgroundColor ?? "#ffffff");
  const [image, setImage] = useState(banner?.image ?? "");
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [order, setOrder] = useState(banner?.order ?? 0);
  const [type] = useState(banner?.type ?? defaultType);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { t } = useTranslation("traderShopBannerPage");

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
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {banner
              ? (type === "home" ? t("editHomePageBanner") : t("editShopBanner"))
              : (type === "home" ? t("addHomePageBanner") : t("addShopBannerModal"))}
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
            placeholder={t("bannerTitlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white"
          />
          <textarea
            placeholder={t("descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder={t("buttonTextPlaceholder")}
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white"
            />
            <input
              placeholder={t("buttonLinkPlaceholder")}
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-['Montserrat'] text-xs font-semibold text-foreground">
                {t("backgroundColor")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-9 w-9 rounded border border-stroke p-0.5 cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 rounded-xl border border-stroke px-3 py-2 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block mb-1 font-['Montserrat'] text-xs font-semibold text-foreground">
                {t("orderModal")}
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full rounded-xl border border-stroke px-3 py-2 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              {t("isActive")}
            </label>
            <Toggle
              checked={isActive}
              onChange={setIsActive}
              size="sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              {t("bannerImage")}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full text-sm text-gray-text file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-light file:text-foreground hover:file:bg-stroke cursor-pointer"
            />
          </div>

          {image && (
            <div className="relative w-full h-48 rounded-xl border border-stroke overflow-hidden mt-2 bg-gray-50 flex items-center justify-center">
              <img
                src={image}
                className="h-full max-w-full object-contain"
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
              disabled={uploading || !title || !description || !image}
              onClick={() => onSave({ title, description, buttonText, buttonLink, image, backgroundColor, isActive, order, type })}
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
          fileName="banner.jpg"
          aspect={1440 / 900}
          onCancel={() => setCropSrc(null)}
          onConfirm={handleCrop}

        />
      )}
    </div>
  );
}
