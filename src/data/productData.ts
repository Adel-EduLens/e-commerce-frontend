export const GALLERY_IMAGES = [
  "image 11.png",
  "image 9.png",
  "image 7.png",
  "image 6.png",
  "image 8.png",
] as const;

export const COLOR_OPTIONS = [
  { name: "Black", hex: "#1A1A1A" },
  { name: "Rose", hex: "#F6D1C9" },
  { name: "Taupe", hex: "#A29F8E" },
  { name: "Sand", hex: "#D1BBA4" },
] as const;

export const SIZE_OPTIONS = ["S", "M", "L"] as const;

export const REVIEW_FILTERS = [
  { label: "Filter by rating all", value: "all" },
  { label: "Filter by rating 5", value: "5" },
  { label: "Filter by rating 4+", value: "4plus" },
] as const;

export const REVIEW_SORTS = [
  { label: "Sort by highest", value: "highest" },
  { label: "Sort by newest", value: "newest" },
  { label: "Sort by helpful", value: "helpful" },
] as const;

export const PRODUCT_DESCRIPTION =
  "Crafted from a premium cotton blend, this round neck t-shirt dress is soft, breathable, and easy to style for everyday wear. The relaxed fit, polished finish, and clean silhouette make it a dependable staple for casual and elevated looks alike.";
export const PRODUCT_TITLE = "Plain Maxi Tabard Dress";
export const PRODUCT_PRICE = 1000;
export const PRODUCT_ID = "plain-maxi-tabard-dress";

export const PRODUCT_REVIEWS = [
  {
    id: 1,
    author: "Mariam K.",
    initial: "M",
    displayDate: "Mar 20, 2025",
    sortDate: "2025-03-20",
    rating: 5,
    title: "Amazing",
    body: "I love this fur coat! literally amazing trust me if you are looking for a fur coat this is the one!!! It’s so cute and the quality is amazing. It’s not oversized but it’s true to size so if you’re petite and looking for an xs this is perfect.",
    helpful: 4,
    images: ["image 11.png", "image 9.png"],
  },
  {
    id: 2,
    author: "Nour A.",
    initial: "N",
    displayDate: "Apr 05, 2025",
    sortDate: "2025-04-05",
    rating: 4,
    title: "So flattering",
    body: "The fit is very clean and flattering, and the fabric feels much better than I expected. I styled it with sneakers and a denim jacket and it looked effortless.",
    helpful: 7,
    images: ["image 7.png", "image 8.png"],
  },
  {
    id: 3,
    author: "Salma H.",
    initial: "S",
    displayDate: "Feb 14, 2025",
    sortDate: "2025-02-14",
    rating: 5,
    title: "Worth it",
    body: "Beautiful material, easy sizing, and the color looks even better in person. I ended up ordering another piece from the same collection after trying this one.",
    helpful: 3,
    images: ["image 6.png", "image 11.png"],
  },
] as const;

export type SizeOption = (typeof SIZE_OPTIONS)[number];
export type ReviewFilterValue = (typeof REVIEW_FILTERS)[number]["value"];
export type ReviewSortValue = (typeof REVIEW_SORTS)[number]["value"];
export type ProductReview = (typeof PRODUCT_REVIEWS)[number];
export type ColorOption = (typeof COLOR_OPTIONS)[number];

export function getVisibleReviews(
  filterValue: ReviewFilterValue,
  sortValue: ReviewSortValue
): ProductReview[] {
  return [...PRODUCT_REVIEWS]
    .filter((review) => {
      if (filterValue === "5") return review.rating === 5;
      if (filterValue === "4plus") return review.rating >= 4;
      return true;
    })
    .sort((a, b) => {
      if (sortValue === "newest") {
        return new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime();
      }
      if (sortValue === "helpful") return b.helpful - a.helpful;
      return b.rating - a.rating;
    });
}