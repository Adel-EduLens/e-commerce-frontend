import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLatestTerms } from "../../hooks/queries/termsQuery";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function TermsPage() {
  const { t, i18n } = useTranslation("traderTerms");
  const isRTL = i18n.language?.startsWith("ar");
  const navigate = useNavigate();
  const { data: latestTerms, isLoading, error } = useLatestTerms();

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="terms-page"
    >
      {/* Decorative background */}
      <div className="terms-page__bg-glow" />

      <div className="terms-page__container">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="terms-page__back-btn"
        >
          <BackArrow className="h-5 w-5" />
          <span>{isRTL ? "رجوع" : "Back"}</span>
        </button>

        {/* Header card */}
        <div className="terms-page__header">
          <div className="terms-page__header-icon">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="terms-page__title">
            {t("termsHeading")}
          </h1>
          <p className="terms-page__subtitle">
            {isRTL
              ? "يرجى قراءة الشروط والأحكام بعناية قبل الاستمرار"
              : "Please read our terms and conditions carefully before proceeding"}
          </p>
        </div>

        {/* Content */}
        <div className="terms-page__content">
          {isLoading ? (
            <LoadingSpinner text={t("loading")} containerClassName="py-20" className="h-10 w-10" />
          ) : error ? (
            <div className="terms-page__error">
              <p>{t("loadError", "Failed to load terms and conditions")}</p>
            </div>
          ) : !latestTerms || latestTerms.sections.length === 0 ? (
            <div className="terms-page__empty">
              <p>{t("noTermsFound")}</p>
            </div>
          ) : (
            <div className="terms-page__sections">
              {[...latestTerms.sections]
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <div key={section.id} className="terms-page__section">
                    <div className="terms-page__section-header">
                      <span className="terms-page__section-number">
                        {section.order}
                      </span>
                      <h3 className="terms-page__section-title">
                        {section.title}
                      </h3>
                    </div>
                    <p className="terms-page__section-content">
                      {section.content}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="terms-page__footer">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="terms-page__footer-btn"
          >
            {isRTL ? "فهمت، رجوع" : "I Understand, Go Back"}
          </button>
        </div>
      </div>
    </div>
  );
}
