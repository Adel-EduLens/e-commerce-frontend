export type CompareProductType = "SHOP" | "RETAIL" | "WHOLESALE";

export interface CompareItem {
  id: string;
  type: CompareProductType;
}

const STORAGE_KEY = "compareProducts";
const MAX_COMPARE_PRODUCTS = 4;

function notifyCompareUpdate() {
  window.dispatchEvent(new Event("compareUpdated"));
}

function isCompareItem(
  value: unknown,
): value is { id: string | number; type: CompareProductType } {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "type" in value
  );
}

export function getCompareProducts(): CompareItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed: unknown = JSON.parse(data);

    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((item) => {
      if (typeof item === "string" || typeof item === "number") {
        return [{ id: String(item), type: "SHOP" as CompareProductType }];
      }

      if (isCompareItem(item)) {
        return [{ id: String(item.id), type: item.type }];
      }

      return [];
    });
  } catch {
    return [];
  }
}

export function saveCompareProducts(items: CompareItem[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(items.slice(0, MAX_COMPARE_PRODUCTS)),
  );
  notifyCompareUpdate();
}

export function addCompareProduct(
  id: string | number,
  type: CompareProductType = "SHOP",
) {
  const items = getCompareProducts();

  if (items.some((i) => i.id === String(id) && i.type === type)) return items;

  const updated = [...items, { id: String(id), type }].slice(
    0,
    MAX_COMPARE_PRODUCTS,
  );

  saveCompareProducts(updated);

  return updated;
}

export function removeCompareProduct(
  id: string | number,
  type: CompareProductType = "SHOP",
) {
  const updated = getCompareProducts().filter(
    (item) => !(item.id === String(id) && item.type === type),
  );

  saveCompareProducts(updated);

  return updated;
}

export function clearCompareProducts() {
  localStorage.removeItem(STORAGE_KEY);
  notifyCompareUpdate();
}

export function isProductCompared(
  id: string | number,
  type: CompareProductType = "SHOP",
) {
  return getCompareProducts().some(
    (item) => item.id === String(id) && item.type === type,
  );
}

export function toggleCompareProduct(
  id: string | number,
  type: CompareProductType = "SHOP",
) {
  if (isProductCompared(id, type)) {
    return removeCompareProduct(id, type);
  }

  return addCompareProduct(id, type);
}

export function compareCount() {
  return getCompareProducts().length;
}
