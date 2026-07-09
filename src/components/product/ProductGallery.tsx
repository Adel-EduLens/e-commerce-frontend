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
  // Filter images to show ONLY images corresponding to the selected color
  const colorImages = item.images.filter(
    (image) =>
      image.color &&
      selectedColor &&
      image.color.toLowerCase() === selectedColor.toLowerCase()
  );

  // Fallback to all images if color specific ones are absent
  const displayImages = colorImages.length > 0 ? colorImages : item.images;

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full select-none">
      {/* Thumbnail List */}
      <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-y-auto max-h-[550px] scrollbar-thin shrink-0">
        {displayImages.map((image, index) => {
          const isSelected = selectedImage === image.url;
          return (
            <button
              type="button"
              key={image.id}
              onClick={() => setSelectedImage(image.url)}
              className={`relative h-20 w-16 md:h-24 md:w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all outline-none ${
                isSelected
                  ? "border-primary scale-[1.02] shadow-md"
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

      {/* Main selected image */}
      <div className="order-1 md:order-2 relative flex-1 aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-50 border border-stroke shadow-sm">
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
    </div>
  );
}
