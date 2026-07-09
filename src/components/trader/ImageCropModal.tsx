import Cropper from "react-easy-crop";
import { useCallback, useState } from "react";
import type { Area, Point } from "react-easy-crop";

export const MIN_IMG_WIDTH = 100;
export const MIN_IMG_HEIGHT = 100;
export const CROP_ASPECT = 4 / 5; // matches product card image area (4:5)

/** Validate an image File's natural dimensions. Returns null if OK, or an error string. */
export function validateImageDimensions(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.naturalWidth < MIN_IMG_WIDTH || img.naturalHeight < MIN_IMG_HEIGHT) {
        resolve(
          `Image is too small (${img.naturalWidth}×${img.naturalHeight}px). Minimum required: ${MIN_IMG_WIDTH}×${MIN_IMG_HEIGHT}px.`
        );
      } else {
        resolve(null);
      }
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve("Could not read image."); };
    img.src = url;
  });
}

/** Crop an image to the given pixel area and return a new File. */
export async function getCroppedFile(imageSrc: string, pixelCrop: Area, fileName: string): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error("Canvas is empty")); return; }
      resolve(new File([blob], fileName.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
    }, "image/jpeg", 0.92);
  });
}

export default function ImageCropModal({
  imageSrc,
  fileName,
  onConfirm,
  onCancel,
}: {
  imageSrc: string;
  fileName: string;
  onConfirm: (file: File) => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [applying, setApplying] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setApplying(true);
    try {
      const file = await getCroppedFile(imageSrc, croppedAreaPixels, fileName);
      onConfirm(file);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-['Montserrat'] text-base font-bold text-foreground">Crop Image</h3>
          <button type="button" onClick={onCancel} className="text-gray-text hover:text-foreground text-xl leading-none">&times;</button>
        </div>

        <p className="font-['Montserrat'] text-xs text-gray-text">
          Drag to reposition · Pinch or scroll to zoom · Crop is 4:5 (matches product card)
        </p>

        {/* Crop area */}
        <div className="relative h-64 w-full overflow-hidden rounded-xl bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={CROP_ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3">
          <span className="font-['Montserrat'] text-xs text-gray-text">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-stroke py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:bg-background"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={applying}
            className="flex-1 rounded-xl bg-primary py-2.5 font-['Montserrat'] text-sm font-bold text-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {applying ? "Applying…" : "Apply Crop"}
          </button>
        </div>
      </div>
    </div>
  );
}
