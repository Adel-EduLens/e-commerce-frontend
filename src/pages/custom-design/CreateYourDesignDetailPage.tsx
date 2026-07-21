import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../hooks/queries/productsQuery";
import { Rnd } from "react-rnd";
import {
  Maximize2,
  Upload,
  LayoutGrid,
  Share,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const CreateYourDesignDetailPage = () => {
  const { t } = useTranslation("createYourDesignDetailsPage");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: blankProduct, isLoading, error } = useProduct(id ?? "");

  const [activeImage, setActiveImage] = useState<string>("");
  const [activeColor, setActiveColor] = useState<string>("");
  const [activeMaterial, setActiveMaterial] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeDirection, setActiveDirection] = useState<string>("");
  const [rndState, setRndState] = useState({
    x: 50,
    y: 50,
    width: 150,
    height: 150,
  });

  useEffect(() => {
    const func = () => {
      if (!blankProduct) return;

      if (blankProduct.colors.length > 0) {
        const firstColor = blankProduct.colors[0];

        setActiveColor(firstColor.color || "");

        if (firstColor.images.length > 0) {
          setActiveDirection(firstColor.images[0].direction || "");
          setActiveImage(firstColor.images[0].url || "");
        }
      }

      if (blankProduct.materials && blankProduct.materials.length > 0) {
        setActiveMaterial(blankProduct.materials[0].material);
      }
    };
    func();
  }, [blankProduct]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorClick = (color?: string) => {
    if (!color) return;
    setActiveColor(color);

    const colorObj = blankProduct?.colors.find((c) => c.color === color);

    if (!colorObj) return;

    if (colorObj.images.length > 0) {
      setActiveDirection(colorObj.images[0].direction || "");
      setActiveImage(colorObj.images[0].url || "");
    }
  };
  const handleDirectionClick = (direction?: string) => {
    if (!direction) return;
    setActiveDirection(direction);

    const colorObj = blankProduct?.colors.find((c) => c.color === activeColor);

    if (!colorObj) return;

    const image = colorObj.images.find((img) => img.direction === direction);

    if (image) {
      setActiveImage(image.url || "");
    }
  };
  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center bg-background text-foreground">
        {t("loadingDesigner")}
      </div>
    );
  }

  if (error || !blankProduct) {
    return (
      <div className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-4 bg-background text-danger">
        <p>{t("failedToLoadProduct")}</p>
        <button
          onClick={() => navigate("/createYourDesign")}
          className="underline"
        >
          {t("goBack")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 lg:flex-row">
        {/* Left Column: Viewer */}
        <div className="relative flex min-h-[500px] flex-1 items-center justify-center overflow-hidden rounded-[24px] bg-card border border-stroke lg:min-h-[700px]">
          {/* Header Info inside Viewer */}
          <div className="absolute left-6 top-6 z-10 md:left-10 md:top-10">
            <h2 className="font-['Montserrat'] text-lg font-medium text-gray-text">
              {blankProduct.name}
            </h2>
            <p className="mt-1 font-['Montserrat'] text-2xl font-bold text-foreground">
              {blankProduct.blankPrice ?? blankProduct.price}$
            </p>
          </div>

          {/* Maximize Button */}
          <button className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card border border-stroke text-foreground shadow-sm transition-transform hover:scale-110 hover:bg-gray-light md:right-10 md:top-10">
            <Maximize2 size={18} />
          </button>

          {/* Base Product Image */}
          <img
            src={activeImage}
            alt={blankProduct.name}
            className="pointer-events-none h-full w-full object-contain p-8 md:p-16"
          />

          {/* Bounding Box / Print Area Overlay */}
          {/* The bounding box defines where the design can be visible (overflow hidden) */}
          <div className="absolute inset-0 m-auto h-[280px] w-[220px] overflow-hidden border-2 border-dashed border-info sm:h-[400px] sm:w-[300px]">
            {uploadedImage && (
              <Rnd
                position={{ x: rndState.x, y: rndState.y }}
                size={{ width: rndState.width, height: rndState.height }}
                onDragStop={(e, d) =>
                  setRndState({ ...rndState, x: d.x, y: d.y })
                }
                onResizeStop={(e, direction, ref, delta, position) => {
                  setRndState({
                    width: parseInt(ref.style.width, 10),
                    height: parseInt(ref.style.height, 10),
                    x: position.x,
                    y: position.y,
                  });
                }}
                lockAspectRatio={true}
                enableResizing={true}
                className="z-20 cursor-move"
              >
                <img
                  src={uploadedImage}
                  alt={t("yourDesign")}
                  className="pointer-events-none h-full w-full object-contain"
                  draggable={false}
                />
              </Rnd>
            )}
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="flex w-full flex-col gap-8 rounded-[24px] bg-card border border-stroke p-6 lg:w-[420px] xl:w-[480px]">
          {/* Sub Navigation */}
          <div className="flex items-center justify-between border-b border-stroke pb-6">
            <button className="text-gray-text transition-colors hover:text-foreground">
              <ChevronLeft size={20} />
            </button>
            <span className="font-['Montserrat'] text-lg font-medium text-foreground">
              {t("hood")}
            </span>
            <button className="text-gray-text transition-colors hover:text-foreground">
              <ChevronRight size={20} />
            </button>
            <button className="ml-auto rounded-xl border border-stroke px-4 py-2 text-sm text-gray-text transition-colors hover:bg-gray-light hover:text-foreground">
              {t("menu")}
            </button>
          </div>

          {/* Color Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-['Montserrat'] text-base font-semibold text-foreground">
              {t("color")}
            </h3>
            <div className="flex flex-wrap gap-3">
              {blankProduct.colors?.map((colorObj) => (
                <button
                  key={colorObj.id}
                  onClick={() => handleColorClick(colorObj.color)}
                  className={`h-9 w-9 rounded-full border-2 transition-all ${
                    activeColor === colorObj.color
                      ? "border-foreground ring-2 ring-foreground/50"
                      : "border-foreground/10 "
                  }`}
                  style={{ backgroundColor: colorObj.color }}
                  title={colorObj.color}
                />
              ))}
            </div>
          </div>

          {/* Material Section */}
          {blankProduct.materials && blankProduct.materials.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-['Montserrat'] text-base font-semibold text-foreground">
                {t("material")}
              </h3>
              <div className="flex flex-wrap gap-3">
                {blankProduct.materials.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setActiveMaterial(mat.material)}
                    className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
                      mat.material === activeMaterial
                        ? "bg-primary text-primary-foreground"
                        : "border border-stroke text-gray-text hover:bg-gray-light hover:text-foreground"
                    }`}
                  >
                    {mat.material}
                  </button>
                ))}
              </div>
            </div>
          )}
          {(() => {
            const selectedColor = blankProduct.colors.find(
              (c) => c.color === activeColor,
            );

            if (!selectedColor) return null;

            return (
              <div className="flex flex-col gap-4">
                <h3 className="font-['Montserrat'] text-base font-semibold text-foreground">
                  {t("view")}
                </h3>

                <div className="flex flex-wrap gap-3">
                  {selectedColor.images.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => handleDirectionClick(image.direction)}
                      className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
                        activeDirection === image.direction
                          ? "bg-primary text-primary-foreground"
                          : "border border-stroke text-gray-text hover:bg-gray-light hover:text-foreground"
                      }`}
                    >
                      {image.direction}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
          {/* Print / Upload Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-['Montserrat'] text-base font-semibold text-foreground">
              {t("print")}
            </h3>
            <div className="flex gap-3">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-stroke px-4 py-3 text-sm font-medium text-gray-text transition-colors hover:bg-gray-light hover:text-foreground">
                <Upload size={18} />
                {t("uploadYourOwn")}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-stroke px-4 py-3 text-sm font-medium text-gray-text transition-colors hover:bg-gray-light hover:text-foreground">
                <LayoutGrid size={18} />
                {t("browseLibrary")}
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-auto flex gap-4 pt-6">
            <button className="flex-1 rounded-xl bg-primary py-4 font-['Montserrat'] text-base font-semibold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02]">
              {t("done")}
            </button>
            <button className="flex items-center justify-center rounded-xl border border-stroke px-5 text-gray-text transition-colors hover:bg-gray-light hover:text-foreground">
              <Share size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateYourDesignDetailPage;
