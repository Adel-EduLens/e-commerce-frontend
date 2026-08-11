export type Coupon = {
  id: string;
  code: string;
  discount: number;
  categoryId?: string | number | null;
  productId?: string | number | null;
  retailCategoryId?: string | number | null;
  retailProductId?: string | number | null;
  category?: { id?: string | number; name?: string } | string | null;
  retailCategory?: { id?: string | number; name?: string } | string | null;
  type?: "trader" | "influencer";
};

type CategoryReference = { id?: number | string; name?: string };
type CategoryInput = CategoryReference | string | number;

type CartItem = {
  categoryIds?: (number | string)[] | null;
  categoryId?: number | string | null;
  category?: CategoryReference | string | null;
  categories?: CategoryInput[] | null;
  categoryName?: string | null;
  productId?: number | string | null;
  [key: string]: unknown;
};

export function couponAppliesToItem(coupon: Coupon, item: CartItem): boolean {
  if (!coupon) return false;

  // Extract all coupon category IDs and names
  const couponCatIds: string[] = [];
  const couponCatNames: string[] = [];

  if (coupon.categoryId) couponCatIds.push(String(coupon.categoryId));
  if (coupon.retailCategoryId) couponCatIds.push(String(coupon.retailCategoryId));
  if (coupon.category) {
    if (typeof coupon.category === "object") {
      if (coupon.category.id) couponCatIds.push(String(coupon.category.id));
      if (coupon.category.name) couponCatNames.push(String(coupon.category.name).trim().toLowerCase());
    } else if (typeof coupon.category === "string") {
      couponCatNames.push(String(coupon.category).trim().toLowerCase());
    }
  }
  if (coupon.retailCategory) {
    if (typeof coupon.retailCategory === "object") {
      if (coupon.retailCategory.id) couponCatIds.push(String(coupon.retailCategory.id));
      if (coupon.retailCategory.name) couponCatNames.push(String(coupon.retailCategory.name).trim().toLowerCase());
    } else if (typeof coupon.retailCategory === "string") {
      couponCatNames.push(String(coupon.retailCategory).trim().toLowerCase());
    }
  }

  // Extract all item category IDs and names
  const itemCatIds: string[] = [];
  const itemCatNames: string[] = [];

  if (item.categoryIds && Array.isArray(item.categoryIds)) {
    item.categoryIds.forEach((id) => itemCatIds.push(String(id)));
  }
  if (item.categoryId) {
    itemCatIds.push(String(item.categoryId));
  }
  if (item.category) {
    if (typeof item.category === "object") {
      if (item.category.id) itemCatIds.push(String(item.category.id));
      if (item.category.name) itemCatNames.push(String(item.category.name).trim().toLowerCase());
    } else if (typeof item.category === "string") {
      itemCatNames.push(String(item.category).trim().toLowerCase());
    }
  }
  if (item.categories && Array.isArray(item.categories)) {
    item.categories.forEach((cat) => {
      if (typeof cat === "object") {
        if (cat.id) itemCatIds.push(String(cat.id));
        if (cat.name) itemCatNames.push(String(cat.name).trim().toLowerCase());
      } else {
        itemCatIds.push(String(cat));
      }
    });
  }
  if (item.categoryName) {
    itemCatNames.push(String(item.categoryName).trim().toLowerCase());
  }

  const hasProductConstraint = Boolean(coupon.productId || coupon.retailProductId);
  const hasCategoryConstraint = couponCatIds.length > 0 || couponCatNames.length > 0;

  // Store-wide coupon (no constraints)
  if (!hasProductConstraint && !hasCategoryConstraint) return true;

  // Check product constraint
  if (hasProductConstraint) {
    const itemPid = String(item.productId || "");
    if (coupon.productId && String(coupon.productId) === itemPid) return true;
    if (coupon.retailProductId && String(coupon.retailProductId) === itemPid) return true;
  }

  // Check category constraint
  if (hasCategoryConstraint) {
    const idMatches = couponCatIds.some((cId) => itemCatIds.includes(cId));
    if (idMatches) return true;

    const nameMatches = couponCatNames.some((cName) => itemCatNames.includes(cName));
    if (nameMatches) return true;
  }

  return false;
}
