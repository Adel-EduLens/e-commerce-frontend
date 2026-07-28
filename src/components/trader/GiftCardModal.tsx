import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  useGiftCard,
  useCreateGiftCard,
  useUpdateGiftCard,
  type GiftCardFormData,
} from "../../hooks/queries/giftCardsQuery";
import ImageCropModal, { validateImageDimensions } from "./ImageCropModal";
import { type InventoryItem, uploadImageFile } from "./inventoryUtils";

interface GiftCardModalProps {
  item?: InventoryItem | null;
  onClose: () => void;
}

export function GiftCardModal({ item, onClose }: GiftCardModalProps) {
  const { t: tShared } = useTranslation("traderInventoryShared");
  const isEditing = !!item;

  const [name, setName] = useState(
    item?.product || tShared("defaultGiftCardName", "Gift Card")
  );
  const [amounts, setAmounts] = useState(
    item?.giftCardAmounts || "10,15,50,75,100,150,200"
  );
  const [price, setPrice] = useState(item?.priceNum?.toString());
  const [stock, setStock] = useState(item?.stock?.toString());
  const [description, setDescription] = useState(item?.description || "");
  const [imageUrl, setImageUrl] = useState(item?.image || "");
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const createGiftCard = useCreateGiftCard();
  const updateGiftCard = useUpdateGiftCard();

  const { data: fullGiftCard, isLoading: isProductLoading } = useGiftCard(
    isEditing ? item.id : undefined
  );

  useEffect(() => {
    if (isEditing && fullGiftCard) {
      if (fullGiftCard.name) setName(fullGiftCard.name);
      if (fullGiftCard.description) setDescription(fullGiftCard.description);
      if (fullGiftCard.amount != null) setPrice(fullGiftCard.amount.toString());
      if (fullGiftCard.amounts != null) setAmounts(fullGiftCard.amounts);
      setStock("100"); // Default unlimited for virtual gift cards
      if (fullGiftCard.image) setImageUrl(fullGiftCard.image);
    }
  }, [fullGiftCard, isEditing]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const dimErr = await validateImageDimensions(file);
    if (dimErr) {
      toast.error(
        tShared("imageDimensionError", {
          err: dimErr,
          defaultValue: `Image dimension error: ${dimErr}`,
        })
      );
      e.target.value = "";
      return;
    }

    setFileName(file.name);
    setCropSrc(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleCropConfirm = async (croppedFile: File) => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    try {
      setUploading(true);
      const url = await uploadImageFile(croppedFile);
      setImageUrl(url);
      toast.success(
        tShared("giftCardImageUploaded", "Gift card image uploaded successfully!")
      );
    } catch (err: any) {
      toast.error(
        err?.message || tShared("failedToUploadImage", "Failed to upload image")
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      const msg = tShared("giftCardNameRequired", "Gift Card Name is required.");
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!amounts.trim()) {
      const msg = tShared(
        "presetDenominationsRequired",
        "Preset Denominations (Amounts) are required."
      );
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      setUploading(true);

      const payload: GiftCardFormData = {
        name,
        description,
        amount: Number(price) || 1000,
        amounts,
        stock: stock ? Number(stock) : 100,
        image: imageUrl || undefined,
      };

      if (isEditing && item) {
        await updateGiftCard.mutateAsync({ id: item.id, ...payload });
      } else {
        await createGiftCard.mutateAsync(payload);
      }

      setUploading(false);
      onClose();
    } catch (err: unknown) {
      setUploading(false);
      console.log(err);
      let errMsg = tShared("somethingWentWrong") || "Something went wrong";
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      if (errorObj?.response?.data?.message) {
        errMsg = errorObj.response.data.message;
      } else if (errorObj?.message) {
        errMsg = errorObj.message;
      }
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          fileName={fileName}
          aspect={3 / 4}
          onConfirm={handleCropConfirm}
          onCancel={() => {
            URL.revokeObjectURL(cropSrc);
            setCropSrc(null);
          }}
        />
      )}

      <div className="w-full max-w-lg rounded-2xl bg-card shadow-xl max-h-[90vh] flex flex-col text-foreground">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {isEditing
              ? tShared("editGiftCard", "Edit Gift Card")
              : tShared("addGiftCard", "Add Gift Card")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-text hover:text-foreground text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {isEditing && isProductLoading ? (
          <div className="flex-1 overflow-y-auto p-5 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-5 space-y-4 bg-card"
          >
            {error && (
              <div className="text-red-500 text-sm font-semibold">{error}</div>
            )}

            {/* Gift Card Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-text">
                {tShared("giftCardName", "Gift Card Name *")}
              </label>
              <input
                placeholder={tShared(
                  "giftCardNamePlaceholder",
                  "e.g. GENZ Gift Card"
                )}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card"
              />
            </div>

            {/* Preset Amounts & Base Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-semibold text-gray-text">
                  {tShared(
                    "presetDenominations",
                    "Preset Denominations (Amounts) *"
                  )}
                </label>
                <input
                  placeholder={tShared(
                    "presetDenominationsPlaceholder",
                    "10, 15, 50, 75, 100, 150, 200"
                  )}
                  value={amounts}
                  onChange={(e) => setAmounts(e.target.value)}
                  className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card"
                />
                <p className="text-[11px] text-gray-text">
                  {tShared(
                    "presetDenominationsHelp",
                    "Comma-separated amounts displayed on the product page"
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-text">
                  {tShared(
                    "startingDefaultPrice",
                    "Starting / Default Price (EGP) *"
                  )}
                </label>
                <input
                  type="number"
                  placeholder={tShared("startingPricePlaceholder", "1000")}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-text">
                  {tShared(
                    "totalAvailableQuantity",
                    "Total Available Quantity (Stock)"
                  )}
                </label>
                <input
                  type="number"
                  placeholder={tShared("stockQuantityPlaceholder", "100")}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-text">
                {tShared("description", "Description")}
              </label>
              <textarea
                placeholder={tShared(
                  "giftCardDescriptionPlaceholder",
                  "Gift card description or terms..."
                )}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card resize-none"
              />
            </div>

            {/* Gift Card Image Upload */}
            <div className="space-y-2 border-t border-stroke pt-3">
              <label className="text-xs font-semibold text-gray-text">
                {tShared(
                  "giftCardArtwork",
                  "Gift Card Artwork / Preview Image"
                )}
              </label>
              {imageUrl && (
                <div className="relative w-32 h-44 rounded-xl border border-stroke overflow-hidden mb-2 bg-black">
                  <img
                    src={imageUrl}
                    alt={tShared("giftCardArtworkAlt", "Gift Card Artwork")}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-700"
                  >
                    &times;
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-foreground"
              />
            </div>

            {/* Submit / Cancel Buttons */}
            <div className="flex gap-2 pt-4 border-t border-stroke">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-stroke py-3 font-['Montserrat'] text-sm font-semibold text-foreground bg-card hover:bg-background transition"
              >
                {tShared("cancel", "Cancel")}
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 transition"
              >
                {uploading
                  ? tShared("saving", "Saving...")
                  : isEditing
                    ? tShared("saveChanges", "Save Changes")
                    : tShared("createGiftCard", "Create Gift Card")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
