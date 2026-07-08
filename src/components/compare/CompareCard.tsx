import { Link } from "react-router-dom";
import {
  Star,
  Tag,
  Palette,
  Ruler,
  Trash2,
  ShoppingBag,
  Zap,
  Sparkles,
} from "lucide-react";

import type { Product } from "../../hooks/queries/productsQuery";
import { useTranslation } from "react-i18next";

interface CompareCardProps {
  product: Product;
  onRemove: (id: string) => void;
}

export function CompareCard({ product, onRemove }: CompareCardProps) {
  const image =
    product.images[0]?.url || "https://placehold.co/600x600?text=No+Image";

  const hasFlashDeal =
    product.isFlashDeals &&
    product.flashDealPrice &&
    product.flashDealPrice < product.price;

  const { t } = useTranslation("compare");

  return (
    <div
      className="
        flex
        flex-col
        rounded-3xl
        border
        border-stroke
        bg-card
        shadow-sm
        transition-all
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* IMAGE */}

      <div className="relative">
        <img
          src={image}
          alt={product.name}
          className="
            aspect-[4/3]
            w-full
            max-h-52
            rounded-t-3xl
            object-cover
          "
        />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isMustHave && (
            <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
              <Sparkles size={13} />
              {t("card.mustHave")}
            </span>
          )}

          {hasFlashDeal && (
            <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
              <Zap size={13} />
              {t("card.flashDeal")}
            </span>
          )}
        </div>
      </div>

      {/* BODY */}

      <div className="flex flex-1 flex-col p-4">
        {/* NAME + PRICE */}

        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-base font-bold text-foreground">
            {product.name}
          </h2>

          <div className="shrink-0 text-end">
            {hasFlashDeal ? (
              <>
                <span className="block text-lg font-bold text-primary">
                  ${product.flashDealPrice}
                </span>

                <span className="text-xs text-gray-text line-through">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-foreground">
                ${product.price}
              </span>
            )}
          </div>
        </div>

        {/* Rating */}

        <div className="mt-2 flex items-center gap-2">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />

          <span className="text-sm font-semibold">
            {product.rating.toFixed(1)}
          </span>
        </div>

        <div className="my-4 border-t border-stroke" />

        {/* BRAND + CATEGORY */}

        <div className="grid grid-cols-2 gap-3">
          <InfoRow
            icon={<ShoppingBag size={16} />}
            label={t("card.brand")}
            value={product.brand?.name ?? "—"}
          />

          <InfoRow
            icon={<Tag size={16} />}
            label={t("card.category")}
            value={product.category.name}
          />
        </div>

        {/* COLORS */}

        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-text">
            <Palette size={16} />
            {t("card.colors")}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {product.colors.length > 0 ? (
              product.colors.map((color) => (
                <span
                  key={color.id}
                  className="
                    rounded-full
                    border
                    border-stroke
                    bg-background
                    px-2
                    py-1
                    text-xs
                    text-foreground
                  "
                >
                  {color.color}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-text">—</span>
            )}
          </div>
        </div>

        {/* SIZES */}

        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-text">
            <Ruler size={16} />
            {t("card.sizes")}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {product.sizes.length > 0 ? (
              product.sizes.map((size) => (
                <span
                  key={size.id}
                  className="
                    rounded-full
                    border
                    border-stroke
                    bg-background
                    px-2
                    py-1
                    text-xs
                    font-medium
                  "
                >
                  {size.size}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-text">—</span>
            )}
          </div>
        </div>

        {/* DESCRIPTION */}

        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-text">
            {t("card.description")}
          </p>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-foreground">
            {product.description || t("card.noDescription")}
          </p>
        </div>

        {/* ACTIONS */}

        <div className="mt-auto pt-5">
          <Link
            to={`/product-details/${product.id}`}
            className="
              flex
              w-full
              items-center
              justify-center
              rounded-xl
              bg-primary
              px-3
              py-2.5
              text-sm
              font-semibold
              text-primary-foreground
              transition
              hover:opacity-90
            "
          >
            {t("card.viewProduct")}
          </Link>

          <button
            onClick={() => onRemove(product.id)}
            className="
              mt-2
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-urgent
              px-3
              py-2.5
              text-sm
              font-semibold
              text-urgent
              transition
              hover:bg-urgent
              hover:text-white
            "
          >
            <Trash2 size={16} />
            {t("card.remove")}
          </button>
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-gray-text">
        {icon}

        <span className="text-xs font-medium">{label}</span>
      </div>

      <span className="truncate text-sm font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}
