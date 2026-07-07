const STORAGE_KEY = "compareProducts";
const MAX_COMPARE_PRODUCTS = 4;

export function getCompareProducts(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return [];

    const ids = JSON.parse(data);

    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function saveCompareProducts(ids: string[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(ids.slice(0, MAX_COMPARE_PRODUCTS))
  );
}

export function addCompareProduct(id: string) {
  const ids = getCompareProducts();

  if (ids.includes(id)) return ids;

  const updated = [...ids, id].slice(0, MAX_COMPARE_PRODUCTS);

  saveCompareProducts(updated);

  return updated;
}

export function removeCompareProduct(id: string) {
  const updated = getCompareProducts().filter((item) => item !== id);

  saveCompareProducts(updated);

  return updated;
}

export function clearCompareProducts() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isProductCompared(id: string) {
  return getCompareProducts().includes(id);
}

export function toggleCompareProduct(id: string) {
  if (isProductCompared(id)) {
    return removeCompareProduct(id);
  }

  return addCompareProduct(id);
}

export function compareCount() {
  return getCompareProducts().length;
}