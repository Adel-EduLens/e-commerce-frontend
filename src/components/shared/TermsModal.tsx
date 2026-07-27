import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useLatestTerms } from "../../hooks/queries/termsQuery";
import LoadingSpinner from "./LoadingSpinner";

interface TermsModalProps {
  onClose: () => void;
}

export default function TermsModal({ onClose }: TermsModalProps) {
  const { t, i18n } = useTranslation("traderTerms");
  const isRTL = i18n.language?.startsWith("ar");
  const { data: latestTerms, isLoading, error } = useLatestTerms();

  // Close when clicking the backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-card border border-stroke shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0 bg-background/50">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {t("termsHeading")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-text hover:text-foreground transition p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-6 overflow-y-auto no-scrollbar bg-card">
          {isLoading ? (
            <LoadingSpinner text={t("loading")} containerClassName="py-12" className="h-8 w-8" />
          ) : error ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-red-500 font-semibold">{t("loadError", "Failed to load terms and conditions")}</p>
            </div>
          ) : !latestTerms || latestTerms.sections.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-text">{t("noTermsFound")}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {[...latestTerms.sections]
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <div key={section.id} className="space-y-2">
                    <h3 className="font-['Montserrat'] text-base font-bold text-foreground flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-['Montserrat'] text-xs font-semibold">
                        {section.order}
                      </span>
                      {section.title}
                    </h3>
                    <p className="font-['Montserrat'] text-sm text-gray-text leading-relaxed pl-8 pr-8 whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stroke p-5 shrink-0 bg-background/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-stroke font-['Montserrat'] text-sm font-semibold text-foreground transition hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer text-center"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
