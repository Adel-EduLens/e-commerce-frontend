import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SignalType = "view" | "purchase";

type Signal = {
  productId: string;
  categoryId: string;
  type: SignalType;
  timestamp: number;
};

const SIGNAL_WEIGHTS: Record<SignalType, number> = {
  view: 1,
  purchase: 3,
};

const MAX_SIGNALS = 50;
const DEDUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

type RecommendationStore = {
  signals: Signal[];
  addSignal: (productId: string, categoryId: string, type: SignalType) => void;
  getTopCategories: (limit?: number) => string[];
  clearSignals: () => void;
};

export const useRecommendationStore = create<RecommendationStore>()(
  persist(
    (set, get) => ({
      signals: [],

      addSignal: (productId, categoryId, type) => {
        const now = Date.now();
        const signals = get().signals;

        const isDuplicate = signals.some(
          (s) =>
            s.productId === productId &&
            s.type === type &&
            now - s.timestamp < DEDUP_WINDOW_MS,
        );
        if (isDuplicate) return;

        const updated = [
          ...signals,
          { productId, categoryId, type, timestamp: now },
        ].slice(-MAX_SIGNALS);

        set({ signals: updated });
      },

      getTopCategories: (limit = 3) => {
        const signals = get().signals;
        const weights = new Map<string, number>();

        for (const signal of signals) {
          const w = SIGNAL_WEIGHTS[signal.type] ?? 0;
          weights.set(
            signal.categoryId,
            (weights.get(signal.categoryId) ?? 0) + w,
          );
        }

        return [...weights.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit)
          .map(([categoryId]) => categoryId);
      },

      clearSignals: () => {
        set({ signals: [] });
      },
    }),
    {
      name: "recommendation-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        signals: state.signals,
      }),
    },
  ),
);
