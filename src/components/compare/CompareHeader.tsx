import { Scale, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
interface CompareHeaderProps {
  count: number;
  onClear: () => void;
}

export function CompareHeader({ count, onClear }: CompareHeaderProps) {
  const { t } = useTranslation("compare");
  return (
    <div className="z-20 mb-8 rounded-3xl border border-stroke bg-card p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Scale size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t("header.title")}
            </h1>

            <p className="mt-1 text-sm text-gray-text">
              {t("header.comparing")}
              <span className="font-semibold text-foreground">
                {count}
              </span>{" "}
              {count === 1 ? t("header.product") : t("header.products")}
            </p>
          </div>
        </div>

        {count > 0 && (
          <button
            onClick={onClear}
            className="flex items-center justify-center gap-2 rounded-xl border border-urgent px-5 py-3 font-medium text-urgent transition hover:bg-urgent hover:text-white"
          >
            <Trash2 size={18} />
            {t("header.clear")}
          </button>
        )}
      </div>
    </div>
  );
}
