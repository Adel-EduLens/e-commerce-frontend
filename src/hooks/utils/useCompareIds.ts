import { useCallback, useEffect, useState } from "react";

const COMPARE_STORAGE_KEY = "compare_product_ids";
const COMPARE_EVENT = "compare-storage-updated";
export const MAX_COMPARE_ITEMS = 4;

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(ids));
  // بنبعت event مخصص عشان أي مكونات تانية فاتحة في نفس التاب تتحدث فورًا
  window.dispatchEvent(new Event(COMPARE_EVENT));
}

export function useCompareIds() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const func = async () => {
      setIds(readIds());
    };
    func();
    const sync = () => setIds(readIds());
    window.addEventListener(COMPARE_EVENT, sync);
    window.addEventListener("storage", sync); 
    return () => {
      window.removeEventListener(COMPARE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addToCompare = useCallback((id: string, max = MAX_COMPARE_ITEMS) => {
    const current = readIds();
    if (current.includes(id)) return;
    const next = [...current, id].slice(-max);
    writeIds(next);
    setIds(next);
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    const next = readIds().filter((existingId) => existingId !== id);
    writeIds(next);
    setIds(next);
  }, []);

  const toggleCompare = useCallback((id: string, max = MAX_COMPARE_ITEMS) => {
    const current = readIds();
    const next = current.includes(id)
      ? current.filter((existingId) => existingId !== id)
      : [...current, id].slice(-max);
    writeIds(next);
    setIds(next);
  }, []);

  const clearCompare = useCallback(() => {
    writeIds([]);
    setIds([]);
  }, []);

  return {
    ids,
    isInCompare: (id: string) => ids.includes(id),
    addToCompare,
    removeFromCompare,
    toggleCompare,
    clearCompare,
  };
}
