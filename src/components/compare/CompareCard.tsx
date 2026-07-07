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

export function CompareCard({
  product,
  onRemove,
}: CompareCardProps) {
  const image =
    product.images[0]?.url ||
    "https://placehold.co/600x600?text=No+Image";

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
      {/* ---------------- IMAGE ---------------- */}

      <div className="relative">
        <img
          src={image}
          alt={product.name}
          className="aspect-square w-full rounded-t-3xl object-cover"
        />

        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {product.isMustHave && (
            <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              <Sparkles size={14} />
              {t("card.mustHave")}
            </span>
          )}

          {hasFlashDeal && (
            <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              <Zap size={14} />
              {t("card.flashDeal")}
            </span>
          )}
        </div>
      </div>

      {/* ---------------- BODY ---------------- */}

      <div className="flex flex-1 flex-col p-6">

        {/* Name */}

        <h2 className="line-clamp-2 text-xl font-bold text-foreground">
          {product.name}
        </h2>

        {/* Rating */}

        <div className="mt-3 flex items-center gap-2">
          <Star
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="font-semibold">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Price */}

        <div className="mt-5">
          {hasFlashDeal ? (
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-primary">
                ${product.flashDealPrice}
              </span>

              <span className="text-gray-text line-through">
                ${product.price}
              </span>
            </div>
          ) : (
            <span className="text-3xl font-bold text-foreground">
              ${product.price}
            </span>
          )}
        </div>

        {/* Divider */}

        <div className="my-6 border-t border-stroke" />

        {/* Brand */}

        <InfoRow
          icon={<ShoppingBag size={18} />}
          label={t("card.brand")}
          value={product.brand.name}
        />

        {/* Category */}

        <InfoRow
          icon={<Tag size={18} />}
          label={t("card.category")}
          value={product.category.name}
        />

        {/* Colors */}

        <div className="mt-5">

          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-text">
            <Palette size={18} />
            {t("card.colors")}
          </div>

          <div className="flex flex-wrap gap-2">
            {product.colors.length > 0 ? (
              product.colors.map((color) => (
                <span
                  key={color.id}
                  className="
                    rounded-full
                    border
                    border-stroke
                    bg-background
                    px-3
                    py-1
                    text-sm
                    text-foreground
                  "
                >
                  {color.color}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-text">
                —
              </span>
            )}
          </div>
        </div>

        {/* Sizes */}

        <div className="mt-5">

          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-text">
            <Ruler size={18} />
            {t("card.sizes")}
          </div>

          <div className="flex flex-wrap gap-2">
            {product.sizes.length > 0 ? (
              product.sizes.map((size) => (
                <span
                  key={size.id}
                  className="
                    rounded-full
                    border
                    border-stroke
                    bg-background
                    px-3
                    py-1
                    text-sm
                    font-medium
                  "
                >
                  {size.size}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-text">
                —
              </span>
            )}
          </div>
        </div>

        {/* Description */}

        <div className="mt-6">

          <p className="text-sm font-semibold text-gray-text">
            {t("card.description")}
          </p>

          <p className="mt-2 line-clamp-5 text-sm leading-6 text-foreground">
            {product.description || t("card.noDescription")}
          </p>
        </div>

        {/* Footer */}

        <div className="mt-auto pt-8">

          <Link
            to={`/products/${product.id}`}
            className="
              flex
              w-full
              items-center
              justify-center
              rounded-xl
              bg-primary
              px-4
              py-3
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
              mt-3
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-urgent
              px-4
              py-3
              font-semibold
              text-urgent
              transition
              hover:bg-urgent
              hover:text-white
            "
          >
            <Trash2 size={18} />

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

function InfoRow({
  icon,
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-2">

      <div className="flex items-center gap-2 text-gray-text">
        {icon}

        <span className="text-sm font-medium">
          {label}
        </span>
      </div>

      <span className="font-semibold text-foreground">
        {value}
      </span>

    </div>
  );
}