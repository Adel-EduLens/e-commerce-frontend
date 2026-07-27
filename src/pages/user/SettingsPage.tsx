import { CheckCircle, ChevronDown } from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";
import { useTranslation } from "react-i18next";
import { useState } from "react";
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
            className={`h-5 w-5 text-gray-text transition-transform ${open ? "rotate-180" : ""
              }`}
          />
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-16 z-20 overflow-hidden rounded-xl border border-stroke bg-card shadow-lg">
            <button
              onClick={() => changeLanguage("en")}
              className={`w-full px-4 py-3 text-left transition  hover:cursor-pointer ${i18n.language.startsWith("en")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-primary/60"
                }`}
            >
              English
            </button>

            <button
              onClick={() => changeLanguage("ar")}
              className={`w-full px-4 py-3 text-left transition  hover:cursor-pointer ${i18n.language.startsWith("ar")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-primary/60"
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
      className={`h-36 w-full overflow-hidden ${isDark ? "bg-black" : "bg-[#ffffff]"}`}
    >
      <div
        className={`mx-4 mt-4 h-32 overflow-hidden ${isDark ? "bg-zinc-900" : "bg-[#ffffff]"}`}
      >
        <div className="grid grid-cols-2 gap-2 p-2">
          <div className="h-10 bg-primary" />
          <div className="h-10 bg-primary" />
          <div className="h-10 bg-primary" />
          <div className="h-10 bg-primary" />
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
      className={`relative w-full sm:w-60 overflow-hidden rounded-lg cursor-pointer transition-all hover:opacity-90 outline outline-2 outline-offset-[-2px] ${
        selected ? "outline-primary" : "outline-stroke"
      } ${isDark ? "bg-gray-light" : "bg-[#ffffff]"}`}
    >
      <ThemeMockup isDark={isDark} />
      <div
        className={`flex items-center justify-between border-t px-3 py-3 ${
          isDark
            ? "border-stroke bg-card text-foreground"
            : "border-gray-200 bg-[#ffffff] text-gray-800"
        }`}
      >
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

import { Gift } from "lucide-react";
import { useReceivedGiftCards, useRedeemGiftCard } from "../../hooks/queries/giftCardsQuery";

export function ReceivedGiftCardsPanel() {
  const { data: giftCards = [], isLoading, isError } = useReceivedGiftCards();
  const redeemMutation = useRedeemGiftCard();

  return (
    <div className="flex w-full flex-col gap-6 font-['Montserrat']">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            My Gift Cards
          </h2>
          <p className="text-xs text-gray-text mt-1">
            Gift cards you have received
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-text">Loading gift cards...</div>
      ) : isError ? (
        <div className="py-12 text-center text-xs text-red-500">Failed to load received gift cards.</div>
      ) : giftCards.length === 0 ? (
        <div className="rounded-2xl border border-stroke bg-card p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-secondary text-primary mx-auto flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-foreground text-sm">No Gift Cards Received Yet</h3>
          <p className="text-xs text-gray-text max-w-sm mx-auto">
            When someone sends you a gift card, it will appear here with your balance and redemption details.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {giftCards.map((gc) => {
            const formattedDate = gc.createdAt
              ? new Date(gc.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Aug 15, 2025";

            const isRedeemed = gc.status === "REDEEMED";
            const displayStatus = isRedeemed ? "Redeemed" : "Delivered";

            return (
              <div
                key={gc.id}
                className="relative flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl border border-stroke bg-card shadow-[0px_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all font-['Montserrat']"
              >
                {/* Left Visual Artwork / Box */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl bg-[#1A1A1E] dark:bg-[#121214] text-white flex items-center justify-center overflow-hidden shadow-inner">
                  {gc.image ? (
                    <img
                      src={gc.image}
                      alt={gc.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <span className="font-bold text-white text-lg sm:text-xl tracking-widest uppercase [writing-mode:vertical-rl] rotate-180 select-none">
                      GENZ
                    </span>
                  )}
                </div>

                {/* Right Info Details */}
                <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-foreground text-base sm:text-lg leading-tight truncate">
                      {gc.name || "Gift Card"}
                    </h3>
                  </div>

                  <div className="text-xs sm:text-sm text-foreground truncate mt-0.5">
                    <span className="text-gray-text font-normal">Sent from: </span>
                    <span className="font-bold text-foreground">
                      {gc.senderName || gc.senderEmail || "Store"}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm text-foreground">
                    <span className="text-gray-text font-normal">Value: </span>
                    <span className="font-bold text-foreground">{gc.balance || gc.amount} EGP</span>
                  </div>

                  <div className="text-xs sm:text-sm text-foreground">
                    <span className="text-gray-text font-normal">status: </span>
                    <span className="font-bold text-foreground capitalize">{displayStatus}</span>
                  </div>

                  <div className="text-xs text-gray-text mt-1 font-normal">
                    Date: {formattedDate}
                  </div>

                  <div className="pt-2">
                    {isRedeemed ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                        ✓ Redeemed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => redeemMutation.mutate(gc.id)}
                        disabled={redeemMutation.isPending}
                        className="w-full sm:w-auto rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95 disabled:opacity-50"
                      >
                        {redeemMutation.isPending ? "Redeeming..." : "Redeem Gift Card"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SettingsPanel() {
  const { t } = useTranslation("setting");
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-foreground">
        {t("title")}
      </div>
      <div className="flex flex-col gap-6">
        <LanguageField />
        <div className="flex flex-col gap-4">
          <div className="font-['Montserrat'] text-base font-medium leading-4 tracking-tight text-foreground">
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

export default function SettingsPage() {
  return <SettingsPanel />;
}
