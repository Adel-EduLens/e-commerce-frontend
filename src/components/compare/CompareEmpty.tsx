import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export function CompareEmpty() {
  const { t } = useTranslation("compare");
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-stroke bg-card px-8 py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
        <Search className="h-10 w-10 text-primary" />
      </div>

      <h2 className="mb-2 text-3xl font-bold text-foreground">
        {t("empty.title")}
      </h2>

      <p className="max-w-md text-gray-text">
        {t("empty.description")}
      </p>

      <Link
        to="/products"
        className="mt-8 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
      >
        {t("empty.button")}
      </Link>
    </div>
  );
}