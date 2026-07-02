import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation("auth");
  const isRTL = i18n.language?.startsWith("ar");
  // Initialize theme from persisted storage on mount

  useThemeStore()
    useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [isRTL, i18n.language]);
  return (
    <div className="min-h-screen w-full bg-background text-foreground font-['Inter']">
      <RouterProvider router={router} />
    </div>
  )

}

export default App;
