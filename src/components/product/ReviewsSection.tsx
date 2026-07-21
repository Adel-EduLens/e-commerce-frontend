import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp } from "lucide-react";
import { useProductReviews, type Review } from "../../hooks/queries/reviewQuery";
import { useAuthStore } from "../../store/useAuthStore";
import { Star } from "../ui/star";
import { ReviewForm } from "./ReviewForm";
import { useTranslation } from "react-i18next";

interface ReviewsSectionProps {
  productType?: "PRODUCT" | "RETAIL" | "WHOLESALE";
}

type ReviewFilterValue = "all" | "5" | "4" | "3" | "2" | "1";
type ReviewSortValue = "newest" | "oldest" | "highest" | "lowest";

const FILTER_OPTIONS: {
  label: string;
  value: ReviewFilterValue;
}[] = [
  { label: "allReviews", value: "all" },
  { label: "fiveStars", value: "5" },
  { label: "fourStars", value: "4" },
  { label: "threeStars", value: "3" },
  { label: "twoStars", value: "2" },
  { label: "oneStar", value: "1" },
];

const SORT_OPTIONS: {
  label: string;
  value: ReviewSortValue;
}[] = [
  { label: "newest", value: "newest" },
  { label: "oldest", value: "oldest" },
  { label: "highestRating", value: "highest" },
  { label: "lowestRating", value: "lowest" },
];

export function ReviewsSection({
  productType = "PRODUCT",
}: ReviewsSectionProps) {
  const { id } = useParams();
  const { user } = useAuthStore();

  const query = useProductReviews(id);
  const { data: reviews = [], isPending, isError } = query;

  const [filterValue, setFilterValue] = useState<ReviewFilterValue>("all");
  const [sortValue, setSortValue] = useState<ReviewSortValue>("newest");
  const [helpfulReviewIds, setHelpfulReviewIds] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Pagination & Load More states
  const [pageSize, setPageSize] = useState(3);

  const { t } = useTranslation("productDetails");

  const myReview = useMemo(
    () => reviews.find((review) => review.userId === Number(user?.id)),
    [reviews, user?.id],
  );

  const visibleReviews = useMemo(() => {
    let data = [...reviews];

    if (filterValue !== "all") {
      data = data.filter((review) => review.rating === Number(filterValue));
    }

    switch (sortValue) {
      case "newest":
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;

      case "oldest":
        data.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;

      case "highest":
        data.sort((a, b) => b.rating - a.rating);
        break;

      case "lowest":
        data.sort((a, b) => a.rating - b.rating);
        break;
    }

    return data;
  }, [reviews, filterValue, sortValue]);

  const averageRating =
    reviews.length === 0
      ? "0.0"
      : (
          reviews.reduce(
            (sum: number, review: { rating: number }) => sum + review.rating,
            0,
          ) / reviews.length
        ).toFixed(1);

  // Paginated visible reviews
  const paginatedReviews = useMemo(() => {
    return visibleReviews.slice(0, pageSize);
  }, [visibleReviews, pageSize]);

  const renderReviewCard = (review: Review) => {
    const isHelpful = helpfulReviewIds.includes(review.id);
    const helpfulCount = isHelpful ? 1 : 0;

 
    return (
      <div
        key={review.id}
        className="flex w-full flex-col gap-4 rounded-2xl border border-stroke p-5 bg-card shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] font-['Montserrat']"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-primary flex items-center justify-center font-bold text-foreground text-lg">
              {review.user.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-foreground text-sm sm:text-base">
                {review.user.name}
              </span>
              <span className="text-xs text-gray-text">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setHelpfulReviewIds((current) =>
                current.includes(review.id)
                  ? current.filter((id) => id !== review.id)
                  : [...current, review.id],
              )
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isHelpful
                ? "bg-primary border-primary text-foreground"
                : "bg-white border-stroke hover:bg-gray-50 text-gray-text"
            }`}
          >
            <ThumbsUp className="h-4 w-4" strokeWidth={2} />
            <span>
              {t("helpful")} {helpfulCount}
            </span>
          </button>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => {
              const fill = Math.min(
                1,
                Math.max(0, Number(review.rating) - index),
              );
              return <Star key={index} fill={fill} size={14} />;
            })}
          </div>
          <span className="text-xs font-bold text-foreground">
            {Number(review.rating).toFixed(1)}
          </span>
        </div>

        {/* Comment */}
        <p className="text-sm text-gray-text leading-relaxed">
          {review.comment ?? t("noCommentProvided")}{" "}
        </p>

       
      </div>
    );
  };

  if (isPending) {
    return (
      <div className="flex justify-center py-10 font-['Montserrat']">
        {t("loading")}
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center py-10 font-['Montserrat'] text-primary">
        {t("couldNotLoadReviews")}
      </div>
    );
  }

  return (
    <section className="flex w-full flex-col gap-6 font-['Montserrat'] select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-foreground">{t("reviews")}</h2>
          {reviews.length > 0 && (
            <>
              <span className="text-lg font-bold text-foreground">
                {averageRating}
              </span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => {
                  const fill = Math.min(
                    1,
                    Math.max(0, Number(averageRating) - index),
                  );
                  return <Star key={index} fill={fill} size={16} />;
                })}
              </div>
              <span className="text-sm text-gray-text">
                ({reviews.length} {t("reviewsCount")})
              </span>
            </>
          )}
          {reviews.length === 0 && (
            <span className="text-sm text-gray-text">{t("noReviews")}</span>
          )}
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-pressed transition w-fit"
          >
            {myReview ? t("editYourReview") : t("writeReview")}
          </button>
        )}
      </div>

      {showForm && (
        <ReviewForm
          productId={id!}
          productType={productType}
          existingReview={myReview}
          onDone={() => setShowForm(false)}
        />
      )}

      {reviews.length > 0 && (
        <>
          {/* Filter & Sort row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-gray-text">
              {t("showingReviews", {
                shown: paginatedReviews.length,
                total: visibleReviews.length,
              })}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterValue}
                onChange={(e) => {
                  setFilterValue(e.target.value as ReviewFilterValue);
                  setPageSize(3);
                }}
                className="rounded-md border border-stroke bg-card px-3 py-1.5 text-xs font-medium text-foreground outline-none cursor-pointer"
              >
                {FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
              <select
                value={sortValue}
                onChange={(e) => {
                  setSortValue(e.target.value as ReviewSortValue);
                  setPageSize(3);
                }}
                className="rounded-md border border-stroke bg-card px-3 py-1.5 text-xs font-medium text-foreground outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reviews Grid — 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paginatedReviews.map((review) => renderReviewCard(review))}
          </div>

          {/* View More */}
          {visibleReviews.length > pageSize && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setPageSize((prev) => prev + 3)}
                className="rounded-md border border-stroke bg-card px-8 py-2.5 text-sm font-bold text-foreground hover:border-gray-text transition"
              >
                {t("viewMore")}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
