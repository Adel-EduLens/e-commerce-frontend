import type { DetailItem } from "../../types/DetailItem";

type ProductGalleryProps = {
  selectedColor: string;
  selectedImage: string | null;
  setSelectedImage: (url: string) => void;
  item: DetailItem;
};

export function ProductGallery({
  selectedColor,
  selectedImage,
  setSelectedImage,
  item,
}: ProductGalleryProps) {
  const colorImages = item.images.filter(
    (image) =>
      image.color &&
      selectedColor &&
      image.color.toLowerCase() === selectedColor.toLowerCase()
  );

  // Fallback to all images if color specific ones are absent
  const displayImages = colorImages.length > 0 ? colorImages : item.images;

  return (
    <div className="flex flex-row gap-3 w-full select-none">
      {/* Main selected image — left */}
      <div className="relative flex-1 aspect-[3/4] w-full overflow-hidden rounded-lg bg-card border border-stroke">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={item.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-['Montserrat'] text-gray-text text-sm">
            No Image Available
          </div>
        )}
      </div>

      {/* Vertical Thumbnail strip — right */}
      <div className="flex flex-col gap-2 shrink-0 overflow-y-auto max-h-[520px]" style={{ width: 72 }}>
        {displayImages.map((image, index) => {
          const isSelected = selectedImage === image.url;
          return (
            <button
              type="button"
              key={image.id}
              onClick={() => setSelectedImage(image.url)}
              className={`relative h-[88px] w-full shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all outline-none bg-card ${isSelected
                  ? "border-primary"
                  : "border-stroke hover:border-gray-text"
                }`}
              aria-label={`Open product image ${index + 1}`}
            >
              <img
                src={image.url}
                alt={`${item.name} thumbnail ${index + 1}`}
                className="absolute left-0 top-0 h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
