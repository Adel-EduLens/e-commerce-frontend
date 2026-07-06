import { CheckCircle, ChevronDown } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

function LanguageField() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
      <div className="font-['Montserrat'] text-base font-medium leading-4 tracking-tight text-foreground">
        Language
      </div>
      <div className="relative h-14 w-full sm:w-80 lg:w-96 overflow-hidden rounded-xl outline outline-1 outline-offset-[-1px] outline-stroke">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex w-[calc(100%-32px)] items-center justify-between">
          <div className="font-['Poppins'] text-base font-normal leading-4 tracking-tight text-gray-text">
            EN
          </div>
          <ChevronDown
            className="h-6 w-6 text-gray-text"
            strokeWidth={2}
          />
        </div>
      </div>
    </div>
  );
}

function ThemeMockup({ isDark = false }: { isDark?: boolean }) {
  return (
    <div className={`h-36 w-full overflow-hidden ${isDark ? "bg-[#0f1115]" : "bg-white"}`}>
      <div className={`mx-4 mt-4 h-32 overflow-hidden ${isDark ? "bg-[#1c1b2e]" : "bg-[#F9FAFB]"}`}>
        <div className="grid grid-cols-2 gap-2 p-2">
          <div className="h-10 bg-[#BBFF63]" />
          <div className="h-10 bg-[#BBFF63]" />
          <div className="h-10 bg-[#BBFF63]" />
          <div className="h-10 bg-[#BBFF63]" />
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
  label: "Light Mode " | "Dark Mode ";
  selected?: boolean;
  isDark?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative w-full sm:w-60 overflow-hidden rounded-lg bg-gray-light cursor-pointer transition-all hover:opacity-90 outline outline-2 outline-offset-[-2px] ${
        selected ? "outline-primary" : "outline-stroke"
      }`}
    >
      <ThemeMockup isDark={isDark} />
      <div className="flex items-center justify-between border-t border-stroke bg-card px-3 py-3">
        <div className="font-['Montserrat'] text-sm sm:text-base font-medium leading-4 tracking-tight text-foreground">
          {label}
        </div>
        {selected && (
          <CheckCircle className="h-5 w-5 fill-[#BBFF63] text-[#BBFF63]" />
        )}
      </div>
    </div>
  );
}

function SettingsPanel() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-foreground">
        Settings
      </div>
      <div className="flex flex-col gap-6">
        <LanguageField />
        <div className="flex flex-col gap-4">
          <div className="font-['Montserrat'] text-base font-medium leading-4 tracking-tight text-foreground">
            Select Theme
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <ThemeCard
              label="Light Mode "
              selected={theme === "light"}
              isDark={false}
              onClick={() => setTheme("light")}
            />
            <ThemeCard
              label="Dark Mode "
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
