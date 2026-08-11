import { useState } from "react";
import { CheckCircle, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../../store/useThemeStore";

function LanguageField() {
  const { t, i18n } = useTranslation("setting");
  const [open, setOpen] = useState(false);

  const currentLanguage = i18n.language.startsWith("ar")
    ? "العربية"
    : "English";

  const changeLanguage = (lang: "en" | "ar") => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    setOpen(false);
  };

  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-6">
      <div className="font-['Montserrat'] text-base font-medium tracking-tight text-foreground">
        {t("language")}
      </div>

      <div className="relative w-full sm:w-80 lg:w-96">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-14 w-full items-center justify-between rounded-xl border border-stroke bg-card px-4 text-foreground transition-colors hover:border-primary"
        >
          <span className="font-['Poppins'] text-base">{currentLanguage}</span>

          <ChevronDown
            className={`h-5 w-5 text-gray-text transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-16 z-20 overflow-hidden rounded-xl border border-stroke bg-card shadow-lg">
            <button
              onClick={() => changeLanguage("en")}
              className={`w-full px-4 py-3 text-left transition hover:cursor-pointer ${
                i18n.language.startsWith("en")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-primary/10"
              }`}
            >
              English
            </button>

            <button
              onClick={() => changeLanguage("ar")}
              className={`w-full px-4 py-3 text-left transition hover:cursor-pointer ${
                i18n.language.startsWith("ar")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-primary/10"
              }`}
            >
              العربية
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ThemeMockup({ isDark = false }: { isDark?: boolean }) {
  return (
    <div
      className={`h-36 w-full overflow-hidden ${
        isDark ? "bg-[#0f1115]" : "bg-[#f9fafb]"
      }`}
    >
      <div
        className={`mx-4 mt-4 h-32 overflow-hidden rounded-t-lg border border-stroke/40 ${
          isDark ? "bg-[#1c1f24]" : "bg-white"
        }`}
      >
        <div className="grid grid-cols-2 gap-2 p-2">
          <div className="h-10 rounded bg-primary" />
          <div className="h-10 rounded bg-primary" />
          <div className="h-10 rounded bg-primary" />
          <div className="h-10 rounded bg-primary" />
        </div>
      </div>
    </div>
  );
}

function ThemeCard({
  label,
  selected = false,
  isDark = false,
  onClick,
}: {
  label: string;
  selected?: boolean;
  isDark?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative w-full sm:w-60 overflow-hidden rounded-xl cursor-pointer transition-all hover:opacity-90 outline outline-2 outline-offset-[-2px] ${
        selected ? "outline-primary shadow-md" : "outline-stroke"
      } bg-card`}
    >
      <ThemeMockup isDark={isDark} />
      <div className="flex items-center justify-between border-t border-stroke bg-card px-4 py-3 text-foreground">
        <div className="font-['Montserrat'] text-sm sm:text-base font-medium leading-4 tracking-tight">
          {label}
        </div>
        {selected && (
          <CheckCircle className="h-5 w-5 fill-primary text-primary-foreground" />
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { t } = useTranslation("setting");
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6 font-['Montserrat']">
      <div className="text-2xl sm:text-3xl font-bold text-foreground">
        {t("title")}
      </div>
      <div className="flex flex-col gap-6">
        <LanguageField />
        <div className="flex flex-col gap-4">
          <div className="text-base font-medium leading-4 tracking-tight text-foreground">
            {t("selectTheme")}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-lg w-full">
            <ThemeCard
              label={t("lightMode")}
              selected={theme === "light"}
              isDark={false}
              onClick={() => setTheme("light")}
            />
            <ThemeCard
              label={t("darkMode")}
              selected={theme === "dark"}
              isDark={true}
              onClick={() => setTheme("dark")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
