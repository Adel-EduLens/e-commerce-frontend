import { useState } from "react";
import { Star } from "lucide-react";

import {
  useCreateReview,
  useUpdateReview,
} from "../../hooks/queries/reviewQuery";
import { useTranslation } from "react-i18next";
import type { Review } from "../../hooks/queries/reviewQuery";

interface ReviewFormProps {
  productId: string;
  productType?: "PRODUCT" | "RENTAL" | "RETAIL" | "WHOLESALE";
  existingReview?: Review;
  onDone: () => void;
}

export function ReviewForm({
  productId,
  productType = "PRODUCT",
  existingReview,
  onDone,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");

  const createProductReview = useCreateReview(productId);
  const updateProductReview = useUpdateReview(productId);

  const { t } = useTranslation("reviewForm");

  const isPending =
    createProductReview.isPending ||
    updateProductReview.isPending;
  const isEditMode = !!existingReview;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    if (isEditMode) {
      updateProductReview.mutate(
        { id: existingReview.id, rating, comment },
        { onSuccess: onDone },
      );
    } else {
      createProductReview.mutate(
        { productId, rating, comment },
        { onSuccess: onDone },
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[918px] flex-col gap-4 rounded-3xl border border-stroke bg-card p-4 sm:p-6"
    >
      <h3 className="font-['Montserrat'] text-xl font-semibold text-foreground">
        {isEditMode ? t("editYourReview") : t("writeReview")}
      </h3>

      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (hoverRating || rating);
          return (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onClick={() => setRating(star)}
              className="p-0.5 transition-transform hover:scale-110"
              aria-label={t("stars", { count: star })}
            >
              <Star
                size={28}
                strokeWidth={1.5}
                className={`transition-colors ${
                  isActive
                    ? "fill-primary stroke-primary"
                    : "fill-transparent stroke-gray-text"
                }`}
              />
            </button>
          );
        })}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t("shareThoughts")}
        maxLength={1000}
        rows={4}
        className="w-full resize-none rounded-xl border border-stroke bg-background px-3 py-2 font-['Montserrat'] text-sm text-foreground placeholder:text-gray-text outline-none focus:border-primary"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-text">{comment.length}/1000</span>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onDone}
            className="rounded-2xl px-5 py-2 font-['Montserrat'] text-sm font-medium text-gray-text hover:opacity-80"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={rating === 0 || isPending}
            className="rounded-2xl bg-primary px-5 py-2 font-['Montserrat'] text-sm font-semibold text-foreground disabled:opacity-50"
          >
            {isPending
              ? t("saving")
              : isEditMode
                ? t("saveChanges")
                : t("submitReview")}
          </button>
        </div>
      </div>
    </form>
  );
}
