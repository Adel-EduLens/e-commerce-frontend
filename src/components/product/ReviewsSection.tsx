import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp } from "lucide-react";

import { useReviews } from "../../hooks/queries/reviewQuery";
import { useAuthStore } from "../../store/useAuthStore";

import { Star } from "../ui/star";
import { ReviewForm } from "./ReviewForm";

type ReviewFilterValue = "all" | "5" | "4" | "3" | "2" | "1";
type ReviewSortValue = "newest" | "oldest" | "highest" | "lowest";

const FILTER_OPTIONS: {
  label: string;
  value: ReviewFilterValue;
}[] = [
  { label: "All Reviews", value: "all" },
  { label: "5 Stars", value: "5" },
  { label: "4 Stars", value: "4" },
  { label: "3 Stars", value: "3" },
  { label: "2 Stars", value: "2" },
  { label: "1 Star", value: "1" },
];

const SORT_OPTIONS: {
  label: string;
  value: ReviewSortValue;
}[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Highest Rating", value: "highest" },
  { label: "Lowest Rating", value: "lowest" },
];

export function ReviewsSection() {
  const { id } = useParams();
  const { user } = useAuthStore();

  const { data: reviews = [], isPending, isError } = useReviews(id);

  const [filterValue, setFilterValue] = useState<ReviewFilterValue>("all");
  const [sortValue, setSortValue] = useState<ReviewSortValue>("newest");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [helpfulReviewIds, setHelpfulReviewIds] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

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

  const renderReviewCard = (review: (typeof visibleReviews)[number]) => {
    const isHelpful = helpfulReviewIds.includes(review.id);
    const helpfulCount = isHelpful ? 1 : 0;

    return (
      <div
        key={review.id}
        className="relative flex w-full max-w-[918px] flex-col gap-4 rounded-3xl border border-stroke p-4 sm:border-0 sm:p-0"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center justify-start gap-4 sm:gap-6">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-light sm:h-20 sm:w-20">
              <div className="absolute inset-0 flex items-center justify-center font-['Montserrat'] text-2xl font-medium text-foreground sm:text-[32px]">
                {review.user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="flex flex-col items-start justify-start gap-1.5">
              <div className="font-['Montserrat'] text-xl font-medium text-foreground sm:text-2xl">
                {review.user.name}
              </div>

              <div className="font-['Montserrat'] text-base font-medium text-gray-text sm:text-xl">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
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
            className="inline-flex items-center justify-start gap-2 rounded-2xl bg-card p-3 outline outline-1 outline-offset-[-1px] outline-stroke sm:p-4"
          >
            <ThumbsUp
              className="h-5 w-5 text-foreground sm:h-6 sm:w-6"
              strokeWidth={1.5}
            />

            <span className="whitespace-nowrap font-['Montserrat'] text-base font-medium text-foreground sm:text-xl">
              Helpful ({helpfulCount})
            </span>
          </button>
        </div>
        <div className="flex items-center justify-start gap-2">
          <div className="font-['Montserrat'] text-base font-semibold text-foreground">
            {review.rating.toFixed(1)}
          </div>

          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => {
              const fill = Math.min(
                1,
                Math.max(0, Number(review.rating.toFixed(1)) - index),
              );
              return <Star key={index} fill={fill} />;
            })}
          </div>
        </div>

        <div className="flex w-full flex-col items-start justify-start gap-3">
          <div className="font-['Montserrat'] text-lg font-medium text-gray-text sm:text-xl">
            {review.comment ?? "No comment"}
          </div>
        </div>
      </div>
    );
  };

  if (isPending) {
    return <div className="flex justify-center py-10">Loading...</div>;
  }
  if (isError) {
    return (
      <div className="flex justify-center py-10">Could not load reviews.</div>
    );
  }

  return (
    <section className="flex w-full flex-col items-start gap-6">
      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6">
          <h2 className="font-['Montserrat'] text-3xl font-bold text-foreground sm:text-5xl">
            Reviews
          </h2>

          {reviews.length > 0 && (
            <div className="flex items-center justify-start gap-2">
              <div className="font-['Montserrat'] text-base font-semibold text-foreground">
                {averageRating}
              </div>

              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => {
                  const fill = Math.min(
                    1,
                    Math.max(0, Number(averageRating) - index),
                  );
                  return <Star key={index} fill={fill} />;
                })}
              </div>

              <div className="font-['Montserrat'] text-base font-medium text-gray-text">
                ({reviews.length} Reviews)
              </div>
            </div>
          )}
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-primary px-5 py-3 font-['Montserrat'] text-base font-semibold text-foreground"
          >
            {myReview ? "Edit Your Review" : "Write a Review"}
          </button>
        )}
      </div>

      {showForm && (
        <ReviewForm
          productId={id!}
          existingReview={myReview}
          onDone={() => setShowForm(false)}
        />
      )}

      {reviews.length === 0 && (
        <div className="flex w-full justify-center py-10">
          No reviews found. Be the first to review this product!
        </div>
      )}

      {reviews.length > 0 && (
        <>
          <div className="flex w-full flex-col flex-wrap items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="font-['Montserrat'] text-base font-medium text-gray-text sm:text-xl">
              {showAllReviews
                ? `Showing all ${visibleReviews.length} reviews`
                : `Showing 1 of ${visibleReviews.length} reviews`}
            </div>

            <div className="flex flex-col items-start justify-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <select
                value={filterValue}
                onChange={(e) =>
                  setFilterValue(e.target.value as ReviewFilterValue)
                }
                className="rounded-2xl bg-[#EDEDED] px-5 py-3 font-['Montserrat'] text-base font-medium text-foreground outline-none sm:text-lg"
              >
                {FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={sortValue}
                onChange={(e) =>
                  setSortValue(e.target.value as ReviewSortValue)
                }
                className="rounded-2xl bg-[#EDEDED] px-5 py-3 font-['Montserrat'] text-base font-medium text-foreground outline-none sm:text-lg"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showAllReviews ? (
            <div className="flex w-full flex-col gap-6">
              {visibleReviews.map((review) => renderReviewCard(review))}
            </div>
          ) : (
            visibleReviews[0] && renderReviewCard(visibleReviews[0])
          )}

          <button
            type="button"
            onClick={() => setShowAllReviews((prev) => !prev)}
            className="mx-auto inline-flex items-center justify-start gap-2 rounded-2xl bg-primary p-4"
          >
            <span className="font-['Montserrat'] text-xl font-semibold text-foreground">
              {showAllReviews ? "View Less" : "View All"}
            </span>
          </button>
        </>
      )}
    </section>
  );
}