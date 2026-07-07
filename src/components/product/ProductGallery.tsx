import { useEffect, useState } from "react";
import { ArrowCircle } from "./ui/ArrowCircle";
import type { DetailItem } from "../../types/DetailItem";

type ProductGalleryProps = {
  selectedColor: string;
  item: DetailItem;
};

export function ProductGallery({ selectedColor, item }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = item.images;

  useEffect(() => {
    const func = async () => {
      if (!selectedColor || images.length === 0) return;

      const matchingIndex = images.findIndex(
        (image) =>
          image.color &&
          image.color.toLowerCase() === selectedColor.toLowerCase(),
      );

      if (matchingIndex !== -1) {
        setSelectedImageIndex(matchingIndex);
      }
    };
    func();
  }, [selectedColor, images]);

  const handleGalleryStep = (direction: "previous" | "next") => {
    setSelectedImageIndex((currentIndex) => {
      if (direction === "previous") {
        return currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      }

      return currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    });
  };

  return (
    <div className="flex flex-3 w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:gap-4">
        {/* Main image */}
        <div className="order-1 relative w-full overflow-hidden rounded-3xl lg:flex-1">
          <img
            src={images[selectedImageIndex]?.url}
            alt={item.name}
            className="aspect-[3/4] w-full object-cover z-0"
          />
        </div>

        {/* Thumbnail column */}
        <div className="order-2 flex items-center gap-3 lg:w-[104px] lg:flex-col lg:items-center lg:gap-4">
          <div className="flex w-full gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {images.map((image, index) => (
              <button
                type="button"
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative h-20 w-16 shrink-0 cursor-pointer overflow-hidden rounded-2xl outline outline-1 outline-offset-[-1px] sm:h-24 sm:w-20 lg:h-[104px] lg:w-full lg:rounded-2xl ${
                  selectedImageIndex === index
                    ? "outline-foreground"
                    : "outline-stroke"
                }`}
                aria-label={`Open product image ${index + 1}`}
              >
                <img
                  src={image.url}
                  alt={`${item.name} ${index + 1}`}
                  className="absolute left-0 top-0 h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
          <div className="flex flex-row-reverse shrink-0 items-center gap-3 lg:mt-1 lg:flex-col lg:gap-3">
            <button
              type="button"
              onClick={() => handleGalleryStep("previous")}
              aria-label="Previous image"
            >
              <ArrowCircle direction="next" />
            </button>

            <button
              type="button"
              onClick={() => handleGalleryStep("next")}
              aria-label="Next image"
            >
              <ArrowCircle direction="prev" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
