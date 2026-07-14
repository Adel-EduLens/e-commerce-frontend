import { useState } from "react";
import { api } from "../../lib/axios";
import { type ShopBanner } from "../../hooks/queries/shopBannerQuery";
import ImageCropModal, {
  validateImageDimensions,
} from "../../components/trader/ImageCropModal";

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
  }) => void;
  onClose: () => void;
}

export function ShopBannerFormModal({
  banner,
  onSave,
  onClose,
}: ShopBannerFormModalProps) {
  const [title, setTitle] = useState(banner?.title ?? "");
  const [description, setDescription] = useState(banner?.description ?? "");
  const [buttonText, setButtonText] = useState(banner?.buttonText ?? "");
  const [buttonLink, setButtonLink] = useState(banner?.buttonLink ?? "");
  const [backgroundColor, setBackgroundColor] = useState(banner?.backgroundColor ?? "#ffffff");
  const [image, setImage] = useState(banner?.image ?? "");
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [order, setOrder] = useState(banner?.order ?? 0);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

      alert("Failed to upload image");
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
            {banner ? "Edit Shop Banner" : "Add Shop Banner"}
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
            placeholder="Banner title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white"
          />
          <textarea
            placeholder="Description *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Button Text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white"
            />
            <input
              placeholder="Button Link"
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              className="rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-['Montserrat'] text-xs font-semibold text-foreground">
                Background Color
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
                Order
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
              Is Active
            </label>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300 ${
                isActive ? "bg-primary" : "bg-stroke"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-300 ${
                  isActive ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div className="space-y-2">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              Banner Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full text-sm text-gray-text file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-light file:text-foreground hover:file:bg-stroke cursor-pointer"
            />
          </div>

          {image && (
            <div className="relative w-full h-32 rounded-xl border border-stroke overflow-hidden mt-2">
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
              Cancel
            </button>
            <button
              type="button"
              disabled={uploading || !title || !description || !image}
              onClick={() => onSave({ title, description, buttonText, buttonLink, image, backgroundColor, isActive, order })}
              className="flex-1 rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          fileName="banner.jpg"
          onCancel={() => setCropSrc(null)}
          onConfirm={handleCrop}

        />
      )}
    </div>
  );
}
